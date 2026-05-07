import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'
import { listCampaigns } from '@/lib/db/newsletter'

export async function DELETE(req: NextRequest) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured.' }, { status: 500 })

  const { id, email } = await req.json().catch(() => ({}))
  if (!id && !email) return NextResponse.json({ error: 'id or email required' }, { status: 400 })

  const query = id
    ? db.from('newsletter_subscribers').delete().eq('id', id)
    : db.from('newsletter_subscribers').delete().eq('email', email)

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured.' }, { status: 500 })

  const [subsResult, campaigns] = await Promise.all([
    db
      .from('newsletter_subscribers')
      .select('id, email, status, tags, source, subscribed_at, unsubscribed_at')
      .order('subscribed_at', { ascending: false })
      .limit(500),
    listCampaigns(),
  ])

  if (subsResult.error) {
    return NextResponse.json({ error: subsResult.error.message }, { status: 500 })
  }

  const subscribers = subsResult.data ?? []
  const active      = subscribers.filter(s => s.status === 'active').length
  const total       = subscribers.length

  return NextResponse.json({ subscribers, campaigns, stats: { total, active, unsubscribed: total - active } })
}
