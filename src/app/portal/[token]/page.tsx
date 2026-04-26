import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPortal } from '@/lib/db/portals'
import { IntakeForm } from '@/components/portal/IntakeForm'
import { ReportView } from '@/components/portal/ReportView'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> },
): Promise<Metadata> {
  const { token } = await params
  const portal    = await getPortal(token)
  if (!portal) return { title: 'Portal Not Found' }
  const name = portal.intake_data?.name
  return {
    title: name
      ? `${name} — Catalyst Market Value Audit`
      : 'Catalyst Market Value Audit Portal',
    robots: { index: false, follow: false },
  }
}

export default async function PortalPage(
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const portal    = await getPortal(token)

  if (!portal) notFound()

  return (
    <>
      <Header />
      <main className="pt-40 pb-32 grain">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {portal.status === 'ready' && portal.intake_data && portal.report_data ? (
            <ReportView
              token={token}
              intake={portal.intake_data}
              report={portal.report_data}
            />
          ) : (
            <IntakeForm token={token} />
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
