// ─── Brand tokens (inline — email clients strip <style> tags) ─────────
const C = {
  obsidian:   '#0A0B0D',
  bone:       '#F4F1EB',
  graphite:   '#1F2226',
  muted:      '#8C8C96',
  gold:       '#C5A059',
  goldGradient: '#D4AF37',
  parchment:  '#E6DFD1',
}

const SITE_URL  = 'https://www.catalyst.theripplenexus.com'
const CLIENTFORGE_URL = 'https://clientforge.theripplenexus.com'

// ─── Shared wrapper ────────────────────────────────────────────────────
function wrap(body: string, unsubscribeUrl?: string): string {
  const unsubBlock = unsubscribeUrl
    ? `<a href="${unsubscribeUrl}" style="font-family:Arial,sans-serif;font-size:9px;color:${C.muted};text-decoration:underline;letter-spacing:0.12em;text-transform:uppercase;">Unsubscribe</a>`
    : ''

  const footerLinks = [
    `<a href="${SITE_URL}" style="font-family:Arial,sans-serif;font-size:9px;color:${C.gold};text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">Catalyst Web →</a>`,
    `<a href="${CLIENTFORGE_URL}/checkout" style="font-family:Arial,sans-serif;font-size:9px;color:${C.gold};text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">ClientForge Portal →</a>`,
    unsubBlock,
  ].filter(Boolean).join(`<span style="font-family:Arial,sans-serif;font-size:9px;color:${C.graphite};padding:0 10px;">·</span>`)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catalyst by Ripple Nexus</title>
</head>
<body style="margin:0;padding:0;background-color:${C.obsidian};font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.obsidian};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0d0e12;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;padding:32px;">

          <!-- Header with Brand Mark -->
          <tr>
            <td style="padding:0 0 24px 0;border-bottom:1px solid ${C.graphite};">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="vertical-align:middle;width:24px;padding-right:12px;">
                    <!-- Reliable Brand Icon -->
                    <img src="${SITE_URL}/logo-email.svg" width="24" height="24" alt="Catalyst" style="display:block;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:${C.bone};letter-spacing:-0.01em;font-weight:700;">CATALYST</p>
                    <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:8px;color:${C.muted};letter-spacing:0.35em;text-transform:uppercase;">BY RIPPLE NEXUS</p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Executive Portal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 0;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0;">

              <!-- Diamond divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid ${C.graphite};width:45%;"></td>
                  <td style="text-align:center;padding:0 12px;white-space:nowrap;vertical-align:top;padding-top:-1px;">
                    <p style="margin:-7px 0 0;font-family:Arial,sans-serif;font-size:12px;color:${C.gold};">◈</p>
                  </td>
                  <td style="border-top:1px solid ${C.graphite};width:45%;"></td>
                </tr>
              </table>

              <!-- Brand strip -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:18px 0 10px;text-align:center;">
                    <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:8px;color:${C.muted};letter-spacing:0.3em;text-transform:uppercase;">
                      CATALYST &nbsp;·&nbsp; RIPPLE NEXUS &nbsp;·&nbsp; GCC &nbsp;·&nbsp; ASEAN &nbsp;·&nbsp; APAC &nbsp;·&nbsp; GLOBAL
                    </p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:${C.muted};font-style:italic;">
                      High-authority positioning for executive career growth.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0 18px;text-align:center;">
                    ${footerLinks}
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid ${C.graphite};padding:12px 0;text-align:center;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:#4a4a50;letter-spacing:0.05em;">
                      © 2026 Ripple Nexus. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Row helper for data tables ─────────────────────────────────────────
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 16px 10px 0;border-bottom:1px solid ${C.graphite};
                 font-family:Arial,sans-serif;font-size:10px;color:${C.muted};
                 letter-spacing:0.15em;text-transform:uppercase;vertical-align:top;
                 white-space:nowrap;width:160px;">
        ${label}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${C.graphite};
                 font-family:Georgia,serif;font-size:14px;color:${C.bone};vertical-align:top;">
        ${value}
      </td>
    </tr>`
}

// ─── CTA button helper ──────────────────────────────────────────────────
function cta(text: string, href: string): string {
  return `
    <a href="${href}"
       style="display:inline-block;background:linear-gradient(135deg, #D4AF37 0%, #C5A059 100%);color:#0A0B0D;
              padding:12px 28px;font-family:Arial,sans-serif;font-size:11px;
              letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;
              font-weight:700;border-radius:24px;margin-top:12px;">
      ${text}
    </a>`
}

// ═══════════════════════════════════════════════════════════════════════
// 1. ADMIN NOTIFICATION — new request form submission
// ═══════════════════════════════════════════════════════════════════════

type RequestData = {
  name: string
  email: string
  phone?: string
  role: string
  seniority: string
  geography: string
  goals: string[]
  service: string
  context: string
  timeline: string
  referral: string
}

export function requestAdminEmail(d: RequestData): { subject: string; html: string } {
  const subject = `[ClientForge CRM] New Lead — ${d.name}, ${d.role}`

  const html = wrap(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;font-weight:700;">
      NEW STRATEGY CONSULTATION ENQUIRY
    </p>
    <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:24px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;">
      ${d.name}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${row('Name',      d.name)}
      ${row('Email',     `<a href="mailto:${d.email}" style="color:${C.gold};text-decoration:none;">${d.email}</a>`)}
      ${row('Phone',     d.phone || 'Not provided')}
      ${row('Role',      d.role)}
      ${row('Seniority', d.seniority)}
      ${row('Geography', d.geography)}
      ${row('Service',   d.service)}
      ${row('Timeline',  d.timeline || 'Immediate')}
      ${row('Goals',     d.goals.join('<br/>') || '—')}
    </table>

    ${d.context ? `
      <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
                 color:${C.muted};letter-spacing:0.2em;text-transform:uppercase;">
        CANDIDATE NOTES
      </p>
      <p style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:15px;
                 color:${C.parchment};line-height:1.7;font-style:italic;
                 border-left:2px solid ${C.gold};padding-left:16px;">
        &ldquo;${d.context}&rdquo;
      </p>
    ` : ''}

    <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:12px;color:${C.muted};">
      Lead synced automatically to ClientForge CRM &amp; Leads Flywheel.
    </p>
    ${cta('Open ClientForge CRM ↗', 'https://clientforge.theripplenexus.com')}
  `)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 2. USER AUTO-REPLY — request form acknowledgement
