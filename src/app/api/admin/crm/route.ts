import { NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'

export type CrmStatus = 'lead' | 'warm' | 'qualified' | 'cold' | 'churned'

export interface CrmLead {
  email:              string
  name:               string | null
  phone:              string | null
  sources:            string[]
  paid:               boolean
  payment_products:   string[]
  payment_total:      number
  tpi_score:          number | null
  tpi_sector:         string | null
  tpi_seniority:      string | null
  has_audit_portal:   boolean
  report_ready:       boolean
  newsletter:         boolean
  waitlist:           boolean
  waitlist_plan:      string | null
  booking:            boolean
  created_at:         string
  status:             CrmStatus
  notes:              string | null
  manual_override:    boolean
  campaigns_received: number
  last_emailed:       string | null
}

function autoQualify(l: Omit<CrmLead, 'status' | 'notes' | 'manual_override' | 'campaigns_received' | 'last_emailed'>): CrmStatus {
  if (l.paid) return 'qualified'
  if (l.booking && l.tpi_score !== null && l.tpi_score >= 65) return 'qualified'
  if (l.sources.length >= 4) return 'qualified'
  if (l.booking) return 'warm'
  if (l.waitlist) return 'warm'
  if (l.tpi_score !== null && l.tpi_score >= 50) return 'warm'
  if (l.sources.length >= 2) return 'warm'
  const daysOld = (Date.now() - new Date(l.created_at).getTime()) / 86_400_000
  if (daysOld > 90) return 'cold'
  return 'lead'
}

export async function GET() {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured' }, { status: 503 })

  const [
    { data: leads },
    { data: tpi },
    { data: payments },
    { data: portals },
    { data: newsletter },
    { data: waitlist },
    { data: bookings },
    { data: contacts },
    { data: recipients },
  ] = await Promise.all([
    db.from('leads').select('name, email, created_at').order('created_at', { ascending: false }),
    db.from('tpi_submissions').select('email, score, sector, seniority, created_at').order('created_at', { ascending: false }),
    db.from('payments').select('email, product, amount, currency, status, created_at').order('created_at', { ascending: false }),
    db.from('audit_portals').select('email, report_ready, created_at').order('created_at', { ascending: false }),
    db.from('newsletter_subscribers').select('email, status, phone, created_at').order('created_at', { ascending: false }),
    db.from('platform_waitlist').select('email, plan, phone, created_at').order('created_at', { ascending: false }),
    db.from('bookings').select('email, name, status, created_at').order('created_at', { ascending: false }),
    db.from('crm_contacts').select('email, status, notes, manual_override, deleted').order('updated_at', { ascending: false }),
    db.from('campaign_recipients').select('email, sent_at').order('sent_at', { ascending: false }),
  ])

  // Index crm_contacts by email
  const contactMap = new Map<string, { status: CrmStatus; notes: string | null; manual_override: boolean; deleted: boolean }>(
    (contacts ?? []).map(c => [c.email, { status: c.status, notes: c.notes ?? null, manual_override: c.manual_override, deleted: c.deleted }])
  )

  // Index campaign recipients: email → { count, last_sent_at }
  const recipientMap = new Map<string, { count: number; last_emailed: string }>()
  for (const r of recipients ?? []) {
    const existing = recipientMap.get(r.email)
    if (!existing) {
      recipientMap.set(r.email, { count: 1, last_emailed: r.sent_at })
    } else {
      existing.count++
      if (r.sent_at > existing.last_emailed) existing.last_emailed = r.sent_at
    }
  }

  type LeadBase = Omit<CrmLead, 'status' | 'notes' | 'manual_override' | 'campaigns_received' | 'last_emailed'>
  const emailMap = new Map<string, LeadBase>()

  function getOrCreate(email: string, name?: string | null, phone?: string | null, created_at?: string): LeadBase {
    if (!emailMap.has(email)) {
      emailMap.set(email, {
        email,
        name:            name ?? null,
        phone:           phone ?? null,
        sources:         [],
        paid:            false,
        payment_products:[],
        payment_total:   0,
        tpi_score:       null,
        tpi_sector:      null,
        tpi_seniority:   null,
        has_audit_portal:false,
        report_ready:    false,
        newsletter:      false,
        waitlist:        false,
        waitlist_plan:   null,
        booking:         false,
        created_at:      created_at ?? new Date().toISOString(),
      })
    }
    const lead = emailMap.get(email)!
    if (name && !lead.name) lead.name = name
    if (phone && !lead.phone) lead.phone = phone
    if (created_at && created_at < lead.created_at) lead.created_at = created_at
    return lead
  }

  for (const r of leads ?? []) {
    const l = getOrCreate(r.email, r.name, null, r.created_at)
    if (!l.sources.includes('request_form')) l.sources.push('request_form')
  }
  for (const r of tpi ?? []) {
    const l = getOrCreate(r.email, null, null, r.created_at)
    if (!l.sources.includes('tpi_calculator')) l.sources.push('tpi_calculator')
    if (l.tpi_score === null) { l.tpi_score = r.score; l.tpi_sector = r.sector; l.tpi_seniority = r.seniority }
  }
  for (const r of payments ?? []) {
    const l = getOrCreate(r.email, null, null, r.created_at)
    if (!l.sources.includes('payment')) l.sources.push('payment')
    l.paid = true
    if (!l.payment_products.includes(r.product)) l.payment_products.push(r.product)
    l.payment_total += Number(r.amount ?? 0)
  }
  for (const r of portals ?? []) {
    const l = getOrCreate(r.email, null, null, r.created_at)
    if (!l.sources.includes('audit')) l.sources.push('audit')
    l.has_audit_portal = true
    if (r.report_ready) l.report_ready = true
  }
  for (const r of newsletter ?? []) {
    const l = getOrCreate(r.email, null, r.phone, r.created_at)
    if (!l.sources.includes('newsletter')) l.sources.push('newsletter')
    if (r.status === 'active') l.newsletter = true
    if (r.phone && !l.phone) l.phone = r.phone
  }
  for (const r of waitlist ?? []) {
    const l = getOrCreate(r.email, null, r.phone, r.created_at)
    if (!l.sources.includes('waitlist')) l.sources.push('waitlist')
    l.waitlist = true
    l.waitlist_plan = r.plan ?? null
    if (r.phone && !l.phone) l.phone = r.phone
  }
  for (const r of bookings ?? []) {
    const l = getOrCreate(r.email, r.name, null, r.created_at)
    if (!l.sources.includes('booking')) l.sources.push('booking')
    l.booking = true
  }

  const crm: CrmLead[] = []

  for (const base of emailMap.values()) {
    const contact = contactMap.get(base.email)

    // Skip soft-deleted
    if (contact?.deleted) continue

    const manual_override = contact?.manual_override ?? false
    const notes           = contact?.notes ?? null
    const status: CrmStatus = manual_override && contact?.status
      ? contact.status
      : autoQualify(base)

    const rec = recipientMap.get(base.email)
    crm.push({
      ...base, status, notes, manual_override,
      campaigns_received: rec?.count ?? 0,
      last_emailed:       rec?.last_emailed ?? null,
    })
  }

  crm.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return NextResponse.json({ crm, total: crm.length })
}
