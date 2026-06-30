import { headers } from 'next/headers'
import { getBand } from './constants/international-pricing'
import type { Band } from './constants/international-pricing'

export type GeoResult = {
  country:       string       // ISO 3166-1 alpha-2, e.g. "IN", "US", "AE"
  isIndia:       boolean
  band:          Band         // pricing band A/B/C/D from PDF
  currency:      'INR' | 'USD'
  paymentMethod: 'razorpay' | 'paypal'
}

// Vercel injects x-vercel-ip-country on every request at the edge — zero latency,
// no external API call. Falls back to 'US' if header is absent (local dev, etc.).
export async function getGeo(): Promise<GeoResult> {
  const h     = await headers()
  let country = h.get('x-vercel-ip-country')

  if (!country) {
    country = process.env.NODE_ENV === 'development' ? 'IN' : 'US'
  }

  const isIndia = country === 'IN'
  const band    = isIndia ? 'D' : getBand(country)

  return {
    country,
    isIndia,
    band,
    currency:      isIndia ? 'INR' : 'USD',
    paymentMethod: isIndia ? 'razorpay' : 'paypal',
  }
}

// Client-side: call /api/geo to get the same result
export type GeoResponse = GeoResult
