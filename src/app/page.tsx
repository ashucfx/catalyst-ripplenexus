import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Button } from '@/components/ui/Button'
import { CostDiagram } from '@/components/ui/CostDiagram'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { GeoPrice } from '@/components/ui/GeoPrice'
import { COMPANIES } from '@/components/ui/CompanyLogos'
import { Disclaimer } from '@/components/ui/Disclaimer'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────


const selectionPlans = [
  {
    tier: 'I',
    product: 'audit' as const,
    name: 'Market Value Audit',
    subtitle: 'AI INTELLIGENCE REPORT',
    anchor: 'Anchored against a $10,000 immediate salary gain.',
    roi: '100× ROI',
    deliverables: [
      'AI-generated Positioning Report — 90 seconds',
      'Talent Positioning Index (TPI) score',
      'ATS pass-rate analysis',
      'Live salary benchmark vs. global market data',
    ],
    transformation: 'Uncertainty → Market Clarity',
    href: '/audit',
    ctaBase: 'Get Report',
  },
  {
    tier: 'II',
    product: 'sprint' as const,
    name: 'Momentum Sprint',
    subtitle: 'AUDIT + 14-DAY EXECUTION',
    anchor: 'For those who refuse to execute alone.',
    roi: 'Limited Availability',
    deliverables: [
      'Everything in the Market Value Audit',
      'Custom Implementation Roadmap',
      'Structured 14-day execution plan',
      'LinkedIn headline & about refactoring',
    ],
    transformation: 'Clarity → First-mile execution',
    href: '/request?service=sprint',
    ctaBase: 'Start Sprint',
    featured: true,
  },
  {
    tier: 'III',
    product: 'blueprint' as const,
    name: 'Positioning Blueprint',
    subtitle: 'FULL-BRAND ARCHITECTURE',
    anchor: 'Anchored against a $50,000 annual salary increase.',
    roi: '143× ROI',
    deliverables: [
      'Executive Resume Rewrite (High Authority)',
      'LinkedIn Full-Brand Identity (Banner, DP)',
      'Narrative Cover Letter Architecture',
      'Sector Heat Map: GCC / PE / SaaS',
      'ATS Stress-Testing across all platforms',
      '30-day delivery · human + AI collaboration',
    ],
    transformation: 'Generalist → Recognized Authority',
    href: '/blueprint',
    ctaBase: 'Engage Blueprint',
  },
]

const caseStudies = [
  {
    profile: 'Director → VP, Financial Services',
    market: 'India → UAE',
    outcome: 'VP offer within 11 weeks of Blueprint delivery.',
    metric: '+$47K',
    metricLabel: 'Salary Uplift',
    duration: '11 weeks',
  },
  {
    profile: 'Managing Director → Board Candidate',
    market: 'GCC / Private Equity',
    outcome: 'Board seat secured within 6 months of Suite engagement.',
    metric: '6 mo',
    metricLabel: 'Board Seat',
    duration: '6 months',
  },
  {
    profile: 'Finance Leader — India → UAE PE',
    market: 'GCC Private Equity',
    outcome: 'Catalyst-engineered positioning for GCC PE sector.',
    metric: '+67%',
    metricLabel: 'Total Comp',
    duration: '4 months',
  },
]

const saasModules = [
  { name: 'Skills Ontology Mapper',     desc: 'Real-time global demand data — what skills are hot, and what they pay.',          icon: '◈' },
  { name: 'Narrative Discretion Engine', desc: 'Identifies signals that lower your value. Shows exactly what to lead with.',      icon: '◎' },
  { name: 'Network Gravity Tracker',    desc: 'Maps the gaps in your network. Surfaces the specific firms you need.',            icon: '⬡' },
  { name: 'Career Pathing Canvas',      desc: 'Model different futures. Make career decisions from data, not instinct.',         icon: '◲' },
]

const trustSignals = [
  { label: 'Placement Rate',    value: '92%'      },
  { label: 'Avg. Salary Uplift', value: '$47K'    },
  { label: 'Time-to-Offer',     value: '11 wks'   },
  { label: 'Global Reach',      value: 'IN·AE·US' },
]

