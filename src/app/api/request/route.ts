import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { requestAdminEmail, requestUserEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limit: 2 submissions per IP per hour (high-ticket form, not a newsletter)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = rateLimit(ip, { limit: 2, windowMs: 60 * 60 * 1000 })
  if (!ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { name, email, role, seniority, geography, goals, service, context, timeline, referral, honeypot } = body

    // Honeypot
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !role?.trim() || !seniority || !geography || !service) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const data  = { name, email, role, seniority, geography, goals: goals ?? [], service, context: context ?? '', timeline: timeline ?? '', referral: referral ?? '' }
    const admin = requestAdminEmail(data)
    const user  = requestUserEmail(name, service)

    const results = await Promise.allSettled([
      resend.emails.send({ from: FROM, to: ADMIN_EMAIL, replyTo: email, subject: admin.subject, html: admin.html }),
      resend.emails.send({ from: FROM, to: email, subject: user.subject, html: user.html }),
    ])

    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[request] Task ${i} failed:`, r.reason)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[request/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
