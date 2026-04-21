import { NextRequest, NextResponse } from 'next/server'
import { getAvailabilityRules, getBlockedDates, getBookingsForMonth, getMeetingType } from '@/lib/db/bookings'
import { getAvailableDaysInMonth } from '@/lib/schedule/slots'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const year  = parseInt(searchParams.get('year')  ?? '0', 10)
  const month = parseInt(searchParams.get('month') ?? '0', 10)
  const type  = searchParams.get('type') ?? 'audit'

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: 'year and month required' }, { status: 400 })
  }

  const [meetingType, rules, blocked, bookings] = await Promise.all([
    getMeetingType(type),
    getAvailabilityRules(),
    getBlockedDates(year, month),
    getBookingsForMonth(year, month),
  ])

  if (!meetingType) {
    return NextResponse.json({ error: 'Unknown meeting type' }, { status: 404 })
  }

  const availableDays = getAvailableDaysInMonth(
    year, month, rules as never, bookings as never, blocked as never, meetingType.duration_min
  )

  return NextResponse.json({ availableDays }, {
    headers: { 'Cache-Control': 'private, max-age=60' },
  })
}
