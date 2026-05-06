import { randomBytes } from 'crypto'
import { getDb } from './supabase'

export type SubscriberStatus = 'active' | 'unsubscribed'

export interface Subscriber {
  id:                string
  email:             string
  status:            SubscriberStatus
  tags:              string[]
  source:            string | null
  unsubscribe_token: string
  subscribed_at:     string
  unsubscribed_at:   string | null
}

function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function upsertSubscriber({
  email,
  source,
  tags = [],
  phone,
}: {
  email:   string
  source?: string
  tags?:   string[]
  phone?:  string
}): Promise<{ token: string; status: SubscriberStatus; isNew: boolean } | null> {
  const db = getDb()
  if (!db) return null

  const { data: existing } = await db
    .from('newsletter_subscribers')
    .select('id, unsubscribe_token, tags, status')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    // Respect explicit opt-out — never silently re-subscribe
    if (existing.status !== 'unsubscribed' && tags.length > 0) {
      const merged = Array.from(new Set([...(existing.tags ?? []), ...tags]))
      await db
        .from('newsletter_subscribers')
        .update({ tags: merged, ...(source ? { source } : {}) })
        .eq('email', email)
    }
    return { token: existing.unsubscribe_token, status: existing.status as SubscriberStatus, isNew: false }
  }

  const unsubscribe_token = generateToken()
  const { error } = await db
    .from('newsletter_subscribers')
    .insert({ email, source: source ?? null, tags, status: 'active', unsubscribe_token, phone: phone ?? null })

  if (error) {
    if (error.code === '23505') {
      // Race: another request won — re-fetch
      const { data: winner } = await db
        .from('newsletter_subscribers')
        .select('unsubscribe_token, status')
        .eq('email', email)
        .single()
      if (winner) return { token: winner.unsubscribe_token, status: winner.status as SubscriberStatus, isNew: false }
    }
    console.error('[newsletter] upsertSubscriber failed:', error.message)
    return null
  }

  return { token: unsubscribe_token, status: 'active', isNew: true }
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const db = getDb()
  if (!db) return false

  const { data, error } = await db
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[newsletter] unsubscribeByToken failed:', error.message)
    return false
  }

  return !!data
}

export async function getSubscriberByToken(token: string): Promise<Subscriber | null> {
  const db = getDb()
  if (!db) return null

  const { data, error } = await db
    .from('newsletter_subscribers')
    .select('*')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (error || !data) return null
  return data as Subscriber
}

export async function getActiveSubscribers(segment?: string[]): Promise<Subscriber[]> {
  const db = getDb()
  if (!db) return []

  let query = db
    .from('newsletter_subscribers')
    .select('*')
    .eq('status', 'active')

  if (segment && segment.length > 0) {
    query = query.overlaps('tags', segment)
  }

  const { data, error } = await query
  if (error) {
    console.error('[newsletter] getActiveSubscribers failed:', error.message)
    return []
  }

  return (data ?? []) as Subscriber[]
}

export async function createCampaign({
  subject,
  html,
  segment,
}: {
  subject:   string
  html:      string
  segment?:  string[]
}): Promise<string | null> {
  const db = getDb()
  if (!db) return null

  const { data, error } = await db
    .from('newsletters')
    .insert({ subject, html, segment: segment ?? null })
    .select('id')
    .single()

  if (error) {
    console.error('[newsletter] createCampaign failed:', error.message)
    return null
  }

  return data.id
}

export async function markCampaignSent(id: string, count: number): Promise<void> {
  const db = getDb()
  if (!db) return

  const { error } = await db
    .from('newsletters')
    .update({ sent_count: count, sent_at: new Date().toISOString() })
    .eq('id', id)

  if (error) console.error('[newsletter] markCampaignSent failed:', error.message)
}

export async function listCampaigns(): Promise<{
  id: string; subject: string; sent_count: number; sent_at: string | null; created_at: string
}[]> {
  const db = getDb()
  if (!db) return []

  const { data, error } = await db
    .from('newsletters')
    .select('id, subject, sent_count, sent_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[newsletter] listCampaigns failed:', error.message)
    return []
  }

  return data ?? []
}
