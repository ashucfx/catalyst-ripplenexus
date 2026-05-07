import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminCookie, getAdminSecret } from '@/lib/auth/admin'

export async function GET(req: NextRequest) {
  const store      = await cookies()
  const all        = store.getAll()
  const authed     = await verifyAdminCookie()
  const secretSet  = !!getAdminSecret()
  const rawCookie  = req.headers.get('cookie')

  return NextResponse.json({
    authed,
    secretSet,
    cookieNames:      all.map(c => c.name),
    hasCatalystAdmin: all.some(c => c.name === 'catalyst_admin'),
    rawCookieHeader:  rawCookie ?? '(none)',
  })
}
