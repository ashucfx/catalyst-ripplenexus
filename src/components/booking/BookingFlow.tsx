'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MeetingType } from '@/lib/db/bookings'
import { PaymentButton } from '@/components/ui/PaymentButton'
import { useGeo } from '@/hooks/useGeo'

type Step = 'calendar' | 'slots' | 'details' | 'payment' | 'done'

interface Props {
  meetingType: MeetingType
}

interface Slot {
  startISO:     string
  endISO:       string
  startDisplay: string
  endDisplay:   string
  available:    boolean
}

const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getUserTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return 'UTC' }
}

function formatSlotTime(isoStr: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoStr))
}

function formatDateDisplay(isoStr: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  }).format(new Date(isoStr + 'T12:00:00Z'))
}

export function BookingFlow({ meetingType }: Props) {
  const geo     = useGeo()
  const isIndia = geo?.isIndia ?? false

  const [step, setStep] = useState<Step>('calendar')
  const [tz,   setTz]   = useState<string>('UTC')

  // Calendar state
  const today    = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [loadingDays,   setLoadingDays]   = useState(false)
  const [selectedDate,  setSelectedDate]  = useState<string>('')

  // Slot state
  const [slots,        setSlots]        = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // Form state
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [formErr, setFormErr] = useState('')

  // Booking result
  const [bookingId,  setBookingId]  = useState('')
  const [priceUSD,   setPriceUSD]   = useState(0)
  const [priceINR,   setPriceINR]   = useState(0)
  const [submitting,  setSubmitting]  = useState(false)
  const [bookErr,     setBookErr]     = useState('')

  useEffect(() => { setTz(getUserTimezone()) }, [])

  const loadAvailableDays = useCallback(async (y: number, m: number) => {
    setLoadingDays(true)
    setAvailableDays([])
    try {
      const r = await fetch(`/api/schedule/availability?year=${y}&month=${m}&type=${meetingType.id}`)
      const d = await r.json()
      setAvailableDays(d.availableDays ?? [])
    } catch {}
    setLoadingDays(false)
  }, [meetingType.id])

  useEffect(() => { loadAvailableDays(year, month) }, [year, month, loadAvailableDays])

  async function handleDateSelect(date: string) {
    setSelectedDate(date)
    setSlots([])
    setSelectedSlot(null)
    setStep('slots')
    setLoadingSlots(true)
    try {
      const r = await fetch(`/api/schedule/slots?date=${date}&type=${meetingType.id}`)
      const d = await r.json()
      setSlots(d.slots ?? [])
    } catch {}
    setLoadingSlots(false)
  }

  function handleSlotSelect(slot: Slot) {
    setSelectedSlot(slot)
    setStep('details')
  }

  async function handleSubmitDetails(e: React.FormEvent) {
    e.preventDefault()
    setFormErr('')
    if (!name.trim()) { setFormErr('Full name is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormErr('Valid email address is required.'); return }
    if (!selectedSlot) { setFormErr('No time slot selected.'); return }

    setSubmitting(true)
    setBookErr('')
    try {
      const res = await fetch('/api/schedule/book', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          meetingTypeId: meetingType.id,
          startISO:      selectedSlot.startISO,
          name, email, company, message, timezone: tz,
          honeypot: '',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setBookErr(data.error ?? 'Something went wrong.'); setSubmitting(false); return }

      setBookingId(data.bookingId)
      setPriceUSD(data.priceUSD ?? 0)
      setPriceINR(data.priceINR ?? 0)

      if (!data.isPaid) {
        window.location.href = '/book/success'
      } else {
        setStep('payment')
      }
    } catch {
      setBookErr('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  async function handlePaymentSuccess() {
    window.location.href = '/book/success'
  }

  // Calendar grid
  const daysInMonth    = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()

  const isPrevDisabled = year === today.getFullYear() && month === today.getMonth() + 1
  function prevMonth() {
    if (isPrevDisabled) return
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const meetingIsPaid = meetingType.price_usd > 0

  return (
    <div className="rounded-2xl bg-obsidian border border-white/15 shadow-2xl overflow-hidden backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12">

      {/* ── LEFT SIDEBAR: SESSION SUMMARY ──────────────────────────── */}
      <div className="lg:col-span-5 p-8 sm:p-10 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
        <div>
          <span className="font-mono text-[0.65rem] text-signal-gold border border-signal-gold/30 bg-signal-gold/10 px-3 py-1 rounded-full uppercase tracking-widest font-bold inline-block mb-4">
            {meetingIsPaid ? 'Executive Strategy Session' : 'Complimentary Consultation'}
          </span>

          <h2 className="display-card text-2xl sm:text-3xl text-bone mb-3">
            {meetingType.name}
          </h2>

          <p className="font-serif text-muted text-xs sm:text-sm leading-relaxed mb-8">
            {meetingType.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-signal-gold text-base">⏱</span>
              <div>
                <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider block">Duration</span>
                <span className="font-mono text-xs text-bone font-bold">{meetingType.duration_min} Minutes</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-signal-gold text-base">📹</span>
              <div>
                <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider block">Location Format</span>
                <span className="font-mono text-xs text-bone font-bold">Google Meet (Auto-generated Link)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-signal-gold text-base">🌐</span>
              <div>
                <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider block">Detected Timezone</span>
                <span className="font-mono text-xs text-signal-gold font-bold">{tz}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Slot Indicator */}
        {(selectedDate || selectedSlot) && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="font-mono text-[0.6rem] text-signal-gold uppercase tracking-widest block mb-2 font-bold">
              SELECTED SLOT SUMMARY
            </span>
            {selectedDate && (
              <p className="font-sans text-bone text-xs font-semibold mb-1">
                📅 {formatDateDisplay(selectedDate, tz)}
              </p>
            )}
            {selectedSlot && (
              <p className="font-mono text-signal-gold text-xs font-bold">
                ⏰ {formatSlotTime(selectedSlot.startISO, tz)} → {formatSlotTime(selectedSlot.endISO, tz)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN PANEL: INTERACTIVE FLOW ──────────────────────── */}
      <div className="lg:col-span-7 p-8 sm:p-10">

        {/* ── STEP 1: CALENDAR DAY SELECTION ──────────────────────── */}
        {step === 'calendar' && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-[0.65rem] text-signal-gold uppercase tracking-widest block font-bold mb-1">
                  STEP 1 OF 3
                </span>
                <h3 className="display-card text-xl text-bone">
                  Select a Consultation Date
                </h3>
              </div>

              {/* Month Switcher Controls */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/15 rounded-full px-3 py-1">
                <button
                  onClick={prevMonth}
                  disabled={isPrevDisabled}
                  className="font-mono text-bone hover:text-signal-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm px-1"
                >
                  ‹
                </button>
                <span className="font-mono text-xs text-bone font-bold px-2">
                  {MONTHS[month - 1]} {year}
                </span>
                <button
                  onClick={nextMonth}
                  className="font-mono text-bone hover:text-signal-gold transition-colors text-sm px-1"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {DAYS.map(d => (
                <span key={d} className="font-mono text-[0.6rem] text-muted uppercase tracking-widest font-bold">
                  {d}
                </span>
              ))}
            </div>

            {loadingDays && (
              <div className="py-16 text-center">
                <p className="font-mono text-xs text-signal-gold uppercase tracking-widest animate-pulse font-bold">
                  Fetching Available Calendar Slots...
                </p>
              </div>
            )}

            {!loadingDays && (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day     = i + 1
                  const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                  const isAvail = availableDays.includes(dateStr)
                  const isPast  = new Date(dateStr) < today

                  return (
                    <button
                      key={dateStr}
                      onClick={() => isAvail && handleDateSelect(dateStr)}
                      disabled={!isAvail || isPast}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-200
                        ${isAvail && !isPast
                          ? 'bg-white/[0.05] border border-white/15 text-bone hover:border-signal-gold hover:bg-signal-gold hover:text-obsidian shadow-md cursor-pointer'
                          : 'bg-transparent text-muted/20 cursor-default border border-transparent'
                        }
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider">
                ● Gold Dates Indicate Verified Analyst Availability
              </span>
              <span className="font-mono text-[0.65rem] text-signal-gold uppercase font-bold">
                TZ: {tz}
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 2: SLOT SELECTION ──────────────────────────────── */}
        {step === 'slots' && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <button
                  onClick={() => { setStep('calendar'); setSelectedDate(''); setSlots([]) }}
                  className="font-mono text-xs text-signal-gold hover:text-bone uppercase tracking-wider block mb-2 transition-colors font-bold"
                >
                  ← Back to Calendar
                </button>
                <h3 className="display-card text-xl text-bone">
                  {selectedDate ? formatDateDisplay(selectedDate, tz) : 'Available Slots'}
                </h3>
              </div>
            </div>

            {loadingSlots && (
              <div className="py-16 text-center">
                <p className="font-mono text-xs text-signal-gold uppercase tracking-widest animate-pulse font-bold">
                  Loading Available Time Slots...
                </p>
              </div>
            )}

            {!loadingSlots && slots.length === 0 && (
              <div className="py-12 text-center rounded-xl bg-white/[0.02] border border-white/10 p-6">
                <p className="font-serif text-muted text-sm mb-4">No remaining slots for this date.</p>
                <button
                  onClick={() => { setStep('calendar'); setSelectedDate(''); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold uppercase tracking-widest rounded-full"
                >
                  Choose Another Date →
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.filter(s => s.available).map(slot => (
                <button
                  key={slot.startISO}
                  onClick={() => handleSlotSelect(slot)}
                  className="p-4 rounded-xl border border-white/15 bg-white/[0.04] text-center font-mono text-xs font-bold text-bone hover:border-signal-gold hover:bg-signal-gold/10 hover:text-signal-gold transition-all shadow-md cursor-pointer"
                >
                  {formatSlotTime(slot.startISO, tz)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: CANDIDATE DETAILS FORM ───────────────────────── */}
        {step === 'details' && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <button
                  onClick={() => { setStep('slots'); setSelectedSlot(null) }}
                  className="font-mono text-xs text-signal-gold hover:text-bone uppercase tracking-wider block mb-2 transition-colors font-bold"
                >
                  ← Back to Slots
                </button>
                <h3 className="display-card text-xl text-bone">
                  Candidate Contact Information
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmitDetails} className="space-y-5" noValidate>
              {formErr && <p className="font-sans text-red-400 text-xs p-3 rounded-lg bg-red-950/40 border border-red-900/50">{formErr}</p>}
              {bookErr && <p className="font-sans text-red-400 text-xs p-3 rounded-lg bg-red-950/40 border border-red-900/50">{bookErr}</p>}

              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  Full Name <span className="text-signal-gold">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Rachel Tan / Arjun Mehta"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  Email Address <span className="text-signal-gold">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rachel@company.com"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  Current Company or Organization (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Grab / Deloitte / Tech Firm"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  Target Role / Brief Notes
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g. Targeting VP of Product role in Singapore; current salary $180k..."
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] px-7 py-4 font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? 'Confirming Reservation...' : meetingIsPaid ? 'Continue to Payment →' : 'Confirm Strategy Session →'}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 4: PAYMENT (IF APPLICABLE) ────────────────────── */}
        {step === 'payment' && (
          <div>
            <div className="mb-6">
              <span className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold block mb-1">
                FINAL STEP
              </span>
              <h3 className="display-card text-xl text-bone mb-2">
                Confirm Strategy Session Payment
              </h3>
              <p className="font-serif text-muted text-xs leading-relaxed">
                Your slot is reserved for 15 minutes while payment processes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 mb-6">
              <span className="font-mono text-[0.6rem] text-signal-gold uppercase tracking-wider font-bold block mb-1">
                RESERVATION CONFIRMATION
              </span>
              <p className="font-sans text-bone text-sm font-semibold">{meetingType.name}</p>
              {selectedSlot && (
                <p className="font-mono text-muted text-xs mt-1">
                  📅 {formatDateDisplay(selectedDate, tz)} · ⏰ {formatSlotTime(selectedSlot.startISO, tz)}
                </p>
              )}
            </div>

            <PaymentButton
              product={`booking:${bookingId}`}
              email={email}
              description={meetingType.name}
              onSuccess={handlePaymentSuccess}
              onError={(err) => setBookErr(err)}
              labelINR={`Pay ₹${(priceINR / 100).toFixed(0)} — Confirm Booking →`}
              labelUSD={`Cards · PayPal — $${(priceUSD / 100).toFixed(0)} USD`}
            />

            {bookErr && <p className="font-sans text-red-400 text-xs mt-4 p-3 rounded bg-red-950/40 border border-red-900/50">{bookErr}</p>}
          </div>
        )}

      </div>
    </div>
  )
}
