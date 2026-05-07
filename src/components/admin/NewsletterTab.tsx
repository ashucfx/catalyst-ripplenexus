'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Types (mirror campaigns.ts without import) ─────────────────────────────

type TemplateId = 'intelligence-brief' | 'announcement' | 'market-insight' | 're-engagement'

interface TemplateField {
  key:          string
  label:        string
  type:         'text' | 'textarea' | 'url'
  placeholder?: string
  required?:    boolean
}

interface TemplateDef {
  id:          TemplateId
  name:        string
  description: string
  fields:      TemplateField[]
  icon:        string
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'intelligence-brief',
    name: 'Intelligence Brief',
    description: 'Weekly market signals. Your flagship newsletter format.',
    icon: '◈',
    fields: [
      { key: 'edition',       label: 'Edition No.',     type: 'text',     placeholder: '24',                        required: true },
      { key: 'date_label',    label: 'Date Label',      type: 'text',     placeholder: '07 May 2026',               required: true },
      { key: 'headline',      label: 'Headline',        type: 'text',     placeholder: 'The AI Salary Correction',  required: true },
      { key: 'intro',         label: 'Introduction',    type: 'textarea', placeholder: '2–3 sentence opening…',    required: true },
      { key: 'signal1_title', label: 'Signal 1 Title',  type: 'text',     placeholder: 'Tech layoffs accelerate',  required: true },
      { key: 'signal1_body',  label: 'Signal 1 Body',   type: 'textarea', placeholder: 'Analysis paragraph…',      required: true },
      { key: 'signal2_title', label: 'Signal 2 Title',  type: 'text',     placeholder: 'India hiring rebounds',    required: true },
      { key: 'signal2_body',  label: 'Signal 2 Body',   type: 'textarea', placeholder: 'Analysis paragraph…',      required: true },
      { key: 'signal3_title', label: 'Signal 3 (opt)',  type: 'text',     placeholder: 'Optional third signal' },
      { key: 'signal3_body',  label: 'Signal 3 Body',   type: 'textarea', placeholder: 'Optional analysis' },
      { key: 'closing',       label: 'Closing Quote',   type: 'textarea', placeholder: 'Italic pull-quote…',       required: true },
      { key: 'cta_url',       label: 'CTA Link',        type: 'url',      placeholder: 'https://…',                required: true },
    ],
  },
  {
    id: 'announcement',
    name: 'Announcement',
    description: 'Bold launch for new services, offers, or events.',
    icon: '→',
    fields: [
      { key: 'label',     label: 'Category Label',  type: 'text',     placeholder: 'NEW SERVICE',              required: true },
      { key: 'headline',  label: 'Headline',         type: 'text',     placeholder: 'The Executive Suite',      required: true },
      { key: 'subline',   label: 'Sub-headline',     type: 'text',     placeholder: 'Reserved for 12 leaders',  required: true },
      { key: 'body',      label: 'Body Copy',        type: 'textarea', placeholder: 'Describe the offering…',   required: true },
      { key: 'benefit1',  label: 'Benefit 1',        type: 'text',     placeholder: 'What they get…',           required: true },
      { key: 'benefit2',  label: 'Benefit 2',        type: 'text',     placeholder: 'Another benefit…',         required: true },
      { key: 'benefit3',  label: 'Benefit 3',        type: 'text',     placeholder: 'Third benefit…',           required: true },
      { key: 'cta_text',  label: 'CTA Text',         type: 'text',     placeholder: 'Apply Now →',              required: true },
      { key: 'cta_url',   label: 'CTA Link',         type: 'url',      placeholder: 'https://…',                required: true },
      { key: 'image_url', label: 'Hero Image URL',   type: 'url',      placeholder: 'https://… (optional)' },
    ],
  },
  {
    id: 'market-insight',
    name: 'Market Insight',
    description: 'Data-rich layout with 3 headline stats and a pull quote.',
    icon: '▲',
    fields: [
      { key: 'headline',    label: 'Headline',         type: 'text',     placeholder: 'Compensation Reality 2026', required: true },
      { key: 'pullquote',   label: 'Pull Quote',       type: 'textarea', placeholder: 'One striking insight…',    required: true },
      { key: 'body',        label: 'Body Copy',        type: 'textarea', placeholder: 'Context paragraph…',       required: true },
      { key: 'stat1_label', label: 'Stat 1 Label',     type: 'text',     placeholder: 'Avg. pay gap',             required: true },
      { key: 'stat1_value', label: 'Stat 1 Value',     type: 'text',     placeholder: '18%',                      required: true },
      { key: 'stat2_label', label: 'Stat 2 Label',     type: 'text',     placeholder: 'Roles undercut',           required: true },
      { key: 'stat2_value', label: 'Stat 2 Value',     type: 'text',     placeholder: '3 in 5',                   required: true },
      { key: 'stat3_label', label: 'Stat 3 Label',     type: 'text',     placeholder: 'Audit ROI',                required: true },
      { key: 'stat3_value', label: 'Stat 3 Value',     type: 'text',     placeholder: '54×',                      required: true },
      { key: 'insight',     label: 'Closing Insight',  type: 'textarea', placeholder: 'What this means…',         required: true },
      { key: 'cta_url',     label: 'CTA Link',         type: 'url',      placeholder: 'https://…',                required: true },
    ],
  },
  {
    id: 're-engagement',
    name: 'Re-engagement',
    description: 'Personal, low-pressure win-back for cold contacts.',
    icon: '◉',
    fields: [
      { key: 'greeting',     label: 'Opening Greeting', type: 'text',     placeholder: 'It has been a while.',     required: true },
      { key: 'hook',         label: 'Hook / Subject',   type: 'text',     placeholder: 'Markets moved since we last spoke.', required: true },
      { key: 'what_changed', label: 'What Changed',     type: 'textarea', placeholder: 'New data, new service…',  required: true },
      { key: 'offer',        label: 'The Offer',        type: 'textarea', placeholder: 'One clear call to action…', required: true },
      { key: 'cta_text',     label: 'CTA Text',         type: 'text',     placeholder: 'Check Your Score →',       required: true },
      { key: 'cta_url',      label: 'CTA Link',         type: 'url',      placeholder: 'https://…',                required: true },
    ],
  },
]

