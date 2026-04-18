import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/payment/paypal'
import { rateLimit } from '@/lib/rateLimit'

const PRICES_USD: Record<string, number>   = { audit: 499 }
const DESCRIPTIONS: Record<string, string> = {
  audit: 'Catalyst Market Value Audit — 45-minute career positioning diagnostic',
}

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 }, 'payment')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { product } = await req.json()

    const amountUSD = PRICES_USD[product]
    if (!amountUSD) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 })

    const order = await createPayPalOrder({
      amountUSD,
      description: DESCRIPTIONS[product] ?? product,
      invoiceId:   `${product}_${Date.now()}`,
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error('[payment/paypal/create]', err)
    return NextResponse.json({ error: 'Could not create PayPal order.' }, { status: 500 })
  }
}
