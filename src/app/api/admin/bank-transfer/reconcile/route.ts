import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getBankTransferInstruction, reconcileInstruction, formatAmount } from '@/lib/payment/bankTransfer'
import { insertPayment } from '@/lib/db/supabase'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { confirmAndNotifyBooking } from '@/lib/booking/confirmAndNotify'
import { createPortalIfNotExists } from '@/lib/db/portals'
import { auditPortalEmail } from '@/lib/email/templates'

// POST /api/admin/bank-transfer/reconcile
// Admin manually confirms a bank transfer payment has been received.

export async function POST(req: NextRequest) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { ref, notes } = await req.json()

    if (!ref || typeof ref !== 'string') {
      return NextResponse.json({ error: 'Reconciliation reference (ref) is required.' }, { status: 400 })
    }

    // ── Fetch the instruction ──────────────────────────────────────────────
    const instruction = await getBankTransferInstruction(ref)
    if (!instruction) {
      return NextResponse.json({ error: `No instruction found for reference ${ref}.` }, { status: 404 })
    }

    if (instruction.status !== 'pending') {
      return NextResponse.json(
        { error: `Instruction ${ref} is already in status '${instruction.status}'. Cannot reconcile again.` },
        { status: 409 },
      )
    }

    // ── Insert payment record ─────────────────────────────────────────────
    // Use the reconciliation ref as paymentId (unique identifier for this payment)
    const paymentId = `BT-${ref}`
    const paymentRow = await insertPayment({
      email:              instruction.email,
      product:            instruction.product,
      method:             'bank_transfer',
      amount:             Number(instruction.amount),
      currency:           instruction.currency,
      paymentId,
      reconciliation_ref: ref,
    })

    // ── Mark instruction as reconciled ────────────────────────────────────
    // Link to the payments table UUID for foreign key integrity
    await reconcileInstruction({
      ref,
      paymentUuid: paymentRow?.id ?? null,
      notes,
    })

    // ── Fulfill Product Delivery ──────────────────────────────────────────
    if (instruction.product.startsWith('booking:')) {
      const bookingId = instruction.product.replace('booking:', '')
      const result = await confirmAndNotifyBooking(bookingId, paymentId, 'bank_transfer')
      if (result === 'collision') {
        console.warn(`[admin/reconcile] Booking collision for ${bookingId} on ref ${ref}`)
      } else if (result === 'error') {
        console.error(`[admin/reconcile] confirmAndNotifyBooking error for ${bookingId}`)
      }
    } else if (instruction.product === 'audit') {
      try {
        const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL ?? ''
        const token     = await createPortalIfNotExists(instruction.email, paymentId)
        const portalUrl = `${baseUrl}/portal/${token}`
        const { subject, html } = auditPortalEmail(portalUrl)
        resend.emails.send({ from: FROM, to: instruction.email, subject, html })
          .catch(e => console.error('[admin/reconcile] portal email failed:', e))
      } catch (err) {
        console.error('[admin/reconcile] portal generation error:', err)
      }
    }

    // ── Admin confirmation email ──────────────────────────────────────────
    resend.emails.send({
      from:    FROM,
      to:      ADMIN_EMAIL,
      subject: `[Reconciled] ${ref} — ${formatAmount(Number(instruction.amount), instruction.currency)} — ${instruction.email}`,
      html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
        <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">BANK TRANSFER MANUALLY RECONCILED</p>
        <p style="margin:0 0 4px;">Reference: <strong>${ref}</strong></p>
        <p style="margin:0 0 4px;">Amount: <strong>${formatAmount(Number(instruction.amount), instruction.currency)}</strong></p>
        <p style="margin:0 0 4px;">Product: ${instruction.product}</p>
        <p style="margin:0 0 4px;">Client: <a href="mailto:${instruction.email}" style="color:#B8935B;">${instruction.email}</a></p>
        ${notes ? `<p style="margin:0;">Notes: ${notes}</p>` : ''}
      </div>`,
    }).catch(e => console.error('[admin/reconcile] email error:', e))

    console.log(`[admin/bank-transfer/reconcile] Reconciled ${ref} for ${instruction.email}`)
    return NextResponse.json({ success: true, ref, paymentId })
  } catch (err) {
    console.error('[admin/bank-transfer/reconcile]', err)
    return NextResponse.json({ error: 'Reconciliation failed.' }, { status: 500 })
  }
}