// ═══════════════════════════════════════════════════════════════════════

export function requestUserEmail(name: string, service: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0]
  const subject   = `Your Catalyst Strategy Consultation — Registered`

  const html = wrap(`
    <p style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:26px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">
      Hello ${firstName},<br/>
      <em style="color:${C.gold};">Your consultation request is registered.</em>
    </p>

    <p style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:15px;
               color:${C.muted};line-height:1.7;">
      A Catalyst Executive Architect is reviewing your profile for <strong style="color:${C.bone};">${service}</strong>.
      Our team will contact you within <span style="color:${C.bone};">24 business hours</span> to schedule your 1-on-1 strategy call.
    </p>

    <div style="background-color:#16181f;border:1px solid ${C.gold};border-radius:8px;padding:20px;margin-bottom:28px;text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;color:${C.gold};letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">
        ⚡ INSTANT SELF-SERVICE BOOKING AVAILABLE
      </p>
      <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:14px;color:${C.bone};">
        Prefer to pick a time right now or complete self-service checkout?
      </p>
      ${cta('Book Strategy Session Now ↗', `${SITE_URL}/book`)}
    </div>

    <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:13px;
               color:${C.muted};line-height:1.6;font-style:italic;">
      All enquiries are handled with strict executive confidentiality. Your information is never shared.
    </p>
  `)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 3. TPI SCORE EMAIL — sent to user after calculator
// ═══════════════════════════════════════════════════════════════════════

type TPIEmailData = {
  email:      string
  score:      number
  gaps:       string[]
  message:    string
  annualCost: string
  answers: {
    seniority:  string
    geography:  string
    salaryBand: string
    lastRaise:  string
    sector:     string
  }
}

