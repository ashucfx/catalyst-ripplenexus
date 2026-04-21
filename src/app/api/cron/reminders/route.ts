import { NextRequest, NextResponse } from 'next/server'
import { getPendingReminders, markReminderSent } from '@/lib/db/bookings'
import { resend } from '@/lib/email/resend'
import { bookingReminder } from '@/lib/email/bookingTemplates'

const FROM = `${process.env.RESEND_FROM_NAME ?? 'Catalyst'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@catalystripple.com'}>`

export async function GET(req: NextRequest) {
  // Vercel cron — validate authorization header
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // 24-hour reminders: sessions starting 23–25 hours from now
  const h24Start = new Date(now.getTime() + 23 * 3_600_000).toISOString()
  const h24End   = new Date(now.getTime() + 25 * 3_600_000).toISOString()

  // 1-hour reminders: sessions starting 50–70 minutes from now
  const h1Start  = new Date(now.getTime() + 50 * 60_000).toISOString()
  const h1End    = new Date(now.getTime() + 70 * 60_000).toISOString()

  const [pending24h, pending1h] = await Promise.all([
    getPendingReminders(h24Start, h24End, 'reminder_24h_sent'),
    getPendingReminders(h1Start,  h1End,  'reminder_1h_sent'),
  ])

  const results: { id: string; type: string; sent: boolean }[] = []

  for (const booking of pending24h) {
    const mt = booking.meeting_types as { name: string; duration_min: number }
    const tpl = bookingReminder({
      name:          booking.name,
      email:         booking.email,
      meetingName:   mt.name,
      durationMin:   mt.duration_min,
      startsAt:      new Date(booking.starts_at),
      timezone:      booking.timezone,
      cancelToken:   booking.cancel_token ?? '',
      meetingTypeId: booking.meeting_type_id,
    }, '24 hours')
    const { error } = await resend.emails.send({ from: FROM, to: booking.email, ...tpl })
    if (!error) await markReminderSent(booking.id, 'reminder_24h_sent')
    results.push({ id: booking.id, type: '24h', sent: !error })
  }

  for (const booking of pending1h) {
    const mt = booking.meeting_types as { name: string; duration_min: number }
    const tpl = bookingReminder({
      name:          booking.name,
      email:         booking.email,
      meetingName:   mt.name,
      durationMin:   mt.duration_min,
      startsAt:      new Date(booking.starts_at),
      timezone:      booking.timezone,
      cancelToken:   booking.cancel_token ?? '',
      meetingTypeId: booking.meeting_type_id,
    }, '1 hour')
    const { error } = await resend.emails.send({ from: FROM, to: booking.email, ...tpl })
    if (!error) await markReminderSent(booking.id, 'reminder_1h_sent')
    results.push({ id: booking.id, type: '1h', sent: !error })
  }

  return NextResponse.json({ processed: results.length, results })
}
