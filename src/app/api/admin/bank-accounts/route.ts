import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'

// GET  /api/admin/bank-accounts        → list all accounts
// POST /api/admin/bank-accounts        → create new account

export async function GET() {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 })

  const { data, error } = await db
    .from('international_bank_accounts')
    .select('*')
    .order('currency', { ascending: true })

  if (error) {
    console.error('[admin/bank-accounts] GET error:', error.message)
    return NextResponse.json({ error: 'Failed to fetch accounts.' }, { status: 500 })
  }

  return NextResponse.json({ accounts: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 })

  try {
    const body = await req.json()
    const {
      currency, rail, status = 'active',
      account_name, bank_name,
      account_number, iban, sort_code,
      routing_number, swift_bic,
      reference_instructions, additional_notes,
    } = body

    if (!currency || !rail || !account_name) {
      return NextResponse.json(
        { error: 'currency, rail, and account_name are required.' },
        { status: 400 },
      )
    }

    const validStatuses = ['active', 'coming_soon', 'requested', 'disabled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 })
    }

    const { data, error } = await db
      .from('international_bank_accounts')
      .insert({
        currency:               currency.toUpperCase(),
        rail:                   rail.toUpperCase(),
        status,
        account_name:           account_name.trim(),
        bank_name:              bank_name?.trim() ?? null,
        account_number:         account_number?.trim() ?? null,
        iban:                   iban?.trim() ?? null,
        sort_code:              sort_code?.trim() ?? null,
        routing_number:         routing_number?.trim() ?? null,
        swift_bic:              swift_bic?.trim() ?? null,
        reference_instructions: reference_instructions?.trim() ?? null,
        additional_notes:       additional_notes?.trim() ?? null,
      })
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'An active account already exists for this currency and rail.' },
          { status: 409 },
        )
      }
      console.error('[admin/bank-accounts] POST error:', error.message)
      return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
    }

    console.log(`[admin/bank-accounts] Created account for ${currency.toUpperCase()}/${rail.toUpperCase()}`)
    return NextResponse.json({ account: data }, { status: 201 })
  } catch (err) {
    console.error('[admin/bank-accounts] POST parse error:', err)
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
}