export function tpiScoreEmail(d: TPIEmailData, unsubscribeUrl?: string): { subject: string; html: string } {
  const subject   = `Your TPI Score: ${d.score}/100`
  const scoreColor = d.score >= 65 ? C.gold : d.score >= 50 ? C.parchment : '#e07070'

  const scoreLabel =
    d.score >= 65 ? 'Above average — gap remains'
    : d.score >= 50 ? 'Below your potential'
    : 'Significant gap identified'

  const html = wrap(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
      YOUR TALENT POSITIONING INDEX
    </p>

    <!-- Score display -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="padding-right:24px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:72px;
                     color:${scoreColor};font-weight:300;line-height:1;letter-spacing:-0.03em;">
            ${d.score}
          </p>
          <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:10px;
                     color:${C.muted};letter-spacing:0.15em;text-transform:uppercase;">
            OUT OF 100
          </p>
        </td>
        <td style="vertical-align:middle;padding-left:8px;border-left:1px solid ${C.graphite};">
          <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:18px;
                     color:${C.bone};font-weight:400;line-height:1.3;">
            ${scoreLabel}
          </p>
          <p style="margin:0;font-family:Georgia,serif;font-size:14px;
                     color:${C.muted};line-height:1.6;">
            ${d.message}
          </p>
        </td>
      </tr>
    </table>

    <!-- Annual cost callout -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background-color:${C.graphite};margin-bottom:32px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:10px;
                     color:${C.muted};letter-spacing:0.2em;text-transform:uppercase;">
            ESTIMATED ANNUAL COST OF THIS GAP
          </p>
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;
                     color:${C.gold};font-weight:400;">
            ${d.annualCost} per year
          </p>
        </td>
      </tr>
    </table>

    <!-- Gaps -->
    ${d.gaps.length > 0 ? `
      <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:10px;
                 color:${C.gold};letter-spacing:0.25em;text-transform:uppercase;">
        GAPS IDENTIFIED
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        ${d.gaps.map(g => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid ${C.graphite};">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:16px;vertical-align:top;padding-top:2px;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:${C.gold};">—</p>
                  </td>
                  <td>
                    <p style="margin:0;font-family:Georgia,serif;font-size:14px;
                               color:${C.muted};line-height:1.5;">${g}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `).join('')}
      </table>
    ` : ''}

    ${cta('Request Market Value Audit →', `${SITE_URL}/audit`)}
  `, unsubscribeUrl)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 4. NEWSLETTER WELCOME
// ═══════════════════════════════════════════════════════════════════════

export function newsletterWelcomeEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  const subject = `Intelligence Brief — access confirmed`

  const html = wrap(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
      ACCESS CONFIRMED
    </p>

    <p style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:30px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.15;">
      The Intelligence Brief<br/>
      <em style="color:${C.gold};">is now on record.</em>
    </p>

    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:16px;
               color:${C.muted};line-height:1.75;">
      Every Thursday, the Catalyst Intelligence Brief reaches senior professionals across
      India, the UAE, Singapore, and global markets with original analysis you will not
      find in a LinkedIn feed — compensation movement, sector heat maps, AI displacement
      curves, and positioning intelligence written for leaders, not job seekers.
    </p>

    ${cta('Get Free TPI Score →', `${SITE_URL}/tpi`)}
  `, unsubscribeUrl)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 5. AUDIT PORTAL ACCESS
// ═══════════════════════════════════════════════════════════════════════

export function auditPortalEmail(portalUrl: string): { subject: string; html: string } {
  const subject = 'Your Catalyst Audit Portal — Complete Your Intake'

  const html = wrap(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
      PAYMENT CONFIRMED &middot; MARKET VALUE AUDIT
    </p>

    <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:28px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">
      Your private portal<br/>
      <em style="color:${C.gold};">is ready.</em>
    </p>

    ${cta('Access Your Portal &rarr;', portalUrl)}
  `)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 6. PLATFORM WAITLIST EMAIL
// ═══════════════════════════════════════════════════════════════════════

export function platformWaitlistEmail(plan?: string, unsubscribeUrl?: string): { subject: string; html: string } {
  const subject = `Catalyst Platform — early access registered`
  const planLabel = plan ? ` — ${plan} tier` : ''

  const html = wrap(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
      EARLY ACCESS REGISTERED${planLabel ? ` &middot; ${plan?.toUpperCase()}` : ''}
    </p>

    <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:28px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">
      Your position<br/>
      <em style="color:${C.gold};">is confirmed.</em>
    </p>

    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:15px;
               color:${C.muted};line-height:1.7;">
      You are registered for early access to the Catalyst Intelligence Platform${planLabel}.
      When we open, early members are notified first and lock in launch pricing permanently.
    </p>

    ${cta('Get Free TPI Score →', `${SITE_URL}/tpi`)}
  `, unsubscribeUrl)

  return { subject, html }
}
