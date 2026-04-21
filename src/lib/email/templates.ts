// ─── Brand tokens (inline — email clients strip <style> tags) ─────────
const C = {
  obsidian:   '#0A0B0D',
  bone:       '#F4F1EB',
  graphite:   '#1F2226',
  muted:      '#8B8681',
  gold:       '#B8935B',
  parchment:  '#E6DFD1',
}

// ─── Shared wrapper ────────────────────────────────────────────────────
function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catalyst</title>
</head>
<body style="margin:0;padding:0;background-color:${C.obsidian};font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.obsidian};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;border-bottom:1px solid ${C.graphite};">
              <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:${C.bone};letter-spacing:-0.02em;font-weight:400;">
                CATALYST
              </p>
              <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
                A RIPPLE NEXUS INSTITUTION
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 0;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;border-top:1px solid ${C.graphite};">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:${C.muted};letter-spacing:0.1em;text-transform:uppercase;">
                Catalyst · Ripple Nexus Institution · www.catalyst.theripplenexus.com
              </p>
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
       style="display:inline-block;background-color:${C.gold};color:${C.obsidian};
              padding:14px 32px;font-family:Arial,sans-serif;font-size:11px;
              letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;
              font-weight:600;margin-top:8px;">
      ${text}
    </a>`
}

// ═══════════════════════════════════════════════════════════════════════
// 1. ADMIN NOTIFICATION — new request form submission
// ═══════════════════════════════════════════════════════════════════════

type RequestData = {
  name: string
  email: string
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
  const subject = `New Enquiry — ${d.name}, ${d.role}`

  const html = wrap(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
      NEW CLIENT ENQUIRY
    </p>
    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:24px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;">
      ${d.name}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${row('Name',      d.name)}
      ${row('Email',     `<a href="mailto:${d.email}" style="color:${C.gold};text-decoration:none;">${d.email}</a>`)}
      ${row('Role',      d.role)}
      ${row('Seniority', d.seniority)}
      ${row('Geography', d.geography)}
      ${row('Service',   d.service)}
      ${row('Timeline',  d.timeline || '—')}
      ${row('Referral',  d.referral || '—')}
      ${row('Goals',     d.goals.join('<br/>') || '—')}
    </table>

    ${d.context ? `
      <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;
                 color:${C.muted};letter-spacing:0.2em;text-transform:uppercase;">
        THEIR OWN WORDS
      </p>
      <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:16px;
                 color:${C.parchment};line-height:1.7;font-style:italic;
                 border-left:2px solid ${C.gold};padding-left:16px;">
        &ldquo;${d.context}&rdquo;
      </p>
    ` : ''}

    <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:12px;color:${C.muted};">
      Reply directly to this email to contact ${d.name.split(' ')[0]}.
    </p>
    ${cta('Reply to Enquiry', `mailto:${d.email}?subject=Re: Your Catalyst Enquiry`)}
  `)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 2. USER AUTO-REPLY — request form acknowledgement
// ═══════════════════════════════════════════════════════════════════════