// ─── Page ─────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="grain">

        {/* ═══════════════════════════════════════════════════════════
            HERO — CINEMATIC DARK + GRID + GOLD BEAMS
        ════════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col justify-center overflow-hidden"
          style={{ background: '#050507' }}
        >
          {/* ── Background layers ── */}
          <div className="absolute inset-0 dot-field" style={{ opacity: 0.48 }} />
          <div className="absolute inset-0 beam-tr" />
          <div className="absolute inset-0 beam-bl" />

          {/* ── Gold hairline at very top ── */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(184,147,91,0.7) 40%, rgba(184,147,91,0.9) 50%, rgba(184,147,91,0.7) 60%, transparent 100%)' }}
          />

          <div className="relative z-10 max-w-dossier mx-auto px-6 lg:px-12 pt-44 pb-36">

            {/* Status chip */}
            <div className="live-badge mb-14 inline-flex">
              <span className="pulse-dot" />
              Operational · IN · AE · US · SG · CH · AU
            </div>

            {/* Hero headline */}
            <h1
              className="display-hero mb-10 max-w-5xl"
              style={{ fontSize: 'clamp(4rem, 10.5vw, 9.5rem)', lineHeight: 1.0 }}
            >
              The market is mispricing
              <br />
              your professional{' '}
              <em className="text-gold-gradient not-italic text-glow-gold">signal.</em>
            </h1>

            {/* Sub */}
            <p
              className="font-serif text-muted leading-relaxed mb-16 max-w-2xl"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)' }}
            >
              Catalyst re-engineers the professional identity of senior leaders across
              global markets. We close the gap between your actual capability and your
              perceived market value — with institutional precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-5 mb-16">
              <div className="shimmer-trigger">
                <Link
                  href="/audit"
                  id="hero-cta-primary"
                  className="inline-flex items-center gap-3 bg-signal-gold text-obsidian
                             px-10 py-5 font-sans text-[0.65rem] font-bold tracking-[0.25em] uppercase
                             btn-primary-glow hover:bg-bone transition-all duration-300"
                >
                  Get AI Positioning Report — <GeoPrice product="audit" variant="cta" />
                  <span className="text-xs">→</span>
                </Link>
                <div className="shimmer-bar" />
              </div>

              <Link
                href="/tpi"
                id="hero-cta-secondary"
                className="inline-flex items-center gap-3 text-bone border border-white/[0.12]
                           px-10 py-5 font-sans text-[0.65rem] tracking-[0.25em] uppercase
                           hover:border-signal-gold/40 hover:bg-white/[0.02] transition-all duration-300"
              >
                Free TPI Score
              </Link>
            </div>

            {/* Trust micro-signals */}
            <div className="flex flex-wrap gap-4 mb-24">
              {['Report ready in 90 seconds', 'Confidential engagement', 'No commitment required'].map((t) => (
                <span key={t} className="trust-badge">
                  <span className="text-signal-gold">✓</span> {t}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="pt-12 border-t border-white/[0.07] grid grid-cols-2 md:grid-cols-4 gap-10">
              {trustSignals.map((stat) => (
                <div key={stat.label} className="group">
                  <p
                    className="metric-number mb-2 group-hover:opacity-90 transition-opacity duration-300"
                    style={{ color: 'var(--signal-gold)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="metric-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fade into trust rail */}
          <div
            className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #050507, transparent)' }}
          />
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRUST RAIL — COMPANY LOGOS + NAMES MARQUEE
        ════════════════════════════════════════════════════════════ */}
        <section
          className="py-10 overflow-hidden"
          style={{ background: '#030304', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Label row */}
          <div className="max-w-dossier mx-auto px-6 lg:px-12 mb-8">
            <div className="flex items-center gap-6">
              <p className="label-inst shrink-0" style={{ letterSpacing: '0.5em', opacity: 0.35, whiteSpace: 'nowrap' }}>
                Leaders At
              </p>
              <div className="flex-1 gold-bar" />
            </div>
          </div>

          {/* Scrolling logo rail */}
          <div className="overflow-hidden">
            <div className="marquee-track" style={{ display: 'flex', width: 'max-content', gap: '0' }}>
              {[...COMPANIES, ...COMPANIES].map(({ name, Icon }, i) => (
                <div
                  key={i}
                  className="trust-logo-tile flex flex-col items-center justify-center cursor-default"
                  style={{ minWidth: '9rem', padding: '0 2.5rem' }}
                >
                  {/* Icon mark */}
                  <Icon
                    className="mb-3"
                    style={{
                      width:  '22px',
                      height: '22px',
                      color:  'rgba(244,241,235,0.22)',
                    }}
                  />
                  {/* Company name */}
                  <span
                    className="font-mono text-center whitespace-nowrap transition-colors duration-300"
                    style={{
                      fontSize:      '0.52rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color:         'rgba(122,122,130,0.65)',
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            THE PROBLEM — THE ECONOMIC GAP
        ════════════════════════════════════════════════════════════ */}
        <section className="relative px-6 lg:px-12 py-44 overflow-hidden">

          {/* Giant watermark number */}
          <div
            className="absolute right-[-2rem] top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif"
            style={{ fontSize: 'clamp(16rem, 30vw, 28rem)', lineHeight: 1, color: 'rgba(184,147,91,0.035)', letterSpacing: '-0.06em', fontWeight: 300 }}
          >
            79%
          </div>

          <div className="max-w-dossier mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">

            <div className="reveal-on-scroll visible">
              <span className="eyebrow mb-8">The Economic Gap</span>
              <h2 className="display-section mt-4 mb-10">
                Skill is cheap.
                <br />
                <em className="not-italic" style={{ color: 'var(--signal-gold)' }}>
                  Signal is expensive.
                </em>
              </h2>
              <p className="prose-lead mb-8">
                The global talent market doesn&apos;t pay you for what you can do.
                It pays you for{' '}
                <strong className="text-bone font-normal">
                  what it perceives you can do.
                </strong>
              </p>
              <div className="prose-catalyst mb-12">
                <p>
                  Most senior professionals negotiate from an uninformed baseline — anchored to
                  a salary set years ago. This gap costs mid-career leaders{' '}
                  <strong>$10K–$50K annually</strong>. Catalyst eliminates this asymmetry using
                  institutional AI and live market intelligence.
                </p>
              </div>

              {/* Stat callout */}
              <div
                className="relative overflow-hidden p-8 border-l-2 border-signal-gold mb-10"
                style={{ background: 'linear-gradient(135deg, rgba(184,147,91,0.07), rgba(184,147,91,0.02))' }}
              >
                <div
                  className="absolute top-0 right-0 w-36 h-36 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top right, rgba(184,147,91,0.1), transparent)' }}
                />
                <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest uppercase mb-3">
                  79% of Senior Leaders
                </p>
                <p className="font-serif text-bone text-xl leading-snug">
                  earn 10–35% below their actual market rate.
                </p>
                <p className="font-mono text-muted text-[0.5rem] tracking-widest mt-4 opacity-60">
                  Source: Ravio Global Compensation Survey 2024
                </p>
              </div>

              <Button href="/system" variant="text">
                Understand the Architecture →
              </Button>
            </div>

            <div
              style={{
                background: 'rgba(10,11,13,0.55)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 20px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <CostDiagram />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRICING — THREE TIERS
        ════════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="relative px-6 lg:px-12 py-44 overflow-hidden"
          style={{ background: '#060608', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="absolute inset-0 beam-top pointer-events-none" />

          <div className="max-w-dossier mx-auto relative">

            <div className="mb-24">
              <span className="eyebrow mb-6">The Catalyst Selection</span>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-4">
                <h2 className="display-section">
                  Three Tiers.{' '}
                  <em className="not-italic" style={{ color: 'var(--signal-gold)' }}>
                    One System.
                  </em>
                </h2>
                <p className="font-serif text-muted text-lg max-w-sm leading-relaxed">
                  Every engagement is anchored against a provable salary outcome.
                  This is a capital allocation decision, not an expense.
                </p>
              </div>
            </div>

            {/* Pricing grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-px"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {selectionPlans.map((plan) => (
                <div
                  key={plan.tier}
                  className={`flex flex-col p-10 lg:p-12 relative transition-all duration-500 ${
                    plan.featured ? 'card-featured' : 'card-glow'
                  }`}
                >
                  {plan.featured && (
                    <>
                      {/* Top beam line */}
                      <div
                        className="absolute -top-px left-0 right-0 h-[2px] pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(184,147,91,0.95), transparent)' }}
                      />
                      {/* Inner radial glow */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -15%, rgba(184,147,91,0.07), transparent)' }}
                      />
                    </>
                  )}

                  {/* Tier + ROI row */}
                  <div className="flex items-center justify-between mb-10">
                    <span className="tier-tag">
                      Tier {plan.tier}{plan.featured ? ' · Recommended' : ''}
                    </span>
                    <span className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-signal-gold/60">
                      {plan.roi}
                    </span>
                  </div>

                  {/* Name & subtitle */}
                  <h3 className="display-card text-3xl mb-1">{plan.name}</h3>
                  <p className="font-mono text-muted text-[0.52rem] tracking-widest uppercase mb-10">
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="pb-10 mb-10 border-b border-white/[0.07]">
                    <GeoPrice product={plan.product} variant="card" />
                    <p className="font-sans text-muted text-xs leading-relaxed italic mt-2">{plan.anchor}</p>
                  </div>

                  {/* Deliverables */}
                  <ul className="flex flex-col gap-5 mb-12 flex-1">
                    {plan.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="text-signal-gold text-[9px] mt-[3px] shrink-0">◈</span>
                        <span className="font-sans text-muted text-sm leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto">
                    <p className="tier-tag text-signal-gold/50 mb-6" style={{ fontSize: '0.5rem' }}>
                      {plan.transformation}
                    </p>
                    <Link
                      href={plan.href}
                      className={`w-full flex justify-center items-center gap-2 py-5 font-sans text-[0.62rem] font-bold tracking-[0.25em] uppercase transition-all duration-300 ${
                        plan.featured
                          ? 'bg-signal-gold text-obsidian hover:bg-bone btn-primary-glow'
                          : 'border border-white/[0.12] text-bone hover:border-signal-gold/40 hover:bg-white/[0.02]'
                      }`}
                    >
                      {plan.ctaBase} — <GeoPrice product={plan.product} variant="cta" /> <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* C-Suite escalation bar */}
            <div
              className="mt-6 p-10 border border-signal-gold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{ background: 'linear-gradient(135deg, rgba(184,147,91,0.04), rgba(184,147,91,0.01))' }}
            >
              <div>
                <span className="eyebrow mb-2" style={{ fontSize: '0.52rem', letterSpacing: '0.45em' }}>
                  C-Suite & Boards
                </span>
                <h3 className="display-card text-2xl mt-2">Sovereign Executive Suite</h3>
                <p className="font-sans text-muted text-sm mt-2 max-w-sm">
                  For leaders managing $500K+ total compensation portfolios. Bespoke architecture.
                </p>
              </div>
              <Button href="/executive" variant="ghost" className="whitespace-nowrap shrink-0">
                Request Brief →
              </Button>
            </div>

            {/* Pricing disclaimer */}
            <Disclaimer variant="compact" className="mt-8" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CASE STUDIES — VERIFIED OUTCOMES
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-44 max-w-dossier mx-auto">

          <div className="mb-20">
            <span className="eyebrow mb-6">Placement Registry · Verified Outcomes</span>
            <h2 className="display-section max-w-3xl mt-4">
              What career re-architecture{' '}
              <em className="not-italic" style={{ color: 'var(--signal-gold)' }}>
                actually delivers.
              </em>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {caseStudies.map((cs) => (
              <div key={cs.profile} className="card-glow p-12 flex flex-col">
                {/* Metric — the only thing that matters */}
                <div className="mb-10 pb-10 border-b border-white/[0.07]">
                  <p
                    className="metric-xl text-glow-gold"
                    style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}
                  >
                    {cs.metric}
                  </p>
                  <p className="metric-label mt-3">{cs.metricLabel}</p>
                </div>

                <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest uppercase mb-5">
                  {cs.market}
                </p>
                <p className="display-card text-xl leading-snug mb-4">{cs.profile}</p>
                <p className="font-sans text-muted text-sm leading-relaxed flex-1">{cs.outcome}</p>
                <p className="font-mono text-muted text-[0.52rem] tracking-widest uppercase mt-8 opacity-35">
                  {cs.duration}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button href="/intelligence#case-studies" variant="ghost">
              View Full Case Archive →
            </Button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SAAS PLATFORM PREVIEW
        ════════════════════════════════════════════════════════════ */}
        <section
          className="px-6 lg:px-12 py-44"
          style={{ background: '#060608', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-dossier mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

              {/* Mock dashboard */}
              <div className="glass p-10 lg:p-12 order-2 lg:order-1">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.07]">
                  <span className="font-mono text-muted text-[0.58rem] tracking-widest uppercase">
                    Intelligence Dashboard
                  </span>
                  <InflectionMark size="sm" />
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                  <TPIMeter score={67} size={150} />
                  <div className="flex-1 w-full space-y-4">
                    {['Market Heat', 'Signal Strength', 'ATS Compatibility', 'Network Gaps'].map((l) => (
                      <div key={l} className="flex justify-between items-end border-b border-white/[0.07] pb-2">
                        <span className="font-mono text-muted text-[0.55rem] uppercase tracking-wider">{l}</span>
                        <span className="font-sans text-bone text-[0.68rem]">Monitoring</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <p className="tier-tag mb-2">SaaS Access</p>
                    <p className="display-card text-2xl">$49<span className="text-muted text-sm font-sans">/mo</span></p>
                  </div>
                  <div className="p-5 border border-signal-gold/20" style={{ background: 'rgba(184,147,91,0.05)' }}>
                    <p className="tier-tag mb-2">Current TPI</p>
                    <p className="display-card text-2xl">67 — <span className="text-signal-gold">Tier 2</span></p>
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className="order-1 lg:order-2">
                <span className="eyebrow mb-8">The Platform</span>
                <h2 className="display-section mb-10 mt-4">
                  Real-time visibility into your{' '}
                  <em className="not-italic" style={{ color: 'var(--signal-gold)' }}>
                    market power.
                  </em>
                </h2>
                <p className="prose-lead mb-14">
                  The Catalyst Platform provides ongoing intelligence for those who manage their
                  career like a portfolio. Data-driven decisions, not gut instinct.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                  {saasModules.map((m) => (
                    <div
                      key={m.name}
                      className="group pl-4 border-l-2 border-transparent hover:border-signal-gold/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-signal-gold text-sm">{m.icon}</span>
                        <p className="font-mono text-bone text-[0.55rem] tracking-[0.2em] uppercase group-hover:text-signal-gold transition-colors">
                          {m.name}
                        </p>
                      </div>
                      <p className="font-sans text-muted text-xs leading-relaxed">{m.desc}</p>
                    </div>
                  ))}
                </div>

                <Button href="/platform" variant="ghost">Join Platform Waitlist →</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA — THE DECISION
        ════════════════════════════════════════════════════════════ */}
        <section
          className="relative px-6 lg:px-12 py-52 overflow-hidden text-center"
          style={{ background: '#030304' }}
        >
          {/* Center radial beam */}
          <div className="absolute inset-0 beam-center pointer-events-none" />

          {/* Top gold hairline */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(184,147,91,0.5), transparent)' }}
          />

          <div className="max-w-dossier mx-auto relative z-10">
            <span className="eyebrow mb-14 inline-block">The Decision</span>

            <h2
              className="display-page mb-14 mx-auto max-w-4xl"
              style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', lineHeight: 1.02 }}
            >
              The market has already priced you.
              <br />
              <em className="not-italic text-gold-gradient text-glow-gold">
                We think it was a mistake.
              </em>
            </h2>

            {/* ROI comparison table */}
            <div
              className="max-w-md mx-auto mb-16 p-10 border border-white/[0.09] text-left"
              style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="border-r border-white/[0.07] pr-6">
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest uppercase mb-3">
                    Cost of Audit
                  </p>
                  <GeoPrice product="audit" variant="inline" className="display-card text-4xl text-bone" />
                  <p className="font-mono text-signal-gold/60 text-[0.5rem] tracking-widest mt-3">
                    ONE TIME
                  </p>
                </div>
                <div className="pl-2">
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest uppercase mb-3">
                    Cost of Inaction
                  </p>
                  <GeoPrice variant="inaction" className="display-card text-4xl text-signal-gold" />
                  <p className="font-mono text-red-400/60 text-[0.5rem] tracking-widest mt-3">
                    PER YEAR
                  </p>
                </div>
              </div>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-4 mb-14">
              {['Report ready in 90 seconds', 'Immediate AI analysis', 'Confidential & discreet'].map((t) => (
                <span key={t} className="trust-badge">
                  <span className="text-signal-gold">✓</span> {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="shimmer-trigger">
                <Link
                  href="/audit"
                  id="footer-cta-primary"
                  className="inline-flex items-center gap-3 bg-signal-gold text-obsidian
                             px-14 py-6 font-sans text-[0.65rem] font-bold tracking-[0.25em] uppercase
                             btn-primary-glow hover:bg-bone transition-all duration-300"
                >
                  Get AI Positioning Report — <GeoPrice product="audit" variant="cta" />
                  <span>→</span>
                </Link>
                <div className="shimmer-bar" />
              </div>

              <Link
                href="/tpi"
                className="inline-flex items-center gap-3 text-bone border border-white/[0.12]
                           px-10 py-6 font-sans text-[0.65rem] tracking-[0.25em] uppercase
                           hover:border-signal-gold/40 transition-all duration-300"
              >
                Free TPI Assessment
              </Link>
            </div>

            {/* CTA disclaimer */}
            <Disclaimer variant="compact" className="mt-12 max-w-2xl mx-auto text-center" />
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
