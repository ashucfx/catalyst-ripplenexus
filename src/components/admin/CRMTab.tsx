'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type CrmStatus = 'lead' | 'warm' | 'qualified' | 'cold' | 'churned'

interface CrmLead {
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

const STATUS_META: Record<CrmStatus, { label: string; dot: string; text: string; border: string }> = {
  qualified: { label: 'Qualified', dot: 'bg-signal-gold',    text: 'text-signal-gold',   border: 'border-signal-gold/40' },
  warm:      { label: 'Warm',      dot: 'bg-amber-400',      text: 'text-amber-400',      border: 'border-amber-400/40' },
  lead:      { label: 'Lead',      dot: 'bg-muted',          text: 'text-muted',          border: 'border-graphite/60' },
  cold:      { label: 'Cold',      dot: 'bg-sky-400/70',     text: 'text-sky-400/70',     border: 'border-sky-400/30' },
  churned:   { label: 'Churned',   dot: 'bg-red-400/70',     text: 'text-red-400/70',     border: 'border-red-400/30' },
}

const FILTER_TABS = [
  { id: 'all',       label: 'All' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'warm',      label: 'Warm' },
  { id: 'lead',      label: 'Lead' },
  { id: 'cold',      label: 'Cold' },
  { id: 'paid',      label: 'Paid' },
] as const
type FilterId = typeof FILTER_TABS[number]['id']

const inputCls = 'bg-transparent border border-graphite px-4 py-2.5 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30 w-full'
const btnGold  = 'bg-signal-gold text-obsidian px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer disabled:opacity-60'
const btnGhost = 'border border-graphite/60 text-muted px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:text-bone hover:border-signal-gold/40 transition-colors cursor-pointer'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function currency(n: number) {
  if (n === 0) return '—'
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  lead,
  onClose,
  onUpdated,
  onDelete,
}: {
  lead: CrmLead
  onClose: () => void
  onUpdated: (email: string, patch: Partial<CrmLead>) => void
  onDelete: (email: string) => void
}) {
  const [status,       setStatus]       = useState<CrmStatus>(lead.status)
  const [notes,        setNotes]        = useState(lead.notes ?? '')
  const [savingNotes,  setSavingNotes]  = useState(false)
  const [notesSaved,   setNotesSaved]   = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [deleteModal,  setDeleteModal]  = useState(false)
  const [deleting,     setDeleting]     = useState(false)
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync when lead changes (click different row)
  useEffect(() => {
    setStatus(lead.status)
    setNotes(lead.notes ?? '')
    setNotesSaved(false)
  }, [lead.email, lead.status, lead.notes])

  async function changeStatus(s: CrmStatus) {
    setStatus(s)
    setSavingStatus(true)
    await fetch('/api/admin/crm/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: lead.email, status: s, manual_override: true }),
    })
    setSavingStatus(false)
    onUpdated(lead.email, { status: s, manual_override: true })
  }

  function handleNotesChange(val: string) {
    setNotes(val)
    setNotesSaved(false)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(async () => {
      setSavingNotes(true)
      await fetch('/api/admin/crm/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lead.email, notes: val }),
      })
      setSavingNotes(false)
      setNotesSaved(true)
    }, 800)
  }

  async function confirmDelete() {
    setDeleting(true)
    await fetch('/api/admin/crm/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: lead.email }),
    })
    setDeleting(false)
    setDeleteModal(false)
    onDelete(lead.email)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <p className="font-sans text-bone text-sm font-medium truncate">{lead.name ?? '—'}</p>
          <p className="font-sans text-muted text-xs break-all">{lead.email}</p>
          {lead.phone && <p className="font-mono text-muted text-[0.6rem] mt-1">{lead.phone}</p>}
        </div>
        <button onClick={onClose} className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone ml-4 shrink-0">
          ✕ Close
        </button>
      </div>

      {/* Status selector */}
      <div className="mb-5">
        <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-2">
          STATUS {savingStatus && <span className="opacity-50">saving…</span>}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(STATUS_META) as CrmStatus[]).map(s => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`font-mono text-[0.55rem] tracking-widest px-2.5 py-1 border transition-colors ${
                status === s
                  ? `${STATUS_META[s].border} ${STATUS_META[s].text} bg-current/5`
                  : 'border-graphite/40 text-muted/60 hover:text-muted'
              }`}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
        {lead.manual_override && (
          <p className="font-mono text-muted/50 text-[0.5rem] tracking-widest mt-1.5">MANUALLY SET</p>
        )}
        {!lead.manual_override && (
          <p className="font-mono text-muted/50 text-[0.5rem] tracking-widest mt-1.5">AUTO-QUALIFIED</p>
        )}
      </div>

      {/* Data rows */}
      <div className="border border-graphite/50 mb-5 text-[0.6rem]">
        {[
          ['Sources',    lead.sources.join(', ') || '—'],
          ['Joined',     formatDate(lead.created_at)],
          ['Paid',       lead.paid ? `Yes — ${currency(lead.payment_total)}` : 'No'],
          ['Products',   lead.payment_products.join(', ') || '—'],
          ['TPI Score',  lead.tpi_score !== null ? String(lead.tpi_score) : '—'],
          ['Sector',     lead.tpi_sector ?? '—'],
          ['Seniority',  lead.tpi_seniority ?? '—'],
          ['Audit',      lead.has_audit_portal ? (lead.report_ready ? 'Report ready' : 'In progress') : 'No'],
          ['Newsletter', lead.newsletter ? 'Active subscriber' : 'Not subscribed'],
          ['Waitlist',   lead.waitlist ? (lead.waitlist_plan ?? 'Yes') : 'No'],
          ['Booking',    lead.booking ? 'Yes' : 'No'],
          ['Campaigns',  lead.campaigns_received > 0 ? `${lead.campaigns_received} sent` : 'None sent yet'],
          ['Last email', lead.last_emailed ? formatDate(lead.last_emailed) : 'Never'],
        ].map(([label, value]) => (
          <div key={label} className="flex border-b border-graphite/40 last:border-b-0">
            <span className="font-mono text-muted tracking-widest w-24 shrink-0 px-3 py-2 border-r border-graphite/40">{label}</span>
            <span className="font-sans text-bone px-3 py-2 break-all">{value}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mb-5 flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <p className="font-mono text-muted text-[0.55rem] tracking-widest">NOTES</p>
          {savingNotes && <p className="font-mono text-muted/50 text-[0.5rem] tracking-widest">saving…</p>}
          {notesSaved && <p className="font-mono text-signal-gold/70 text-[0.5rem] tracking-widest">saved</p>}
        </div>
        <textarea
          value={notes}
          onChange={e => handleNotesChange(e.target.value)}
          rows={5}
          placeholder="Internal notes about this lead…"
          className={`${inputCls} resize-none font-mono text-xs`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <a
          href={`mailto:${lead.email}`}
          className={`${btnGhost} text-center`}
          style={{ textDecoration: 'none' }}
        >
          Email →
        </a>
        <button
          onClick={() => setDeleteModal(true)}
          className="border border-red-400/30 text-red-400/70 px-4 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:border-red-400/60 hover:text-red-400 transition-colors cursor-pointer ml-auto"
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
          <div className="bg-obsidian border border-graphite p-8 max-w-md w-full">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">CONFIRM DELETE</p>
            <p className="font-sans text-bone text-sm mb-2">
              Remove <strong>{lead.email}</strong> from CRM?
            </p>
            <p className="font-sans text-muted text-xs mb-6 leading-relaxed">
              This hides the contact from all CRM views. Their data in other tables (payments, bookings, etc.) is preserved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="border border-red-400/50 text-red-400 px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:bg-red-400/10 transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Yes, remove'}
              </button>
              <button
                onClick={() => setDeleteModal(false)}
                className={btnGhost}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main CRM Tab ──────────────────────────────────────────────────────────────

export function CRMTab() {
  const [leads,         setLeads]         = useState<CrmLead[]>([])
  const [loading,       setLoading]       = useState(false)
  const [search,        setSearch]        = useState('')
  const [activeFilter,  setActiveFilter]  = useState<FilterId>('all')
  const [selected,      setSelected]      = useState<CrmLead | null>(null)
  const [checkedEmails, setCheckedEmails] = useState<Set<string>>(new Set())
  const [emailModal,    setEmailModal]    = useState(false)
  const [emailSubject,  setEmailSubject]  = useState('')
  const [emailHtml,     setEmailHtml]     = useState('')
  const [emailSending,  setEmailSending]  = useState(false)
  const [emailResult,   setEmailResult]   = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/crm')
      if (r.ok) { const d = await r.json(); setLeads(d.crm ?? []) }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  // Counts per tab
  const counts: Record<FilterId, number> = {
    all:       leads.length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    warm:      leads.filter(l => l.status === 'warm').length,
    lead:      leads.filter(l => l.status === 'lead').length,
    cold:      leads.filter(l => l.status === 'cold').length,
    paid:      leads.filter(l => l.paid).length,
  }

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      l.email.toLowerCase().includes(q) ||
      (l.name ?? '').toLowerCase().includes(q) ||
      (l.phone ?? '').includes(q)
    const matchFilter =
      activeFilter === 'all'  ? true :
      activeFilter === 'paid' ? l.paid :
      l.status === activeFilter
    return matchSearch && matchFilter
  })

  function handleLeadUpdated(email: string, patch: Partial<CrmLead>) {
    setLeads(prev => prev.map(l => l.email === email ? { ...l, ...patch } : l))
    setSelected(prev => prev?.email === email ? { ...prev, ...patch } : prev)
  }

  function handleLeadDeleted(email: string) {
    setLeads(prev => prev.filter(l => l.email !== email))
    setSelected(prev => prev?.email === email ? null : prev)
  }

  function toggleCheck(email: string, e: React.MouseEvent) {
    e.stopPropagation()
    setCheckedEmails(prev => {
      const next = new Set(prev)
      if (next.has(email)) { next.delete(email) } else { next.add(email) }
      return next
    })
  }

  function toggleAllVisible(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setCheckedEmails(new Set(filtered.map(l => l.email)))
    } else {
      setCheckedEmails(new Set())
    }
  }

  const allVisibleChecked = filtered.length > 0 && filtered.every(l => checkedEmails.has(l.email))
  const someChecked = checkedEmails.size > 0

  async function sendBulkEmail() {
    if (!emailSubject.trim() || !emailHtml.trim()) return
    setEmailSending(true)
    setEmailResult('')
    try {
      // If specific rows are checked, send only to those; otherwise send to all active subscribers
      const targets = someChecked ? Array.from(checkedEmails) : undefined
      const r = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: emailSubject, html: emailHtml, ...(targets ? { targets } : {}) }),
      })
      const d = await r.json()
      if (r.ok) {
        setEmailResult(`Sent to ${d.sent} of ${d.total} recipients.`)
        setCheckedEmails(new Set())
        load()
      } else {
        setEmailResult(d.error ?? 'Failed.')
      }
    } finally { setEmailSending(false) }
  }

  const hasPanel = !!selected

  return (
    <div className="flex flex-col gap-6">
      {/* ClientForge CRM Live Link Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-signal-gold/10 via-obsidian to-obsidian border border-signal-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[0.65rem] text-signal-gold uppercase tracking-widest font-bold block mb-1">
            ⚡ LIVE CRM HUB · CLIENTFORGE
          </span>
          <h3 className="display-card text-lg text-bone">
            ClientForge Leads Flywheel &amp; Deal Pipeline
          </h3>
          <p className="font-serif text-muted text-xs">
            Every lead, booking, TPI score, and inquiry is automatically logged. Export your entire database as a multi-sheet XLSX Excel file to upload to ClientForge anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.location.href = '/api/admin/crm/export'}
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all shrink-0 shadow-md cursor-pointer"
          >
            📊 Download XLSX Spreadsheet ↓
          </button>
          <a
            href="https://clientforge.theripplenexus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/20 text-bone hover:border-signal-gold/40 font-mono text-xs font-semibold uppercase tracking-widest rounded-full transition-all shrink-0"
          >
            ClientForge Portal ↗
          </a>
        </div>
      </div>

      <div className="flex gap-0 min-h-0">
        {/* ── Left: table ── */}
        <div className={`flex flex-col min-w-0 transition-all ${hasPanel ? 'w-[60%]' : 'w-full'}`}>

        {/* Status filter tabs */}
        <div className="flex gap-0 border-b border-graphite mb-4 overflow-x-auto">
          {FILTER_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={`font-mono text-[0.55rem] tracking-widest px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                activeFilter === t.id
                  ? 'border-signal-gold text-bone'
                  : 'border-transparent text-muted hover:text-bone'
              }`}
            >
              {t.label} <span className="opacity-60">{counts[t.id]}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search email, name, phone…"
            className="bg-transparent border border-graphite px-4 py-2 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30 min-w-[200px]"
          />
          <span className="font-mono text-muted text-[0.55rem] tracking-widest">
            {filtered.length} of {leads.length}
          </span>
          <div className="flex gap-2 ml-auto flex-wrap">
            {someChecked && (
              <span className="font-mono text-signal-gold text-[0.55rem] tracking-widest self-center">
                {checkedEmails.size} selected
              </span>
            )}
            <button
              onClick={() => setEmailModal(true)}
              className={btnGhost}
              title={someChecked ? `Email ${checkedEmails.size} selected leads` : 'Email all active subscribers'}
            >
              {someChecked ? `Email ${checkedEmails.size} selected →` : 'Email all active →'}
            </button>
            <button onClick={() => window.location.href = '/api/admin/crm/export'} className={btnGold}>Export ↓</button>
            <button onClick={load} disabled={loading} className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone disabled:opacity-40">
              {loading ? '…' : '↻'}
            </button>
          </div>
        </div>

        {/* Table */}
        {loading && leads.length === 0 ? (
          <p className="font-sans text-muted text-sm py-8">Loading CRM data…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" style={{ minWidth: hasPanel ? '560px' : '860px' }}>
              <thead>
                <tr className="border-b border-graphite">
                  <th className="pb-3 pr-3 w-6">
                    <input type="checkbox" checked={allVisibleChecked} onChange={toggleAllVisible}
                      className="accent-signal-gold w-3 h-3 cursor-pointer" />
                  </th>
                  {['Status', 'Email', 'Name', 'Sources', 'TPI', 'Value', 'Emailed', 'Joined'].map(h => (
                    <th key={h} className="pb-3 pr-4 font-mono text-muted text-[0.5rem] tracking-widest whitespace-nowrap">{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const meta = STATUS_META[l.status]
                  const isSelected = selected?.email === l.email
                  const isChecked  = checkedEmails.has(l.email)
                  return (
                    <tr
                      key={l.email}
                      onClick={() => setSelected(isSelected ? null : l)}
                      className={`border-b border-graphite/30 cursor-pointer transition-colors ${
                        isSelected ? 'bg-graphite/30' : isChecked ? 'bg-signal-gold/5' : 'hover:bg-graphite/10'
                      }`}
                    >
                      <td className="py-3 pr-3" onClick={e => toggleCheck(l.email, e)}>
                        <input type="checkbox" checked={isChecked} onChange={() => {}}
                          className="accent-signal-gold w-3 h-3 cursor-pointer pointer-events-none" />
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1.5 font-mono text-[0.5rem] tracking-widest px-2 py-0.5 border ${meta.border} ${meta.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-sans text-bone text-xs max-w-[160px] truncate">{l.email}</td>
                      <td className="py-3 pr-4 font-sans text-muted text-xs whitespace-nowrap">{l.name ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {l.sources.slice(0, 2).map(s => (
                            <span key={s} className="font-mono text-[0.45rem] tracking-widest px-1 py-0.5 border border-graphite/60 text-muted">{s}</span>
                          ))}
                          {l.sources.length > 2 && (
                            <span className="font-mono text-[0.45rem] text-muted">+{l.sources.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-mono text-muted text-[0.6rem]">{l.tpi_score ?? '—'}</td>
                      <td className="py-3 pr-4 font-mono text-[0.6rem] whitespace-nowrap">
                        {l.paid ? <span className="text-signal-gold">{currency(l.payment_total)}</span> : <span className="text-muted">—</span>}
                      </td>
                      <td className="py-3 pr-4 font-mono text-[0.55rem] whitespace-nowrap">
                        {l.campaigns_received > 0
                          ? <span className="text-signal-gold/80" title={l.last_emailed ? `Last: ${formatDate(l.last_emailed)}` : ''}>{l.campaigns_received}×</span>
                          : <span className="text-muted/40">—</span>}
                      </td>
                      <td className="py-3 pr-4 font-mono text-muted text-[0.55rem] whitespace-nowrap">{formatDate(l.created_at)}</td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 font-sans text-muted text-sm text-center">No records match your filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Right: detail panel ── */}
      {selected && (
        <div className="w-[40%] ml-6 pl-6 border-l border-graphite overflow-y-auto max-h-[80vh] shrink-0">
          <DetailPanel
            lead={selected}
            onClose={() => setSelected(null)}
            onUpdated={handleLeadUpdated}
            onDelete={handleLeadDeleted}
          />
        </div>
      )}

      {/* ── Bulk email modal ── */}
      {emailModal && (
        <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
          <div className="bg-obsidian border border-graphite p-8 max-w-xl w-full">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">
              {someChecked ? `EMAIL ${checkedEmails.size} SELECTED LEADS` : 'EMAIL ALL ACTIVE SUBSCRIBERS'}
            </p>
            <p className="font-sans text-muted text-xs mb-6">
              {someChecked
                ? <>Sends to <strong className="text-bone">{checkedEmails.size}</strong> selected contacts who are active newsletter subscribers. Non-subscribers in selection are skipped.</>
                : <>Sends to all active newsletter subscribers. Only those with <code className="text-bone">status = active</code> in the subscriber list receive it.</>
              }
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Subject line"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className={inputCls}
              />
              <textarea
                placeholder="<p>HTML email body…</p>"
                value={emailHtml}
                onChange={e => setEmailHtml(e.target.value)}
                rows={8}
                className={`${inputCls} resize-none font-mono text-xs`}
              />
              {emailResult && <p className="font-sans text-signal-gold text-xs">{emailResult}</p>}
              <div className="flex gap-3">
                <button onClick={sendBulkEmail} disabled={emailSending} className={btnGold}>
                  {emailSending ? 'Sending…' : 'Send →'}
                </button>
                <button onClick={() => { setEmailModal(false); setEmailResult('') }} className={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