export function requestUserEmail(name: string, service: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0]
  const subject   = `Your Catalyst enquiry has been received`

  const html = wrap(`
    <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:28px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">
      Your enquiry is<br/>
      <em style="color:${C.gold};">in trusted hands.</em>
    </p>

    <p style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:16px;
               color:${C.muted};line-height:1.7;">
      ${firstName}, a Catalyst Executive Architect will review your profile and reach out
      within <span style="color:${C.bone};">24 business hours</span>.
    </p>

    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:15px;
               color:${C.muted};line-height:1.7;">
      Your enquiry has been logged as: <span style="color:${C.bone};">${service}</span>
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid ${C.graphite};margin-bottom:32px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:10px;
                     color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
            WHAT HAPPENS NEXT
          </p>
          ${[
            ['01', 'Profile review', 'We benchmark your submission against live market data before the call.'],
            ['02', '24-hour response', 'A senior Catalyst architect reaches out within one business day.'],
            ['03', 'First conversation', '45 minutes. Diagnostic, not coaching. You receive a directional TPI score.'],
          ].map(([n, title, desc]) => `
            <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:2px;">
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;
                             color:${C.gold};letter-spacing:0.1em;">${n}</p>
                </td>
                <td style="vertical-align:top;">
                  <p style="margin:0 0 2px 0;font-family:Arial,sans-serif;font-size:12px;
                             color:${C.bone};font-weight:600;">${title}</p>
                  <p style="margin:0;font-family:Georgia,serif;font-size:13px;
                             color:${C.muted};line-height:1.5;">${desc}</p>
                </td>
              </tr>
            </table>
          `).join('')}
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:13px;
               color:${C.muted};line-height:1.6;font-style:italic;">
      All enquiries are handled with absolute discretion. Your information is never shared
      with third parties or used for any purpose other than delivering your service.
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

export function tpiScoreEmail(d: TPIEmailData): { subject: string; html: string } {
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

    <!-- Your profile summary -->
    <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:10px;
               color:${C.muted};letter-spacing:0.2em;text-transform:uppercase;">
      YOUR PROFILE
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${row('Seniority',   d.answers.seniority)}
      ${row('Geography',   d.answers.geography)}
      ${row('Salary Band', d.answers.salaryBand)}
      ${row('Last Raise',  d.answers.lastRaise)}
      ${row('Sector',      d.answers.sector)}
    </table>

    <!-- What this means -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid ${C.graphite};margin-bottom:32px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:10px;
                     color:${C.gold};letter-spacing:0.25em;text-transform:uppercase;">
            WHAT THIS SCORE MEANS
          </p>
          <p style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:14px;
                     color:${C.muted};line-height:1.7;">
            This is a directional score based on five data points. The full Market Value Audit
            uses live compensation benchmarks from Ravio, Taggd, and Lightcast, your actual
            professional history, and a 45-minute diagnostic conversation with a Catalyst
            architect. It is significantly more precise.
          </p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;
                     color:${C.muted};letter-spacing:0.15em;text-transform:uppercase;">
            AUDIT COST: $499 · ANCHORED AGAINST A $5,000–$10,000 SALARY GAIN
          </p>
        </td>
      </tr>
    </table>

    ${cta('Book the Full Audit — $499 →', 'https://www.catalyst.theripplenexus.com/request')}

    <p style="margin:24px 0 0 0;font-family:Georgia,serif;font-size:13px;
               color:${C.muted};line-height:1.6;font-style:italic;">
      All enquiries are handled with absolute discretion.
    </p>
  `)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// 4. NEWSLETTER WELCOME — sent when someone subscribes
// ═══════════════════════════════════════════════════════════════════════

export function newsletterWelcomeEmail(): { subject: string; html: string } {
  const subject = `Welcome to the Intelligence Brief`

  const html = wrap(`
    <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:28px;
               color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">
      You're in.<br/>
      <em style="color:${C.gold};">First brief arrives Thursday.</em>
    </p>

    <p style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:16px;
               color:${C.muted};line-height:1.7;">
      Every Thursday, the Intelligence Brief delivers original market analysis to
      3,200+ senior professionals — compensation shifts, sector heat maps, AI displacement
      trends, and positioning strategy.
    </p>

    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:15px;
               color:${C.muted};line-height:1.7;">
      Written for senior professionals. Not job seekers.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid ${C.graphite};margin-bottom:32px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:10px;
                     color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
            WHILE YOU WAIT
          </p>
          <p style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:14px;
                     color:${C.bone};line-height:1.5;">
            Get your free Talent Positioning Index score.
          </p>
          <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:13px;
                     color:${C.muted};line-height:1.6;">
            Five questions. Five minutes. Tells you exactly where you stand in the market
            and what the gap is costing you annually.
          </p>
          ${cta('Get Free TPI Score →', 'https://www.catalyst.theripplenexus.com/tpi')}
        </td>
      </tr>
    </table>

    <p style="margin:0;font-family:Georgia,serif;font-size:13px;
               color:${C.muted};line-height:1.6;font-style:italic;">
      You can unsubscribe at any time. Your email is never shared.
    </p>
  `)

  return { subject, html }
}
