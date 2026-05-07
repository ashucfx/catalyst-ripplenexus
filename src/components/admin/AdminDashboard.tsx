'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { InflectionMark } from '@/components/ui/InflectionMark'
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

const inputCls = 'bg-transparent border border-graphite px-4 py-2.5 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30'
const btnGold  = 'bg-signal-gold text-obsidian px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer disabled:opacity-60'

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
        {tab === 'crm' && <CRMTab />}

        {/* ── NEWSLETTER TAB ── */}
        {tab === 'newsletter' && <NewsletterTab />}

      </div>
    </div>
  )
}
