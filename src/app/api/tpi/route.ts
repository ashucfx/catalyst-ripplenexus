import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { subscribeToForm, CK_FORMS } from '@/lib/email/convertkit'
import { tpiScoreEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'
import { insertTpiSubmission } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 }, 'tpi')
  if (!ok) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const body = await req.json()
    const { email, score, gaps, message, annualCost, answers, honeypot } = body

    if (honeypot) return NextResponse.json({ success: true })

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json({ error: 'Invalid score.' }, { status: 400 })
    }

    const template = tpiScoreEmail({ email, score, gaps, message, annualCost, answers })

    await Promise.all([
      Promise.allSettled([
        resend.emails.send({ from: FROM, to: email, subject: template.subject, html: template.html }),
        subscribeToForm({
          formId: CK_FORMS.tpiLeads,
          email,
          fields: {
            tpi_score:   String(score),
            seniority:   answers?.seniority  ?? '',
            geography:   answers?.geography  ?? '',
            salary_band: answers?.salaryBand ?? '',
            last_raise:  answers?.lastRaise  ?? '',
            sector:      answers?.sector     ?? '',
          },
        }),
        resend.emails.send({
          from: FROM, to: ADMIN_EMAIL,
          subject: `New TPI Lead — Score ${score}/100 — ${email}`,
          html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:24px;">
            <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">TPI LEAD</p>
            <p style="font-size:20px;margin:0 0 16px;">Score: <strong style="color:#B8935B;">${score}/100</strong></p>
            <p style="margin:0 0 4px;">Email: <a href="mailto:${email}" style="color:#B8935B;">${email}</a></p>
            <p style="margin:0 0 4px;">Seniority: ${answers?.seniority ?? '—'}</p>
            <p style="margin:0 0 4px;">Geography: ${answers?.geography ?? '—'}</p>
            <p style="margin:0 0 4px;">Salary band: ${answers?.salaryBand ?? '—'}</p>
            <p style="margin:0 0 4px;">Last raise: ${answers?.lastRaise ?? '—'}</p>
            <p style="margin:0;">Sector: ${answers?.sector ?? '—'}</p>
          </div>`,
        }),
      ]),
      insertTpiSubmission({
        email,
        score,
        seniority:  answers?.seniority  ?? '',
        geography:  answers?.geography  ?? '',
        salaryBand: answers?.salaryBand ?? '',
        lastRaise:  answers?.lastRaise  ?? '',
        sector:     answers?.sector     ?? '',
        gaps:       gaps ?? [],
        annualCost: annualCost ?? '',
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[tpi/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
