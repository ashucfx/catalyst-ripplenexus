'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CRMTab } from '@/components/admin/CRMTab'
import { NewsletterTab } from '@/components/admin/NewsletterTab'

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

const inputCls = 'w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors placeholder:text-muted/30'
const btnGold  = 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] px-6 py-3 font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all cursor-pointer shadow-md whitespace-nowrap'

// ── Main Component ─────────────────────────────────────────────────────────────

export function AdminDashboard({ initialBookings, initialRules, adminTZ }: Props) {
  const router = useRouter()
  const [bookings,    setBookings]   = useState<Booking[]>(initialBookings)
  const [rules,       setRules]      = useState<Rule[]>(initialRules)
  const [tab,         setTab]        = useState<'bookings' | 'availability' | 'crm' | 'newsletter'>('bookings')
  const [blockedDate, setBlockedDate] = useState('')
  const [blockedNote, setBlockedNote] = useState('')
  const [blockMsg,    setBlockMsg]    = useState('')

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  const refreshBookings = useCallback(async () => {
    const r = await fetch('/api/admin/bookings')
    if (r.ok) { const d = await r.json(); setBookings(d.bookings) }
  }, [])

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

  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const pending   = bookings.filter(b => b.status === 'pending_payment').length

  const TABS = [
    { id: 'bookings',     label: 'Bookings' },
    { id: 'availability', label: 'Availability' },
    { id: 'crm',          label: 'CRM Leads' },
    { id: 'newsletter',   label: 'Newsletter' },
  ] as const

  return (
    <div className="min-h-screen bg-obsidian grain">
      {/* Top Header Bar */}
      <header className="border-b border-white/10 bg-obsidian/90 sticky top-0 z-50 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-signal-gold rotate-45 rounded-sm" />
          <span className="font-serif font-bold text-bone tracking-wider text-base">CATALYST</span>
          <span className="font-mono text-[0.6rem] text-signal-gold border border-signal-gold/30 px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold">
            CONTROL CENTER
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider hidden sm:inline-block">
            TZ: {adminTZ}
          </span>
          <Link href="/" className="font-mono text-[0.65rem] text-muted hover:text-bone uppercase tracking-wider hidden sm:inline-block">
            Website ↗
          </Link>
          <button
            onClick={logout}
            className="font-mono text-[0.65rem] text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Upcoming Bookings', value: bookings.length },
            { label: 'Confirmed Calls',   value: confirmed },
            { label: 'Pending Payment',   value: pending },
            { label: 'Timezone Standard', value: adminTZ.split('/')[1] ?? adminTZ },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg">
              <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block mb-2 font-bold">
                {s.label}
              </span>
              <p className="display-card text-3xl text-bone">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 mb-8 overflow-x-auto">
          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`font-mono text-xs uppercase tracking-widest px-5 py-3 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
                  tab === t.id
                    ? 'border-signal-gold text-signal-gold bg-signal-gold/5'
                    : 'border-transparent text-muted hover:text-bone'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === 'bookings' && (
            <button
              onClick={refreshBookings}
              className="font-mono text-xs text-signal-gold hover:text-bone px-4 py-2 border border-white/10 rounded-full transition-colors cursor-pointer shrink-0"
            >
              Refresh ↻
            </button>
          )}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
                <p className="font-serif text-muted text-base">No upcoming strategy call bookings recorded.</p>
              </div>
            )}
            {bookings.map(b => (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/30 transition-all grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
              >
                <div>
                  <span className="font-mono text-[0.65rem] text-signal-gold uppercase tracking-wider block mb-1 font-bold">
                    CANDIDATE
                  </span>
                  <p className="font-sans text-bone text-base font-semibold">{b.name}</p>
                  <p className="font-sans text-muted text-xs">{b.email}</p>
                  {b.company && <p className="font-sans text-muted text-xs font-mono">{b.company}</p>}
                </div>
                <div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider block mb-1 font-bold">
                    SESSION TYPE
                  </span>
                  <p className="font-sans text-bone text-sm font-medium">{b.meeting_types?.name}</p>
                  <p className="font-sans text-muted text-xs font-mono">{b.meeting_types?.duration_min} minutes</p>
                </div>
                <div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider block mb-1 font-bold">
                    DATE & TIME (IST)
                  </span>
                  <p className="font-sans text-bone text-sm font-mono">{formatTime(b.starts_at, adminTZ)}</p>
                  <p className="font-sans text-muted text-xs font-mono">TZ: {b.timezone}</p>
                </div>
                <div className="flex md:justify-end">
                  <span className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border font-bold ${
                    b.status === 'confirmed'
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : b.status === 'pending_payment'
                      ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                      : 'border-white/20 text-muted'
                  }`}>
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {tab === 'availability' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block mb-6 font-bold">
                WEEKLY AVAILABILITY WINDOWS ({adminTZ})
              </span>
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, dow) => {
                  const rule   = rules.find(r => r.day_of_week === dow)
                  const active = !!rule?.is_active
                  return (
                    <div
                      key={dow}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        active
                          ? 'border-white/15 bg-white/[0.03]'
                          : 'border-white/5 bg-transparent opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleDay(dow)}
                          className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                        />
                        <span className="font-mono text-bone text-xs font-bold w-24">
                          {DAYS_FULL[dow]}
                        </span>
                      </div>
                      {active && rule && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={rule.start_time}
                            onChange={e => updateTime(dow, 'start_time', e.target.value)}
                            className="bg-white/[0.04] border border-white/15 rounded px-3 py-1 font-mono text-bone text-xs focus:outline-none focus:border-signal-gold"
                          />
                          <span className="font-mono text-muted text-xs">—</span>
                          <input
                            type="time"
                            value={rule.end_time}
                            onChange={e => updateTime(dow, 'end_time', e.target.value)}
                            className="bg-white/[0.04] border border-white/15 rounded px-3 py-1 font-mono text-bone text-xs focus:outline-none focus:border-signal-gold"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block mb-6 font-bold">
                BLACKOUT / BLOCK SPECIFIC DATE
              </span>
              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    SELECT DATE
                  </label>
                  <input
                    type="date"
                    value={blockedDate}
                    onChange={e => setBlockedDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    REASON (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={blockedNote}
                    onChange={e => setBlockedNote(e.target.value)}
                    placeholder="Public Holiday / Personal Outing"
                    className={inputCls}
                  />
                </div>
                <button onClick={addBlock} className={btnGold}>
                  Block Selected Date →
                </button>
                {blockMsg && (
                  <p className="font-sans text-emerald-400 text-xs p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/50">
                    {blockMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CRM TAB ── */}
        {tab === 'crm' && <CRMTab />}

        {/* ── NEWSLETTER TAB ── */}
        {tab === 'newsletter' && <NewsletterTab />}

      </main>
    </div>
  )
}
