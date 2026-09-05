import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/supabase'
import { rateLimit } from '@/lib/rateLimit'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() 
          || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
          || 'unknown'
  const { ok } = await rateLimit(ip, { limit: 10, windowMs: 60 * 60 * 1000 }, 'bank-transfer-confirm')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { ref, senderBank, transactionRef, notes } = await req.json()

    if (!ref || typeof ref !== 'string') {
      return NextResponse.json({ error: 'Payment reference is required.' }, { status: 400 })
    }
    if (!senderBank || typeof senderBank !== 'string') {
      return NextResponse.json({ error: 'Sender bank name is required.' }, { status: 400 })
    }

    const db = getDb()
    if (!db) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })

    // 1. Verify the instruction exists and is pending
    const { data: instruction, error: fetchErr } = await db
      .from('bank_transfer_instructions')
      .select('*')
      .eq('reconciliation_ref', ref)
      .maybeSingle()

    if (fetchErr || !instruction) {
      return NextResponse.json({ error: 'Invalid payment reference.' }, { status: 404 })
    }
    if (instruction.status !== 'pending') {
      return NextResponse.json({ error: 'This payment has already been processed.' }, { status: 400 })
    }

    // 2. Update the record
    const { error: updateErr } = await db
      .from('bank_transfer_instructions')
      .update({
        client_confirmed_at: new Date().toISOString(),
        client_sender_bank: senderBank.trim(),
        client_transaction_ref: transactionRef?.trim() || null,
        client_notes: notes?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('reconciliation_ref', ref)

    if (updateErr) {
      console.error('[bank-transfer/confirm] update error:', updateErr.message)
      return NextResponse.json({ error: 'Failed to save confirmation.' }, { status: 500 })
    }

    // 3. Send admin alert
    const html = `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
      <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">TRANSFER SENT CONFIRMATION</p>
      <p style="margin:0 0 4px;">Reference: <strong style="color:#B8935B;">${ref}</strong></p>
      <p style="margin:0 0 4px;">Client: ${instruction.email}</p>
      <p style="margin:0 0 16px;">Amount Due: ${instruction.currency} ${Number(instruction.amount).toFixed(2)}</p>
      
      <div style="background:#16181f;border:1px solid #C5A059;padding:16px;border-radius:4px;">
        <p style="margin:0 0 4px;"><strong>Sender Bank:</strong> ${senderBank.trim()}</p>
        ${transactionRef ? `<p style="margin:0 0 4px;"><strong>Transaction Ref:</strong> ${transactionRef.trim()}</p>` : ''}
        ${notes ? `<p style="margin:0;"><strong>Notes:</strong> ${notes.trim()}</p>` : ''}
      </div>
      
      <p style="margin:16px 0 0;font-size:12px;color:#8C8C96;">
        Check your bank account for this incoming transfer. You can manually reconcile it from the Catalyst Admin Dashboard.
      </p>
    </div>`

    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `[Transfer Sent] ${ref} from ${senderBank.trim()}`,
      html,
    }).catch(e => console.error('[bank-transfer/confirm] email error:', e))

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[bank-transfer/confirm]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
