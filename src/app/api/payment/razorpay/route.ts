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
    const { product, email } = await req.json()

    // booking:UUID — look up price from DB
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
    } else {
      amountINR = Math.round((PRICING[product as keyof typeof PRICING]?.inr || 0) / 100)
      if (!amountINR) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 })
      receipt   = `${product}_${Date.now()}`
    }

    const order = await createRazorpayOrder({
      amountINR,
      receipt,
      notes: { email: email ?? '', product },
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error('[payment/razorpay]', err)
    return NextResponse.json({ error: 'Could not create order.' }, { status: 500 })
  }
}
