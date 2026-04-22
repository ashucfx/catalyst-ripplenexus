import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { PricingSection } from '@/components/ui/PricingSection'

export const metadata: Metadata = {
  title: 'Catalyst Platform — The Intelligence Engine',
  description:
    'The Catalyst Intelligence Engine (CIE) — four modules powering real-time career positioning. Skills Ontology Mapper, Narrative Discretion Agent, Network Gravity Tracker, Career Pathing Canvas.',
}

const modules = [
  {
    id: '01',
    name: 'Skills Ontology Mapper',
    icon: '◈',
    desc: 'Pulls from global labor market data — Ravio, Taggd, Lightcast — to create a single source of truth for what skills are actually in demand and what they are worth in real time. Uses Skills Forecasting to tell you not just what you are worth today, but what you will be worth in three years if you follow a specific developmental path.',
    output: 'Live skill-value heat map, 3-year trajectory forecast, sector demand index.',
  },
  {
    id: '02',
    name: 'Narrative Discretion Agent',
    icon: '◎',
    desc: 'Analyzes your professional history and identifies "Red Flags" or "Dilutive Signals" that lower your market value. Provides specific recommendations on what to emphasize and what to strategically omit to maintain Executive Gravity.',
    output: 'Narrative audit report, strategic omission list, identity signal score.',
  },
  {
    id: '03',
    name: 'Network Gravity Tracker',
    icon: '⬡',
    desc: 'Maps your professional network and identifies Influence Gaps — the specific individuals, firms, and organizations you should align with to increase your Social Capital. Surfaces the connectors between you and your target roles.',
    output: 'Influence gap analysis, strategic alignment recommendations, network heat map.',
  },
  {
    id: '04',
    name: 'Career Pathing Canvas',
    icon: '◲',
    desc: 'A visual interface where clients can model different Future Selves. Shows the magnitude of skill gaps for different career moves, allowing for data-driven decision making during a mid-career crisis. Not hypothetical — calibrated against live market data.',
    output: 'Multi-path career model, skill gap quantification, probability-weighted outcomes.',
  },
]


export default function PlatformPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <p className="label-inst mb-6">The Catalyst Intelligence Engine (CIE)</p>
            <hr className="rule mb-10 w-16 border-signal-gold" style={{ borderColor: '#B8935B' }} />
            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.025em' }}>
              From consultancy<br />to platform
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl">
              The same proprietary intelligence that powers our human consultants is now
              available as a self-serve SaaS platform. The CIE captures the mid-market and
              entry-level segments that cannot access $5,000 consulting packages — and turns
              continuous career optimization into a subscription.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="bg-graphite border border-graphite/60 p-8 mb-20">
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-graphite">
              <div>
                <p className="label-inst mb-1">TALENT POSITIONING DASHBOARD</p>
                <p className="font-sans text-bone text-sm">Catalyst Pro — Active · Profile: Head of Finance</p>
              </div>
              <InflectionMark size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex justify-center">
                <TPIMeter score={74} size={130} />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { label: 'Market Heat — PE Sector', value: 'High Demand', badge: '↑ +12%', color: 'text-signal-gold' },
                  { label: 'ATS Pass Rate', value: '71% → target 90%', badge: 'Action req.', color: 'text-signal-gold' },
                  { label: 'Narrative Signal', value: 'FP&A Authority — strong', badge: 'TPI: 74', color: 'text-bone' },
                  { label: 'Network Gaps', value: '4 influence gaps', badge: 'Review ready', color: 'text-muted' },
                  { label: 'Salary vs. Market', value: '₹18.4L vs. ₹23.2L', badge: '-21%', color: 'text-signal-gold' },
                  { label: 'Next Skill Priority', value: 'FP&A → CFO signals', badge: 'Q2 2026', color: 'text-bone' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-obsidian p-4 border border-graphite">
                    <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-1">{stat.label}</p>
                    <p className={`font-sans text-sm ${stat.color}`}>{stat.value}</p>
                    <p className="font-mono text-muted text-[0.55rem] tracking-widest mt-1">{stat.badge}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills heat map bars */}
            <div className="border-t border-graphite pt-6">
              <p className="label-inst mb-4">Skills Heat Map — Finance / PE Sector</p>
              <div className="flex flex-col gap-3">
                {[
                  { skill: 'Financial Modelling', demand: 88, yours: 82 },
                  { skill: 'M&A Due Diligence', demand: 91, yours: 55 },
                  { skill: 'Board Reporting', demand: 76, yours: 70 },
                  { skill: 'AI-enabled FP&A', demand: 94, yours: 31 },
                ].map((s) => (
                  <div key={s.skill} className="flex items-center gap-4">
                    <p className="font-mono text-muted text-[0.6rem] tracking-wide w-40 shrink-0">{s.skill}</p>
                    <div className="flex-1 h-1.5 bg-graphite relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-graphite"
                        style={{ width: `${s.demand}%`, background: '#1F2226' }}
                      />
                      <div
                        className="absolute top-0 left-0 h-full bg-signal-gold"
                        style={{ width: `${s.yours}%`, opacity: 0.7 }}
                      />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className="font-mono text-muted text-[0.6rem]">{s.yours}%</span>
                      <span className="font-mono text-muted text-[0.6rem]">/</span>
                      <span className="font-mono text-signal-gold text-[0.6rem]">{s.demand}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-muted text-[0.6rem] mt-3">
                <span className="inline-block w-3 h-1 bg-signal-gold/70 mr-2 align-middle" />Your profile &nbsp;
                <span className="inline-block w-3 h-1 bg-graphite mr-2 align-middle" />Market demand
              </p>
            </div>
          </div>

          {/* Four modules */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-10">The Four Core Modules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
              {modules.map((m) => (
                <div key={m.id} className="bg-obsidian p-8 flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <span className="text-signal-gold text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-mono text-muted text-[0.6rem] tracking-widest">{m.id}</p>
                      <h3 className="font-serif text-bone text-xl font-light">{m.name}</h3>
                    </div>
                  </div>
                  <p className="font-sans text-muted text-sm leading-relaxed">{m.desc}</p>
                  <div className="border-t border-graphite pt-4">
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">OUTPUT</p>
                    <p className="font-serif text-signal-gold text-sm italic">{m.output}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing tiers */}
          <PricingSection />

          {/* B2B callout */}
          <div className="border border-signal-gold/20 p-10 bg-graphite/10 mb-20">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="label-inst mb-4">B2B Enterprise — Succession Management Intelligence</p>
                <h2 className="font-serif text-bone text-2xl font-light mb-4">
                  Selling Readiness Intelligence to organisations
                </h2>
                <p className="font-serif text-muted text-lg leading-relaxed">
                  The Catalyst Enterprise platform sells &ldquo;Readiness Intelligence&rdquo; to HR
                  departments to help them identify high-potential internal talent, reduce turnover
                  risk, and make data-driven succession decisions. The same engine that services
                  individuals becomes an institutional asset for the organisation.
                </p>
              </div>
              <div className="shrink-0">
                <Button href="/request" variant="ghost">
                  Contact for Enterprise →
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
