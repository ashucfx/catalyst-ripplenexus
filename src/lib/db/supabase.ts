import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Server-only — uses service role key, bypasses RLS.
// Never import this in client components.
export function getDb(): SupabaseClient | null {
  if (_client) return _client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.warn('[db] Supabase not configured — DB writes skipped.')
    return null
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _client
}

// ── Typed insert helpers ─────────────────────────────────────────────────────

export async function insertNewsletterSubscriber(email: string) {
  const db = getDb()
  if (!db) return
  const { error } = await db
    .from('newsletter_subscribers')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })
  if (error) console.error('[db] newsletter_subscribers insert:', error.message)
}

export async function insertTpiSubmission(data: {
  email:      string
  score:      number
  seniority:  string
  geography:  string
  salaryBand: string
  lastRaise:  string
  sector:     string
  gaps:       string[]
  annualCost: string
}) {
  const db = getDb()
  if (!db) return
  const { error } = await db.from('tpi_submissions').insert({
    email:       data.email,
    score:       data.score,
    seniority:   data.seniority,
    geography:   data.geography,
    salary_band: data.salaryBand,
    last_raise:  data.lastRaise,
    sector:      data.sector,
    gaps:        data.gaps,
    annual_cost: data.annualCost,
  })
  if (error) console.error('[db] tpi_submissions insert:', error.message)
}

export async function insertLead(data: {
  name:      string
  email:     string
  role:      string
  seniority: string
  geography: string
  goals:     string[]
  service:   string
  context:   string
  timeline:  string
  referral:  string
}) {
  const db = getDb()
  if (!db) return
  const { error } = await db.from('leads').insert(data)
  if (error) console.error('[db] leads insert:', error.message)
}

export async function insertPayment(data: {
  email:     string
  product:   string
  method:    'razorpay' | 'paypal'
  amount:    number
  currency:  string
  paymentId: string
  orderId?:  string
}) {
  const db = getDb()
  if (!db) return
  const { error } = await db.from('payments').insert({
    email:      data.email,
    product:    data.product,
    method:     data.method,
    amount:     data.amount,
    currency:   data.currency,
    payment_id: data.paymentId,
    order_id:   data.orderId ?? null,
    status:     'completed',
  })
  if (error) console.error('[db] payments insert:', error.message)
}

export async function insertPlatformWaitlist(email: string, plan?: string) {
  const db = getDb()
  if (!db) return
  const { error } = await db
    .from('platform_waitlist')
    .upsert({ email, plan: plan ?? null }, { onConflict: 'email', ignoreDuplicates: true })
  if (error) console.error('[db] platform_waitlist insert:', error.message)
}
