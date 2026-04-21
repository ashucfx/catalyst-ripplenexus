import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rateLimit'
import { createBooking, getMeetingType, getAvailabilityRules, getBookingsForDate, getBlockedDates, getPendingBookingForUser } from '@/lib/db/bookings'
import { generateSlots } from '@/lib/schedule/slots'
import { resend } from '@/lib/email/resend'
import { bookingConfirmationClient, bookingConfirmationAdmin } from '@/lib/email/bookingTemplates'

const FROM    = `${process.env.RESEND_FROM_NAME ?? 'Catalyst'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@catalystripple.com'}>`
const ADMIN   = process.env.RESEND_ADMIN_EMAIL ?? ''

export async function POST(req: NextRequest) {
  const hdr = await headers()
  const ip  = hdr.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const rl  = await rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 }, 'schedule-book')
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  let body: {
    meetingTypeId: string
    startISO:      string
    name:          string
    email:         string
    company?:      string
    message?:      string
    timezone:      string
    honeypot?:     string
  }

  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.honeypot) return NextResponse.json({ ok: true })

  const { meetingTypeId, startISO, name, email, timezone } = body
  if (!meetingTypeId || !startISO || !name || !email || !timezone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
  }

  const meetingType = await getMeetingType(meetingTypeId)
  if (!meetingType) return NextResponse.json({ error: 'Unknown meeting type.' }, { status: 404 })

  // 1. Recover existing pending booking if it matches
  const pendingBooking = await getPendingBookingForUser(email, startISO)
  if (pendingBooking) {
    return NextResponse.json({
      bookingId:    pendingBooking.id,
      status:       pendingBooking.status,
      cancelToken:  pendingBooking.cancel_token,
      startISO:     pendingBooking.starts_at,
      endISO:       pendingBooking.ends_at,
      meetingName:  meetingType.name,
      durationMin:  meetingType.duration_min,
      isPaid:       meetingType.price_usd > 0,
      priceUSD:     meetingType.price_usd,
      priceINR:     meetingType.price_inr,
      recovered:    true,
    })
  }

  // 2. Validate slot is actually available
  const start   = new Date(startISO)
  const dateStr = start.toISOString().slice(0, 10)
  const [year, month] = dateStr.split('-').map(Number)

  const [rules, blocked, existingBookings] = await Promise.all([
    getAvailabilityRules(),
    getBlockedDates(year, month),
    getBookingsForDate(dateStr),
  ])

  const slots = generateSlots(dateStr, meetingType.duration_min, rules as never, existingBookings as never, blocked as never)
  const slot  = slots.find(s => s.startISO === startISO && s.available)
  if (!slot) return NextResponse.json({ error: 'Slot no longer available.' }, { status: 409 })

  const isPaid  = meetingType.price_usd > 0
  const status  = isPaid ? 'pending_payment' : 'confirmed'

  let booking;
  try {
    booking = await createBooking({
      meeting_type_id: meetingTypeId,
      name,
      email,
      company:        body.company,
      message:        body.message,
      starts_at:      slot.startISO,
      ends_at:        slot.endISO,
      timezone,
      status,
    })
  } catch (err: any) {
    if (err.message === 'This slot was just booked. Please select another time.') {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 })
  }

  if (!booking) return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 })

  // Send confirmation emails for free meetings immediately
  if (!isPaid && booking.cancel_token) {
    const clientTpl = bookingConfirmationClient({
      name,
      email,
      meetingName:   meetingType.name,
      durationMin:   meetingType.duration_min,
      startsAt:      start,
      timezone,
      cancelToken:   booking.cancel_token,
      meetingTypeId,
    })
    const adminTpl = bookingConfirmationAdmin({
      name,
      email,
      company:       body.company,
      message:       body.message,
      meetingName:   meetingType.name,
      durationMin:   meetingType.duration_min,
      startsAt:      start,
      timezone,
      cancelToken:   booking.cancel_token,
      meetingTypeId,
    })

    await Promise.allSettled([
      resend.emails.send({ from: FROM, to: email,  ...clientTpl }),
      ADMIN && resend.emails.send({ from: FROM, to: ADMIN, ...adminTpl }),
    ])
  }

  return NextResponse.json({
    bookingId:    booking.id,
    status:       booking.status,
    cancelToken:  booking.cancel_token,
    startISO:     slot.startISO,
    endISO:       slot.endISO,
    meetingName:  meetingType.name,
    durationMin:  meetingType.duration_min,
    isPaid,
    priceUSD:     meetingType.price_usd,
    priceINR:     meetingType.price_inr,
  })
}
