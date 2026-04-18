import { Ratelimit } from '@upstash/ratelimit'
import { Redis }     from '@upstash/redis'

// ── In-memory fallback (local dev / Upstash not configured) ──────────────────
const memStore = new Map<string, { count: number; reset: number }>()
setInterval(() => {
  const now = Date.now()
  memStore.forEach((v, k) => { if (now > v.reset) memStore.delete(k) })
}, 10 * 60 * 1000)

function memLimit(key: string, limit: number, windowMs: number) {
  const now   = Date.now()
  const entry = memStore.get(key)
  if (!entry || now > entry.reset) {
    memStore.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }
  if (entry.count >= limit) return { ok: false, remaining: 0 }
  entry.count++
  return { ok: true, remaining: limit - entry.count }
}

// ── Upstash Redis (production) ───────────────────────────────────────────────
let _redis: Redis | null = null
const _limiters = new Map<string, Ratelimit>()

function getRedis(): Redis | null {
  if (_redis) return _redis
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  return _redis
}

function getLimiter(route: string, limit: number): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  if (!_limiters.has(route)) {
    _limiters.set(route, new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, '1 h'),
      prefix:  `catalyst:rl:${route}`,
    }))
  }
  return _limiters.get(route)!
}

export type RateLimitOptions = {
  limit:    number
  windowMs: number
}

// route = unique name per endpoint ('newsletter' | 'tpi' | 'request' | 'payment' | ...)
export async function rateLimit(
  ip:    string,
  opts:  RateLimitOptions,
  route: string = 'default',
): Promise<{ ok: boolean; remaining: number }> {
  const limiter = getLimiter(route, opts.limit)

  if (!limiter) {
    return memLimit(`${route}:${ip}`, opts.limit, opts.windowMs)
  }

  try {
    const { success, remaining } = await limiter.limit(ip)
    return { ok: success, remaining }
  } catch (err) {
    // Redis error → fail open so legitimate users aren't blocked
    console.error('[rateLimit] Redis error, failing open:', err)
    return { ok: true, remaining: opts.limit }
  }
}
