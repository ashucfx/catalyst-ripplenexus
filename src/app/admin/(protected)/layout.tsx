import { redirect } from 'next/navigation'
import { verifyAdminCookie } from '@/lib/auth/admin'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await verifyAdminCookie()
  if (!authed) redirect('/admin/login')
  return <>{children}</>
}
