import { NextRequest, NextResponse } from 'next/server'
import { getPaymentMethods } from '@/lib/payment/methodEngine'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country  = searchParams.get('country') || 'US'
  const currency = searchParams.get('currency') || 'USD'

  const methods = await getPaymentMethods(country, currency)
  return NextResponse.json(methods)
}
