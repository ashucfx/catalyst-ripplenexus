import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { renderCampaign, type TemplateId } from '@/lib/email/campaigns'

export async function POST(req: NextRequest) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { templateId, vars } = body as { templateId?: TemplateId; vars?: Record<string, string> }

  if (!templateId || !vars) {
    return NextResponse.json({ error: 'templateId and vars required' }, { status: 400 })
  }

  try {
    const result = renderCampaign(templateId, vars)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}
