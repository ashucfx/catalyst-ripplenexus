import { NextRequest, NextResponse } from 'next/server'
import {
  COOKIE_NAME,
  MAX_AGE,
  verifyAdminSecret,
  createAdminSessionToken,
} from '@/lib/auth/admin'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limiting against brute-force attacks: max 5 attempts per 15 minutes per IP
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'

  const { ok: allowed } = await rateLimit(
    ip,
    { limit: 5, windowMs: 15 * 60 * 1000 },
    'admin-auth',
  )

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
      { status: 429 },
    )
  }

  const { secret } = await req.json().catch(() => ({ secret: '' }))

  if (!secret || !verifyAdminSecret(secret)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await createAdminSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
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
