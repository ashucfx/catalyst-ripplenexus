const ADMIN_TZ = process.env.ADMIN_TIMEZONE ?? 'Asia/Kolkata'

export { ADMIN_TZ }

/** Convert a local wall-clock date string (YYYY-MM-DD HH:MM) in a given tz to UTC Date */
export function localToUTC(dateStr: string, timeStr: string, tz: string): Date {
  // Build an ISO string that Temporal/Intl would understand, then use the hack:
  // Create a date in the target timezone by formatting and comparing offsets.
  const candidate = new Date(`${dateStr}T${timeStr}:00`)
  const offset = getUTCOffset(candidate, tz)
  return new Date(candidate.getTime() - offset * 60_000)
}

/** Get UTC offset in minutes for a given Date in a given IANA timezone */
export function getUTCOffset(date: Date, tz: string): number {
  const utcStr  = formatInTZ(date, 'UTC')
  const tzStr   = formatInTZ(date, tz)
  const utcMs   = parseNumericDateTime(utcStr)
  const tzMs    = parseNumericDateTime(tzStr)
  return (tzMs - utcMs) / 60_000
}

/** Format a UTC Date into YYYY-MM-DD in the given timezone */
export function toDateString(date: Date, tz: string = ADMIN_TZ): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year:     'numeric',
    month:    '2-digit',
    day:      '2-digit',
  }).format(date)
}

/** Format a UTC Date into HH:MM in the given timezone */
export function toTimeString(date: Date, tz: string = ADMIN_TZ): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour:     '2-digit',
    minute:   '2-digit',
    hour12:   false,
  }).format(date)
}

/** Get day-of-week (0=Sun) for a UTC Date in a given timezone */
export function getDayOfWeek(date: Date, tz: string = ADMIN_TZ): number {
  const str = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
  }).format(date)
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(str)
}

/** Get year/month/day parts for a UTC Date in a given timezone */
export function getDateParts(date: Date, tz: string = ADMIN_TZ): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year:  'numeric',
    month: 'numeric',
    day:   'numeric',
  }).formatToParts(date)

  const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value ?? '0', 10)
  return { year: get('year'), month: get('month'), day: get('day') }
}

/** Convert a YYYY-MM-DD + HH:MM in admin timezone to UTC Date */
export function adminLocalToUTC(dateStr: string, timeStr: string): Date {
  return localToUTC(dateStr, timeStr, ADMIN_TZ)
}

/** Format date for human display in a given timezone */
export function formatDisplay(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  }).format(date)
}

/** Format time for human display in a given timezone */
export function formatTimeDisplay(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour:   'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function formatInTZ(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year:   'numeric', month:  'numeric', day:    'numeric',
    hour:   'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  }).format(date)
}

function parseNumericDateTime(str: string): number {
  // en-US format: M/D/YYYY, HH:MM:SS
  const [datePart, timePart] = str.split(', ')
  const [m, d, y] = datePart.split('/').map(Number)
  const [hh, mm, ss] = timePart.split(':').map(Number)
  return Date.UTC(y, m - 1, d, hh % 24, mm, ss)
}
