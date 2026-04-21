import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/supabase'

export async function GET(req: NextRequest) {
  // Verify cron authorization
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB Unavailable' }, { status: 503 })

  // Find all pending_payment bookings older than 15 minutes
  const expiryTime = new Date(Date.now() - 15 * 60 * 1000).toISOString()

  const { data: expiredBookings, error: fetchError } = await db
    .from('bookings')
    .select('id, starts_at, email')
    .eq('status', 'pending_payment')
    .lt('created_at', expiryTime)

  if (fetchError) {
    console.error('[cron/cleanup] Error fetching expired bookings:', fetchError.message)
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!expiredBookings || expiredBookings.length === 0) {
    return NextResponse.json({ ok: true, deleted: 0 })
  }

  console.log(`[cron/cleanup] Found ${expiredBookings.length} expired pending bookings. Releasing slots.`)

  // Update them to cancelled to release the DB constraint lock but preserve record
  const idsToCancel = expiredBookings.map(b => b.id)
  
  const { error: deleteError } = await db
    .from('bookings')
    .update({ status: 'cancelled', cancel_reason: 'abandoned_checkout' })
    .in('id', idsToCancel)

  if (deleteError) {
    console.error('[cron/cleanup] Error deleting expired bookings:', deleteError.message)
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ 
    ok: true, 
    deleted: expiredBookings.length,
    released_slots: expiredBookings 
  })
}
