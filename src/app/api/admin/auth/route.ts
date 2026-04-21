import { NextRequest, NextResponse } from 'next/server'
import { setAdminCookie, clearAdminCookie } from '@/lib/auth/admin'

export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({ secret: '' }))
  const ok = await setAdminCookie(secret)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearAdminCookie()
  return NextResponse.json({ ok: true })
}
