import { cookies } from 'next/headers'

const COOKIE_NAME = 'catalyst_admin'
const MAX_AGE     = 60 * 60 * 8  // 8 hours

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET ?? ''
}

export async function verifyAdminCookie(): Promise<boolean> {
  const store  = await cookies()
  const cookie = store.get(COOKIE_NAME)
  if (!cookie) return false
  return cookie.value === getAdminSecret() && !!getAdminSecret()
}

export async function setAdminCookie(secret: string): Promise<boolean> {
  if (!secret || secret !== getAdminSecret()) return false
  const store = await cookies()
  store.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/admin',
  })
  return true
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
