import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { platformWaitlistEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'
import { insertPlatformWaitlist } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 3, windowMs: 60 * 60 * 1000 }, 'platform-waitlist')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { email, plan, phone, honeypot } = await req.json()

    if (honeypot) return NextResponse.json({ success: true })

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    const welcome = platformWaitlistEmail(plan)

    await Promise.all([
      insertPlatformWaitlist(email, plan, phone || undefined),
      resend.emails.send({
        from:    FROM,
        to:      email,
        subject: welcome.subject,
        html:    welcome.html,
      }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `Platform waitlist — ${plan ?? 'unspecified'} — ${email}`,
        html: `<p style="font-family:Arial;color:#F4F1EB;background:#0A0B0D;padding:24px;">
          Waitlist: <strong>${email}</strong><br/>
          Plan: ${plan ?? '—'}<br/>
          Phone: ${phone ?? '—'}
        </p>`,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[platform-waitlist/route]', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg || 'Something went wrong.' }, { status: 500 })
  }
}
