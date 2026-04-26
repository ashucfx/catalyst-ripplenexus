import { NextRequest, NextResponse } from 'next/server'
import { getPortal } from '@/lib/db/portals'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportDocument } from '@/lib/pdf/ReportPdf'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  const portal = await getPortal(token)
  if (!portal || portal.status !== 'ready' || !portal.intake_data || !portal.report_data) {
    return new NextResponse('Report not found.', { status: 404 })
  }

  const buffer = await renderToBuffer(
    <ReportDocument intake={portal.intake_data} report={portal.report_data} />,
  )

  const safeName = portal.intake_data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const filename  = `catalyst-audit-${safeName}.pdf`

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control':       'private, no-store',
    },
  })
}
