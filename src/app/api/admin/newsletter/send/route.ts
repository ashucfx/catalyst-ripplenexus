import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCookie } from '@/lib/auth/admin'
import { resend, FROM } from '@/lib/email/resend'
import { getActiveSubscribers, createCampaign, markCampaignSent } from '@/lib/db/newsletter'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''
const BATCH_SIZE = 50

export async function POST(req: NextRequest) {
  if (!await verifyAdminCookie()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { subject, html, segment } = await req.json()

    if (!subject || !html) {
      return NextResponse.json({ error: 'subject and html are required.' }, { status: 400 })
    }

    const campaignId = await createCampaign({ subject, html, segment })
    if (!campaignId) {
      return NextResponse.json({ error: 'Failed to create campaign record.' }, { status: 500 })
    }

    const subscribers = await getActiveSubscribers(segment)

    if (subscribers.length === 0) {
      await markCampaignSent(campaignId, 0)
      return NextResponse.json({ ok: true, sent: 0, campaignId })
    }

    let sent = 0

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)

      const emails = batch.map(sub => {
        const unsubUrl = `${BASE_URL}/api/unsubscribe?token=${sub.unsubscribe_token}`
        const unsubFooter = `<p style="margin:16px 0 0 0;font-family:Arial,sans-serif;font-size:10px;color:#8B8681;">
          <a href="${unsubUrl}" style="color:#8B8681;text-decoration:underline;">Unsubscribe</a>
          &nbsp;·&nbsp; Catalyst · Ripple Nexus
        </p>`

        return {
          from:    FROM,
          to:      sub.email,
          subject,
          html:    html + unsubFooter,
        }
      })

      const results = await Promise.allSettled(
        emails.map(e => resend.emails.send(e))
      )
      const ok = results.filter(r => r.status === 'fulfilled').length
      sent += ok
      const failed = results.length - ok
      if (failed > 0) console.error(`[newsletter/send] batch ${i / BATCH_SIZE}: ${failed} sends failed`)
    }

    await markCampaignSent(campaignId, sent)

    return NextResponse.json({ ok: true, sent, total: subscribers.length, campaignId })
  } catch (err) {
    console.error('[admin/newsletter/send]', err)
    return NextResponse.json({ error: 'Send failed.' }, { status: 500 })
  }
}
