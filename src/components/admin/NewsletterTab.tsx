'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type TemplateId = 'intelligence-brief' | 'announcement' | 'market-insight' | 're-engagement'

interface TemplateField {
  key: string; label: string; type: 'text' | 'textarea' | 'url'; placeholder?: string; required?: boolean
}

interface TemplateDef {
  id: TemplateId; name: string; description: string; icon: string; fields: TemplateField[]
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'intelligence-brief', name: 'Intelligence Brief', icon: '◈',
    description: 'Weekly market signals. Your flagship newsletter format.',
    fields: [
      { key: 'edition',       label: 'Edition No.',     type: 'text',     placeholder: '24',                       required: true },
      { key: 'date_label',    label: 'Date Label',      type: 'text',     placeholder: '07 May 2026',              required: true },
      { key: 'headline',      label: 'Headline',        type: 'text',     placeholder: 'The AI Salary Correction', required: true },
      { key: 'intro',         label: 'Introduction',    type: 'textarea', placeholder: '2–3 sentence opening…',    required: true },
      { key: 'signal1_title', label: 'Signal 1 Title',  type: 'text',     placeholder: 'Tech layoffs accelerate', required: true },
      { key: 'signal1_body',  label: 'Signal 1 Body',   type: 'textarea', placeholder: 'Analysis paragraph…',     required: true },
      { key: 'signal2_title', label: 'Signal 2 Title',  type: 'text',     placeholder: 'India hiring rebounds',   required: true },
      { key: 'signal2_body',  label: 'Signal 2 Body',   type: 'textarea', placeholder: 'Analysis paragraph…',     required: true },
      { key: 'signal3_title', label: 'Signal 3 (opt)',  type: 'text',     placeholder: 'Optional third signal' },
      { key: 'signal3_body',  label: 'Signal 3 Body',   type: 'textarea', placeholder: 'Optional analysis' },
      { key: 'closing',       label: 'Closing Quote',   type: 'textarea', placeholder: 'Italic pull-quote…',      required: true },
      { key: 'cta_url',       label: 'CTA Link',        type: 'url',      placeholder: 'https://…',               required: true },
    ],
  },
  {
    id: 'announcement', name: 'Announcement', icon: '→',
    description: 'Bold launch for new services, offers, or events.',
    fields: [
      { key: 'label',     label: 'Category Label', type: 'text',     placeholder: 'NEW SERVICE',             required: true },
      { key: 'headline',  label: 'Headline',        type: 'text',     placeholder: 'The Executive Suite',     required: true },
      { key: 'subline',   label: 'Sub-headline',    type: 'text',     placeholder: 'Reserved for 12 leaders', required: true },
      { key: 'body',      label: 'Body Copy',       type: 'textarea', placeholder: 'Describe the offering…',  required: true },
      { key: 'benefit1',  label: 'Benefit 1',       type: 'text',     placeholder: 'What they get…',          required: true },
      { key: 'benefit2',  label: 'Benefit 2',       type: 'text',     placeholder: 'Another benefit…',        required: true },
      { key: 'benefit3',  label: 'Benefit 3',       type: 'text',     placeholder: 'Third benefit…',          required: true },
      { key: 'cta_text',  label: 'CTA Text',        type: 'text',     placeholder: 'Apply Now →',             required: true },
      { key: 'cta_url',   label: 'CTA Link',        type: 'url',      placeholder: 'https://…',               required: true },
      { key: 'image_url', label: 'Hero Image URL',  type: 'url',      placeholder: 'https://… (optional)' },
    ],
  },
  {
    id: 'market-insight', name: 'Market Insight', icon: '▲',
    description: 'Data-rich layout with 3 headline stats and a pull quote.',
    fields: [
      { key: 'headline',    label: 'Headline',        type: 'text',     placeholder: 'Compensation Reality 2026',  required: true },
      { key: 'pullquote',   label: 'Pull Quote',      type: 'textarea', placeholder: 'One striking insight…',     required: true },
      { key: 'body',        label: 'Body Copy',       type: 'textarea', placeholder: 'Context paragraph…',        required: true },
      { key: 'stat1_label', label: 'Stat 1 Label',    type: 'text',     placeholder: 'Avg. pay gap',              required: true },
      { key: 'stat1_value', label: 'Stat 1 Value',    type: 'text',     placeholder: '18%',                       required: true },
      { key: 'stat2_label', label: 'Stat 2 Label',    type: 'text',     placeholder: 'Roles undercut',            required: true },
      { key: 'stat2_value', label: 'Stat 2 Value',    type: 'text',     placeholder: '3 in 5',                    required: true },
      { key: 'stat3_label', label: 'Stat 3 Label',    type: 'text',     placeholder: 'Audit ROI',                 required: true },
      { key: 'stat3_value', label: 'Stat 3 Value',    type: 'text',     placeholder: '54×',                       required: true },
      { key: 'insight',     label: 'Closing Insight', type: 'textarea', placeholder: 'What this means…',          required: true },
      { key: 'cta_url',     label: 'CTA Link',        type: 'url',      placeholder: 'https://…',                 required: true },
    ],
  },
  {
    id: 're-engagement', name: 'Re-engagement', icon: '◉',
    description: 'Personal, low-pressure win-back for cold contacts.',
    fields: [
      { key: 'greeting',     label: 'Opening Greeting', type: 'text',     placeholder: 'It has been a while.',              required: true },
      { key: 'hook',         label: 'Hook / Subject',   type: 'text',     placeholder: 'Markets moved since we last spoke.', required: true },
      { key: 'what_changed', label: 'What Changed',     type: 'textarea', placeholder: 'New data, new service…',            required: true },
      { key: 'offer',        label: 'The Offer',        type: 'textarea', placeholder: 'One clear call to action…',         required: true },
      { key: 'cta_text',     label: 'CTA Text',         type: 'text',     placeholder: 'Check Your Score →',                required: true },
      { key: 'cta_url',      label: 'CTA Link',         type: 'url',      placeholder: 'https://…',                         required: true },
    ],
  },
]

