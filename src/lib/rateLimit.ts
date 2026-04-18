// Simple in-memory rate limiter — replaced with Redis/Upstash in production
const store = new Map<string, { count: number; reset: number }>()

type Options = {
  limit:      number  // max requests
  windowMs:   number  // window in milliseconds
}

export function rateLimit(ip: string, opts: Options): { ok: boolean; remaining: number } {
  const now    = Date.now()
  const entry  = store.get(ip)

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + opts.windowMs })
    return { ok: true, remaining: opts.limit - 1 }
  }

  if (entry.count >= opts.limit) {
    return { ok: false, remaining: 0 }
  }

  entry.count++
  return { ok: true, remaining: opts.limit - entry.count }
}

// Clean up expired entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  store.forEach((v, k) => { if (now > v.reset) store.delete(k) })
}, 10 * 60 * 1000)
