import { NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getUpcomingBookings } from '@/lib/db/bookings'

export async function GET() {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await getUpcomingBookings(100)
  return NextResponse.json({ bookings })
}
