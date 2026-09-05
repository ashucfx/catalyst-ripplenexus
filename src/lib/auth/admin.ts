import { cookies } from 'next/headers'
import {
  COOKIE_NAME,
  MAX_AGE,
  getAdminSecret,
  timingSafeEqualStrings,
  verifyAdminSecret,
  createAdminSessionToken,
  verifyAdminToken,
} from './token'

export {
  COOKIE_NAME,
  MAX_AGE,
  getAdminSecret,
  timingSafeEqualStrings,
  verifyAdminSecret,
  createAdminSessionToken,
  verifyAdminToken,
}

export async function verifyAdminCookie(): Promise<boolean> {
  const store  = await cookies()
  const cookie = store.get(COOKIE_NAME)
  if (!cookie) return false
  return await verifyAdminToken(cookie.value)
}

export async function setAdminCookie(secret: string): Promise<boolean> {
  if (!verifyAdminSecret(secret)) return false
  const store = await cookies()
  const token = await createAdminSessionToken()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  })
  return true
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
