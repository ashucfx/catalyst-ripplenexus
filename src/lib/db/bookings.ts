import { getDb } from './supabase'
import crypto from 'crypto'

export interface MeetingType {
  id:           string
  name:         string
  duration_min: number
  price_usd:    number
  price_inr:    number
  description:  string
  is_active:    boolean
}

export interface BookingInsert {
  meeting_type_id: string
  name:            string
  email:           string
  company?:        string
  message?:        string
  starts_at:       string   // ISO UTC
  ends_at:         string   // ISO UTC
  timezone:        string
  status:          'pending_payment' | 'confirmed'
  payment_id?:     string
  payment_method?: string
}

export interface Booking extends BookingInsert {
  id:          string
  cancel_token: string | null
  created_at:  string
}

function makeCancelToken(bookingId: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'fallback-secret'
  return crypto.createHmac('sha256', secret).update(bookingId).digest('hex')
}

export async function getMeetingTypes(): Promise<MeetingType[]> {
  const db = getDb()
  if (!db) return []
  const { data } = await db
    .from('meeting_types')
    .select('*')
    .eq('is_active', true)
    .order('price_usd', { ascending: true })
  return (data ?? []) as MeetingType[]
}

export async function getMeetingType(id: string): Promise<MeetingType | null> {
  const db = getDb()
  if (!db) return null
  const { data } = await db.from('meeting_types').select('*').eq('id', id).single()
  return data as MeetingType | null
}

export async function getAvailabilityRules() {
  const db = getDb()
  if (!db) return []
  const { data } = await db
    .from('availability_rules')
    .select('*')
    .eq('is_active', true)
  return data ?? []
}

export async function getBlockedDates(year: number, month: number) {
  const db = getDb()
  if (!db) return []
  const from = `${year}-${String(month).padStart(2,'0')}-01`
  const to   = `${year}-${String(month).padStart(2,'0')}-31`
  const { data } = await db
    .from('blocked_dates')
    .select('blocked_date')
    .gte('blocked_date', from)
    .lte('blocked_date', to)
  return data ?? []
}

export async function getBookingsForMonth(year: number, month: number) {
  const db = getDb()
  if (!db) return []
  const from = new Date(year, month - 1, 1).toISOString()
  const to   = new Date(year, month, 1).toISOString()
  const { data } = await db
    .from('bookings')
    .select('starts_at,ends_at,status')
    .gte('starts_at', from)
    .lt('starts_at', to)
    .in('status', ['confirmed','pending_payment'])
  return data ?? []
}

export async function getBookingsForDate(dateISO: string) {
  const db = getDb()
  if (!db) return []
  const dayStart = new Date(dateISO + 'T00:00:00Z').toISOString()
  const dayEnd   = new Date(dateISO + 'T23:59:59Z').toISOString()
  const { data } = await db
    .from('bookings')
    .select('starts_at,ends_at,status')
    .gte('starts_at', dayStart)
    .lte('starts_at', dayEnd)
    .in('status', ['confirmed','pending_payment'])
  return data ?? []
}

export async function getPendingBookingForUser(email: string, startISO: string): Promise<Booking | null> {
  const db = getDb()
  if (!db) return null
  const { data } = await db
    .from('bookings')
    .select('*')
    .eq('email', email)
    .eq('starts_at', startISO)
    .eq('status', 'pending_payment')
    .single()
  return data as Booking | null
}

export async function createBooking(input: BookingInsert): Promise<Booking | null> {
  const db = getDb()
  if (!db) return null

  // 1. Double-booking race condition check
  const { count, error: countError } = await db
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('starts_at', input.starts_at)
    .in('status', ['confirmed', 'pending_payment'])

  if (countError) { console.error('createBooking count:', countError); return null }
  if (count && count > 0) { console.warn('Double booking prevented:', input.starts_at); return null }

  const { data, error } = await db
    .from('bookings')
    .insert(input)
    .select()
    .single()

  if (error) {
    if (error.code === '23505' && error.message.includes('bookings_no_double_book_idx')) {
      console.warn('Double booking prevented by unique constraint:', input.starts_at);
      throw new Error('This slot was just booked. Please select another time.');
    }
    console.error('createBooking:', error); 
    return null;
  }
  if (!data) return null;

  const token = makeCancelToken(data.id)
  await db.from('bookings').update({ cancel_token: token }).eq('id', data.id)

  return { ...data, cancel_token: token } as Booking
}

