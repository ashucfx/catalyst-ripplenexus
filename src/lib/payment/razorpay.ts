import Razorpay from 'razorpay'
import crypto from 'crypto'

let _client: Razorpay | null = null

function getClient(): Razorpay {
  if (!_client) {
    const key_id     = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) throw new Error('Razorpay credentials not configured')
    _client = new Razorpay({ key_id, key_secret })
  }
  return _client
}

export type RazorpayOrderParams = {
  amount:    number   // in major currency units (rupees for INR, dollars for USD, etc.)
  receipt:   string   // unique receipt ID (e.g. "audit_<timestamp>")
  currency?: string   // defaults to 'INR' for backward-compatibility
  notes?:    Record<string, string>
  /** @deprecated use amount instead */
  amountINR?: number
}

export type RazorpayOrderResult = {
  orderId:  string
  amount:   number    // in smallest currency unit (paise for INR, cents for USD, etc.)
  currency: string
  keyId:    string
}

export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult> {
  const client   = getClient()
  // Support legacy amountINR callers — prefer amount if both provided
  const unitAmount = params.amount ?? params.amountINR ?? 0
  const currency   = params.currency ?? 'INR'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order: any = await client.orders.create({
    amount:   Math.round(unitAmount * 100),   // major unit → smallest unit (paise/cents/pence)
    currency,
    receipt:  params.receipt,
    notes:    params.notes ?? {},
  })

  return {
    orderId:  order.id,
    amount:   order.amount as number,
    currency: order.currency as string,
    keyId:    process.env.RAZORPAY_KEY_ID!,
  }
}

export function verifyRazorpaySignature(params: {
  orderId:   string
  paymentId: string
  signature: string
}): boolean {
  const secret  = process.env.RAZORPAY_KEY_SECRET!
  const body    = `${params.orderId}|${params.paymentId}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return expected === params.signature
}
