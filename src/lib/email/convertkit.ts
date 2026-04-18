const CK_BASE    = 'https://api.convertkit.com/v3'
const CK_API_KEY = process.env.CONVERTKIT_API_KEY ?? ''

export const CK_FORMS = {
  newsletter: process.env.CONVERTKIT_NEWSLETTER_FORM_ID ?? '',
  tpiLeads:   process.env.CONVERTKIT_TPI_FORM_ID        ?? '',
}

type SubscribeOptions = {
  formId:  string
  email:   string
  fields?: Record<string, string>
  tags?:   string[]
}

export async function subscribeToForm({ formId, email, fields }: SubscribeOptions) {
  if (!CK_API_KEY || !formId) {
    console.warn('[ConvertKit] Missing API key or form ID — skipping subscription.')
    return { subscribed: false, reason: 'not_configured' }
  }

  const res = await fetch(`${CK_BASE}/forms/${formId}/subscribe`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ api_key: CK_API_KEY, email, fields }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[ConvertKit] Error:', res.status, text)
    return { subscribed: false, reason: text }
  }

  return { subscribed: true }
}
