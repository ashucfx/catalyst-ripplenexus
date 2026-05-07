import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/supabase'
import { resend, FROM } from '@/lib/email/resend'
import { getActiveSubscribers, createCampaign, markCampaignSent } from '@/lib/db/newsletter'

const BASE_URL   = process.env.NEXT_PUBLIC_BASE_URL ?? ''
const BATCH_SIZE = 50

export async function POST(req: NextRequest) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB not configured.' }, { status: 500 })

  const { campaignId } = await req.json().catch(() => ({}))
  if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 })

  const { data: campaign, error } = await db
    .from('newsletters')
    .select('subject, html')
    .eq('id', campaignId)
    .single()

  if (error || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const { subject, html } = campaign
  const newId = await createCampaign({ subject, html })
  if (!newId) return NextResponse.json({ error: 'Failed to create campaign record' }, { status: 500 })

  const subscribers = await getActiveSubscribers()
  let sent = 0

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)
    const emails = batch.map(sub => {
      const unsubUrl    = `${BASE_URL}/api/unsubscribe?token=${sub.unsubscribe_token}`
      const unsubFooter = `<p style="margin:16px 0 0 0;font-family:Arial,sans-serif;font-size:10px;color:#8B8681;">
        <a href="${unsubUrl}" style="color:#8B8681;text-decoration:underline;">Unsubscribe</a>
        &nbsp;·&nbsp; Catalyst · Ripple Nexus
      </p>`
      return { from: FROM, to: sub.email, subject, html: html + unsubFooter }
    })
    const results = await Promise.allSettled(emails.map(e => resend.emails.send(e)))
    sent += results.filter(r => r.status === 'fulfilled').length
  }

  await markCampaignSent(newId, sent)
  return NextResponse.json({ ok: true, sent, total: subscribers.length })
}
