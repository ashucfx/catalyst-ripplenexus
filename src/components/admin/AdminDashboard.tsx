'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { InflectionMark } from '@/components/ui/InflectionMark'

const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// ── Types ──────────────────────────────────────────────────────────────────────

interface Booking {
  id:              string
  name:            string
  email:           string
  company?:        string
  starts_at:       string
  ends_at:         string
  timezone:        string
  status:          string
  payment_method?: string
  meeting_types:   { name: string; duration_min: number }
}

interface Rule {
  id:          string
  day_of_week: number
  start_time:  string
  end_time:    string
  is_active:   boolean
}

interface CrmLead {
  email:            string
  name:             string | null
  phone:            string | null
  sources:          string[]
  paid:             boolean
  payment_products: string[]
  payment_total:    number
  tpi_score:        number | null
  has_audit_portal: boolean
  report_ready:     boolean
  newsletter:       boolean
  waitlist:         boolean
  waitlist_plan:    string | null
  booking:          boolean
  created_at:       string
}

interface NewsletterStats {
  total:        number
  active:       number
  unsubscribed: number
}

interface Campaign {
  id:         string
  subject:    string
  sent_count: number
  sent_at:    string | null
  created_at: string
}

interface Props {
  initialBookings: Booking[]
  initialRules:    Rule[]
  adminTZ:         string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(isoStr: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(isoStr))
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const inputCls = 'bg-transparent border border-graphite px-4 py-2.5 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30'
const btnGold  = 'bg-signal-gold text-obsidian px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer disabled:opacity-60'
const btnGhost = 'border border-graphite/60 text-muted px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:text-bone hover:border-signal-gold/40 transition-colors cursor-pointer'

// ── Main Component ─────────────────────────────────────────────────────────────

export function AdminDashboard({ initialBookings, initialRules, adminTZ }: Props) {
  const router = useRouter()
  const [bookings,   setBookings]  = useState<Booking[]>(initialBookings)
  const [rules,      setRules]     = useState<Rule[]>(initialRules)
  const [tab,        setTab]       = useState<'bookings' | 'availability' | 'crm' | 'newsletter'>('bookings')
  const [blockedDate, setBlockedDate] = useState('')
  const [blockedNote, setBlockedNote] = useState('')
  const [blockMsg,    setBlockMsg]    = useState('')

  // CRM state
  const [crm,          setCrm]         = useState<CrmLead[]>([])
  const [crmLoading,   setCrmLoading]  = useState(false)
  const [crmFilter,    setCrmFilter]   = useState('')
  const [crmPaidOnly,  setCrmPaidOnly] = useState(false)
  const [crmEmailModal,setCrmEmailModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody,    setEmailBody]   = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [emailResult,  setEmailResult]  = useState('')

  // Newsletter state
  const [nlStats,     setNlStats]    = useState<NewsletterStats | null>(null)
  const [campaigns,   setCampaigns]  = useState<Campaign[]>([])
  const [nlLoading,   setNlLoading]  = useState(false)
  const [sendSubject, setSendSubject] = useState('')
  const [sendHtml,    setSendHtml]   = useState('')
  const [sending,     setSending]    = useState(false)
  const [sendResult,  setSendResult] = useState('')

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  async function refreshBookings() {
    const r = await fetch('/api/admin/bookings')
    if (r.ok) { const d = await r.json(); setBookings(d.bookings) }
  }

  async function toggleDay(dow: number) {
    const exists = rules.find(r => r.day_of_week === dow)
    const next: Rule[] = exists
      ? rules.map(r => r.day_of_week === dow ? { ...r, is_active: !r.is_active } : r)
      : [...rules, { id: '', day_of_week: dow, start_time: '10:00', end_time: '18:00', is_active: true }]
    setRules(next)
    await fetch('/api/admin/availability', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ rules: next.filter(r => r.is_active).map(({ day_of_week, start_time, end_time }) => ({ day_of_week, start_time, end_time })) }),
    })
  }

  async function updateTime(dow: number, field: 'start_time' | 'end_time', val: string) {
    const next = rules.map(r => r.day_of_week === dow ? { ...r, [field]: val } : r)
    setRules(next)
    await fetch('/api/admin/availability', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ rules: next.filter(r => r.is_active).map(({ day_of_week, start_time, end_time }) => ({ day_of_week, start_time, end_time })) }),
    })
  }

  async function addBlock() {
    if (!blockedDate) return
    const res = await fetch('/api/admin/availability', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ date: blockedDate, reason: blockedNote }),
    })
    if (res.ok) { setBlockMsg(`${blockedDate} blocked.`); setBlockedDate(''); setBlockedNote('') }
    else         setBlockMsg('Failed to block date.')
  }

  const loadCrm = useCallback(async () => {
    setCrmLoading(true)
    try {
      const r = await fetch('/api/admin/crm')
      if (r.ok) { const d = await r.json(); setCrm(d.crm ?? []) }
    } finally {
      setCrmLoading(false)
    }
  }, [])

  const loadNewsletter = useCallback(async () => {
    setNlLoading(true)
    try {
      const r = await fetch('/api/admin/newsletter/subscribers')
      if (r.ok) {
        const d = await r.json()
        setNlStats(d.stats)
        setCampaigns(d.campaigns ?? [])
      }
    } finally {
      setNlLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'crm') loadCrm()
    if (tab === 'newsletter') loadNewsletter()
  }, [tab, loadCrm, loadNewsletter])

  async function sendCampaign() {
    if (!sendSubject.trim() || !sendHtml.trim()) return
    setSending(true)
    setSendResult('')
    try {
      const r = await fetch('/api/admin/newsletter/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subject: sendSubject, html: sendHtml }),
      })
      const d = await r.json()
      if (r.ok) {
        setSendResult(`Sent to ${d.sent} of ${d.total} subscribers.`)
        setSendSubject('')
        setSendHtml('')
        loadNewsletter()
      } else {
        setSendResult(d.error ?? 'Send failed.')
      }
    } finally {
      setSending(false)
    }
  }

  async function sendBulkEmail() {
    if (!emailSubject.trim() || !emailBody.trim()) return
    const targets = filteredCrm.map(l => l.email)
    if (targets.length === 0) return
    setEmailSending(true)
    setEmailResult('')
    try {
      const r = await fetch('/api/admin/newsletter/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subject: emailSubject, html: emailBody }),
      })
      const d = await r.json()
      setEmailResult(r.ok ? `Sent to ${d.sent} subscribers.` : (d.error ?? 'Failed.'))
    } finally {
      setEmailSending(false)
    }
  }

  function exportExcel() {
    window.location.href = '/api/admin/crm/export'
  }

  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const pending   = bookings.filter(b => b.status === 'pending_payment').length

  const filteredCrm = crm.filter(l => {
    const q = crmFilter.toLowerCase()
    const matchSearch = !q || l.email.toLowerCase().includes(q) || (l.name ?? '').toLowerCase().includes(q) || (l.phone ?? '').includes(q)
    const matchPaid   = !crmPaidOnly || l.paid
    return matchSearch && matchPaid
  })

  const TABS = [
    { id: 'bookings',     label: 'Bookings' },
    { id: 'availability', label: 'Availability' },
    { id: 'crm',          label: 'CRM' },
    { id: 'newsletter',   label: 'Newsletter' },
  ] as const

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Top bar */}
      <div className="border-b border-graphite px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <InflectionMark size="sm" />
          <p className="label-inst">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="font-mono text-muted text-[0.55rem] tracking-widest">{adminTZ}</p>
          <button onClick={logout} className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-graphite mb-10">
          {[
            { label: 'Upcoming bookings', value: bookings.length },
            { label: 'Confirmed',         value: confirmed },
            { label: 'Pending payment',   value: pending },
            { label: 'Admin TZ',          value: adminTZ.split('/')[1] ?? adminTZ },
          ].map(s => (
            <div key={s.label} className="bg-obsidian p-6">
              <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-2">{s.label.toUpperCase()}</p>
              <p className="display-card text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-graphite mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-mono text-[0.6rem] tracking-widest px-6 py-3 border-b-2 transition-colors whitespace-nowrap
                ${tab === t.id ? 'border-signal-gold text-bone' : 'border-transparent text-muted hover:text-bone'}`}
            >
              {t.label}
            </button>
          ))}
          {tab === 'bookings' && (
            <button onClick={refreshBookings} className="ml-auto font-mono text-muted text-[0.55rem] tracking-widest px-4 hover:text-bone shrink-0">
              Refresh ↻
            </button>
          )}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <>
            {bookings.length === 0 && (
              <p className="font-sans text-muted text-sm py-8">No upcoming bookings.</p>
            )}
            <div className="flex flex-col gap-2">
              {bookings.map(b => (
                <div key={b.id} className="bg-graphite border border-graphite/60 p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-sans text-bone text-sm font-medium">{b.name}</p>
                    <p className="font-sans text-muted text-xs">{b.email}</p>
                    {b.company && <p className="font-sans text-muted text-xs">{b.company}</p>}
                  </div>
                  <div>
                    <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1">SESSION</p>
                    <p className="font-sans text-bone text-sm">{b.meeting_types?.name}</p>
                    <p className="font-sans text-muted text-xs">{b.meeting_types?.duration_min} min</p>
                  </div>
                  <div>
                    <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1">TIME (IST)</p>
                    <p className="font-sans text-bone text-sm">{formatTime(b.starts_at, adminTZ)}</p>
                    <p className="font-sans text-muted text-xs">Client TZ: {b.timezone}</p>
                  </div>
                  <div className="flex items-start justify-end">
                    <span className={`font-mono text-[0.55rem] tracking-widest px-2 py-1 border ${
                      b.status === 'confirmed'       ? 'border-signal-gold/30 text-signal-gold bg-signal-gold/5' :
                      b.status === 'pending_payment' ? 'border-muted/30 text-muted' :
                      'border-graphite text-muted'
                    }`}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {tab === 'availability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-6">WEEKLY AVAILABILITY ({adminTZ})</p>
              <div className="flex flex-col gap-3">
                {Array.from({ length: 7 }).map((_, dow) => {
                  const rule   = rules.find(r => r.day_of_week === dow)
                  const active = !!rule?.is_active
                  return (
                    <div key={dow} className={`border p-4 flex items-center gap-4 transition-colors ${active ? 'border-graphite' : 'border-graphite/30 opacity-50'}`}>
                      <button
                        onClick={() => toggleDay(dow)}
                        className={`w-4 h-4 border-2 flex-shrink-0 transition-colors ${active ? 'bg-signal-gold border-signal-gold' : 'border-graphite'}`}
                      />
                      <span className="font-mono text-bone text-[0.7rem] w-12">{DAYS_FULL[dow]}</span>
                      {active && rule && (
                        <div className="flex items-center gap-2 ml-auto">
                          <input type="time" value={rule.start_time}
                            onChange={e => updateTime(dow, 'start_time', e.target.value)}
                            className="bg-transparent border border-graphite px-2 py-1 font-mono text-bone text-xs focus:outline-none" />
                          <span className="font-mono text-muted text-xs">—</span>
                          <input type="time" value={rule.end_time}
                            onChange={e => updateTime(dow, 'end_time', e.target.value)}
                            className="bg-transparent border border-graphite px-2 py-1 font-mono text-bone text-xs focus:outline-none" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-6">BLOCK A DATE</p>
              <div className="flex flex-col gap-3">
                <input
                  type="date" value={blockedDate}
                  onChange={e => setBlockedDate(e.target.value)}
                  className={inputCls}
                />
                <input
                  type="text" value={blockedNote}
                  onChange={e => setBlockedNote(e.target.value)}
                  placeholder="Reason (optional)"
                  className={inputCls}
                />
                <button onClick={addBlock} className={btnGold}>Block date →</button>
                {blockMsg && <p className="font-sans text-muted text-xs">{blockMsg}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── CRM TAB ── */}
        {tab === 'crm' && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <input
                type="text"
                value={crmFilter}
                onChange={e => setCrmFilter(e.target.value)}
                placeholder="Search email, name, phone…"
                className={`${inputCls} min-w-[220px]`}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crmPaidOnly}
                  onChange={e => setCrmPaidOnly(e.target.checked)}
                  className="accent-signal-gold"
                />
                <span className="font-mono text-muted text-[0.6rem] tracking-widest">PAID ONLY</span>
              </label>
              <span className="font-mono text-muted text-[0.55rem] tracking-widest ml-auto">
                {filteredCrm.length} of {crm.length} leads
              </span>
              <button onClick={() => setCrmEmailModal(true)} className={btnGhost}>
                Email Selected →
              </button>
              <button onClick={exportExcel} className={btnGold}>
                Export Excel ↓
              </button>
              <button onClick={loadCrm} className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone">
                Refresh ↻
              </button>
            </div>

            {crmLoading ? (
              <p className="font-sans text-muted text-sm py-8">Loading CRM data…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left" style={{ minWidth: '900px' }}>
                  <thead>
                    <tr className="border-b border-graphite">
                      {['Email', 'Name', 'Phone', 'Sources', 'Paid', 'TPI', 'Portal', 'Newsletter', 'Waitlist', 'Joined'].map(h => (
                        <th key={h} className="pb-3 pr-4 font-mono text-muted text-[0.55rem] tracking-widest whitespace-nowrap">{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrm.map(l => (
                      <tr key={l.email} className="border-b border-graphite/30 hover:bg-graphite/10 transition-colors">
                        <td className="py-3 pr-4 font-sans text-bone text-xs">{l.email}</td>
                        <td className="py-3 pr-4 font-sans text-muted text-xs">{l.name ?? '—'}</td>
                        <td className="py-3 pr-4 font-mono text-muted text-[0.6rem]">{l.phone ?? '—'}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-1">
                            {l.sources.map(s => (
                              <span key={s} className="font-mono text-[0.5rem] tracking-widest px-1.5 py-0.5 border border-graphite/60 text-muted">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          {l.paid
                            ? <span className="font-mono text-[0.55rem] text-signal-gold tracking-widest">YES</span>
                            : <span className="font-mono text-[0.55rem] text-muted tracking-widest">—</span>}
                        </td>
                        <td className="py-3 pr-4 font-mono text-muted text-[0.6rem]">
                          {l.tpi_score !== null ? l.tpi_score : '—'}
                        </td>
                        <td className="py-3 pr-4">
                          {l.has_audit_portal
                            ? <span className={`font-mono text-[0.55rem] tracking-widest ${l.report_ready ? 'text-signal-gold' : 'text-muted'}`}>
                                {l.report_ready ? 'READY' : 'PENDING'}
                              </span>
                            : <span className="font-mono text-[0.55rem] text-muted tracking-widest">—</span>}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`font-mono text-[0.55rem] tracking-widest ${l.newsletter ? 'text-signal-gold' : 'text-muted'}`}>
                            {l.newsletter ? 'YES' : '—'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono text-muted text-[0.55rem] tracking-widest">
                          {l.waitlist ? (l.waitlist_plan ?? 'YES') : '—'}
                        </td>
                        <td className="py-3 pr-4 font-mono text-muted text-[0.6rem] whitespace-nowrap">
                          {formatDate(l.created_at)}
                        </td>
                      </tr>
                    ))}
                    {filteredCrm.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-12 font-sans text-muted text-sm text-center">No records match your filter.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bulk email modal */}
            {crmEmailModal && (
              <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
                <div className="bg-obsidian border border-graphite p-8 max-w-xl w-full">
                  <p className="label-inst mb-6">Send Email to Filtered Leads</p>
                  <p className="font-sans text-muted text-xs mb-6">
                    This sends to <strong className="text-bone">{filteredCrm.length}</strong> newsletter subscribers in the current filter.
                    Non-subscribers are excluded automatically.
                  </p>
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Email subject line"
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className={`${inputCls} w-full`}
                    />
                    <textarea
                      placeholder="HTML email body…"
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                      rows={8}
                      className={`${inputCls} w-full resize-none`}
                    />
                    {emailResult && <p className="font-sans text-signal-gold text-xs">{emailResult}</p>}
                    <div className="flex gap-3">
                      <button onClick={sendBulkEmail} disabled={emailSending} className={btnGold}>
                        {emailSending ? 'Sending…' : 'Send →'}
                      </button>
                      <button onClick={() => { setCrmEmailModal(false); setEmailResult('') }} className={btnGhost}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NEWSLETTER TAB ── */}
        {tab === 'newsletter' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left — stats + campaigns */}
            <div>
              {nlLoading ? (
                <p className="font-sans text-muted text-sm mb-8">Loading…</p>
              ) : nlStats && (
                <div className="grid grid-cols-3 gap-px bg-graphite mb-8">
                  {[
                    { label: 'Total', value: nlStats.total },
                    { label: 'Active', value: nlStats.active },
                    { label: 'Unsubscribed', value: nlStats.unsubscribed },
                  ].map(s => (
                    <div key={s.label} className="bg-obsidian p-5">
                      <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1">{s.label.toUpperCase()}</p>
                      <p className="display-card text-2xl">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-muted text-[0.6rem] tracking-widest">RECENT CAMPAIGNS</p>
                <button onClick={loadNewsletter} className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone">
                  Refresh ↻
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {campaigns.length === 0 && (
                  <p className="font-sans text-muted text-sm">No campaigns sent yet.</p>
                )}
                {campaigns.map(c => (
                  <div key={c.id} className="border border-graphite/60 p-4">
                    <p className="font-sans text-bone text-sm mb-1">{c.subject}</p>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-muted text-[0.55rem] tracking-widest">
                        {c.sent_at ? formatDate(c.sent_at) : formatDate(c.created_at)}
                      </span>
                      <span className="font-mono text-signal-gold text-[0.55rem] tracking-widest">
                        {c.sent_count} sent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — send new campaign */}
            <div>
              <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-6">SEND NEW CAMPAIGN</p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-2">SUBJECT LINE</p>
                  <input
                    type="text"
                    placeholder="The intelligence brief — [Date]"
                    value={sendSubject}
                    onChange={e => setSendSubject(e.target.value)}
                    className={`${inputCls} w-full`}
                  />
                </div>
                <div>
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-2">EMAIL BODY (HTML)</p>
                  <textarea
                    placeholder="<p>Your campaign HTML here. Keep it concise and valuable.</p>"
                    value={sendHtml}
                    onChange={e => setSendHtml(e.target.value)}
                    rows={14}
                    className={`${inputCls} w-full resize-none font-mono text-xs`}
                  />
                </div>
                <p className="font-mono text-muted text-[0.55rem] tracking-widest">
                  Unsubscribe links are added automatically to every recipient.
                </p>
                {sendResult && (
                  <p className="font-sans text-signal-gold text-xs">{sendResult}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={sendCampaign}
                    disabled={sending || !sendSubject.trim() || !sendHtml.trim()}
                    className={btnGold}
                  >
                    {sending ? 'Sending…' : 'Send to All Active →'}
                  </button>
                </div>
                <p className="font-sans text-muted text-xs leading-relaxed">
                  This sends to all active newsletter subscribers. There is no undo.
                  Preview your HTML before sending.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
