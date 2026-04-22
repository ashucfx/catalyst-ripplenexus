import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'How It Works — The Catalyst Positioning System',
  description:
    'Catalyst is not career coaching or resume writing. It is a professional identity engineering system that re-architects how the global talent market perceives your value.',
}

const differentiators = [
  {
    capability: 'CV and profile writing',
    typical: 'Generic templates. Keyword stuffing. No market intelligence.',
    catalyst: 'Architected for a specific future role. Built on signaling theory, not template.',
  },
  {
    capability: 'Career coaching',
    typical: 'Guidance, accountability, and encouragement. Billed by the hour.',
    catalyst: 'Architecture with measurable outputs. You receive documents, data, and a strategy — not advice.',
  },
  {
    capability: 'Executive search',
    typical: 'Works for the hiring company. Incentivised to fill the role, not optimise your outcome.',
    catalyst: 'Works for you. Intelligence on which firms are hiring, at what levels, and at what compensation.',
  },
  {
    capability: 'LinkedIn optimisation',
    typical: 'Profile rewrite. Follower growth tactics. Vanity metrics.',
    catalyst: 'Signal reconstruction. Your LinkedIn is re-engineered to function as a market positioning asset, not a digital CV.',
  },
  {
    capability: 'Salary negotiation',
    typical: 'Generic scripts and tactics applied without market data.',
    catalyst: 'Data-driven benchmarks from Ravio, Taggd, and Lightcast. You negotiate from knowledge, not instinct.',
  },
]

const journey = [
  {
    stage: 'Discovery',
    label: '01',
    action: 'Market Value Audit — 45 minutes',
    outcome: 'You see your Talent Positioning Index, salary gap, ATS pass rate, and the three highest-leverage moves you can make in the next 90 days. Clarity replaces assumption.',
    href: '/audit',
  },
  {
    stage: 'Architecture',
    label: '02',
    action: 'Positioning Blueprint — 30 days',
    outcome: 'Your professional identity is re-built from the ground up. CV, LinkedIn, narrative strategy, sector targeting, and ATS optimisation — delivered as a complete system, not a document.',
    href: '/blueprint',
  },
  {
    stage: 'Deployment',
    label: '03',
    action: 'Market entry from strength',
    outcome: 'You approach the market as a positioned authority, not a candidate. The negotiation starts from a fundamentally different place. Roles come to you.',
    href: '/request',
  },
  {
    stage: 'Continuity',
    label: '04',
    action: 'Catalyst Platform — ongoing subscription',
    outcome: 'Real-time market intelligence. Skills heat maps. Network gap analysis. Your positioning does not freeze after delivery — it compounds.',
    href: '/platform',
  },
]

const principles = [
  {
    title: 'AI has made the document worthless.',
    body: 'Every candidate now produces a syntactically perfect CV. The document is noise. The signal that differentiates you exists above the document level — in your narrative, your network, and the market\'s perception of your authority.',
  },
  {
    title: 'The pay gap is a positioning problem, not a skill problem.',
    body: '79% of professionals earn 10–35% below their market rate. They are not underskilled. They are negotiating from an uninformed baseline anchored to a salary set years ago. The fix is market intelligence, not more qualifications.',
  },
  {
    title: 'You are priced on your signal, not your history.',
    body: 'What the market pays you is determined by what it perceives your future value to be. A professional whose signal says "experienced generalist" is priced as one — regardless of their actual capability. We change the signal.',
  },
  {
    title: 'The best time to reposition is before you need to.',
    body: 'Repositioning under pressure — after a redundancy, after a performance review — compresses your options and weakens your leverage. The professionals who command the largest premiums reposition from a position of strength.',
  },
]

