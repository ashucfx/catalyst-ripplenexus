'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MeetingType } from '@/lib/db/bookings'
import { PaymentButton } from '@/components/ui/PaymentButton'

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

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
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
    if (!name.trim()) { setFormErr('Name is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormErr('Valid email required.'); return }
    if (!selectedSlot) { setFormErr('No slot selected.'); return }

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

      {/* Left: session info */}
      <div className="bg-graphite p-8 border-r border-graphite lg:border-b-0 border-b">
        <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">SESSION</p>
        <h2 className="display-card text-2xl mb-2">{meetingType.name}</h2>
        <p className="font-sans text-muted text-sm leading-relaxed mb-6">{meetingType.description}</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-signal-gold text-sm">◷</span>
            <span className="font-sans text-muted text-sm">{meetingType.duration_min} minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-signal-gold text-sm">◈</span>
            <span className="font-sans text-muted text-sm">Video call</span>
          </div>
          {meetingIsPaid && (
            <div className="flex items-center gap-3">
              <span className="text-signal-gold text-sm">◎</span>
              <span className="font-sans text-muted text-sm">
                ${(meetingType.price_usd / 100).toFixed(0)} · ₹{(meetingType.price_inr / 100).toFixed(0)}
              </span>
            </div>
          )}
          {!meetingIsPaid && (
            <div className="flex items-center gap-3">
              <span className="text-signal-gold text-sm">◎</span>
              <span className="font-sans text-signal-gold text-sm">Free</span>
            </div>
          )}
        </div>

        {selectedDate && (
          <div className="mt-8 pt-6 border-t border-graphite/50">
            <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-2">SELECTED DATE</p>
            <p className="font-sans text-bone text-sm">{formatDateDisplay(selectedDate, tz)}</p>
          </div>
        )}
        {selectedSlot && (
          <div className="mt-4">
            <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-2">SELECTED TIME</p>
            <p className="font-sans text-bone text-sm">
              {formatSlotTime(selectedSlot.startISO, tz)} → {formatSlotTime(selectedSlot.endISO, tz)}
            </p>
            <p className="font-mono text-muted text-[0.55rem] mt-1">{tz}</p>
          </div>
        )}
      </div>

      {/* Right: flow */}
      <div className="lg:col-span-2 bg-obsidian p-8">

        {/* Step: Calendar */}
        {(step === 'calendar' || step === 'slots') && !selectedSlot && (
          <>
            {step === 'calendar' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="display-card text-xl">
                    {MONTHS[month - 1]} {year}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} disabled={isPrevDisabled}
                      className="font-mono text-muted text-lg px-2 hover:text-bone disabled:opacity-30 disabled:cursor-not-allowed">
                      ‹
                    </button>
                    <button onClick={nextMonth}
                      className="font-mono text-muted text-lg px-2 hover:text-bone">
                      ›
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-center font-mono text-muted text-[0.55rem] tracking-widest py-1">{d}</div>
                  ))}
                </div>

                {loadingDays && (
                  <div className="text-center py-12">
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest">Loading availability…</p>
                  </div>
                )}

                {!loadingDays && (
                  <div className="grid grid-cols-7 gap-1">
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
                            aspect-square flex items-center justify-center text-sm font-sans transition-colors
                            ${isAvail && !isPast
                              ? 'text-bone hover:bg-signal-gold hover:text-obsidian cursor-pointer border border-graphite hover:border-signal-gold'
                              : 'text-muted/30 cursor-default'
                            }
                          `}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                )}

                <p className="font-mono text-muted text-[0.55rem] tracking-widest mt-6">
                  Timezone detected: {tz} · All times shown in your local time
                </p>
              </>
            )}

            {step === 'slots' && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => { setStep('calendar'); setSelectedDate(''); setSlots([]) }}
                    className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone">
                    ← Back
                  </button>
                  <h3 className="display-card text-xl">
                    {selectedDate ? formatDateDisplay(selectedDate, tz) : ''}
                  </h3>
                </div>

                {loadingSlots && (
                  <p className="font-mono text-muted text-[0.6rem] tracking-widest">Loading slots…</p>
                )}

                {!loadingSlots && slots.length === 0 && (
                  <div className="py-8">
                    <p className="font-sans text-muted text-sm">No available slots on this date.</p>
                    <button onClick={() => { setStep('calendar'); setSelectedDate(''); }}
                      className="font-mono text-signal-gold text-[0.6rem] tracking-widest mt-4 hover:text-bone">
                      Choose another date →
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots.filter(s => s.available).map(slot => (
                    <button
                      key={slot.startISO}
                      onClick={() => handleSlotSelect(slot)}
                      className="border border-graphite p-3 text-center font-sans text-bone text-sm
                                 hover:border-signal-gold hover:bg-signal-gold/10 transition-colors cursor-pointer"
                    >
                      {formatSlotTime(slot.startISO, tz)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Step: Details form */}
        {step === 'details' && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => { setStep('slots'); setSelectedSlot(null) }}
                className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone">
                ← Back
              </button>
              <h3 className="display-card text-xl">Your details</h3>
            </div>

            <form onSubmit={handleSubmitDetails} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-muted text-[0.55rem] tracking-widest">FULL NAME *</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm
                             focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-muted text-[0.55rem] tracking-widest">EMAIL ADDRESS *</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="priya@company.com"
                  className="bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm
                             focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-muted text-[0.55rem] tracking-widest">COMPANY / ORGANISATION</label>
                <input
                  type="text" value={company} onChange={e => setCompany(e.target.value)}
                  placeholder="Optional"
                  className="bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm
                             focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-muted text-[0.55rem] tracking-widest">ANYTHING WE SHOULD KNOW</label>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Current role, target move, biggest challenge…"
                  className="bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm
                             focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/30 resize-none"
                />
              </div>

              {formErr && <p className="font-sans text-signal-gold text-xs">{formErr}</p>}
              {bookErr && <p className="font-sans text-signal-gold text-xs">{bookErr}</p>}

              <button
                type="submit" disabled={submitting}
                className="bg-signal-gold text-obsidian px-8 py-4 font-sans text-[0.65rem] tracking-[0.2em]
                           uppercase hover:bg-bone transition-colors duration-200 cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? 'Processing…' : meetingIsPaid ? 'Continue to payment →' : 'Confirm booking →'}
              </button>
            </form>
          </>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <>
            <div className="mb-8">
              <h3 className="display-card text-xl mb-2">Complete payment</h3>
              <p className="font-sans text-muted text-sm">
                Your slot is reserved for 15 minutes. Complete payment to confirm your booking.
              </p>
            </div>

            <div className="border border-graphite p-6 mb-6">
              <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1">BOOKING SUMMARY</p>
              <p className="font-sans text-bone text-sm">{meetingType.name}</p>
              {selectedSlot && (
                <p className="font-sans text-muted text-sm mt-1">
                  {formatSlotTime(selectedSlot.startISO, tz)} · {formatDateDisplay(selectedDate, tz)}
                </p>
              )}
            </div>

            <PaymentButton
              product={`booking:${bookingId}`}
              email={email}
              onSuccess={handlePaymentSuccess}
              onError={(err) => setBookErr(err)}
              labelINR={`Pay ₹${(priceINR / 100).toFixed(0)} — Confirm Booking →`}
              labelUSD={`Cards · PayPal — $${(priceUSD / 100).toFixed(0)} USD`}
            />

            {bookErr && <p className="font-sans text-signal-gold text-xs mt-4">{bookErr}</p>}
          </>
        )}

      </div>
    </div>
  )
}
