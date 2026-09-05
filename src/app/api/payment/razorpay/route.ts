import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/payment/razorpay'
import { rateLimit } from '@/lib/rateLimit'
import { getDb } from '@/lib/db/supabase'
import { PRICING } from '@/lib/constants/pricing'

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { ok } = await rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 }, 'payment')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { product, email, currency, amount: explicitAmount } = await req.json()

    // Determine if this is an international card order (non-INR) or the standard India flow
    const isIntl = currency && currency.toUpperCase() !== 'INR'

    // ── International card order ─────────────────────────────────────────────
    // When currency is provided (e.g. GBP, USD, EUR), use the caller-supplied amount.
    // Razorpay international card requires account to have international payments enabled.
    if (isIntl) {
      if (!explicitAmount || typeof explicitAmount !== 'number' || explicitAmount <= 0) {
        return NextResponse.json({ error: 'Amount required for international orders.' }, { status: 400 })
      }
      const receipt = product?.startsWith('booking:')
        ? `booking_${product.replace('booking:', '')}`
        : `${product ?? 'order'}_${Date.now()}`

      const order = await createRazorpayOrder({
        amount:   explicitAmount,
        currency: currency.toUpperCase(),
        receipt,
        notes: { email: email ?? '', product: product ?? '' },
      })
      return NextResponse.json(order)
    }

    // ── Standard India flow (INR) — unchanged ────────────────────────────────
    let amountINR: number
    let receipt: string

    if (product?.startsWith('booking:')) {
      const bookingId = product.replace('booking:', '')
      const db = getDb()
      if (!db) return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 })
      const { data: booking } = await db
        .from('bookings')
        .select('id, meeting_types(price_inr)')
        .eq('id', bookingId)
        .eq('status', 'pending_payment')
        .single()
      if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
      amountINR = Math.round(((booking.meeting_types as unknown as { price_inr: number }).price_inr) / 100)
      receipt   = `booking_${bookingId}`
    } else if (explicitAmount && typeof explicitAmount === 'number' && explicitAmount > 0) {
      amountINR = Math.round(explicitAmount)
      receipt   = `${product ?? 'package'}_${Date.now()}`
    } else {
      amountINR = Math.round((PRICING[product as keyof typeof PRICING]?.inr || 0) / 100)
      if (!amountINR) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 })
      receipt   = `${product}_${Date.now()}`
    }

    const order = await createRazorpayOrder({
      amount: amountINR,
      receipt,
      notes: { email: email ?? '', product },
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error('[payment/razorpay]', err)
    return NextResponse.json({ error: 'Could not create order.' }, { status: 500 })
  }
}
