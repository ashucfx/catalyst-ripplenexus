import { NextRequest, NextResponse } from 'next/server'
import { getAdminSecret } from '@/lib/auth/admin'

const COOKIE_NAME = 'catalyst_admin'
const MAX_AGE     = 60 * 60 * 8

export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({ secret: '' }))
  const adminSecret = getAdminSecret()

  if (!secret || !adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
