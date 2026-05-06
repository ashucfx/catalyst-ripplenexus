import { confirmBooking } from '@/lib/db/bookings'
import { getDb } from '@/lib/db/supabase'
import { resend } from '@/lib/email/resend'
import { bookingConfirmationClient, bookingConfirmationAdmin } from '@/lib/email/bookingTemplates'

const FROM  = `${process.env.RESEND_FROM_NAME ?? 'Catalyst'} <${process.env.RESEND_FROM_EMAIL ?? 'catalyst@theripplenexus.com'}>`
const ADMIN = process.env.RESEND_ADMIN_EMAIL ?? ''

export type ConfirmResult = 'success' | 'collision' | 'error' | 'already_confirmed'

/**
 * Confirms a booking and sends all notification emails in one shot.
 * Call this directly from webhook handlers instead of via HTTP self-call.
 * Handles idempotency, collision detection, and admin alerts internally.
 */
export async function confirmAndNotifyBooking(
  bookingId: string,
  paymentId: string,
  paymentMethod: string,
): Promise<ConfirmResult> {
  const state = await confirmBooking(bookingId, paymentId, paymentMethod)

  if (state === 'already_confirmed') return 'already_confirmed'

  if (state === 'collision') {
    await resend.emails.send({
      from: FROM,
      to:   ADMIN,
      subject: `CRITICAL: Late Payment Collision (Booking ${bookingId})`,
      html: `<div style="font-family:Arial;background:#5F0B0B;color:#FFF;padding:24px;">
        <h2>Action Required: Double Booking Prevented</h2>
        <p>A delayed payment (${paymentId}) was confirmed via webhook.</p>
        <p>The 15-min TTL had already cancelled the booking and another user claimed the slot.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>Money was deposited. Manually contact the user to refund or reschedule.</p>
      </div>`,
    }).catch(e => console.error('[confirmAndNotify] Collision admin email failed:', e))
    return 'collision'
  }

  if (state === 'error') return 'error'

  // Send confirmation emails
  const db = getDb()
  if (db) {
    const { data: booking } = await db
      .from('bookings')
      .select('*, meeting_types(name,duration_min)')
      .eq('id', bookingId)
      .single()

    if (booking?.cancel_token) {
      const mt    = booking.meeting_types as { name: string; duration_min: number }
      const start = new Date(booking.starts_at)

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

  return 'success'
}