export async function confirmBooking(id: string, paymentId: string, method: string): Promise<'success' | 'collision' | 'error' | 'already_confirmed'> {
  const db = getDb()
  if (!db) return 'error'
  
  // We check before update so we don't accidentally update a 'confirmed' booking 
  // and trigger another wave of success emails on duplicate webhook deliveries.
  const { data: existing } = await db.from('bookings').select('status').eq('id', id).single()
  if (!existing) return 'error'
  if (existing.status === 'confirmed') return 'already_confirmed'
  
  const { data, error } = await db
    .from('bookings')
    .update({ status: 'confirmed', payment_id: paymentId, payment_method: method })
    .eq('id', id)
    .in('status', ['pending_payment', 'cancelled'])
    .select()
  
  if (error) {
    if (error.code === '23505' && error.message.includes('bookings_no_double_book_idx')) {
      return 'collision'
    }
    return 'error'
  }
  
  if (!data || data.length === 0) {
    // If it was cancelled right before this, wait, the in clause caught cancelled?
    // If length is 0 and no error, it means another thread just confirmed it!
    return 'already_confirmed'
  }
  
  return 'success'
}

export async function cancelByToken(token: string, reason?: string): Promise<Booking | null> {
  const db = getDb()
  if (!db) return null
  const { data, error } = await db
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), cancel_reason: reason ?? '' })
    .eq('cancel_token', token)
    .in('status', ['confirmed','pending_payment'])
    .select()
    .single()
  if (error) { console.error('cancelByToken:', error); return null }
  return data as Booking
}

export async function getUpcomingBookings(limit = 50) {
  const db = getDb()
  if (!db) return []
  const { data } = await db
    .from('bookings')
    .select('*, meeting_types(name,duration_min)')
    .gte('starts_at', new Date().toISOString())
    .in('status', ['confirmed','pending_payment'])
    .order('starts_at', { ascending: true })
    .limit(limit)
  return data ?? []
}

export async function getPendingReminders(windowStart: string, windowEnd: string, field: 'reminder_24h_sent' | 'reminder_1h_sent') {
  const db = getDb()
  if (!db) return []
  const { data } = await db
    .from('bookings')
    .select('*, meeting_types(name,duration_min)')
    .eq('status', 'confirmed')
    .eq(field, false)
    .gte('starts_at', windowStart)
    .lte('starts_at', windowEnd)
  return data ?? []
}

export async function markReminderSent(id: string, field: 'reminder_24h_sent' | 'reminder_1h_sent') {
  const db = getDb()
  if (!db) return
  await db.from('bookings').update({ [field]: true }).eq('id', id)
}

export async function setAvailabilityRules(rules: { day_of_week: number; start_time: string; end_time: string }[]) {
  const db = getDb()
  if (!db) return false
  await db.from('availability_rules').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
  const { error } = await db.from('availability_rules').upsert(
    rules.map(r => ({ ...r, is_active: true })),
    { onConflict: 'day_of_week' }
  )
  return !error
}

export async function addBlockedDate(date: string, reason?: string) {
  const db = getDb()
  if (!db) return false
  const { error } = await db.from('blocked_dates').upsert({ blocked_date: date, reason }, { onConflict: 'blocked_date' })
  return !error
}

export async function removeBlockedDate(date: string) {
  const db = getDb()
  if (!db) return false
  const { error } = await db.from('blocked_dates').delete().eq('blocked_date', date)
  return !error
}
