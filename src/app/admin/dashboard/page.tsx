import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getUpcomingBookings, getAvailabilityRules } from '@/lib/db/bookings'
import { ADMIN_TZ } from '@/lib/schedule/timezone'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin — Catalyst',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  // Defense-in-depth: enforce server-side auth verification in addition to middleware
  const isAuthenticated = await verifyAdminCookie()
  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  const [bookings, rules] = await Promise.all([
    getUpcomingBookings(50),
    getAvailabilityRules(),
  ])

  return (
    <AdminDashboard
      initialBookings={bookings as never[]}
      initialRules={rules as never[]}
      adminTZ={ADMIN_TZ}
    />
  )
}
