import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { getDb } from '@/lib/db/supabase'
import {
  getActiveAccount,
  createBankTransferInstruction,
  getCurrencyInfo,
  formatAmount,
} from '@/lib/payment/bankTransfer'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { bankTransferConfirmationEmail } from '@/lib/email/templates'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
             || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
             || 'unknown'
  const { ok } = await rateLimit(ip, { limit: 10, windowMs: 60 * 60 * 1000 }, 'bank-transfer')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { product, email, currency, amount } = await req.json()

    // ── Input validation ────────────────────────────────────────────────────
    if (!product || typeof product !== 'string') {
      return NextResponse.json({ error: 'Product is required.' }, { status: 400 })
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
    }
    if (!currency || typeof currency !== 'string') {
      return NextResponse.json({ error: 'Currency is required.' }, { status: 400 })
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required.' }, { status: 400 })
    }

    const normalCurrency = currency.toUpperCase()
    let finalAmount = amount

    // ── Validate booking is still pending (if applicable) ──────────────────
    if (product.startsWith('booking:')) {
      const bookingId = product.replace('booking:', '')
      const db = getDb()
      if (!db) return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 })
      const { data: booking } = await db
        .from('bookings')
        .select('status, meeting_types(price_usd, price_inr)')
        .eq('id', bookingId)
        .single()
      if (!booking || booking.status !== 'pending_payment') {
        return NextResponse.json({ error: 'Booking not found or already paid.' }, { status: 404 })
      }
      const mt = booking.meeting_types as unknown as { price_usd: number; price_inr: number }
      if (mt?.price_usd && normalCurrency === 'USD') {
        finalAmount = Math.round(mt.price_usd / 100)
      }

      // Mark booking as awaiting transfer so cleanup TTL extends to 72 hours
      const { markBookingAwaitingTransfer } = await import('@/lib/db/bookings')
      await markBookingAwaitingTransfer(bookingId)
    }

    // ── Look up active bank account for this currency ──────────────────────
    const account = await getActiveAccount(normalCurrency)
    if (!account) {
      return NextResponse.json(
        { error: `No bank transfer account configured for ${normalCurrency}.` },
        { status: 404 },
      )
    }

    // ── Create instruction record ──────────────────────────────────────────
    const instruction = await createBankTransferInstruction({
      product,
      email,
      currency: normalCurrency,
      amount: finalAmount,
      bankAccountId: account.id,
    })

    const currencyInfo = getCurrencyInfo(normalCurrency)

    // ── Send confirmation emails ───────────────────────────────────────────
    const { subject, html } = bankTransferConfirmationEmail({
      recipientEmail:  email,
      ref:             instruction.reconciliation_ref,
      amount:          finalAmount,
      currency:        normalCurrency,
      formattedAmount: formatAmount(finalAmount, normalCurrency),
      rail:            currencyInfo.rail,
      clientLabel:     currencyInfo.clientLabel,
      accountName:     account.account_name,
      bankName:        account.bank_name ?? undefined,
      accountNumber:   account.account_number ?? undefined,
      iban:            account.iban ?? undefined,
      sortCode:        account.sort_code ?? undefined,
      routingNumber:   account.routing_number ?? undefined,
      swiftBic:        account.swift_bic ?? undefined,
      referenceInstructions: account.reference_instructions ?? undefined,
      additionalNotes: account.additional_notes ?? undefined,
    })

    // Fire-and-forget emails — don't fail the response if email fails
    Promise.allSettled([
      resend.emails.send({ from: FROM, to: email, subject, html }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `[Bank Transfer] ${instruction.reconciliation_ref} — ${formatAmount(amount, normalCurrency)} — ${email}`,
        html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
          <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">BANK TRANSFER INSTRUCTIONS GENERATED</p>
          <p style="margin:0 0 4px;">Reference: <strong>${instruction.reconciliation_ref}</strong></p>
          <p style="margin:0 0 4px;">Amount: <strong>${formatAmount(amount, normalCurrency)}</strong></p>
          <p style="margin:0 0 4px;">Rail: ${currencyInfo.rail}</p>
          <p style="margin:0 0 4px;">Product: ${product}</p>
          <p style="margin:0;">Client: <a href="mailto:${email}" style="color:#B8935B;">${email}</a></p>
        </div>`,
      }),
    ]).catch(e => console.error('[bank-transfer/instructions] email error:', e))

    // ── Return safe client-facing data (no internal IDs) ──────────────────
    return NextResponse.json({
      ref:             instruction.reconciliation_ref,
      currency:        normalCurrency,
      amount,
      formattedAmount: formatAmount(amount, normalCurrency),
      rail:            currencyInfo.rail,
      clientLabel:     currencyInfo.clientLabel,
      // Bank account details — safe for client display
      accountName:     account.account_name,
      bankName:        account.bank_name,
      accountNumber:   account.account_number,
      iban:            account.iban,
      sortCode:        account.sort_code,
      routingNumber:   account.routing_number,
      swiftBic:        account.swift_bic,
      referenceInstructions: account.reference_instructions,
      additionalNotes: account.additional_notes,
      // Status info
      status:          instruction.status,
      createdAt:       instruction.created_at,
    })
  } catch (err) {
    console.error('[payment/bank-transfer/instructions]', err)
    return NextResponse.json({ error: 'Could not generate bank transfer instructions.' }, { status: 500 })
  }
}
