import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { newsletterWelcomeEmail } from '@/lib/email/templates'
import { upsertSubscriber } from '@/lib/db/newsletter'
import { rateLimit } from '@/lib/rateLimit'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 3, windowMs: 60 * 60 * 1000 }, 'newsletter')
  if (!ok) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const { email, honeypot } = await req.json()

    if (honeypot) return NextResponse.json({ success: true })

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    const result = await upsertSubscriber({ email, source: 'newsletter_form', tags: ['newsletter'] })

    // Respect prior opt-out — don't send welcome email to unsubscribed addresses
    if (result && result.status !== 'unsubscribed') {
      const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?token=${result.token}`
      const welcome        = newsletterWelcomeEmail(unsubscribeUrl)

      await Promise.allSettled([
        resend.emails.send({ from: FROM, to: email, subject: welcome.subject, html: welcome.html }),
        resend.emails.send({
          from: FROM, to: ADMIN_EMAIL,
          subject: `New newsletter subscriber — ${email}`,
          html: `<p style="font-family:Arial;color:#F4F1EB;background:#0A0B0D;padding:24px;">New subscriber: <strong>${email}</strong>${result.isNew ? '' : ' (returning)'}</p>`,
        }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
