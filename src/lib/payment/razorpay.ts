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
  amountINR: number   // in rupees — we convert to paise internally
  receipt:   string   // unique receipt ID (e.g. "audit_<timestamp>")
  notes?:    Record<string, string>
}

export type RazorpayOrderResult = {
  orderId:  string
  amount:   number    // paise
  currency: 'INR'
  keyId:    string
}

export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult> {
  const client = getClient()
  const order  = await client.orders.create({
    amount:   Math.round(params.amountINR * 100),   // rupees → paise
    currency: 'INR',
    receipt:  params.receipt,
    notes:    params.notes ?? {},
  })

  return {
    orderId:  order.id,
    amount:   order.amount as number,
    currency: 'INR',
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
