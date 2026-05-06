import { NextRequest, NextResponse } from 'next/server'
import { getDb, insertPayment } from '@/lib/db/supabase'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { verifyPayPalWebhook } from '@/lib/payment/paypal'
import { createPortalIfNotExists } from '@/lib/db/portals'
import { auditPortalEmail } from '@/lib/email/templates'
import { confirmAndNotifyBooking } from '@/lib/booking/confirmAndNotify'

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
      // invoice_id always holds the invoiceId we set at order creation.
      // custom_id holds the buyer's email (set since fix for webhook recovery).
      const invoiceId = resource.invoice_id
      const amountUSD = parseFloat(resource.amount.value)

      let product = 'audit'
      if (invoiceId && invoiceId.startsWith('booking_')) {
        product = `booking:${invoiceId.replace('booking_', '')}`
      } else if (invoiceId && invoiceId.includes('_')) {
        product = invoiceId.split('_')[0]
      }

      // custom_id stores buyer email (set by createPayPalOrder); payer field is not on Capture resource
      const email = resource.custom_id || resource.payer?.email_address || 'unknown@example.com'

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
          const result = await confirmAndNotifyBooking(bookingId, paymentId, 'paypal')
          if (result === 'error') console.error('[webhooks/paypal] confirmAndNotify returned error for booking', bookingId)
          if (result === 'collision') console.error('[webhooks/paypal] collision detected for booking', bookingId)
        }
      } else if (product === 'audit' && email && email !== 'unknown@example.com') {
        // Backup path: client-side capture may have failed (mobile, browser killed, network drop).
        // Create portal only if one doesn't already exist for this payment.
        try {
          const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL ?? ''
          const token     = await createPortalIfNotExists(email, paymentId)
          const portalUrl = `${baseUrl}/portal/${token}`
          const { subject, html } = auditPortalEmail(portalUrl)
          resend.emails.send({ from: FROM, to: email, subject, html })
            .catch(e => console.error('[webhooks/paypal] portal email failed:', e))
        } catch (e) {
          console.error('[webhooks/paypal] portal creation failed:', e)
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
  } catch (err: unknown) {
    console.error('[webhooks/paypal]', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
