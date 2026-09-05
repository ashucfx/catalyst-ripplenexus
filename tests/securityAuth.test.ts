/**
 * Security & Cryptographic Authentication Test Suite
 * Tests HMAC token security, constant-time validation, tamper rejection,
 * token expiration, and rate-limiting defenses.
 */

import {
  createAdminSessionToken,
  verifyAdminToken,
  verifyAdminSecret,
  timingSafeEqualStrings,
} from '../src/lib/auth/token'
import { rateLimit } from '../src/lib/rateLimit'

async function runSecurityTests() {
  console.log('🛡️ Starting Security & Cryptographic Authentication Test Suite...\n')

  process.env.ADMIN_SECRET = 'test-ultra-secure-admin-secret-2026-key'

  // ── 1. Test Constant-Time String Equality ───────────────────────────────────
  console.log('1. Testing constant-time string comparison...')
  if (!timingSafeEqualStrings('identical_string_123', 'identical_string_123')) {
    throw new Error('Identical strings should match')
  }
  if (timingSafeEqualStrings('short', 'longer_string')) {
    throw new Error('Different length strings should not match')
  }
  if (timingSafeEqualStrings('almost_match_1', 'almost_match_2')) {
    throw new Error('Different contents should not match')
  }
  if (timingSafeEqualStrings('', 'something') || timingSafeEqualStrings('something', '')) {
    throw new Error('Empty strings should fail safely')
  }
  console.log('   ✅ Constant-time string equality verified.')

  // ── 2. Test Admin Secret Verification ───────────────────────────────────────
  console.log('2. Testing admin secret verification...')
  if (!verifyAdminSecret('test-ultra-secure-admin-secret-2026-key')) {
    throw new Error('Valid secret must be accepted')
  }
  if (verifyAdminSecret('wrong-secret')) {
    throw new Error('Wrong secret must be rejected')
  }
  if (verifyAdminSecret('test-ultra-secure-admin-secret-2026-key-extra')) {
    throw new Error('Superstring secret must be rejected')
  }
  if (verifyAdminSecret('')) {
    throw new Error('Empty secret must be rejected')
  }
  console.log('   ✅ Admin secret constant-time verification passed.')

  // ── 3. Test Signed HMAC Session Token Creation & Verification ───────────────
  console.log('3. Testing HMAC signed session token generation & verification...')
  const token = await createAdminSessionToken()
  if (!token || !token.includes('.')) {
    throw new Error(`Invalid token format: ${token}`)
  }
  if (!(await verifyAdminToken(token))) {
    throw new Error('Freshly generated token must be verified successfully')
  }
  console.log(`   ✅ Token successfully verified: ${token.substring(0, 30)}...`)

  // ── 4. Test Tamper Detection on Token Payload ──────────────────────────────
  console.log('4. Testing anti-tampering on token payload and signature...')
  const [timestampStr, signature] = token.split('.')

  // Tamper with timestamp
  const tamperedTimestamp = `${parseInt(timestampStr, 10) - 1000}.${signature}`
  if (await verifyAdminToken(tamperedTimestamp)) {
    throw new Error('Tampered timestamp must be rejected')
  }

  // Tamper with signature
  const tamperedSignature = `${timestampStr}.${signature.slice(0, -2)}aa`
  if (await verifyAdminToken(tamperedSignature)) {
    throw new Error('Tampered signature must be rejected')
  }

  // Completely forged token
  if (await verifyAdminToken('1700000000000.deadbeefcafebabe12345678')) {
    throw new Error('Forged signature must be rejected')
  }
  console.log('   ✅ Anti-tamper detection verified: all modified tokens rejected.')

  // ── 5. Test Token Expiration ────────────────────────────────────────────────
  console.log('5. Testing token expiration limits (8 hours max)...')
  const expiredTimestamp = Date.now() - (8 * 60 * 60 * 1000 + 1000) // 8 hours and 1 sec ago
  const crypto = await import('crypto')
  const expiredSig = crypto
    .createHmac('sha256', process.env.ADMIN_SECRET)
    .update(`admin_session:${expiredTimestamp}`)
    .digest('hex')
  const expiredToken = `${expiredTimestamp}.${expiredSig}`

  if (await verifyAdminToken(expiredToken)) {
    throw new Error('Expired token must be rejected')
  }

  // Future token (>60s skew)
  const futureTimestamp = Date.now() + 120_000 // 2 min in future
  const futureSig = crypto
    .createHmac('sha256', process.env.ADMIN_SECRET)
    .update(`admin_session:${futureTimestamp}`)
    .digest('hex')
  const futureToken = `${futureTimestamp}.${futureSig}`

  if (await verifyAdminToken(futureToken)) {
    throw new Error('Future token must be rejected')
  }
  console.log('   ✅ Token expiration bounds passed.')

  // ── 6. Test Admin Login Rate Limiting ────────────────────────────────────────
  console.log('6. Testing brute-force rate limiter on admin authentication...')
  const testIp = '198.51.100.99'
  const route = 'test-admin-auth-suite'

  for (let i = 1; i <= 5; i++) {
    const res = await rateLimit(testIp, { limit: 5, windowMs: 60 * 1000 }, route)
    if (!res.ok) {
      throw new Error(`Attempt ${i} should be allowed within limit of 5`)
    }
  }

  // 6th attempt must be rejected
  const blocked = await rateLimit(testIp, { limit: 5, windowMs: 60 * 1000 }, route)
  if (blocked.ok) {
    throw new Error('6th attempt should be blocked by rate limiter')
  }
  console.log('   ✅ Brute-force rate limiter verified: successfully throttled after 5 attempts.')

  console.log('\n🎉 ALL SECURITY & AUTHENTICATION TESTS PASSED FLAWLESSLY!\n')
}

runSecurityTests().catch((err) => {
  console.error('\n❌ Security test failed:', err)
  process.exit(1)
})
