import { NextRequest, NextResponse } from 'next/server'
import { confirmAndNotifyBooking } from '@/lib/booking/confirmAndNotify'

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

  const state = await confirmAndNotifyBooking(bookingId, paymentId, paymentMethod)

  if (state === 'already_confirmed') return NextResponse.json({ ok: true, message: 'Already processed' })
  if (state === 'collision')         return NextResponse.json({ error: 'Collision prevented, admin alerted' }, { status: 409 })
  if (state === 'error')             return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
