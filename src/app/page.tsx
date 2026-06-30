import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Button } from '@/components/ui/Button'
import { CostDiagram } from '@/components/ui/CostDiagram'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { GeoPrice } from '@/components/ui/GeoPrice'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────


const selectionPlans = [
  {
    tier: 'I',
    product: 'audit' as const,
    name: 'Market Value Audit',
    subtitle: 'ANALYST-PREPARED REPORT',
    anchor: '',
    roi: '',
    deliverables: [
      'Analyst-prepared Positioning Report',
      'Talent Positioning Index (TPI) score',
      'ATS readability review',
      'Market benchmark for your role and geography',
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
    anchor: 'The diagnosis and the first-mile execution, together.',
    roi: '',
    deliverables: [
      'Everything in the Market Value Audit',
      'Custom Implementation Roadmap',
      'Structured 14-day execution plan',
      'LinkedIn headline & about section rewrite',
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
    anchor: '',
    roi: '',
    deliverables: [
      'Executive Resume Rewrite',
      'LinkedIn Full-Brand Identity (Banner, DP)',
      'Narrative Cover Letter Architecture',
      'Sector Heat Map: GCC / PE / SaaS',
      'ATS readability review across common platforms',
      '30-day delivery · prepared by our positioning team',
    ],
    transformation: 'Generalist → Recognized Authority',
    href: '/blueprint',
    ctaBase: 'Engage Blueprint',
  },
]

// [PLACEHOLDER] Replace with real, consented client outcomes as they are documented

const saasModules = [
  { name: 'Skills Ontology Mapper',     desc: 'Real-time global demand data — what skills are hot, and what they pay.',          icon: '◈' },
  { name: 'Narrative Discretion Engine', desc: 'Identifies signals that lower your value. Shows exactly what to lead with.',      icon: '◎' },
  { name: 'Network Gravity Tracker',    desc: 'Maps the gaps in your network. Surfaces the specific firms you need.',            icon: '⬡' },
  { name: 'Career Pathing Canvas',      desc: 'Model different futures. Make career decisions from data, not instinct.',         icon: '◲' },
]

const auditAnalysis = [
  { label: 'Seniority Signal',       desc: 'How your level currently reads' },
  { label: 'ATS Readability',        desc: 'Where tracking systems see gaps' },
  { label: 'Market Positioning',     desc: 'Your profile vs. market expectations' },
  { label: 'Narrative Gaps',         desc: 'What is holding your level down' },
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
                  Get your Market Value Audit — <GeoPrice product="audit" variant="cta" />
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
              {['Analyst-prepared report', 'Confidential engagement', 'No commitment required'].map((t) => (
                <span key={t} className="trust-badge">
                  <span className="text-signal-gold">✓</span> {t}
                </span>
              ))}
            </div>

            {/* What the Audit analyzes */}
            <div className="pt-12 border-t border-white/[0.07]">
              <p className="font-mono text-muted text-[0.52rem] tracking-[0.3em] uppercase mb-8 opacity-50">What the Audit analyzes</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {auditAnalysis.map((item) => (
                  <div key={item.label} className="group">
                    <p className="font-mono text-bone text-[0.6rem] tracking-[0.12em] uppercase mb-2 group-hover:text-signal-gold transition-colors">
                      {item.label}
                    </p>
                    <p className="font-sans text-muted text-xs leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade into trust rail */}
          <div
            className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #050507, transparent)' }}
          />
        </section>


        {/* ═══════════════════════════════════════════════════════════
            THE PROBLEM — THE ECONOMIC GAP
        ════════════════════════════════════════════════════════════ */}
        <section className="relative px-6 lg:px-12 py-44 overflow-hidden">

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
                  Most senior professionals negotiate from a baseline set years ago. The gap
                  between that baseline and their real market position compounds every year
                  it is left unaddressed. Catalyst removes the asymmetry — not by changing
                  your experience, but by changing how the market reads it.
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
                  Choose the depth of engagement that matches your positioning objectives.
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
                    {plan.roi && (
                      <span className="font-mono text-[0.52rem] tracking-[0.22em] uppercase text-signal-gold/60">
                        {plan.roi}
                      </span>
                    )}
                  </div>

                  {/* Name & subtitle */}
                  <h3 className="display-card text-3xl mb-1">{plan.name}</h3>
                  <p className="font-mono text-muted text-[0.52rem] tracking-widest uppercase mb-10">
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="pb-10 mb-10 border-b border-white/[0.07]">
                    <GeoPrice product={plan.product} variant="card" />
                    {plan.anchor && (
                      <p className="font-sans text-muted text-xs leading-relaxed italic mt-2">{plan.anchor}</p>
                    )}
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
            WHAT THE WORK CHANGES
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-44 max-w-dossier mx-auto">

          <div className="mb-20">
            <span className="eyebrow mb-6">What the Work Changes</span>
            <h2 className="display-section max-w-3xl mt-4">
              We rebuild how you are read.{' '}
              <em className="not-italic" style={{ color: 'var(--signal-gold)' }}>
                What happens next is yours.
              </em>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              {
                label: 'Profile',
                body: 'A profile that reads at your actual level, not a tier below it.',
              },
              {
                label: 'Narrative',
                body: 'A narrative a recruiter can place in the six seconds they spend on it.',
              },
              {
                label: 'Presence',
                body: 'A LinkedIn presence that signals authority instead of activity.',
              },
            ].map((item) => (
              <div key={item.label} className="card-glow p-12 flex flex-col">
                <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest uppercase mb-8">{item.label}</p>
                <p className="font-serif text-bone text-xl leading-snug flex-1">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="font-serif text-muted text-base leading-relaxed mt-12 max-w-2xl">
            Results depend on the market, the employer, and the candidate. Catalyst controls
            the signal. We do not guarantee outcomes.
          </p>
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

                <div className="p-5 border border-signal-gold/20 text-center" style={{ background: 'rgba(184,147,91,0.04)' }}>
                  <p className="font-mono text-muted text-[0.55rem] tracking-widest uppercase mb-2">Platform</p>
                  <p className="font-serif text-bone text-sm">In development — join the waitlist</p>
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
                  We are building an ongoing intelligence layer for professionals who manage
                  their career like a portfolio: skills demand mapping, signal tracking, and
                  network-gap analysis. It is in development. Join the waitlist to get early
                  access.
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
            INTELLIGENCE BRIEF — NEWSLETTER SUBSCRIBE
        ════════════════════════════════════════════════════════════ */}
        <section
          className="px-6 lg:px-12 py-32"
          style={{ background: '#050507', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-dossier mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

              {/* Left — copy */}
              <div>
                <span className="eyebrow mb-8 inline-block">Intelligence Brief</span>
                <h2
                  className="display-page mb-8 leading-tight"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
                >
                  The market intelligence<br/>
                  <em className="not-italic text-gold-gradient">serious leaders read.</em>
                </h2>
                <p className="font-serif text-muted text-lg leading-relaxed mb-10 max-w-lg">
                  Compensation movement, sector heat maps, and positioning strategy across
                  India, UAE, Singapore, and global markets. Written to inform decisions,
                  not generate clicks.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    'Live compensation benchmarks by role, sector, and geography',
                    'Sector heat maps — where demand is rising and where it is contracting',
                    'Positioning intelligence to close your market value gap',
                    'AI displacement analysis for your specific seniority level',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-signal-gold text-sm mt-0.5 shrink-0">◈</span>
                      <p className="font-sans text-muted text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div>
                <div className="border border-graphite/60 p-10 bg-graphite/5">
                  <p className="label-inst mb-3">Market intelligence for senior professionals</p>
                  <h3 className="font-serif text-bone text-2xl mb-2 leading-tight">
                    Subscribe to the brief.
                  </h3>
                  <p className="font-serif text-muted text-sm leading-relaxed mb-8">
                    One email weekly. No noise. Instant unsubscribe.
                  </p>
                  <NewsletterForm />
                </div>
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

            {/* Audit summary card */}
            <div
              className="max-w-md mx-auto mb-16 p-10 border border-white/[0.09] text-left"
              style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}
            >
              <GeoPrice product="audit" variant="card" className="mb-4" />
              <p className="font-sans text-muted text-sm leading-relaxed">
                One report. A precise, analyst-prepared picture of how your seniority is
                currently landing and the three highest-leverage moves to strengthen it.
              </p>
              <p className="font-mono text-muted text-[0.52rem] tracking-widest uppercase mt-6 opacity-50">
                Confidential · No call required · No obligation
              </p>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-4 mb-14">
              {['Analyst-prepared report', 'Confidential & discreet', 'No call required'].map((t) => (
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
                  Get your Market Value Audit — <GeoPrice product="audit" variant="cta" />
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
