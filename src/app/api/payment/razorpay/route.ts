import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/payment/razorpay'
import { rateLimit } from '@/lib/rateLimit'

const PRICES_INR: Record<string, number> = {
  audit: 15000,
}

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 }, 'payment')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { product, email } = await req.json()

    const amountINR = PRICES_INR[product]
    if (!amountINR) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 })

    const order = await createRazorpayOrder({
      amountINR,
      receipt: `${product}_${Date.now()}`,
      notes:   { email: email ?? '', product },
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error('[payment/razorpay]', err)
    return NextResponse.json({ error: 'Could not create order.' }, { status: 500 })
  }
}
