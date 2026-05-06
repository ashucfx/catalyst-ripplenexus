import { NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'
import * as XLSX from 'xlsx'

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
    db.from('leads').select('*').order('created_at', { ascending: false }),
    db.from('tpi_submissions').select('*').order('created_at', { ascending: false }),
    db.from('payments').select('*').order('created_at', { ascending: false }),
    db.from('audit_portals').select('email, report_ready, created_at').order('created_at', { ascending: false }),
    db.from('newsletter_subscribers').select('email, status, phone, tags, source, subscribed_at, unsubscribed_at').order('subscribed_at', { ascending: false }),
    db.from('platform_waitlist').select('email, plan, phone, created_at').order('created_at', { ascending: false }),
    db.from('bookings').select('name, email, company, status, starts_at, ends_at, timezone, payment_method, created_at').order('created_at', { ascending: false }),
  ])

  const wb = XLSX.utils.book_new()

  // ── Leads ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (leads ?? []).map(r => ({
      Name:      r.name,
      Email:     r.email,
      Role:      r.role,
      Seniority: r.seniority,
      Geography: r.geography,
      Service:   r.service,
      Goals:     Array.isArray(r.goals) ? r.goals.join(', ') : r.goals,
      Timeline:  r.timeline,
      Referral:  r.referral,
      Date:      r.created_at ? new Date(r.created_at).toLocaleString() : '',
    }))
  ), 'Request Leads')

  // ── TPI Submissions ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (tpi ?? []).map(r => ({
      Email:       r.email,
      Score:       r.score,
      Seniority:   r.seniority,
      Geography:   r.geography,
      'Salary Band': r.salary_band,
      'Last Raise':  r.last_raise,
      Sector:      r.sector,
      'Annual Cost': r.annual_cost,
      Gaps:        Array.isArray(r.gaps) ? r.gaps.join(' | ') : r.gaps,
      Date:        r.created_at ? new Date(r.created_at).toLocaleString() : '',
    }))
  ), 'TPI Submissions')

  // ── Payments ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (payments ?? []).map(r => ({
      Email:      r.email,
      Product:    r.product,
      Amount:     r.amount,
      Currency:   r.currency,
      Method:     r.method,
      Status:     r.status,
      'Payment ID': r.payment_id,
      'Order ID':   r.order_id,
      Date:       r.created_at ? new Date(r.created_at).toLocaleString() : '',
    }))
  ), 'Payments')

  // ── Audit Portals ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (portals ?? []).map(r => ({
      Email:          r.email,
      'Report Ready': r.report_ready ? 'Yes' : 'No',
      Date:           r.created_at ? new Date(r.created_at).toLocaleString() : '',
    }))
  ), 'Audit Portals')

  // ── Newsletter ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (newsletter ?? []).map(r => ({
      Email:        r.email,
      Phone:        r.phone ?? '',
      Status:       r.status,
      Tags:         Array.isArray(r.tags) ? r.tags.join(', ') : r.tags,
      Source:       r.source ?? '',
      'Subscribed':   r.subscribed_at ? new Date(r.subscribed_at).toLocaleString() : '',
      'Unsubscribed': r.unsubscribed_at ? new Date(r.unsubscribed_at).toLocaleString() : '',
    }))
  ), 'Newsletter')

  // ── Waitlist ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (waitlist ?? []).map(r => ({
      Email: r.email,
      Phone: r.phone ?? '',
      Plan:  r.plan ?? '',
      Date:  r.created_at ? new Date(r.created_at).toLocaleString() : '',
    }))
  ), 'Platform Waitlist')

  // ── Bookings ──
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    (bookings ?? []).map(r => ({
      Name:      r.name,
      Email:     r.email,
      Company:   r.company ?? '',
      Status:    r.status,
      Starts:    r.starts_at ? new Date(r.starts_at).toLocaleString() : '',
      Ends:      r.ends_at   ? new Date(r.ends_at).toLocaleString()   : '',
      Timezone:  r.timezone,
      Payment:   r.payment_method ?? '',
      Date:      r.created_at ? new Date(r.created_at).toLocaleString() : '',
    }))
  ), 'Bookings')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const filename = `catalyst-crm-${new Date().toISOString().split('T')[0]}.xlsx`

  return new NextResponse(buf, {
    headers: {
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
