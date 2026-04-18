import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { subscribeToForm, CK_FORMS } from '@/lib/email/convertkit'
import { newsletterWelcomeEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limit: 3 submissions per IP per hour
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = rateLimit(ip, { limit: 3, windowMs: 60 * 60 * 1000 })
  if (!ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { email, honeypot } = body

    // Honeypot — bots fill this, humans don't see it
    if (honeypot) {
      return NextResponse.json({ success: true }) // silently accept to fool bots
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    const welcome = newsletterWelcomeEmail()

    const results = await Promise.allSettled([
      subscribeToForm({ formId: CK_FORMS.newsletter, email }),
      resend.emails.send({ from: FROM, to: email,        subject: welcome.subject, html: welcome.html }),
      resend.emails.send({ from: FROM, to: ADMIN_EMAIL,  subject: `New newsletter subscriber — ${email}`, html: `<p style="font-family:Arial;color:#F4F1EB;background:#0A0B0D;padding:24px;">New subscriber: <strong>${email}</strong></p>` }),
    ])

    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[newsletter] Task ${i} failed:`, r.reason)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
