import { NextResponse } from 'next/server'
import { verifyAdminCookie, getAdminSecret } from '@/lib/auth/admin'

export async function GET() {
  const authed = await verifyAdminCookie()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secretSet = !!getAdminSecret()

  return NextResponse.json({
    status: 'ok',
    authed: true,
    secretConfigured: secretSet,
    timestamp: new Date().toISOString(),
  })
}
