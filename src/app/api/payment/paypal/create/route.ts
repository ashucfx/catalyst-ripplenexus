import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/payment/paypal'
import { rateLimit } from '@/lib/rateLimit'
import { getDb } from '@/lib/db/supabase'
import { PRICING } from '@/lib/constants/pricing'

const DESCRIPTIONS: Record<string, string> = {
  audit: 'Catalyst Market Value Audit — AI-Generated Positioning Intelligence Report',
}

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { ok } = await rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 }, 'payment')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { product } = await req.json()

    let amountUSD: number
    let description: string
    let invoiceId: string

    if (product?.startsWith('booking:')) {
      const bookingId = product.replace('booking:', '')
      const db = getDb()
      if (!db) return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 })
      const { data: booking } = await db
        .from('bookings')
        .select('id, meeting_types(price_usd, name)')
        .eq('id', bookingId)
        .eq('status', 'pending_payment')
        .single()
      if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
      amountUSD = Math.round(((booking.meeting_types as unknown as { price_usd: number }).price_usd) / 100)
      description = (booking.meeting_types as unknown as { name: string }).name
      invoiceId = `booking_${bookingId}`
    } else {
      amountUSD = Math.round((PRICING[product as keyof typeof PRICING]?.usd || 0) / 100)
      if (!amountUSD) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 })
      description = DESCRIPTIONS[product] ?? product
      invoiceId   = `${product}_${Date.now()}`
    }

    const order = await createPayPalOrder({
      amountUSD,
      description,
      invoiceId,
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error('[payment/paypal/create]', err)
    return NextResponse.json({ error: 'Could not create PayPal order.' }, { status: 500 })
  }
}
