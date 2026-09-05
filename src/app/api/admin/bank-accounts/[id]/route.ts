import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'

// PATCH /api/admin/bank-accounts/[id]  → update account fields / status
// DELETE /api/admin/bank-accounts/[id] → soft-delete (set status='disabled')

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Account ID required.' }, { status: 400 })

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 })

  try {
    const body = await req.json()

    // Only allow updating these fields — strip anything else
    const allowedFields = [
      'currency', 'rail', 'status',
      'account_name', 'bank_name',
      'account_number', 'iban', 'sort_code',
      'routing_number', 'swift_bic',
      'reference_instructions', 'additional_notes',
    ]

    const validStatuses = ['active', 'coming_soon', 'requested', 'disabled']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 })
    }

    // Build the update object from allowed fields only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    for (const field of allowedFields) {
      if (field in body) {
        const val = body[field]
        if (field === 'currency' || field === 'rail') {
          updates[field] = typeof val === 'string' ? val.toUpperCase() : val
        } else {
          updates[field] = typeof val === 'string' ? val.trim() : val
        }
      }
    }

    const { data, error } = await db
      .from('international_bank_accounts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
      }
      console.error('[admin/bank-accounts/[id]] PATCH error:', error.message)
      return NextResponse.json({ error: 'Failed to update account.' }, { status: 500 })
    }

    console.log(`[admin/bank-accounts] Updated account ${id}`)
    return NextResponse.json({ account: data })
  } catch (err) {
    console.error('[admin/bank-accounts/[id]] PATCH parse error:', err)
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Account ID required.' }, { status: 400 })

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 })

  // Soft-delete: set status to 'disabled' rather than deleting the row.
  // This preserves the FK reference from bank_transfer_instructions.
  const { error } = await db
    .from('international_bank_accounts')
    .update({ status: 'disabled', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[admin/bank-accounts/[id]] DELETE error:', error.message)
    return NextResponse.json({ error: 'Failed to disable account.' }, { status: 500 })
  }

  console.log(`[admin/bank-accounts] Disabled account ${id}`)
  return NextResponse.json({ success: true })
}
