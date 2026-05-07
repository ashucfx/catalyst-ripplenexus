import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'catalyst_admin'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)
  const secret = process.env.ADMIN_SECRET

  if (!cookie?.value || !secret || cookie.value !== secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
