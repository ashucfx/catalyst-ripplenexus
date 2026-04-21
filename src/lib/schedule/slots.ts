import { adminLocalToUTC, toTimeString, getDayOfWeek, ADMIN_TZ } from './timezone'

export interface AvailabilityRule {
  day_of_week: number   // 0=Sun
  start_time:  string   // 'HH:MM'
  end_time:    string   // 'HH:MM'
  is_active:   boolean
}

export interface Booking {
  starts_at: string  // ISO string
  ends_at:   string  // ISO string
  status:    string
}

export interface BlockedDate {
  blocked_date: string  // 'YYYY-MM-DD'
}

export interface TimeSlot {
  startISO:     string   // UTC ISO
  endISO:       string   // UTC ISO
  startDisplay: string   // 'HH:MM' in admin tz
  endDisplay:   string
  available:    boolean
}

const SLOT_DURATION_MIN = 60
const MIN_ADVANCE_HRS   = 24
const MAX_ADVANCE_DAYS  = 60

export function generateSlots(
  dateStr:    string,             // 'YYYY-MM-DD' in admin TZ
  duration:   number,             // meeting duration in minutes
  rules:      AvailabilityRule[],
  bookings:   Booking[],
  blocked:    BlockedDate[],
): TimeSlot[] {
  // Check if date is blocked
  if (blocked.some(b => b.blocked_date === dateStr)) return []

  // Parse the day of week in admin timezone
  const dayStart = adminLocalToUTC(dateStr, '00:00')
  const dow      = getDayOfWeek(dayStart, ADMIN_TZ)

  const rule = rules.find(r => r.day_of_week === dow && r.is_active)
  if (!rule) return []

  const windowStart = adminLocalToUTC(dateStr, rule.start_time)
  const windowEnd   = adminLocalToUTC(dateStr, rule.end_time)
  const now         = new Date()
  const minStart    = new Date(now.getTime() + MIN_ADVANCE_HRS * 3_600_000)

  // Confirmed+pending bookings for this day
  const dayBookings = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'pending_payment')
    .map(b => ({ start: new Date(b.starts_at), end: new Date(b.ends_at) }))

  const slots: TimeSlot[] = []
  let cursor = new Date(windowStart.getTime())

  while (cursor.getTime() + duration * 60_000 <= windowEnd.getTime()) {
    const slotStart = new Date(cursor.getTime())
    const slotEnd   = new Date(cursor.getTime() + duration * 60_000)

    const pastMinAdvance = slotStart >= minStart
    const noConflict     = !dayBookings.some(b => slotStart < b.end && slotEnd > b.start)

    slots.push({
      startISO:     slotStart.toISOString(),
      endISO:       slotEnd.toISOString(),
      startDisplay: toTimeString(slotStart, ADMIN_TZ),
      endDisplay:   toTimeString(slotEnd,   ADMIN_TZ),
      available:    pastMinAdvance && noConflict,
    })

    cursor = new Date(cursor.getTime() + SLOT_DURATION_MIN * 60_000)
  }

  return slots
}

/** Get list of dates in the given month that have at least one available slot */
export function getAvailableDaysInMonth(
  year:     number,
  month:    number,           // 1-12
  rules:    AvailabilityRule[],
  bookings: Booking[],
  blocked:  BlockedDate[],
  durationMin: number = 45,
): string[] {
  const available: string[] = []
  const now       = new Date()
  const maxDate   = new Date(now.getTime() + MAX_ADVANCE_DAYS * 86_400_000)

  const daysInMonth = new Date(year, month, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dateMs  = adminLocalToUTC(dateStr, '00:00').getTime()

    if (dateMs > maxDate.getTime()) break

    const slots = generateSlots(dateStr, durationMin, rules, bookings, blocked)
    if (slots.some(s => s.available)) {
      available.push(dateStr)
    }
  }

  return available
}