export default function SystemPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <p className="label-inst mb-6">The System</p>
            <hr className="rule mb-10 w-16" style={{ borderColor: '#B8935B' }} />
            <h1
              className="font-serif text-bone font-light leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.025em' }}
            >
              Not coaching.<br />
              Not writing.<br />
              <em className="text-signal-gold not-italic">Architecture.</em>
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl">
              Catalyst is a professional identity engineering system. We re-architect how the
              global talent market perceives your seniority, authority, and market value — so
              that the compensation the market offers you reflects what you are actually worth.
            </p>
          </div>

          {/* What makes it different */}
          <div className="mb-20">
            <p className="label-inst mb-6">How Catalyst is Different</p>
            <h2 className="font-serif text-bone text-3xl font-light mb-10">
              Everything you have tried. Why it has not worked.
            </h2>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-graphite">
                    <th className="text-left font-mono text-muted text-[0.6rem] tracking-widest py-3 pr-8 w-1/4">SERVICE</th>
                    <th className="text-left font-mono text-muted text-[0.6rem] tracking-widest py-3 pr-8 w-[37.5%]">TYPICAL APPROACH</th>
                    <th className="text-left font-mono text-signal-gold text-[0.6rem] tracking-widest py-3 w-[37.5%]">CATALYST</th>
                  </tr>
                </thead>
                <tbody>
                  {differentiators.map((row) => (
                    <tr key={row.capability} className="border-b border-graphite">
                      <td className="font-sans text-bone text-sm py-4 pr-8 align-top">{row.capability}</td>
                      <td className="font-serif text-muted text-sm py-4 pr-8 leading-relaxed italic align-top">{row.typical}</td>
                      <td className="font-serif text-bone text-sm py-4 leading-relaxed align-top">{row.catalyst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* The four principles */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-6">Why This Works</p>
            <h2 className="font-serif text-bone text-3xl font-light mb-10">
              Four things that are provably true about the professional market.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
              {principles.map((p, i) => (
                <div key={p.title} className="bg-obsidian p-8 flex flex-col gap-4">
                  <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif text-bone text-xl font-light leading-snug">{p.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The journey */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-6">The Journey</p>
            <h2 className="font-serif text-bone text-3xl font-light mb-10">
              From where you are to where you should be.
            </h2>
            <div className="flex flex-col">
              {journey.map((j, i) => (
                <div key={j.label} className="flex gap-8 pb-12 relative">
                  {i < journey.length - 1 && (
                    <div className="absolute left-7 top-14 bottom-0 w-px bg-graphite" />
                  )}
                  <div className="w-14 h-14 shrink-0 border border-signal-gold flex items-center justify-center z-10 bg-obsidian">
                    <span className="font-mono text-signal-gold text-xs tracking-widest">{j.label}</span>
                  </div>
                  <div className="pt-3">
                    <p className="label-inst mb-2">{j.stage}</p>
                    <p className="font-sans text-bone text-sm font-medium mb-3">{j.action}</p>
                    <p className="font-serif text-muted text-base italic leading-relaxed mb-4">{j.outcome}</p>
                    <Button href={j.href} variant="text">
                      Learn more
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="border border-signal-gold/20 p-10 bg-graphite/10 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  label: 'Not This',
                  items: ['Resume writing service', 'Career coaching', 'LinkedIn management', 'Job board or recruiter'],
                },
                {
                  label: 'What Catalyst Is',
                  items: ['Professional identity engineering', 'Market intelligence system', 'Strategic positioning consultancy', 'Human expertise + AI infrastructure'],
                },
                {
                  label: 'The Closest Comparisons',
                  items: ['Boutique strategy consulting', 'Executive search (on your side)', 'Private wealth management', 'McKinsey / Bain — for career capital'],
                },
              ].map((col) => (
                <div key={col.label}>
                  <p className="label-inst mb-4">{col.label}</p>
                  <ul className="flex flex-col gap-2">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-signal-gold text-xs mt-1 shrink-0">—</span>
                        <span className="font-sans text-muted text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-graphite pt-16 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div>
              <p className="font-serif text-signal-gold italic text-2xl mb-2">
                Five minutes to see where you stand.
              </p>
              <p className="font-sans text-muted text-sm">
                The free TPI assessment gives you a directional score and a specific gap analysis.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button href="/tpi" variant="primary">
                Get Free TPI Score →
              </Button>
              <Button href="/request" variant="ghost">
                Book Audit — $199
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
