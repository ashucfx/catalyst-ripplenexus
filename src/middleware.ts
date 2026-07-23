import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'catalyst_admin'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public auth and health endpoints
  if (pathname === '/api/admin/auth' || pathname === '/api/admin/ping') {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE_NAME)
  const secret = process.env.ADMIN_SECRET

  const isAuthenticated = cookie?.value && secret && cookie.value === secret

  if (!isAuthenticated) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard', '/admin/dashboard/:path*', '/api/admin/:path*'],
}

