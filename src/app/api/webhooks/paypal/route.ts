import { NextRequest, NextResponse } from 'next/server'
import { getDb, insertPayment } from '@/lib/db/supabase'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { verifyPayPalWebhook } from '@/lib/payment/paypal'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    
    // Validate signature via lib/payment/paypal
    const isValid = await verifyPayPalWebhook(req, rawBody)
    if (!isValid) {
      console.error('[webhooks/paypal] Invalid signature')
      return NextResponse.json({ error: 'Invalid PayPal signature.' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    // Only process payment capture completed events
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = event.resource
      const paymentId = resource.id
      // PayPal capture typically sits under a supplemental order, but sometimes invoice_id is passed
      // We will rely on custom_id if we have passed the product in it, or invoice_id
      const invoiceId = resource.invoice_id || resource.custom_id
      const amountUSD = parseFloat(resource.amount.value)
      
      let product = 'audit'
      if (invoiceId && invoiceId.startsWith('booking_')) {
        product = `booking:${invoiceId.replace('booking_', '')}`
      } else if (invoiceId && invoiceId.includes('_')) {
        product = invoiceId.split('_')[0]
      }

      const email = resource.payer?.email_address ?? 'unknown@example.com'

      const db = getDb()
      if (!db) return NextResponse.json({ error: 'DB Unavailable' }, { status: 503 })

      // Make webhook idempotent
      const { data: existing } = await db.from('payments').select('id').eq('payment_id', paymentId).single()
      if (existing) {
        return NextResponse.json({ ok: true, message: 'Already processed' })
      }

      if (product.startsWith('booking:')) {
        const bookingId = product.replace('booking:', '')
        
        // Final sanity check: make sure booking isn't already confirmed
        const { data: booking } = await db.from('bookings').select('status').eq('id', bookingId).single()
        
        if (booking && (booking.status === 'pending_payment' || booking.status === 'cancelled')) {
          // Confirm booking via standard API (handles Rescue Protocol collisions natively)
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/schedule/confirm`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ bookingId, paymentId, paymentMethod: 'paypal' }),
          }).catch(e => console.error('[webhooks/paypal] booking confirm failed:', e))
        }
      }

      await Promise.all([
        insertPayment({
          email,
          product,
          method:    'paypal',
          amount:    amountUSD,
          currency:  'USD',
          paymentId,
          orderId:   invoiceId,
        }),
        resend.emails.send({
          from:    FROM,
          to:      ADMIN_EMAIL,
          subject: `Webhook received — ${product} — $${amountUSD} — ${email}`,
          html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
            <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">WEBHOOK PAYMENT CONFIRMED — PAYPAL</p>
            <p style="margin:0 0 4px;">Product: <strong>${product}</strong></p>
            <p style="margin:0 0 4px;">Email: <a href="mailto:${email}" style="color:#B8935B;">${email}</a></p>
            <p style="margin:0;">PayPal Capture ID: ${paymentId}</p>
          </div>`,
        }).catch((e) => console.error('[webhooks/paypal] Admin email failed:', e)),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[webhooks/paypal]', err.message)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
