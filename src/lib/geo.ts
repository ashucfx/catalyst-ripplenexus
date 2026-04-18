import { headers } from 'next/headers'

export type GeoResult = {
  country: string       // ISO 3166-1 alpha-2, e.g. "IN", "US", "AE"
  isIndia: boolean
  currency: 'INR' | 'USD'
  paymentMethod: 'razorpay' | 'paypal'
}

// Vercel injects x-vercel-ip-country on every request at the edge — zero latency,
// no external API call. Falls back to 'US' if header is absent (local dev, etc.).
export async function getGeo(): Promise<GeoResult> {
  const h       = await headers()
  const country = h.get('x-vercel-ip-country') ?? 'US'
  const isIndia = country === 'IN'

  return {
    country,
    isIndia,
    currency:      isIndia ? 'INR' : 'USD',
    paymentMethod: isIndia ? 'razorpay' : 'paypal',
  }
}

// Client-side: call /api/geo to get the same result
export type GeoResponse = GeoResult
