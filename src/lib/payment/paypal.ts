// PayPal Orders API v2 — no SDK, raw fetch (simpler, no bloat)

const BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('PayPal credentials not configured')

  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token as string
}

export type PayPalOrderResult = {
  orderId:  string
  clientId: string
}

export async function createPayPalOrder(params: {
  amountUSD:   number
  description: string
  invoiceId:   string
}): Promise<PayPalOrderResult> {
  const token = await getAccessToken()

  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
      'PayPal-Request-Id': params.invoiceId,   // idempotency key
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id:  params.invoiceId,
        description:   params.description,
        invoice_id:    params.invoiceId,
        amount: {
          currency_code: 'USD',
          value: params.amountUSD.toFixed(2),
        },
      }],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name:                'Catalyst',
            locale:                    'en-US',
            landing_page:              'NO_PREFERENCE',
            user_action:               'PAY_NOW',
            return_url:                `${process.env.NEXT_PUBLIC_BASE_URL}/audit/success`,
            cancel_url:                `${process.env.NEXT_PUBLIC_BASE_URL}/audit`,
          },
        },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal order creation failed: ${err}`)
  }

  const data = await res.json()
  return {
    orderId:  data.id,
    clientId: process.env.PAYPAL_CLIENT_ID!,
  }
}

export async function capturePayPalOrder(orderId: string): Promise<{
  status:    string
  captureId: string
  amount:    string
  payer:     { email: string; name: string }
}> {
  const token = await getAccessToken()

  const res = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal capture failed: ${err}`)
  }

  const data = await res.json()
  const unit = data.purchase_units?.[0]
  const cap  = unit?.payments?.captures?.[0]

  return {
    status:    data.status,
    captureId: cap?.id ?? '',
    amount:    cap?.amount?.value ?? '0',
    payer: {
      email: data.payer?.email_address ?? '',
      name:  `${data.payer?.name?.given_name ?? ''} ${data.payer?.name?.surname ?? ''}`.trim(),
    },
  }
}
