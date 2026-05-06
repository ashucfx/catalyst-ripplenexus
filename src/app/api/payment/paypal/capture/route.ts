import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/payment/paypal'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { insertPayment } from '@/lib/db/supabase'
import { PRICING } from '@/lib/constants/pricing'
import { createPortalIfNotExists } from '@/lib/db/portals'
import { auditPortalEmail } from '@/lib/email/templates'
import { confirmAndNotifyBooking } from '@/lib/booking/confirmAndNotify'
import { rateLimit } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
         || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
         || 'unknown'
  const { ok } = await rateLimit(ip, { limit: 10, windowMs: 60 * 60 * 1000 }, 'paypal-capture')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { orderId, product, email } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'Missing orderId.' }, { status: 400 })

    const result = await capturePayPalOrder(orderId)

    if (result.status !== 'COMPLETED') {
      return NextResponse.json({ error: `Payment not completed: ${result.status}` }, { status: 402 })
    }

    const resolvedEmail = (email && EMAIL_RE.test(email)) ? email : result.payer.email

    if (product?.startsWith('booking:')) {
      const bookingId = product.replace('booking:', '')
      const state = await confirmAndNotifyBooking(bookingId, result.captureId, 'paypal')
      if (state === 'collision') {
        return NextResponse.json({ error: 'Slot taken — admin alerted for refund/reschedule.' }, { status: 409 })
      }
      if (state === 'error') {
        console.error('[paypal/capture] confirmAndNotify error for booking', bookingId)
      }
    } else if (product === 'audit' && resolvedEmail && EMAIL_RE.test(resolvedEmail)) {
      const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL ?? ''
      const token     = await createPortalIfNotExists(resolvedEmail, result.captureId)
      const portalUrl = `${baseUrl}/portal/${token}`
      const { subject, html } = auditPortalEmail(portalUrl)
      resend.emails.send({ from: FROM, to: resolvedEmail, subject, html })
        .catch(e => console.error('[paypal/capture] portal email failed:', e))
    }

    await Promise.all([
      insertPayment({
        email:     resolvedEmail,
        product,
        method:    'paypal',
        amount:    PRICING[product as keyof typeof PRICING]?.usd
                     ? Math.round(PRICING[product as keyof typeof PRICING].usd / 100)
                     : Number(result.amount),
        currency:  'USD',
        paymentId: result.captureId,
        orderId,
      }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `Payment received — ${product} — $${result.amount} — ${resolvedEmail}`,
        html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
          <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">PAYMENT CONFIRMED — PAYPAL</p>
          <p style="margin:0 0 4px;">Product: <strong>${product}</strong></p>
          <p style="margin:0 0 4px;">Amount: <strong style="color:#B8935B;">$${result.amount}</strong></p>
          <p style="margin:0 0 4px;">Payer: ${result.payer.name} &lt;${result.payer.email}&gt;</p>
          <p style="margin:0 0 4px;">PayPal Order ID: ${orderId}</p>
          <p style="margin:0;">Capture ID: ${result.captureId}</p>
        </div>`,
      }).catch((e) => console.error('[paypal/capture] Admin email failed:', e)),
    ])

    return NextResponse.json({ success: true, captureId: result.captureId, payer: result.payer })
  } catch (err) {
    console.error('[payment/paypal/capture]', err)
    return NextResponse.json({ error: 'Capture failed.' }, { status: 500 })
  }
}
