import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getDb, insertPayment } from '@/lib/db/supabase'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: 'Missing signature or secret.' }, { status: 400 })
    }

    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (expected !== signature) {
      console.error('[webhooks/razorpay] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    // Only process payment captured events
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id
      const email = payment.email || 'unknown@example.com'
      const amountPaise = payment.amount
      
      const db = getDb()
      if (!db) return NextResponse.json({ error: 'DB Unavailable' }, { status: 503 })

      // Make webhook idempotent
      const { data: existing } = await db.from('payments').select('id').eq('payment_id', paymentId).single()
      if (existing) {
        return NextResponse.json({ ok: true, message: 'Already processed' })
      }

      // Notes contain the product/booking info passed during checkout creation
      const product = payment.notes?.product ?? 'unknown'
      const amountINR = Math.round(amountPaise / 100)

      if (product.startsWith('booking:')) {
        const bookingId = product.replace('booking:', '')
        
        // Final sanity check: make sure booking isn't already confirmed
        const { data: booking } = await db.from('bookings').select('status').eq('id', bookingId).single()
        
        if (booking && (booking.status === 'pending_payment' || booking.status === 'cancelled')) {
          // Confirm booking via standard API (handles Rescue Protocol collisions natively)
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/schedule/confirm`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ bookingId, paymentId, paymentMethod: 'razorpay' }),
          }).catch(e => console.error('[webhooks/razorpay] booking confirm failed:', e))
        }
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
          subject: `Webhook received — ${product} — ₹${amountINR.toLocaleString('en-IN')} — ${email}`,
          html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
            <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">WEBHOOK PAYMENT CONFIRMED — RAZORPAY</p>
            <p style="margin:0 0 4px;">Product: <strong>${product}</strong></p>
            <p style="margin:0 0 4px;">Email: <a href="mailto:${email}" style="color:#B8935B;">${email}</a></p>
            <p style="margin:0 0 4px;">Razorpay Order ID: ${orderId}</p>
            <p style="margin:0;">Razorpay Payment ID: ${paymentId}</p>
          </div>`,
        }).catch((e) => console.error('[webhooks/razorpay] Admin email failed:', e)),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[webhooks/razorpay]', err.message)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
