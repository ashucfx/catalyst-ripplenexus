export const COOKIE_NAME = 'catalyst_admin'
export const MAX_AGE     = 60 * 60 * 8  // 8 hours in seconds

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET ?? ''
}

/**
 * Constant-time comparison of two strings to prevent timing side-channel attacks.
 * Pure bitwise comparison without Node.js crypto dependency, ensuring 100% Edge runtime compatibility.
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  let mismatch = a.length === b.length ? 0 : 1
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0
    const charB = i < b.length ? b.charCodeAt(i) : 0
    mismatch |= charA ^ charB
  }
  return mismatch === 0
}

/**
 * Verifies a submitted admin secret against the environment secret using constant-time comparison.
 */
export function verifyAdminSecret(providedSecret: string): boolean {
  const adminSecret = getAdminSecret()
  if (!providedSecret || !adminSecret) return false
  return timingSafeEqualStrings(providedSecret, adminSecret)
}

/**
 * Computes an HMAC-SHA256 hex digest using standard Web Crypto API (supported natively in Node.js & Edge Runtime).
 */
async function computeHmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(message))
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generates a signed, tamper-evident HMAC session token containing an issuance timestamp.
 * Format: `<timestamp_ms>.<hmac_sha256_hex>`
 */
export async function createAdminSessionToken(): Promise<string> {
  const secret = getAdminSecret()
  if (!secret) {
    throw new Error('ADMIN_SECRET environment variable is not configured.')
  }
  const timestamp = Date.now().toString()
  const signature = await computeHmacSha256Hex(secret, `admin_session:${timestamp}`)
  return `${timestamp}.${signature}`
}

/**
 * Verifies whether a session token is authentic, un-tampered, and unexpired.
 */
export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const secret = getAdminSecret()
  if (!secret) return false

  // Support signed HMAC token: timestamp.signature
  const parts = token.split('.')
  if (parts.length === 2) {
    const [timestampStr, signature] = parts
    const timestamp = parseInt(timestampStr, 10)
    if (isNaN(timestamp)) return false

    const now = Date.now()
    // Reject tokens from the future (> 60s skew) or older than MAX_AGE
    if (timestamp > now + 60_000 || now - timestamp > MAX_AGE * 1000) {
      return false
    }

    const expectedSignature = await computeHmacSha256Hex(secret, `admin_session:${timestampStr}`)
    return timingSafeEqualStrings(signature, expectedSignature)
  }

  // Graceful fallback for legacy raw secret cookies during migration
  return timingSafeEqualStrings(token, secret)
}
