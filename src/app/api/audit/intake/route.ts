import { NextRequest, NextResponse } from 'next/server'
import { getPortal, saveReport } from '@/lib/db/portals'
import type { IntakeData } from '@/lib/db/portals'
import { generateAuditReport } from '@/lib/llm/report'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { token: string } & IntakeData

    const { token, ...intake } = body

    if (!token) {
      return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
    }

    const requiredFields: (keyof IntakeData)[] = [
      'name', 'title', 'seniority', 'yearsExperience',
      'compensation', 'currency', 'sector', 'geography',
      'targetRole', 'biggestChallenge', 'achievements',
    ]
    for (const field of requiredFields) {
      if (!intake[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    const portal = await getPortal(token)
    if (!portal) {
      return NextResponse.json({ error: 'Invalid portal.' }, { status: 404 })
    }
    if (portal.status === 'ready') {
      return NextResponse.json({ error: 'Report already generated.' }, { status: 409 })
    }

    const report = await generateAuditReport(intake)
    await saveReport(token, intake, report)

    resend.emails.send({
      from:    FROM,
      to:      ADMIN_EMAIL,
      subject: `Audit report generated — ${intake.name} — TPI ${report.tpi_score} (${report.tpi_tier})`,
      html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
        <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">AUDIT REPORT GENERATED</p>
        <p style="margin:0 0 4px;">Name: <strong>${intake.name}</strong></p>
        <p style="margin:0 0 4px;">Email: <a href="mailto:${portal.email}" style="color:#B8935B;">${portal.email}</a></p>
        <p style="margin:0 0 4px;">TPI Score: <strong>${report.tpi_score}/100 — ${report.tpi_tier}</strong></p>
        <p style="margin:0 0 4px;">Sector: ${intake.sector} · ${intake.geography}</p>
        <p style="margin:0;">Salary Gap: ${report.salary_benchmark.gap_percentage}% below market</p>
      </div>`,
    }).catch(e => console.error('[audit/intake] admin email failed:', e))

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[audit/intake]', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Report generation failed. Please try again.' }, { status: 500 })
  }
}