interface NlStats  { total: number; active: number; unsubscribed: number }
interface Campaign { id: string; subject: string; sent_count: number; sent_at: string | null; created_at: string }

const inputCls = 'bg-transparent border border-graphite px-4 py-2.5 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30 w-full'
const btnGold  = 'bg-signal-gold text-obsidian px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer disabled:opacity-60'
const btnGhost = 'border border-graphite/60 text-muted px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.15em] uppercase hover:text-bone hover:border-signal-gold/40 transition-colors cursor-pointer'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function NewsletterTab() {
  const [stats,         setStats]         = useState<NlStats | null>(null)
  const [campaigns,     setCampaigns]     = useState<Campaign[]>([])
  const [loading,       setLoading]       = useState(false)

  // Template builder state
  const [mode,          setMode]          = useState<'compose' | 'raw'>('compose')
  const [selectedTpl,   setSelectedTpl]   = useState<TemplateId | null>(null)
  const [vars,          setVars]          = useState<Record<string, string>>({})
  const [customSubject, setCustomSubject] = useState('')
  const [previewHtml,   setPreviewHtml]   = useState('')
  const [previewSubject,setPreviewSubject]= useState('')
  const [previewing,    setPreviewing]    = useState(false)
  const [showPreview,   setShowPreview]   = useState(false)

  // Raw mode state
  const [rawSubject,    setRawSubject]    = useState('')
  const [rawHtml,       setRawHtml]       = useState('')

  // Sending
  const [confirmModal,  setConfirmModal]  = useState(false)
  const [sending,       setSending]       = useState(false)
  const [sendResult,    setSendResult]    = useState('')

  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadStats = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/newsletter/subscribers')
      if (r.ok) {
        const d = await r.json()
        setStats(d.stats)
        setCampaigns(d.campaigns ?? [])
      }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  // Pick template
  function selectTemplate(id: TemplateId) {
    setSelectedTpl(id)
    setVars({})
    setPreviewHtml('')
    setPreviewSubject('')
    setShowPreview(false)
    setCustomSubject('')
    setSendResult('')
  }

  // Debounced preview refresh
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, vars: v }),
      })
      if (r.ok) {
        const d = await r.json()
        setPreviewHtml(d.html ?? '')
        setPreviewSubject(d.subject ?? '')
        setShowPreview(true)
      }
    } finally { setPreviewing(false) }
  }

  async function handlePreviewClick() {
    if (!selectedTpl) return
    await fetchPreview(selectedTpl, vars)
  }

  async function handleSend() {
    const subject = mode === 'compose' ? (customSubject || previewSubject) : rawSubject
    const html    = mode === 'compose' ? previewHtml : rawHtml
    if (!subject.trim() || !html.trim()) return
    setSending(true)
    setSendResult('')
    try {
      const r = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html }),
      })
      const d = await r.json()
      if (r.ok) {
        setSendResult(`Sent to ${d.sent} of ${d.total} active subscribers.`)
        setConfirmModal(false)
        setSelectedTpl(null)
        setPreviewHtml('')
        setPreviewSubject('')
        setVars({})
        setRawSubject('')
        setRawHtml('')
        loadStats()
      } else {
        setSendResult(d.error ?? 'Send failed.')
        setConfirmModal(false)
      }
    } finally { setSending(false) }
  }

  const readyToSend = mode === 'compose'
    ? !!(previewHtml && (customSubject || previewSubject))
    : !!(rawSubject.trim() && rawHtml.trim())

  const tpl = selectedTpl ? TEMPLATES.find(t => t.id === selectedTpl) : null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">

      {/* ── Left: compose ── */}
      <div>
        {/* Stats */}
        {loading ? (
          <p className="font-sans text-muted text-sm mb-8">Loading…</p>
        ) : stats && (
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

        {/* Mode toggle */}
        <div className="flex gap-0 border-b border-graphite mb-6">
          {[{ id: 'compose', label: 'Template Builder' }, { id: 'raw', label: 'Custom HTML' }].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as 'compose' | 'raw')}
              className={`font-mono text-[0.6rem] tracking-widest px-5 py-2.5 border-b-2 transition-colors ${
                mode === m.id ? 'border-signal-gold text-bone' : 'border-transparent text-muted hover:text-bone'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── COMPOSE MODE ── */}
        {mode === 'compose' && (
          <div>
            {/* Template picker */}
            {!selectedTpl && (
              <>
                <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-5">CHOOSE A TEMPLATE</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => selectTemplate(t.id)}
                      className="border border-graphite/60 p-5 text-left hover:border-signal-gold/50 hover:bg-graphite/10 transition-colors group"
                    >
                      <p className="font-mono text-signal-gold text-xl mb-2 group-hover:scale-110 transition-transform inline-block">{t.icon}</p>
                      <p className="font-sans text-bone text-sm font-medium mb-1">{t.name}</p>
                      <p className="font-sans text-muted text-xs leading-relaxed">{t.description}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Variable inputs */}
            {tpl && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => { setSelectedTpl(null); setShowPreview(false) }}
                    className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone">
                    ← Templates
                  </button>
                  <p className="font-mono text-bone text-[0.6rem] tracking-widest">{tpl.name.toUpperCase()}</p>
                </div>

                {/* Subject override */}
                <div className="mb-4">
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">
                    SUBJECT LINE <span className="opacity-60">(auto-generated if blank)</span>
                  </p>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    placeholder={previewSubject || 'Leave blank to use template default…'}
                    className={inputCls}
                  />
                </div>

                {/* Template fields */}
                <div className="flex flex-col gap-4 mb-5">
                  {tpl.fields.map(f => (
                    <div key={f.key}>
                      <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">
                        {f.label.toUpperCase()}
                        {f.required && <span className="text-signal-gold ml-1">*</span>}
                      </p>
                      {f.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={vars[f.key] ?? ''}
                          onChange={e => updateVar(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className={`${inputCls} resize-y font-sans`}
                        />
                      ) : (
                        <input
                          type={f.type === 'url' ? 'url' : 'text'}
                          value={vars[f.key] ?? ''}
                          onChange={e => updateVar(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className={inputCls}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Preview / send buttons */}
                <div className="flex gap-3 items-center flex-wrap">
                  <button onClick={handlePreviewClick} disabled={previewing} className={btnGhost}>
                    {previewing ? 'Generating…' : 'Preview →'}
                  </button>
                  {previewHtml && (
                    <button
                      onClick={() => setConfirmModal(true)}
                      disabled={!readyToSend}
                      className={btnGold}
                    >
                      Send to All Active →
                    </button>
                  )}
                </div>
                {sendResult && <p className="font-sans text-signal-gold text-xs mt-3">{sendResult}</p>}

                {/* Live preview */}
                {showPreview && previewHtml && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-muted text-[0.6rem] tracking-widest">EMAIL PREVIEW</p>
                      <p className="font-mono text-muted text-[0.55rem] tracking-widest">
                        Subject: <span className="text-bone">{customSubject || previewSubject}</span>
                      </p>
                    </div>
                    <div className="border border-graphite overflow-hidden" style={{ height: '600px' }}>
                      <iframe
                        srcDoc={previewHtml}
                        title="Email preview"
                        style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── RAW HTML MODE ── */}
        {mode === 'raw' && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">SUBJECT LINE</p>
              <input
                type="text"
                value={rawSubject}
                onChange={e => setRawSubject(e.target.value)}
                placeholder="The intelligence brief — May 2026"
                className={inputCls}
              />
            </div>
            <div>
              <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1.5">EMAIL BODY (HTML)</p>
              <textarea
                value={rawHtml}
                onChange={e => setRawHtml(e.target.value)}
                rows={16}
                placeholder="<p>Your full HTML email…</p>"
                className={`${inputCls} resize-none font-mono text-xs`}
              />
            </div>
            <p className="font-mono text-muted text-[0.55rem] tracking-widest">
              Unsubscribe links are appended automatically to every recipient.
            </p>
            {sendResult && <p className="font-sans text-signal-gold text-xs">{sendResult}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(true)}
                disabled={!readyToSend}
                className={btnGold}
              >
                Send to All Active →
              </button>
            </div>
            <p className="font-sans text-muted text-xs leading-relaxed">
              This sends to all active newsletter subscribers immediately. There is no undo.
            </p>
          </div>
        )}
      </div>

      {/* ── Right: campaign history ── */}
      <div>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-obsidian py-1">
          <p className="font-mono text-muted text-[0.6rem] tracking-widest">CAMPAIGN HISTORY</p>
          <button onClick={loadStats} disabled={loading} className="font-mono text-muted text-[0.55rem] tracking-widest hover:text-bone disabled:opacity-40">
            {loading ? '…' : '↻'}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {campaigns.length === 0 && !loading && (
            <p className="font-sans text-muted text-sm">No campaigns sent yet.</p>
          )}
          {campaigns.map(c => (
            <div key={c.id} className="border border-graphite/60 p-4">
              <p className="font-sans text-bone text-sm mb-2 leading-snug">{c.subject}</p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-muted text-[0.5rem] tracking-widest">
                  {formatDate(c.sent_at ?? c.created_at)}
                </span>
                <span className="font-mono text-signal-gold text-[0.5rem] tracking-widest">
                  {c.sent_count} sent
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confirm send modal ── */}
      {confirmModal && (
        <div className="fixed inset-0 bg-obsidian/90 z-50 flex items-center justify-center p-6">
          <div className="bg-obsidian border border-graphite p-8 max-w-md w-full">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">CONFIRM SEND</p>
            <p className="font-sans text-bone text-sm mb-2">
              Subject: <strong>{mode === 'compose' ? (customSubject || previewSubject) : rawSubject}</strong>
            </p>
            <p className="font-sans text-muted text-xs mb-6 leading-relaxed">
              This will send to all active newsletter subscribers immediately. This action cannot be undone.
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
    </div>
  )
}
