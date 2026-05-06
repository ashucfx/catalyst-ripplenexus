import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeByToken } from '@/lib/db/newsletter'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe?error=missing', req.url))
  }

  const ok = await unsubscribeByToken(token)

  if (!ok) {
    return NextResponse.redirect(new URL('/unsubscribe?error=invalid', req.url))
  }

  return NextResponse.redirect(new URL('/unsubscribe?success=1', req.url))
}
