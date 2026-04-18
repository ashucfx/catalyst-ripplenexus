import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { subscribeToForm, CK_FORMS } from '@/lib/email/convertkit'
import { newsletterWelcomeEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'
import { insertNewsletterSubscriber } from '@/lib/db/supabase'

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

    const welcome = newsletterWelcomeEmail()

    const [results] = await Promise.all([
      Promise.allSettled([
        subscribeToForm({ formId: CK_FORMS.newsletter, email }),
        resend.emails.send({ from: FROM, to: email, subject: welcome.subject, html: welcome.html }),
        resend.emails.send({
          from: FROM, to: ADMIN_EMAIL,
          subject: `New newsletter subscriber — ${email}`,
          html: `<p style="font-family:Arial;color:#F4F1EB;background:#0A0B0D;padding:24px;">New subscriber: <strong>${email}</strong></p>`,
        }),
      ]),
      insertNewsletterSubscriber(email),
    ])

    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[newsletter] task ${i} failed:`, r.reason)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
