import { NextRequest, NextResponse } from 'next/server'
import { cancelByToken } from '@/lib/db/bookings'
import { getDb } from '@/lib/db/supabase'
import { resend } from '@/lib/email/resend'
import { bookingCancelledClient } from '@/lib/email/bookingTemplates'

const FROM = `${process.env.RESEND_FROM_NAME ?? 'Catalyst'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@catalystripple.com'}>`

export async function POST(req: NextRequest) {
  let body: { token: string; reason?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { token, reason } = body
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const booking = await cancelByToken(token, reason)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found, already cancelled, or token invalid.' }, { status: 404 })
  }

  // Fetch meeting type name
  const db = getDb()
  let meetingName = 'your session'
  if (db) {
    const { data: mt } = await db.from('meeting_types').select('name').eq('id', booking.meeting_type_id).single()
    if (mt) meetingName = mt.name
  }

  const tpl = bookingCancelledClient(booking.name, meetingName)
  await Promise.allSettled([
    resend.emails.send({ from: FROM, to: booking.email, ...tpl }),
  ])

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/book', req.url))
  }
  return NextResponse.json({ token })
}
