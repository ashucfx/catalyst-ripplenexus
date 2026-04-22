import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Button } from '@/components/ui/Button'
import { CostDiagram } from '@/components/ui/CostDiagram'
import { TPIMeter } from '@/components/ui/TPIMeter'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────

const offerTiers = [
  {
    tier: 'I',
    name: 'Market Value Audit',
    subtitle: 'Start here',
    price: '$199',
    priceINR: '₹5,999',
    anchor: 'Anchored against a $5,000–$10,000 immediate salary gain from better negotiation.',
    deliverables: [
      '45-minute positioning diagnostic',
      'Talent Positioning Index (TPI) score',
      'ATS pass-rate analysis',
      'Salary benchmark vs. live market data',
      'Your three highest-leverage moves in 90 days',
    ],
    transformation: 'Uncertainty → Clarity on your real market value',
    href: '/audit',
    cta: 'Request Audit',
  },
  {
    tier: 'II',
    name: 'Positioning Blueprint',
    subtitle: 'Primary programme — most popular',
    price: '$1,500 – $3,500',
    priceINR: '₹1,00,000 – ₹2,50,000',
    anchor: 'Anchored against a $20,000–$50,000 annual salary increase.',
    deliverables: [
      'Executive CV — architected for a specific future role',
      'LinkedIn reconstruction — authority signals, not history',
      'Sector heat map: GCC / PE / SaaS opportunities',
      'Narrative strategy — what to say and what to leave out',
      'ATS stress-tested across Workday, Greenhouse, Lever',
      '30-day delivery · human + AI collaboration',
    ],
    transformation: 'Experienced Generalist → Recognised Niche Authority',
    href: '/blueprint',
    cta: 'Engage Blueprint',
    featured: true,
  },
  {
    tier: 'III',
    name: 'Sovereign Executive Suite',
    subtitle: 'For C-suite and board-level leaders',
    price: '$5,000 – $15,000+',
    priceINR: '₹5,00,000 – ₹15,00,000+',
    anchor: 'Risk-premium pricing — a fraction of a $500,000+ total compensation package.',
    deliverables: [
      'White-glove executive identity brief (90 min discovery)',
      'Board-ready governance portfolio',
      'Identity firewall and digital estate management',
      'High-stakes compensation negotiation coaching',
      'Stealth-mode visibility strategy',
      'Sovereign Network onboarding',
    ],
    transformation: 'Operational Executive → Institutional Asset',
    href: '/executive',
    cta: 'Engage Suite',
  },
]

const caseStudies = [
  {
    profile: 'Director → VP, Financial Services',
    challenge: 'Eight years at the same firm. Invisible externally. TPI score: 41 out of 100.',
    outcome: '$47,000 salary increase. VP offer within 11 weeks of Blueprint delivery.',
    metric: '+$47K',
    metricLabel: 'Salary Uplift',
  },
  {
    profile: 'Managing Director → Board Candidate',
    challenge: 'Board transition blocked by narrative risk. Previous agency produced vanity LinkedIn content.',
    outcome: 'Identity strategy rebuilt. Board seat secured within 6 months of Sovereign Executive Suite.',
    metric: '6 months',
    metricLabel: 'Board Seat Timeline',
  },
  {
    profile: 'Finance Leader — India → UAE Private Equity',
    challenge: 'GCC relocation with no PE network and compensation expectations misread by the market.',
    outcome: '67% total compensation increase. Catalyst-engineered positioning for GCC PE sector.',
    metric: '+67%',
    metricLabel: 'Total Comp Increase',
  },
]

const saasModules = [
  {
    name: 'Skills Ontology Mapper',
    desc: 'Real-time global demand data — what skills are hot, what they pay, and where the market is heading in three years.',
    icon: '◈',
  },
  {
    name: 'Narrative Discretion Engine',
    desc: 'Identifies the signals in your history that lower your market value. Shows exactly what to lead with — and what to omit.',
    icon: '◎',
  },
  {
    name: 'Network Gravity Tracker',
    desc: 'Maps the gaps in your professional network. Surfaces the specific people and firms you need to align with.',
    icon: '⬡',
  },
  {
    name: 'Career Pathing Canvas',
    desc: 'Model different futures. Quantify the real skill gaps for each path. Make career decisions from data, not instinct.',
    icon: '◲',
  },
]

