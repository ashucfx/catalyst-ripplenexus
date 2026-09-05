import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, verifyAdminToken } from '@/lib/auth/token'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public auth endpoint (login POST, logout DELETE)
  if (pathname === '/api/admin/auth') {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE_NAME)
  const isAuthenticated = await verifyAdminToken(cookie?.value)

  // If already authenticated and visiting login page, redirect to dashboard
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // If unauthenticated:
  if (!isAuthenticated) {
    // Block API calls with 401 Unauthorized
    if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/cost-engine')) {
      return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 })
    }
    // Redirect browser requests to admin login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If authenticated and hitting /admin root, redirect to /admin/dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/cost-engine/:path*',
  ],
}
