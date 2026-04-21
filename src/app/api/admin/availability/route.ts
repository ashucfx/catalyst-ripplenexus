import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getAvailabilityRules, setAvailabilityRules, getBlockedDates, addBlockedDate, removeBlockedDate } from '@/lib/db/bookings'

export async function GET() {
  if (!await verifyAdminCookie()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now   = new Date()
  const rules   = await getAvailabilityRules()
  const blocked = await getBlockedDates(now.getFullYear(), now.getMonth() + 1)
  return NextResponse.json({ rules, blocked })
}

export async function PUT(req: NextRequest) {
  if (!await verifyAdminCookie()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.rules) return NextResponse.json({ error: 'rules required' }, { status: 400 })

  const ok = await setAvailabilityRules(body.rules)
  return NextResponse.json({ ok })
}

export async function POST(req: NextRequest) {
  if (!await verifyAdminCookie()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.date) return NextResponse.json({ error: 'date required (YYYY-MM-DD)' }, { status: 400 })

  const ok = await addBlockedDate(body.date, body.reason)
  return NextResponse.json({ ok })
}

export async function DELETE(req: NextRequest) {
  if (!await verifyAdminCookie()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const ok = await removeBlockedDate(date)
  return NextResponse.json({ ok })
}
