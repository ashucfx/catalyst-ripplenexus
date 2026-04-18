import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { requestAdminEmail, requestUserEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'
import { insertLead } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 2, windowMs: 60 * 60 * 1000 }, 'request')
  if (!ok) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const body = await req.json()
    const { name, email, role, seniority, geography, goals, service, context, timeline, referral, honeypot } = body

    if (honeypot) return NextResponse.json({ success: true })

    if (!name?.trim() || !email?.trim() || !role?.trim() || !seniority || !geography || !service) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const data  = { name, email, role, seniority, geography, goals: goals ?? [], service, context: context ?? '', timeline: timeline ?? '', referral: referral ?? '' }
    const admin = requestAdminEmail(data)
    const user  = requestUserEmail(name, service)

    await Promise.all([
      Promise.allSettled([
        resend.emails.send({ from: FROM, to: ADMIN_EMAIL, replyTo: email, subject: admin.subject, html: admin.html }),
        resend.emails.send({ from: FROM, to: email, subject: user.subject, html: user.html }),
      ]),
      insertLead(data),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[request/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
