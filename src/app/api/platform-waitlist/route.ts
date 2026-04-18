import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { rateLimit } from '@/lib/rateLimit'
import { insertPlatformWaitlist } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const ip     = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 3, windowMs: 60 * 60 * 1000 }, 'platform-waitlist')
  if (!ok) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  try {
    const { email, plan, honeypot } = await req.json()

    if (honeypot) return NextResponse.json({ success: true })

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
    }

    await Promise.all([
      insertPlatformWaitlist(email, plan),
      resend.emails.send({
        from:    FROM,
        to:      email,
        subject: 'You\'re on the Catalyst Platform waitlist',
        html: `<div style="font-family:Arial;background:#0A0B0D;color:#F4F1EB;padding:32px;max-width:600px;">
          <p style="color:#B8935B;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 16px;">CATALYST PLATFORM</p>
          <h1 style="font-size:24px;font-weight:300;margin:0 0 16px;color:#F4F1EB;">You&rsquo;re on the list.</h1>
          <p style="color:#8B8681;font-size:15px;line-height:1.6;margin:0 0 16px;">
            We&rsquo;ll notify you when the Catalyst Intelligence Platform opens for early access${plan ? ` — ${plan} tier` : ''}.
            Early access members lock in launch pricing permanently.
          </p>
          <p style="color:#8B8681;font-size:15px;line-height:1.6;margin:0;">
            In the meantime, the free TPI score calculator is live at
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/tpi" style="color:#B8935B;">catalystripple.com/tpi</a>.
          </p>
        </div>`,
      }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `Platform waitlist — ${plan ?? 'unspecified'} — ${email}`,
        html:    `<p style="font-family:Arial;color:#F4F1EB;background:#0A0B0D;padding:24px;">Waitlist: <strong>${email}</strong> — plan: ${plan ?? '—'}</p>`,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[platform-waitlist/route]', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
