import { NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'

export interface CrmLead {
  email:            string
  name:             string | null
  phone:            string | null
  sources:          string[]
  paid:             boolean
  payment_products: string[]
  payment_total:    number
  tpi_score:        number | null
  tpi_sector:       string | null
  tpi_seniority:    string | null
  has_audit_portal: boolean
  report_ready:     boolean
  newsletter:       boolean
  waitlist:         boolean
  waitlist_plan:    string | null
  booking:          boolean
  created_at:       string
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
  ] = await Promise.all([
    db.from('leads').select('name, email, created_at').order('created_at', { ascending: false }),
    db.from('tpi_submissions').select('email, score, sector, seniority, created_at').order('created_at', { ascending: false }),
    db.from('payments').select('email, product, amount, currency, status, created_at').order('created_at', { ascending: false }),
    db.from('audit_portals').select('email, report_ready, created_at').order('created_at', { ascending: false }),
    db.from('newsletter_subscribers').select('email, status, phone, created_at').order('created_at', { ascending: false }),
    db.from('platform_waitlist').select('email, plan, phone, created_at').order('created_at', { ascending: false }),
    db.from('bookings').select('email, name, status, created_at').order('created_at', { ascending: false }),
  ])

  const emailMap = new Map<string, CrmLead>()

  function getOrCreate(email: string, name?: string | null, phone?: string | null, created_at?: string): CrmLead {
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

  const crm = Array.from(emailMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return NextResponse.json({ crm, total: crm.length })
}
