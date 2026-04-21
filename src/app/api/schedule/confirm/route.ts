import { NextRequest, NextResponse } from 'next/server'
import { confirmBooking } from '@/lib/db/bookings'
import { getDb } from '@/lib/db/supabase'
import { resend } from '@/lib/email/resend'
import { bookingConfirmationClient, bookingConfirmationAdmin } from '@/lib/email/bookingTemplates'

const FROM  = `${process.env.RESEND_FROM_NAME ?? 'Catalyst'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@www.catalyst.theripplenexus.com'}>`
const ADMIN = process.env.RESEND_ADMIN_EMAIL ?? ''

/** Called by payment routes after successful payment capture */
export async function POST(req: NextRequest) {
  let body: { bookingId: string; paymentId: string; paymentMethod: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { bookingId, paymentId, paymentMethod } = body
  if (!bookingId || !paymentId || !paymentMethod) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const state = await confirmBooking(bookingId, paymentId, paymentMethod)
  
  if (state === 'already_confirmed') {
    return NextResponse.json({ ok: true, message: 'Already processed' })
  }

  if (state === 'collision') {
    // Rescue Protocol Safefall: Payment arrived, but slot is taken.
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `🚨 CRITICAL: Late Payment Collision (Booking ${bookingId})`,
      html: `<div style="font-family:Arial;background:#5F0B0B;color:#FFF;padding:24px;">
        <h2>Action Required: Double Booking Prevented</h2>
        <p>A delayed payment (${paymentId}) was just confirmed via webhook.</p>
        <p>However, the 15-min TTL had already cancelled the booking, and another user has since claimed the calendar slot.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>The money has been deposited. You must manually contact the user to refund or reschedule.</p>
      </div>`
    }).catch(e => console.error('[schedule/confirm] Rescue email failed', e))
    return NextResponse.json({ error: 'Collision prevented, admin alerted' }, { status: 409 })
  }
  
  if (state === 'error') return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  // Fetch full booking for email
  const db = getDb()
  if (db) {
    const { data: booking } = await db
      .from('bookings')
      .select('*, meeting_types(name,duration_min,price_usd)')
      .eq('id', bookingId)
      .single()

    if (booking && booking.cancel_token) {
      const mt     = booking.meeting_types as { name: string; duration_min: number }
      const start  = new Date(booking.starts_at)

      const clientTpl = bookingConfirmationClient({
        name:          booking.name,
        email:         booking.email,
        meetingName:   mt.name,
        durationMin:   mt.duration_min,
        startsAt:      start,
        timezone:      booking.timezone,
        cancelToken:   booking.cancel_token,
        meetingTypeId: booking.meeting_type_id,
      })
      const adminTpl = bookingConfirmationAdmin({
        name:          booking.name,
        email:         booking.email,
        company:       booking.company,
        message:       booking.message,
        meetingName:   mt.name,
        durationMin:   mt.duration_min,
        startsAt:      start,
        timezone:      booking.timezone,
        cancelToken:   booking.cancel_token,
        meetingTypeId: booking.meeting_type_id,
      })

      await Promise.allSettled([
        resend.emails.send({ from: FROM, to: booking.email, ...clientTpl }),
        ADMIN && resend.emails.send({ from: FROM, to: ADMIN, ...adminTpl }),
      ])
    }
  }

  return NextResponse.json({ ok: true })
}