const faqs = [
  {
    q: 'Is this just resume writing?',
    a: 'No. Resume writing optimises a document. We optimise how the entire talent market perceives your value. The CV is one of six outputs — not the product. The product is the signal the market receives about you, with or without a document in front of it.',
  },
  {
    q: 'How is Catalyst different from a career coach?',
    a: 'A career coach gives you guidance and accountability. We deliver architecture — specific documents, live market intelligence, and a positioning strategy with measurable salary outcomes. We are accountable for outputs, not conversations.',
  },
  {
    q: 'What salary increase can I realistically expect?',
    a: 'Across our client base, the average uplift from the Positioning Blueprint is $47,000 in the first 12 months. 92% of clients secure an equal or better role. The Market Value Audit will give you a specific, data-backed projection for your profile before you commit to anything.',
  },
  {
    q: 'Do I need to be actively job hunting?',
    a: 'No — and the best results come when you are not under pressure. Repositioning from a position of current employment and financial stability gives you negotiating power that desperation removes. Most of our clients are employed, not searching.',
  },
  {
    q: 'How long does the process take?',
    a: 'The Market Value Audit is a 45-minute conversation. The Positioning Blueprint is delivered in 30 days. The Sovereign Executive Suite timeline is bespoke — typically 60–90 days for the full engagement.',
  },
  {
    q: 'Which tier is right for me?',
    a: 'Take the free TPI assessment — it takes five minutes and gives you a directional score and a clear pathway recommendation. If you prefer a human conversation first, the Market Value Audit is the right starting point.',
  },
  {
    q: 'What sectors and markets do you specialise in?',
    a: 'Finance, Technology, Private Equity, and cross-border Indian talent transitions (India → UAE/GCC and India → US/UK). If your profile sits outside these areas, we will tell you honestly in the first conversation rather than take your money.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="pt-16">

        {/* ── SECTION 1: HERO ─────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col justify-center px-6 lg:px-12 py-24 max-w-dossier mx-auto">

          {/* Geo label */}
          <p className="label-inst mb-8">India · UAE · US/UK — Career Positioning</p>
          <hr className="rule mb-12 w-16" style={{ borderColor: '#B8935B' }} />

          {/* Headline — passes 5-second test */}
          <h1 className="font-serif font-light text-bone leading-tight tracking-[-0.025em] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}>
            You&apos;re worth more<br />
            than your salary says.
          </h1>

          {/* What we do — immediately clear */}
          <p className="font-serif text-muted max-w-2xl leading-relaxed mb-4"
             style={{ fontSize: '1.35rem' }}>
            Catalyst engineers the career positioning of senior professionals across India, UAE,
            and the US — so the global talent market pays what you are actually worth.
          </p>
          <p className="font-sans text-muted text-sm mb-12 max-w-xl">
            Not resume writing. Not career coaching.{' '}
            <span className="text-bone">A complete re-architecture of how the market sees your value.</span>
          </p>

          {/* CTAs — free entry point first, paid second */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button href="/tpi" variant="primary">
              Get Your Free TPI Score →
            </Button>
            <Button href="/request" variant="ghost">
              Book Audit — $199
            </Button>
          </div>

          {/* Proof bar */}
          <div className="mt-20 pt-8 border-t border-graphite grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '92%', l: 'Client placement rate' },
              { n: '$47K', l: 'Avg. salary uplift, Tier II' },
              { n: '11 wks', l: 'Median time-to-offer' },
              { n: '3', l: 'Markets: India · UAE · US/UK' },
            ].map((stat) => (
              <div key={stat.l}>
                <p className="font-mono text-signal-gold text-2xl mb-1">{stat.n}</p>
                <p className="font-sans text-muted text-xs tracking-wide">{stat.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: POSITIONING SIGNAL ───────────────────── */}
        <section className="border-t border-b border-graphite bg-graphite/20 py-8 px-6 lg:px-12">
          <div className="max-w-dossier mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="font-mono text-muted text-[0.65rem] tracking-widest">
                BY APPLICATION ONLY · DISCRETION GUARANTEED
              </p>
              <div className="flex flex-wrap gap-8">
                {['Finance', 'Technology', 'Private Equity', 'GCC Markets', 'India → UAE Transitions', 'Cross-border Mobility'].map((sector) => (
                  <span key={sector} className="font-sans text-muted text-xs tracking-wide opacity-60">{sector}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: THE PROBLEM ──────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite max-w-dossier mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label-inst mb-6">The Pay Gap Nobody Talks About</p>
              <h2 className="font-serif text-bone font-light leading-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}>
                79% of senior professionals earn 10–35% below their market rate.
              </h2>
              <p className="font-serif text-muted text-lg leading-relaxed mb-6">
                Not because they lack skill. Because they negotiate from an uninformed baseline —
                anchored to a salary set years ago under different market conditions.{' '}
                <span className="text-signal-gold">
                  For a mid-career manager, this gap costs $10,000 to $50,000 every year.
                </span>{' '}
                It compounds silently, permanently resetting your salary ceiling with every move
                you make.
              </p>
              <p className="font-serif text-muted text-lg leading-relaxed mb-8">
                AI-generated CVs have made this worse. When every candidate looks like a top
                performer on paper, recruiters stop trusting the document entirely. The professionals
                who win are those whose market signal is impossible to fake.
              </p>
              <Button href="/tpi" variant="text">
                See your TPI score — free
              </Button>
            </div>
            <div>
              <CostDiagram />
            </div>
          </div>
        </section>

        {/* ── SECTION 4: HOW IT WORKS ─────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite bg-graphite/20">
          <div className="max-w-dossier mx-auto">
            <p className="label-inst mb-6">The Process</p>
            <h2 className="font-serif text-bone font-light leading-tight mb-16"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Three stages. One outcome.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite mb-16">
              {[
                {
                  n: '01',
                  stage: 'Audit',
                  headline: 'Find out exactly where you stand.',
                  body: 'A 45-minute diagnostic with a Catalyst architect. We compute your Talent Positioning Index (TPI) — a single score across five dimensions that tells you precisely where you are underpriced, and why.',
                  output: 'TPI score · Salary benchmark · ATS pass rate · Repositioning map',
                  href: '/audit',
                },
                {
                  n: '02',
                  stage: 'Architect',
                  headline: 'We rebuild your professional identity.',
                  body: 'Not your CV. Your entire market signal. We re-engineer how recruiters, headhunters, and search algorithms perceive your seniority, authority, and value — across every touchpoint they encounter.',
                  output: 'CV · LinkedIn · Narrative strategy · Sector heat map · ATS-tested',
                  href: '/blueprint',
                },
                {
                  n: '03',
                  stage: 'Deploy',
                  headline: 'Enter the market from strength.',
                  body: 'You go to market positioned to command premium compensation — not searching desperately, but attracting the roles the market should already be offering you. The negotiation starts from a different place entirely.',
                  output: 'Market-ready in 30 days · 92% placement rate · Avg. $47K uplift',
                  href: '/request',
                },
              ].map((step) => (
                <div key={step.n} className="bg-obsidian p-8 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest">{step.n}</span>
                    <hr className="flex-1 rule" />
                    <span className="label-inst">{step.stage}</span>
                  </div>
                  <h3 className="font-serif text-bone text-xl font-light leading-snug">{step.headline}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed flex-1">{step.body}</p>
                  <div className="border-t border-graphite pt-4">
                    <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest leading-relaxed">{step.output}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Who it's for */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
              {[
                {
                  who: 'Entry-Level to Manager',
                  years: '2–8 years',
                  problem: 'Invisible to the firms that pay the most.',
                  outcome: 'A documented pathway into high-status organisations that the standard application process will never surface.',
                  tier: 'Market Value Audit',
                  href: '/audit',
                },
                {
                  who: 'Senior Manager to Director',
                  years: '8–15 years',
                  problem: 'Experience is real. The market reads you as an expensive generalist.',
                  outcome: 'A complete identity re-architecture. From experienced generalist to a niche authority the market pays a premium for.',
                  tier: 'Positioning Blueprint',
                  href: '/blueprint',
                },
                {
                  who: 'VP to C-Suite',
                  years: '15+ years',
                  problem: 'Reputation is everything. One wrong move erodes it.',
                  outcome: 'A strategic architect who manages your market positioning so you can focus on your leadership legacy.',
                  tier: 'Sovereign Executive Suite',
                  href: '/executive',
                },
              ].map((seg) => (
                <div key={seg.who} className="bg-obsidian p-8 flex flex-col gap-4">
                  <div>
                    <p className="label-inst mb-1">{seg.who}</p>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest">{seg.years}</p>
                  </div>
                  <hr className="rule" />
                  <p className="font-serif text-muted text-sm leading-relaxed italic">{seg.problem}</p>
                  <p className="font-serif text-bone text-sm leading-relaxed">{seg.outcome}</p>
                  <div className="mt-auto pt-4 border-t border-graphite">
                    <Button href={seg.href} variant="text">
                      {seg.tier} →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: OFFER STACK ───────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite">
          <div className="max-w-dossier mx-auto">
            <p className="label-inst mb-6">Services</p>
            <h2 className="font-serif text-bone font-light leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Three tiers. One system.
            </h2>
            <p className="font-serif text-muted text-lg mb-16 max-w-2xl">
              Every price is anchored against a provable salary outcome — not the cost of the service.
              This is a return-on-investment decision, not an expense.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
              {offerTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className={`flex flex-col gap-6 p-8 ${
                    tier.featured ? 'bg-graphite ring-1 ring-signal-gold' : 'bg-obsidian'
                  }`}
                >
                  {tier.featured && (
                    <p className="label-inst">Most Popular</p>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-signal-gold text-[0.6rem] tracking-[0.2em]">TIER {tier.tier}</span>
                    </div>
                    <h3 className="font-serif text-bone text-2xl font-light mb-1">{tier.name}</h3>
                    <p className="font-sans text-muted text-xs tracking-wide">{tier.subtitle}</p>
                  </div>

                  <div className="border-t border-graphite pt-4">
                    <p className="font-serif text-bone text-2xl">{tier.price}</p>
                    <p className="font-serif text-muted text-sm italic mt-0.5">{tier.priceINR}</p>
                    <p className="font-sans text-muted text-xs leading-relaxed mt-3">{tier.anchor}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {tier.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="text-signal-gold mt-1 text-xs shrink-0">—</span>
                        <span className="font-sans text-muted text-sm leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 border-t border-graphite">
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">OUTCOME</p>
                    <p className="font-serif text-signal-gold text-sm italic mb-6">{tier.transformation}</p>
                    <Button href={tier.href} variant={tier.featured ? 'primary' : 'ghost'}>
                      {tier.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Free entry nudge */}
            <div className="mt-6 text-center">
              <p className="font-sans text-muted text-sm">
                Not sure which tier? {' '}
                <Link href="/tpi" className="text-signal-gold hover:text-bone transition-colors underline underline-offset-2">
                  Take the free TPI assessment
                </Link>
                {' '} — five minutes, no commitment.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: CASE STUDIES ──────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite bg-graphite/20">
          <div className="max-w-dossier mx-auto">
            <p className="label-inst mb-6">Client Results</p>
            <h2 className="font-serif text-bone font-light leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Outcomes, not testimonials.
            </h2>
            <p className="font-serif text-muted text-lg mb-4 max-w-2xl">
              We do not display quote-cards. We display outcomes. All profiles are anonymised at
              client request — a standard feature of working at this level.
            </p>
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-16 max-w-2xl">
              ILLUSTRATIVE OUTCOMES — BASED ON COMPARABLE CLIENT PROFILES · INDIVIDUAL RESULTS VARY
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
              {caseStudies.map((cs) => (
                <div key={cs.profile} className="bg-obsidian p-8 flex flex-col gap-6">
                  <div className="border-b border-graphite pb-6">
                    <p className="font-mono text-signal-gold text-3xl">{cs.metric}</p>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mt-1">{cs.metricLabel}</p>
                  </div>
                  <div>
                    <p className="font-sans text-bone text-sm font-medium mb-4">{cs.profile}</p>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">STARTING POINT</p>
                    <p className="font-serif text-muted text-sm leading-relaxed mb-4 italic">{cs.challenge}</p>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">OUTCOME</p>
                    <p className="font-serif text-bone text-sm leading-relaxed">{cs.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 7: SAAS PLATFORM ─────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite max-w-dossier mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label-inst mb-6">The Catalyst Platform</p>
              <h2 className="font-serif text-bone font-light leading-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
                The same intelligence engine — available as a subscription.
              </h2>
              <p className="font-serif text-muted text-lg leading-relaxed mb-8">
                Four AI-powered modules that give any professional real-time visibility into their
                market position — starting at $49/month. For those not yet ready for full
                consulting, the platform is the bridge.
              </p>
              <div className="grid grid-cols-1 gap-px bg-graphite mb-8">
                {saasModules.map((m) => (
                  <div key={m.name} className="bg-obsidian p-5 flex gap-4 items-start">
                    <span className="text-signal-gold text-lg shrink-0 mt-0.5">{m.icon}</span>
                    <div>
                      <p className="font-sans text-bone text-sm font-medium mb-1">{m.name}</p>
                      <p className="font-sans text-muted text-xs leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button href="/platform" variant="ghost">
                Explore the platform
              </Button>
            </div>

            <div className="bg-graphite border border-graphite/50 p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-graphite">
                <div>
                  <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-1">TALENT POSITIONING DASHBOARD</p>
                  <p className="font-sans text-bone text-sm">Catalyst Pro · Active</p>
                </div>
                <InflectionMark size="sm" />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <TPIMeter score={67} size={120} />
                <div className="flex flex-col gap-3 flex-1">
                  {[
                    { label: 'Market Heat', value: 'High — Finance/PE sector', delta: '+12%' },
                    { label: 'Signal Strength', value: 'Director-level positioning', delta: 'Tier 2' },
                    { label: 'ATS Pass Rate', value: '73% — target is 90%+', delta: '↑ Improving' },
                    { label: 'Network Gaps', value: '3 influence gaps identified', delta: 'Action req.' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start border-b border-graphite pb-3">
                      <div>
                        <p className="font-mono text-muted text-[0.6rem] tracking-widest">{row.label}</p>
                        <p className="font-sans text-bone text-xs mt-0.5">{row.value}</p>
                      </div>
                      <p className="font-mono text-signal-gold text-[0.65rem]">{row.delta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px bg-graphite">
                {[
                  { tier: 'Lite', price: '$49/mo', note: 'Skills Mapper + ATS' },
                  { tier: 'Pro', price: '$199/mo', note: 'All modules + Reports' },
                  { tier: 'Enterprise', price: 'Custom', note: 'B2B Succession Intel' },
                ].map((t) => (
                  <div key={t.tier} className="bg-obsidian p-4 text-center">
                    <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-1">{t.tier}</p>
                    <p className="font-sans text-bone text-sm font-medium">{t.price}</p>
                    <p className="font-sans text-muted text-[0.65rem] mt-1 leading-tight">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FAQ ───────────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite bg-graphite/20">
          <div className="max-w-dossier mx-auto">
            <p className="label-inst mb-6">Common Questions</p>
            <h2 className="font-serif text-bone font-light leading-tight mb-16"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              What you need to know before starting.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-obsidian p-8 flex flex-col gap-4">
                  <h3 className="font-serif text-bone text-xl font-light leading-snug">{faq.q}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: NEWSLETTER CAPTURE ───────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t border-graphite">
          <div className="max-w-dossier mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="label-inst mb-6">The Intelligence Brief</p>
                <h2 className="font-serif text-bone font-light leading-tight mb-4"
                    style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-0.02em' }}>
                  Market intelligence, weekly. Free.
                </h2>
                <p className="font-serif text-muted text-lg leading-relaxed mb-4">
                  Original research on the professional talent market — compensation shifts,
                  sector heat maps, AI displacement trends, and positioning strategy. Written
                  for senior professionals, not job seekers.
                </p>
                <p className="font-mono text-muted text-[0.6rem] tracking-widest">
                  No spam · Unsubscribe anytime · Your email is never shared
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* ── SECTION 10: FINAL CTA ─────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-32 border-t border-graphite max-w-dossier mx-auto">
          <div className="max-w-3xl">
            <p className="label-inst mb-8">Begin</p>
            <h2 className="font-serif text-bone font-light leading-none tracking-[-0.03em] mb-8"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              The market has already priced you.
              <em className="text-signal-gold not-italic block">Wrong.</em>
            </h2>
            <p className="font-serif text-muted text-xl leading-relaxed mb-6">
              A Market Value Audit takes 45 minutes. It surfaces your TPI score, your salary
              gap against live market data, and the three highest-leverage moves you can make
              in the next 90 days.
            </p>
            <p className="font-mono text-signal-gold text-sm tracking-wide mb-12">
              Cost of the audit: $199. Cost of not doing it: $10,000–$50,000 per year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/request" variant="primary">
                Request a Market Value Audit →
              </Button>
              <Button href="/tpi" variant="ghost">
                Free TPI Score first
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

// ─── Newsletter Form (client island) ──────────────────────────────────
// Isolated client component — keeps the entire page as a server component
import { NewsletterForm } from '@/components/ui/NewsletterForm'
