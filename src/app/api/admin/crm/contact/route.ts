import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'

async function guard() {
  if (!await verifyAdminCookie()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 })
  return null
}

export async function PATCH(req: NextRequest) {
  const fail = await guard()
  if (fail) return fail
  const db = getDb()!

  const body = await req.json().catch(() => ({}))
  const { email, status, notes, manual_override } = body as {
    email?: string
    status?: string
    notes?: string
    manual_override?: boolean
  }

  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const validStatuses = ['lead', 'warm', 'qualified', 'cold', 'churned']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 })
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status !== undefined) { patch.status = status; patch.manual_override = manual_override ?? true }
  if (notes !== undefined)  patch.notes = notes

  const { error } = await db.from('crm_contacts').upsert(
    { email, ...patch },
    { onConflict: 'email' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const fail = await guard()
  if (fail) return fail
  const db = getDb()!

  const body = await req.json().catch(() => ({}))
  const { email } = body as { email?: string }
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const { error } = await db.from('crm_contacts').upsert(
    { email, deleted: true, deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { onConflict: 'email' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