interface NlStats  { total: number; active: number; unsubscribed: number }
interface Campaign { id: string; subject: string; sent_count: number; sent_at: string | null; created_at: string }
interface Subscriber {
  id: string; email: string; status: string; source: string | null; subscribed_at: string; tags: string[]
}

const inputCls = 'bg-transparent border border-graphite px-4 py-2.5 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30 w-full'
const btnGold  = 'bg-signal-gold text-obsidian px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer disabled:opacity-60'
const btnGhost = 'border border-graphite/60 text-muted px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:text-bone hover:border-signal-gold/40 transition-colors cursor-pointer'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function NewsletterTab() {
  const [stats,          setStats]          = useState<NlStats | null>(null)
  const [campaigns,      setCampaigns]      = useState<Campaign[]>([])
  const [subscribers,    setSubscribers]    = useState<Subscriber[]>([])
  const [loading,        setLoading]        = useState(false)

  // Sub-tab: compose | subscribers
  const [view,           setView]           = useState<'compose' | 'subscribers'>('compose')

  // Subscriber filters
  const [subSearch,      setSubSearch]      = useState('')
  const [subFilter,      setSubFilter]      = useState<'all' | 'active' | 'unsubscribed'>('all')
  const [deletingId,     setDeletingId]     = useState<string | null>(null)
  const [deleteConfirm,  setDeleteConfirm]  = useState<Subscriber | null>(null)

  // Template builder
  const [mode,           setMode]           = useState<'compose' | 'raw'>('compose')
  const [selectedTpl,    setSelectedTpl]    = useState<TemplateId | null>(null)
  const [vars,           setVars]           = useState<Record<string, string>>({})
  const [customSubject,  setCustomSubject]  = useState('')
  const [previewHtml,    setPreviewHtml]    = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [previewing,     setPreviewing]     = useState(false)
  const [showPreview,    setShowPreview]    = useState(false)

  // Raw mode
  const [rawSubject,     setRawSubject]     = useState('')
  const [rawHtml,        setRawHtml]        = useState('')

  // Sending / resend
  const [confirmModal,   setConfirmModal]   = useState(false)
  const [resendConfirm,  setResendConfirm]  = useState<Campaign | null>(null)
  const [sending,        setSending]        = useState(false)
  const [sendResult,     setSendResult]     = useState('')

  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/newsletter/subscribers')
      if (r.ok) {
        const d = await r.json()
        setStats(d.stats)
        setCampaigns(d.campaigns ?? [])
        setSubscribers(d.subscribers ?? [])
      }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Subscriber management ──────────────────────────────────────────────────

  const filteredSubs = subscribers.filter(s => {
    const q = subSearch.toLowerCase()
    const matchSearch = !q || s.email.toLowerCase().includes(q)
    const matchStatus = subFilter === 'all' || s.status === subFilter
    return matchSearch && matchStatus
  })

  async function deleteSub(sub: Subscriber) {
    setDeletingId(sub.id)
    await fetch('/api/admin/newsletter/subscribers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sub.id }),
    })
    setDeleteConfirm(null)
    setDeletingId(null)
    setSubscribers(prev => prev.filter(s => s.id !== sub.id))
    setStats(prev => prev ? { ...prev, total: prev.total - 1, active: sub.status === 'active' ? prev.active - 1 : prev.active } : prev)
  }

  // ── Template builder ───────────────────────────────────────────────────────

  function selectTemplate(id: TemplateId) {
    setSelectedTpl(id); setVars({}); setPreviewHtml(''); setPreviewSubject(''); setShowPreview(false); setCustomSubject(''); setSendResult('')
  }

  function updateVar(key: string, value: string) {
    const next = { ...vars, [key]: value }
    setVars(next)
    setShowPreview(false)
    if (previewTimer.current) clearTimeout(previewTimer.current)
    previewTimer.current = setTimeout(() => fetchPreview(selectedTpl!, next), 1200)
  }

  async function fetchPreview(templateId: TemplateId, v: Record<string, string>) {
    setPreviewing(true)
    try {
      const r = await fetch('/api/admin/newsletter/preview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, vars: v }),
      })
      if (r.ok) {
        const d = await r.json()
        setPreviewHtml(d.html ?? ''); setPreviewSubject(d.subject ?? ''); setShowPreview(true)
      }
    } finally { setPreviewing(false) }
  }

  async function handleSend() {
    const subject = mode === 'compose' ? (customSubject || previewSubject) : rawSubject
    const html    = mode === 'compose' ? previewHtml : rawHtml
    if (!subject.trim() || !html.trim()) return
    setSending(true); setSendResult('')
    try {
      const r = await fetch('/api/admin/newsletter/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html }),
      })
      const d = await r.json()
      if (r.ok) {
        setSendResult(`Sent to ${d.sent} of ${d.total} active subscribers.`)
        setConfirmModal(false); setSelectedTpl(null); setPreviewHtml(''); setPreviewSubject(''); setVars({}); setRawSubject(''); setRawHtml('')
        loadAll()
      } else {
        setSendResult(d.error ?? 'Send failed.'); setConfirmModal(false)
      }
    } finally { setSending(false) }
  }

  async function handleResend() {
    if (!resendConfirm) return
    setSending(true)
    try {
      const r = await fetch('/api/admin/newsletter/resend', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: resendConfirm.id }),
      })
      const d = await r.json()
      setSendResult(r.ok ? `Resent to ${d.sent} of ${d.total} active subscribers.` : (d.error ?? 'Failed.'))
      setResendConfirm(null)
      if (r.ok) loadAll()
    } finally { setSending(false) }
  }

  const readyToSend = mode === 'compose'
    ? !!(previewHtml && (customSubject || previewSubject))
    : !!(rawSubject.trim() && rawHtml.trim())

  const tpl = selectedTpl ? TEMPLATES.find(t => t.id === selectedTpl) : null

  return (
    <div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-3 gap-px bg-graphite mb-8">
          {[
            { label: 'Total',        value: stats.total },
            { label: 'Active',       value: stats.active },
            { label: 'Unsubscribed', value: stats.unsubscribed },
          ].map(s => (
            <div key={s.label} className="bg-obsidian p-5">
              <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1">{s.label.toUpperCase()}</p>
              <p className="font-sans text-bone text-2xl font-light">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* View tabs */}
      <div className="flex gap-0 border-b border-graphite mb-7">
        {[{ id: 'compose', label: 'Compose & Send' }, { id: 'subscribers', label: `Subscribers ${subscribers.length > 0 ? `(${subscribers.length})` : ''}` }].map(v => (
          <button key={v.id} onClick={() => setView(v.id as typeof view)}
            className={`font-mono text-[0.6rem] tracking-widest px-5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${view === v.id ? 'border-signal-gold text-bone' : 'border-transparent text-muted hover:text-bone'}`}>
            {v.label}
          </button>
        ))}
        <button onClick={loadAll} disabled={loading}
          className="ml-auto font-mono text-muted text-[0.55rem] tracking-widest px-4 hover:text-bone disabled:opacity-40">
          {loading ? '…' : '↻'}
        </button>
      </div>

      {sendResult && (
        <div className="border border-signal-gold/30 bg-signal-gold/5 px-5 py-3 mb-6">
          <p className="font-sans text-signal-gold text-sm">{sendResult}</p>
        </div>
      )}

      {/* ── COMPOSE VIEW ── */}
      {view === 'compose' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-10">

          {/* Left: compose */}
          <div>
            {/* Mode toggle */}
            <div className="flex gap-0 border-b border-graphite mb-6">
              {[{ id: 'compose', label: 'Template Builder' }, { id: 'raw', label: 'Custom HTML' }].map(m => (
                <button key={m.id} onClick={() => setMode(m.id as 'compose' | 'raw')}
                  className={`font-mono text-[0.6rem] tracking-widest px-5 py-2.5 border-b-2 transition-colors ${mode === m.id ? 'border-signal-gold text-bone' : 'border-transparent text-muted hover:text-bone'}`}>
                  {m.label}
                </button>
              ))}
            </div>

            {mode === 'compose' && (
              <div>
                {!selectedTpl ? (
                  <>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-5">CHOOSE A TEMPLATE</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TEMPLATES.map(t => (
                        <button key={t.id} onClick={() => selectTemplate(t.id)}
                          className="border border-graphite/60 p-5 text-left hover:border-signal-gold/50 hover:bg-graphite/10 transition-colors group">
                          <p className="font-mono text-signal-gold text-xl mb-2 group-hover:scale-110 transition-transform inline-block">{t.icon}</p>
                          <p className="font-sans text-bone text-sm font-medium mb-1">{t.name}</p>
                          <p className="font-sans text-muted text-xs leading-relaxed">{t.description}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : tpl && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <button onClick={() => { setSelectedTpl(null); setShowPreview(false) }}
                        className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone">← Templates</button>
                      <p className="font-mono text-bone text-[0.6rem] tracking-widest">{tpl.name.toUpperCase()}</p>
                    </div>

                    <div className="mb-4">
                      <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">SUBJECT LINE <span className="opacity-60">(auto if blank)</span></p>
                      <input type="text" value={customSubject} onChange={e => setCustomSubject(e.target.value)}
                        placeholder={previewSubject || 'Leave blank for template default…'} className={inputCls} />
                    </div>

                    <div className="flex flex-col gap-4 mb-5">
                      {tpl.fields.map(f => (
                        <div key={f.key}>
                          <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">
                            {f.label.toUpperCase()}{f.required && <span className="text-signal-gold ml-1">*</span>}
                          </p>
                          {f.type === 'textarea' ? (
                            <textarea rows={3} value={vars[f.key] ?? ''} onChange={e => updateVar(f.key, e.target.value)}
                              placeholder={f.placeholder} className={`${inputCls} resize-y`} />
                          ) : (
                            <input type={f.type === 'url' ? 'url' : 'text'} value={vars[f.key] ?? ''}
                              onChange={e => updateVar(f.key, e.target.value)} placeholder={f.placeholder} className={inputCls} />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 items-center flex-wrap">
                      <button onClick={() => fetchPreview(selectedTpl!, vars)} disabled={previewing} className={btnGhost}>
                        {previewing ? 'Generating…' : 'Preview →'}
                      </button>
                      {previewHtml && (
                        <button onClick={() => setConfirmModal(true)} disabled={!readyToSend} className={btnGold}>
                          Send to All Active →
                        </button>
                      )}
                    </div>

                    {showPreview && previewHtml && (
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-mono text-muted text-[0.6rem] tracking-widest">EMAIL PREVIEW</p>
                          <p className="font-mono text-muted text-[0.55rem] tracking-widest">
                            Subject: <span className="text-bone">{customSubject || previewSubject}</span>
                          </p>
                        </div>
                        <div className="border border-graphite" style={{ height: '600px' }}>
                          <iframe srcDoc={previewHtml} title="Email preview"
                            style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                            sandbox="allow-same-origin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {mode === 'raw' && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">SUBJECT LINE</p>
                  <input type="text" value={rawSubject} onChange={e => setRawSubject(e.target.value)}
                    placeholder="The intelligence brief — May 2026" className={inputCls} />
                </div>
                <div>
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">EMAIL BODY (HTML)</p>
                  <textarea value={rawHtml} onChange={e => setRawHtml(e.target.value)} rows={16}
                    placeholder="<p>Your full HTML email…</p>"
                    className={`${inputCls} resize-none font-mono text-xs`} />
                </div>
                <p className="font-mono text-muted text-[0.55rem] tracking-widest">Unsubscribe links appended automatically.</p>
                <button onClick={() => setConfirmModal(true)} disabled={!readyToSend} className={btnGold}>
                  Send to All Active →
                </button>
                <p className="font-sans text-muted text-xs leading-relaxed">This sends immediately to all active subscribers. No undo.</p>
              </div>
            )}
          </div>

          {/* Right: campaign history */}
          <div>
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">CAMPAIGN HISTORY</p>
            <div className="flex flex-col gap-2">
              {campaigns.length === 0 && !loading && (
                <p className="font-sans text-muted text-sm">No campaigns sent yet.</p>
              )}
              {campaigns.map(c => (
                <div key={c.id} className="border border-graphite/60 p-4">
                  <p className="font-sans text-bone text-sm mb-2 leading-snug">{c.subject}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-muted text-[0.5rem] tracking-widest">
                      {formatDate(c.sent_at ?? c.created_at)}
                    </span>
                    <span className="font-mono text-signal-gold text-[0.5rem] tracking-widest">
                      {c.sent_count} sent
                    </span>
                    <button
                      onClick={() => { setResendConfirm(c); setSendResult('') }}
                      className="ml-auto font-mono text-muted text-[0.5rem] tracking-widest hover:text-signal-gold transition-colors"
                    >
                      Resend ↻
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBSCRIBERS VIEW ── */}
      {view === 'subscribers' && (
        <div>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <input type="text" value={subSearch} onChange={e => setSubSearch(e.target.value)}
              placeholder="Search email…"
              className="bg-transparent border border-graphite px-4 py-2 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30 min-w-[220px]" />
            <div className="flex gap-0 border border-graphite/60">
              {(['all', 'active', 'unsubscribed'] as const).map(f => (
                <button key={f} onClick={() => setSubFilter(f)}
                  className={`font-mono text-[0.55rem] tracking-widest px-4 py-2 transition-colors ${subFilter === f ? 'bg-signal-gold text-obsidian' : 'text-muted hover:text-bone'}`}>
                  {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Unsub'}
                </button>
              ))}
            </div>
            <span className="font-mono text-muted text-[0.55rem] tracking-widest ml-auto">
              {filteredSubs.length} of {subscribers.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left" style={{ minWidth: '600px' }}>
              <thead>
                <tr className="border-b border-graphite">
                  {['Email', 'Status', 'Source', 'Tags', 'Joined', ''].map(h => (
                    <th key={h} className="pb-3 pr-4 font-mono text-muted text-[0.5rem] tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map(s => (
                  <tr key={s.id} className="border-b border-graphite/30 hover:bg-graphite/10 transition-colors">
                    <td className="py-3 pr-4 font-sans text-bone text-xs">{s.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-mono text-[0.5rem] tracking-widest px-2 py-0.5 border ${
                        s.status === 'active'
                          ? 'border-signal-gold/30 text-signal-gold'
                          : 'border-graphite/60 text-muted'
                      }`}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-muted text-[0.55rem] tracking-widest">{s.source ?? '—'}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.tags ?? []).map(t => (
                          <span key={t} className="font-mono text-[0.45rem] tracking-widest px-1 py-0.5 border border-graphite/60 text-muted">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-muted text-[0.55rem] whitespace-nowrap">{formatDate(s.subscribed_at)}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setDeleteConfirm(s)}
                        disabled={deletingId === s.id}
                        className="font-mono text-[0.5rem] tracking-widest text-muted/60 hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        {deletingId === s.id ? '…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 font-sans text-muted text-sm text-center">No subscribers match.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Confirm send modal ── */}
      {confirmModal && (
        <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
          <div className="bg-obsidian border border-graphite p-8 max-w-md w-full">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">CONFIRM SEND</p>
            <p className="font-sans text-bone text-sm mb-2">
              Subject: <strong>{mode === 'compose' ? (customSubject || previewSubject) : rawSubject}</strong>
            </p>
            <p className="font-sans text-muted text-xs mb-6 leading-relaxed">
              Sends to all <strong className="text-bone">{stats?.active ?? '—'}</strong> active subscribers immediately. No undo.
            </p>
            <div className="flex gap-3">
              <button onClick={handleSend} disabled={sending} className={btnGold}>
                {sending ? 'Sending…' : 'Confirm send →'}
              </button>
              <button onClick={() => setConfirmModal(false)} className={btnGhost}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend confirmation modal ── */}
      {resendConfirm && (
        <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
          <div className="bg-obsidian border border-graphite p-8 max-w-md w-full">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">CONFIRM RESEND</p>
            <p className="font-sans text-bone text-sm mb-2">{resendConfirm.subject}</p>
            <p className="font-sans text-muted text-xs mb-6 leading-relaxed">
              This will create a new campaign record and resend the exact same email to all <strong className="text-bone">{stats?.active ?? '—'}</strong> currently active subscribers, including anyone who joined after the original send.
            </p>
            <div className="flex gap-3">
              <button onClick={handleResend} disabled={sending} className={btnGold}>
                {sending ? 'Sending…' : 'Resend →'}
              </button>
              <button onClick={() => setResendConfirm(null)} className={btnGhost}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete subscriber confirmation ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
          <div className="bg-obsidian border border-graphite p-8 max-w-md w-full">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">REMOVE SUBSCRIBER</p>
            <p className="font-sans text-bone text-sm mb-2">{deleteConfirm.email}</p>
            <p className="font-sans text-muted text-xs mb-6 leading-relaxed">
              This permanently removes them from the subscriber list. They can re-subscribe through the site.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteSub(deleteConfirm)}
                disabled={deletingId === deleteConfirm.id}
                className="border border-red-400/50 text-red-400 px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:bg-red-400/10 transition-colors cursor-pointer disabled:opacity-60"
              >
                {deletingId === deleteConfirm.id ? 'Removing…' : 'Remove permanently'}
              </button>
              <button onClick={() => setDeleteConfirm(null)} className={btnGhost}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
