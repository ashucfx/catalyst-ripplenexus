// ─── Brand tokens ──────────────────────────────────────────────────────
const C = {
  obsidian:  '#0A0B0D',
  bone:      '#F4F1EB',
  graphite:  '#1F2226',
  muted:     '#8B8681',
  gold:      '#B8935B',
  parchment: '#E6DFD1',
  amber:     '#D4A847',
}

const LOGO_URL = 'https://www.catalyst.theripplenexus.com/logo-email.svg'
const SITE_URL = 'https://www.catalyst.theripplenexus.com'

// ─── Animation-aware wrapper ────────────────────────────────────────────
function wrapCampaign(body: string, unsubUrl?: string): string {
  const unsubBlock = unsubUrl
    ? `<a href="${unsubUrl}" style="font-family:Arial,sans-serif;font-size:9px;color:${C.muted};text-decoration:underline;letter-spacing:0.12em;text-transform:uppercase;">Unsubscribe</a>`
    : ''

  const footerLinks = [
    `<a href="${SITE_URL}" style="font-family:Arial,sans-serif;font-size:9px;color:${C.gold};text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">Visit →</a>`,
    `<a href="${SITE_URL}/tpi" style="font-family:Arial,sans-serif;font-size:9px;color:${C.gold};text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">Free TPI →</a>`,
    `<a href="${SITE_URL}/audit" style="font-family:Arial,sans-serif;font-size:9px;color:${C.gold};text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">Audit $99 →</a>`,
    unsubBlock,
  ].filter(Boolean).join(`<span style="font-family:Arial,sans-serif;font-size:9px;color:${C.graphite};padding:0 10px;">·</span>`)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catalyst</title>
  <style>
    @media screen {
      @keyframes catalyst-fadein {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes catalyst-pulse {
        0%, 100% { opacity: 0.75; }
        50%       { opacity: 1; }
      }
      @keyframes catalyst-bar {
        from { width: 0; }
        to   { width: 48px; }
      }
      .c-hero    { animation: catalyst-fadein 0.7s ease-out forwards; }
      .c-accent  { animation: catalyst-pulse 4s ease-in-out infinite; }
      .c-bar     { animation: catalyst-bar 0.8s ease-out 0.3s both; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${C.obsidian};font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.obsidian};padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header with logo -->
          <tr>
            <td style="padding:0 0 28px 0;border-bottom:1px solid ${C.graphite};">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="vertical-align:middle;padding-right:14px;width:20px;">
                    <img src="${LOGO_URL}" width="20" height="25" alt="Catalyst"
                         style="display:block;width:20px;height:25px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:${C.bone};letter-spacing:-0.01em;font-weight:400;">CATALYST</p>
                    <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:8px;color:${C.gold};letter-spacing:0.35em;text-transform:uppercase;">A RIPPLE NEXUS INSTITUTION</p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:${C.muted};letter-spacing:0.1em;">catalyst.theripplenexus.com</p>
                  </td>
                </tr>
              </table>
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
                      CATALYST &nbsp;·&nbsp; RIPPLE NEXUS &nbsp;·&nbsp; INDIA &nbsp;·&nbsp; UAE &nbsp;·&nbsp; GLOBAL
                    </p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:${C.muted};font-style:italic;">
                      Intelligence for those who will not settle.
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
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:#2a2a2a;letter-spacing:0.05em;">
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

function ctaBtn(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background-color:${C.gold};color:${C.obsidian};padding:14px 32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;font-weight:700;">${text}</a>`
}


// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 1: Intelligence Brief — weekly market newsletter
// ═══════════════════════════════════════════════════════════════════════

export interface IntelligenceBriefVars {
  edition:         string
  date_label:      string
  headline:        string
  intro:           string
  signal1_title:   string
  signal1_body:    string
  signal2_title:   string
  signal2_body:    string
  signal3_title?:  string
  signal3_body?:   string
  closing:         string
  cta_url:         string
}

export function campaignIntelligenceBrief(v: IntelligenceBriefVars, unsubUrl?: string): { subject: string; html: string } {
  const subject = `Intelligence Brief No. ${v.edition} — ${v.headline}`

  const signal3Block = v.signal3_title ? `
    <tr>
      <td style="padding:20px 0;border-bottom:1px solid ${C.graphite};">
        <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">SIGNAL 03</p>
        <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:17px;color:${C.bone};font-weight:400;line-height:1.3;">${v.signal3_title}</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${C.muted};line-height:1.7;">${v.signal3_body}</p>
      </td>
    </tr>` : ''

  const html = wrapCampaign(`
    <!-- Edition label -->
    <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.muted};letter-spacing:0.25em;text-transform:uppercase;">
      NO. ${v.edition} &nbsp;·&nbsp; ${v.date_label}
    </p>

    <!-- Hero headline -->
    <div class="c-hero">
      <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.35em;text-transform:uppercase;">
        CATALYST INTELLIGENCE BRIEF
      </p>
      <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:32px;color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.15;">
        ${v.headline}
      </p>
    </div>

    <!-- Gold bar -->
    <div class="c-bar" style="height:2px;background-color:${C.gold};width:48px;margin-bottom:28px;"></div>

    <!-- Intro -->
    <p style="margin:0 0 36px 0;font-family:Georgia,serif;font-size:16px;color:${C.muted};line-height:1.75;">
      ${v.intro}
    </p>

    <!-- Signals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="padding:20px 0;border-top:1px solid ${C.graphite};border-bottom:1px solid ${C.graphite};">
          <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">SIGNAL 01</p>
          <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:17px;color:${C.bone};font-weight:400;line-height:1.3;">${v.signal1_title}</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${C.muted};line-height:1.7;">${v.signal1_body}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 0;border-bottom:1px solid ${C.graphite};">
          <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">SIGNAL 02</p>
          <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:17px;color:${C.bone};font-weight:400;line-height:1.3;">${v.signal2_title}</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${C.muted};line-height:1.7;">${v.signal2_body}</p>
        </td>
      </tr>
      ${signal3Block}
    </table>

    <!-- Closing -->
    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:15px;color:${C.parchment};line-height:1.75;font-style:italic;border-left:2px solid ${C.gold};padding-left:20px;">
      ${v.closing}
    </p>

    ${ctaBtn('Read Full Brief →', v.cta_url)}

    <p style="margin:28px 0 0 0;font-family:Arial,sans-serif;font-size:10px;color:${C.muted};letter-spacing:0.1em;">
      You received this because you subscribed to the Catalyst Intelligence Brief.
    </p>
  `, unsubUrl)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 2: Announcement — product launch / offer / event
// ═══════════════════════════════════════════════════════════════════════

export interface AnnouncementVars {
  label:      string
  headline:   string
  subline:    string
  body:       string
  benefit1:   string
  benefit2:   string
  benefit3:   string
  cta_text:   string
  cta_url:    string
  image_url?: string
}

export function campaignAnnouncement(v: AnnouncementVars, unsubUrl?: string): { subject: string; html: string } {
  const subject = `${v.label} — ${v.headline}`

  const imageBlock = v.image_url ? `
    <tr>
      <td style="padding:0 0 32px 0;">
        <img src="${v.image_url}" alt="${v.headline}" width="600"
          style="width:100%;max-width:600px;height:auto;display:block;border:0;" />
      </td>
    </tr>` : ''

  const html = wrapCampaign(`
    <table width="100%" cellpadding="0" cellspacing="0">
      ${imageBlock}
      <tr>
        <td>
          <div class="c-hero">
            <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.35em;text-transform:uppercase;">${v.label}</p>
            <p style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:34px;color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.1;">${v.headline}</p>
            <p style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:18px;color:${C.gold};font-weight:400;line-height:1.3;">${v.subline}</p>
          </div>

          <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:15px;color:${C.muted};line-height:1.75;">${v.body}</p>

          <!-- Benefits -->
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="border:1px solid ${C.graphite};background-color:${C.graphite};margin-bottom:32px;">
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">WHAT YOU GET</p>
                ${[v.benefit1, v.benefit2, v.benefit3].map(b => `
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;width:100%;">
                    <tr>
                      <td style="width:20px;vertical-align:top;padding-top:2px;">
                        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:${C.gold};font-weight:700;">◈</p>
                      </td>
                      <td style="vertical-align:top;padding-left:10px;">
                        <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${C.bone};line-height:1.5;">${b}</p>
                      </td>
                    </tr>
                  </table>
                `).join('')}
              </td>
            </tr>
          </table>

          ${ctaBtn(v.cta_text, v.cta_url)}

          <p style="margin:28px 0 0 0;font-family:Georgia,serif;font-size:13px;color:${C.muted};line-height:1.6;font-style:italic;">
            Questions? Reply directly to this email.
          </p>
        </td>
      </tr>
    </table>
  `, unsubUrl)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 3: Market Insight — data-driven thought leadership
// ═══════════════════════════════════════════════════════════════════════

export interface MarketInsightVars {
  headline:    string
  pullquote:   string
  body:        string
  stat1_label: string
  stat1_value: string
  stat2_label: string
  stat2_value: string
  stat3_label: string
  stat3_value: string
  insight:     string
  cta_url:     string
}

export function campaignMarketInsight(v: MarketInsightVars, unsubUrl?: string): { subject: string; html: string } {
  const subject = `Market Intelligence — ${v.headline}`

  const html = wrapCampaign(`
    <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.35em;text-transform:uppercase;">
      MARKET INTELLIGENCE
    </p>

    <div class="c-hero">
      <p style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:30px;color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">${v.headline}</p>
    </div>

    <!-- Pull quote -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background-color:${C.graphite};margin-bottom:32px;">
      <tr>
        <td style="padding:24px 28px;border-left:3px solid ${C.gold};">
          <p class="c-accent" style="margin:0;font-family:Georgia,serif;font-size:18px;color:${C.parchment};font-style:italic;line-height:1.5;">&ldquo;${v.pullquote}&rdquo;</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:15px;color:${C.muted};line-height:1.75;">${v.body}</p>

    <!-- Stats grid -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid ${C.graphite};margin-bottom:32px;">
      <tr>
        <td style="padding:20px;border-right:1px solid ${C.graphite};text-align:center;width:33%;">
          <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:28px;color:${C.gold};font-weight:300;letter-spacing:-0.02em;">${v.stat1_value}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:${C.muted};letter-spacing:0.15em;text-transform:uppercase;">${v.stat1_label}</p>
        </td>
        <td style="padding:20px;border-right:1px solid ${C.graphite};text-align:center;width:33%;">
          <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:28px;color:${C.gold};font-weight:300;letter-spacing:-0.02em;">${v.stat2_value}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:${C.muted};letter-spacing:0.15em;text-transform:uppercase;">${v.stat2_label}</p>
        </td>
        <td style="padding:20px;text-align:center;width:33%;">
          <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:28px;color:${C.gold};font-weight:300;letter-spacing:-0.02em;">${v.stat3_value}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:${C.muted};letter-spacing:0.15em;text-transform:uppercase;">${v.stat3_label}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:14px;color:${C.parchment};line-height:1.7;font-style:italic;border-left:2px solid ${C.gold};padding-left:20px;">
      ${v.insight}
    </p>

    ${ctaBtn('Get Your Market Position →', v.cta_url)}
  `, unsubUrl)

  return { subject, html }
}

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE 4: Re-engagement — win-back email
// ═══════════════════════════════════════════════════════════════════════

export interface ReEngagementVars {
  greeting:    string
  hook:        string
  what_changed:string
  offer:       string
  cta_text:    string
  cta_url:     string
}

export function campaignReEngagement(v: ReEngagementVars, unsubUrl?: string): { subject: string; html: string } {
  const subject = v.hook

  const html = wrapCampaign(`
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">
      A NOTE FROM CATALYST
    </p>

    <p style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:28px;color:${C.bone};font-weight:400;letter-spacing:-0.02em;line-height:1.2;">
      ${v.greeting}
    </p>

    <p style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:16px;color:${C.muted};line-height:1.8;">
      ${v.hook}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid ${C.graphite};margin-bottom:28px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 10px 0;font-family:Arial,sans-serif;font-size:9px;color:${C.gold};letter-spacing:0.3em;text-transform:uppercase;">WHAT HAS CHANGED</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:${C.muted};line-height:1.7;">${v.what_changed}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 32px 0;font-family:Georgia,serif;font-size:15px;color:${C.parchment};line-height:1.75;">${v.offer}</p>

    ${ctaBtn(v.cta_text, v.cta_url)}

    <p style="margin:28px 0 0 0;font-family:Georgia,serif;font-size:13px;color:${C.muted};line-height:1.6;font-style:italic;">
      No pressure. One click unsubscribes you permanently.
    </p>
  `, unsubUrl)

  return { subject, html }
}

// ─── Template registry ──────────────────────────────────────────────────

export type TemplateId = 'intelligence-brief' | 'announcement' | 'market-insight' | 're-engagement'

export interface TemplateField {
  key:          string
  label:        string
  type:         'text' | 'textarea' | 'url'
  placeholder?: string
  required?:    boolean
}

export interface TemplateDef {
  id:          TemplateId
  name:        string
  description: string
  fields:      TemplateField[]
}

export const CAMPAIGN_TEMPLATES: TemplateDef[] = [
  {
    id: 'intelligence-brief',
    name: 'Intelligence Brief',
    description: 'Weekly market analysis with 2–3 market signals. Your flagship newsletter format.',
    fields: [
      { key: 'edition',       label: 'Edition Number',  type: 'text',     placeholder: '24',                        required: true },
      { key: 'date_label',    label: 'Date Label',      type: 'text',     placeholder: '07 May 2026',               required: true },
      { key: 'headline',      label: 'Headline',        type: 'text',     placeholder: 'The AI Salary Correction',  required: true },
      { key: 'intro',         label: 'Introduction',    type: 'textarea', placeholder: '2–3 sentence opening...',   required: true },
      { key: 'signal1_title', label: 'Signal 1 Title',  type: 'text',     placeholder: 'Tech layoffs continue...', required: true },
      { key: 'signal1_body',  label: 'Signal 1 Body',   type: 'textarea', placeholder: 'Analysis paragraph...',    required: true },
      { key: 'signal2_title', label: 'Signal 2 Title',  type: 'text',     placeholder: 'India hiring rebounds...', required: true },
      { key: 'signal2_body',  label: 'Signal 2 Body',   type: 'textarea', placeholder: 'Analysis paragraph...',    required: true },
      { key: 'signal3_title', label: 'Signal 3 (opt.)', type: 'text',     placeholder: 'Optional third signal' },
      { key: 'signal3_body',  label: 'Signal 3 Body',   type: 'textarea', placeholder: 'Optional analysis' },
      { key: 'closing',       label: 'Closing Line',    type: 'textarea', placeholder: 'Italicised pull quote...',  required: true },
      { key: 'cta_url',       label: 'CTA Link',        type: 'url',      placeholder: 'https://...',              required: true },
    ],
  },
  {
    id: 'announcement',
    name: 'Announcement',
    description: 'Bold announcement for new services, offers, or events. Supports an optional hero image.',
    fields: [
      { key: 'label',     label: 'Category Label',  type: 'text',     placeholder: 'NEW SERVICE',              required: true },
      { key: 'headline',  label: 'Headline',         type: 'text',     placeholder: 'The Executive Suite...',   required: true },
      { key: 'subline',   label: 'Sub-headline',     type: 'text',     placeholder: 'Reserved for 12 leaders',  required: true },
      { key: 'body',      label: 'Body Copy',        type: 'textarea', placeholder: 'Describe the offering...', required: true },
      { key: 'benefit1',  label: 'Benefit 1',        type: 'text',     placeholder: 'What they get...',         required: true },
      { key: 'benefit2',  label: 'Benefit 2',        type: 'text',     placeholder: 'Another benefit...',       required: true },
      { key: 'benefit3',  label: 'Benefit 3',        type: 'text',     placeholder: 'Third benefit...',         required: true },
      { key: 'cta_text',  label: 'CTA Button Text',  type: 'text',     placeholder: 'Apply Now →',              required: true },
      { key: 'cta_url',   label: 'CTA Link',         type: 'url',      placeholder: 'https://...',              required: true },
      { key: 'image_url', label: 'Hero Image URL',   type: 'url',      placeholder: 'https://... (optional)' },
    ],
  },
  {
    id: 'market-insight',
    name: 'Market Insight',
    description: 'Data-driven thought leadership with 3 headline stats and a pull quote.',
    fields: [
      { key: 'headline',    label: 'Headline',        type: 'text',     placeholder: 'Compensation Reality 2026', required: true },
      { key: 'pullquote',   label: 'Pull Quote',      type: 'textarea', placeholder: 'One striking insight...',   required: true },
      { key: 'body',        label: 'Body Copy',        type: 'textarea', placeholder: 'Context paragraph...',     required: true },
      { key: 'stat1_label', label: 'Stat 1 Label',    type: 'text',     placeholder: 'Avg. pay gap',             required: true },
      { key: 'stat1_value', label: 'Stat 1 Value',    type: 'text',     placeholder: '18%',                      required: true },
      { key: 'stat2_label', label: 'Stat 2 Label',    type: 'text',     placeholder: 'Roles undercut',           required: true },
      { key: 'stat2_value', label: 'Stat 2 Value',    type: 'text',     placeholder: '3 in 5',                   required: true },
      { key: 'stat3_label', label: 'Stat 3 Label',    type: 'text',     placeholder: 'Audit ROI',                required: true },
      { key: 'stat3_value', label: 'Stat 3 Value',    type: 'text',     placeholder: '54×',                      required: true },
      { key: 'insight',     label: 'Closing Insight', type: 'textarea', placeholder: 'What this means for...',   required: true },
      { key: 'cta_url',     label: 'CTA Link',        type: 'url',      placeholder: 'https://...',              required: true },
    ],
  },
  {
    id: 're-engagement',
    name: 'Re-engagement',
    description: 'Personal, low-pressure win-back email for cold or inactive contacts.',
    fields: [
      { key: 'greeting',     label: 'Opening Greeting',  type: 'text',     placeholder: 'It has been a while.',   required: true },
      { key: 'hook',         label: 'Hook / Subject',    type: 'text',     placeholder: 'Markets moved since we last spoke.', required: true },
      { key: 'what_changed', label: 'What Has Changed',  type: 'textarea', placeholder: 'New data, new service...', required: true },
      { key: 'offer',        label: 'The Offer / Nudge', type: 'textarea', placeholder: 'One clear thing to do...', required: true },
      { key: 'cta_text',     label: 'CTA Button Text',   type: 'text',     placeholder: 'Check Your Score →',       required: true },
      { key: 'cta_url',      label: 'CTA Link',          type: 'url',      placeholder: 'https://...',              required: true },
    ],
  },
]

// ─── Generic render dispatch ────────────────────────────────────────────

export function renderCampaign(
  id: TemplateId,
  vars: Record<string, string>,
  unsubUrl?: string
): { subject: string; html: string } {
  switch (id) {
    case 'intelligence-brief':
      return campaignIntelligenceBrief(vars as unknown as IntelligenceBriefVars, unsubUrl)
    case 'announcement':
      return campaignAnnouncement(vars as unknown as AnnouncementVars, unsubUrl)
    case 'market-insight':
      return campaignMarketInsight(vars as unknown as MarketInsightVars, unsubUrl)
    case 're-engagement':
      return campaignReEngagement(vars as unknown as ReEngagementVars, unsubUrl)
  }
}
