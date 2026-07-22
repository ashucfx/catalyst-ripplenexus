import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM, ADMIN_EMAIL } from '@/lib/email/resend'
import { requestAdminEmail, requestUserEmail } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rateLimit'
import { insertLead } from '@/lib/db/supabase'
import { syncLeadToClientForge } from '@/lib/clientforge/clientforge'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { ok } = await rateLimit(ip, { limit: 10, windowMs: 60 * 60 * 1000 }, 'request')
  if (!ok) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      countryCode,
      countryName,
      role,
      seniority,
      geography,
      goals,
      service,
      packageSlug,
      servicesRequested,
      context,
      timeline,
      referral,
      honeypot,
    } = body

    if (honeypot) return NextResponse.json({ success: true })

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const leadRole = role || 'Senior Leader'
    const leadSeniority = seniority || '9-15 yrs'
    const leadGeo = geography || countryName || 'Global'
    const leadService = service || packageSlug || 'Career Booster Package'

    const data = {
      name: name.trim(),
      email: email.trim(),
      phone: phone || '',
      role: leadRole,
      seniority: leadSeniority,
      geography: leadGeo,
      goals: goals ?? [],
      service: leadService,
      context: context ?? '',
      timeline: timeline ?? '',
      referral: referral ?? '',
    }

    const admin = requestAdminEmail(data)
    const user = requestUserEmail(name, leadService)

    // Execute ClientForge CRM sync, local DB save, and Resend emails concurrently
    const [clientForgeRes] = await Promise.all([
      syncLeadToClientForge({
        name,
        email,
        phone: phone || '+10000000000',
        countryCode: countryCode || 'IN',
        countryName: countryName || 'India',
        experienceLevel: leadSeniority,
        services: servicesRequested || [leadService],
        packageSlug: packageSlug || 'CAREER_BOOSTER',
        targetRole: leadRole,
        requirementNotes: `[Market: ${leadGeo}] Goals: ${Array.isArray(goals) ? goals.join(', ') : ''}. Context: ${context || ''}`,
      }),
      insertLead(data).catch((err) => console.warn('[Supabase Lead Insert Warning]:', err)),
      Promise.allSettled([
        resend.emails.send({ from: FROM, to: ADMIN_EMAIL, replyTo: email, subject: admin.subject, html: admin.html }).catch(() => null),
        resend.emails.send({ from: FROM, to: email, subject: user.subject, html: user.html }).catch(() => null),
      ]),
    ])

    return NextResponse.json({
      success: true,
      message: 'Strategic Consultation Request received. Our team will reach out shortly.',
      clientForgeSynced: clientForgeRes.success,
    })
  } catch (err) {
    console.error('[request/route]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
