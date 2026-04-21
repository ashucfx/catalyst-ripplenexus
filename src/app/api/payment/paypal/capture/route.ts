import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/payment/paypal'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { insertPayment } from '@/lib/db/supabase'

const AMOUNTS_USD: Record<string, number> = { audit: 499 }

export async function POST(req: NextRequest) {
  try {
    const { orderId, product, email } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'Missing orderId.' }, { status: 400 })

    const result = await capturePayPalOrder(orderId)

    if (result.status !== 'COMPLETED') {
      return NextResponse.json({ error: `Payment not completed: ${result.status}` }, { status: 402 })
    }

    const resolvedEmail = email || result.payer.email

    // Confirm booking if this is a booking payment
    if (product?.startsWith('booking:')) {
      const bookingId = product.replace('booking:', '')
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/schedule/confirm`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ bookingId, paymentId: result.captureId, paymentMethod: 'paypal' }),
      }).catch(e => console.error('[paypal/capture] booking confirm failed:', e))
    }

    await Promise.all([
      insertPayment({
        email:     resolvedEmail,
        product,
        method:    'paypal',
        amount:    AMOUNTS_USD[product] ?? Number(result.amount),
        currency:  'USD',
        paymentId: result.captureId,
        orderId,
      }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `Payment received — ${product} — $${result.amount} — ${result.payer.email}`,
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
