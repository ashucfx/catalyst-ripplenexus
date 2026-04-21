import { NextRequest, NextResponse } from 'next/server'
import { getAvailabilityRules, getBlockedDates, getBookingsForDate, getMeetingType } from '@/lib/db/bookings'
import { generateSlots } from '@/lib/schedule/slots'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const date = searchParams.get('date')   // 'YYYY-MM-DD'
  const type = searchParams.get('type') ?? 'audit'

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date required (YYYY-MM-DD)' }, { status: 400 })
  }

  const [year, month] = date.split('-').map(Number)

  const [meetingType, rules, blocked, bookings] = await Promise.all([
    getMeetingType(type),
    getAvailabilityRules(),
    getBlockedDates(year, month),
    getBookingsForDate(date),
  ])

  if (!meetingType) {
    return NextResponse.json({ error: 'Unknown meeting type' }, { status: 404 })
  }

  const slots = generateSlots(date, meetingType.duration_min, rules as never, bookings as never, blocked as never)

  return NextResponse.json({ slots, meetingType }, {
    headers: { 'Cache-Control': 'private, max-age=30' },
  })
}
