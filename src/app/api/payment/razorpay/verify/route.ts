import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/payment/razorpay'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { PRICING } from '@/lib/constants/pricing'
import { getDb, insertPayment } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, email, product } = await req.json()

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment fields.' }, { status: 400 })
    }

    const valid = verifyRazorpaySignature({ orderId, paymentId, signature })
    if (!valid) {
      console.error('[razorpay/verify] Invalid signature', { orderId, paymentId })
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
    }

    let amountINR = 0

    // Confirm booking if this is a booking payment
    if (product?.startsWith('booking:')) {
      const bookingId = product.replace('booking:', '')
      
      const db = getDb()
      if (db) {
        const { data: booking } = await db
          .from('bookings')
          .select('meeting_types(price_inr)')
          .eq('id', bookingId)
          .single()
        if (booking && booking.meeting_types) {
          amountINR = Math.round(((booking.meeting_types as unknown as { price_inr: number }).price_inr) / 100)
        }
      }

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/schedule/confirm`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ bookingId, paymentId, paymentMethod: 'razorpay' }),
      }).catch(e => console.error('[razorpay/verify] booking confirm failed:', e))
    } else {
      amountINR = Math.round((PRICING[product as keyof typeof PRICING]?.inr || 0) / 100)
    }

    await Promise.all([
      insertPayment({
        email,
        product,
        method:    'razorpay',
        amount:    amountINR,
        currency:  'INR',
        paymentId,
        orderId,
      }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `Payment received — ${product} — ₹${amountINR.toLocaleString('en-IN')} — ${email}`,
        html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
          <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">PAYMENT CONFIRMED — RAZORPAY</p>
          <p style="margin:0 0 4px;">Product: <strong>${product}</strong></p>
          <p style="margin:0 0 4px;">Email: <a href="mailto:${email}" style="color:#B8935B;">${email}</a></p>
          <p style="margin:0 0 4px;">Razorpay Order ID: ${orderId}</p>
          <p style="margin:0;">Razorpay Payment ID: ${paymentId}</p>
        </div>`,
      }).catch((e) => console.error('[razorpay/verify] Admin email failed:', e)),
    ])

    return NextResponse.json({ success: true, paymentId })
  } catch (err) {
    console.error('[payment/razorpay/verify]', err)
    return NextResponse.json({ error: 'Verification error.' }, { status: 500 })
  }
}
