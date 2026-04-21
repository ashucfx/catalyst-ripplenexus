import { redirect } from 'next/navigation'
import { verifyAdminCookie } from '@/lib/auth/admin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await verifyAdminCookie()
  if (!authed) redirect('/admin/login')
  return <>{children}</>
}
