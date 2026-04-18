import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/payment/razorpay'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'

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

    // Notify admin — fire and forget
    resend.emails.send({
      from:    FROM,
      to:      ADMIN_EMAIL,
      subject: `Payment received — ${product} — ₹${product === 'audit' ? '15,000' : '?'} — ${email}`,
      html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
        <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">PAYMENT CONFIRMED — RAZORPAY</p>
        <p style="margin:0 0 4px;">Product: <strong>${product}</strong></p>
        <p style="margin:0 0 4px;">Email: <a href="mailto:${email}" style="color:#B8935B;">${email}</a></p>
        <p style="margin:0 0 4px;">Razorpay Order ID: ${orderId}</p>
        <p style="margin:0;">Razorpay Payment ID: ${paymentId}</p>
      </div>`,
    }).catch((e) => console.error('[razorpay/verify] Admin email failed:', e))

    return NextResponse.json({ success: true, paymentId })
  } catch (err) {
    console.error('[payment/razorpay/verify]', err)
    return NextResponse.json({ error: 'Verification error.' }, { status: 500 })
  }
}
