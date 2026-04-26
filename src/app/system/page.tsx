import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { GeoPrice } from '@/components/ui/GeoPrice'

export const metadata: Metadata = {
  title: 'The System — Catalyst Institutional Architecture',
  description:
    'Catalyst is a professional identity engineering system that re-architects how the global talent market perceives your value.',
}

const differentiators = [
  {
    capability: 'CV and profile writing',
    typical: 'Generic templates. Keyword stuffing. No market intelligence.',
    catalyst: 'Architected for a specific future role. Built on signaling theory.',
  },
  {
    capability: 'Career coaching',
    typical: 'Guidance and encouragement. Billed by the hour.',
    catalyst: 'Architecture with measurable outputs. We deliver data and strategy.',
  },
  {
    capability: 'Executive search',
    typical: 'Works for the hiring company. Incentivised to fill the role.',
    catalyst: 'Works for you. Intelligence on real market caps and hidden supply.',
  },
  {
    capability: 'LinkedIn management',
    typical: 'Follower growth tactics. Vanity metrics.',
    catalyst: 'Signal reconstruction. Re-engineered as a market positioning asset.',
  },
]

const principles = [
  {
    title: 'AI has made the document worthless.',
    body: 'Every candidate now produces a perfect CV. The signal that differentiates you exists above the document level — in your narrative and perceived authority.',
  },
  {
    title: 'Pay gaps are positioning problems.',
    body: '79% of professionals earn 10–35% below their rate. They are underpositioned, negotiating from uninformed baselines anchored to legacy salaries.',
  },
  {
    title: 'You are priced on your future signal.',
    body: 'What the market pays you is determined by its perception of your future value. We change the signal from generalist to institutional asset.',
  },
  {
    title: 'Repositioning is a defensive move.',
    body: 'The best results come when you reposition from a position of current strength and financial stability — not under the pressure of a search.',
  },
]

export default function SystemPage() {
  return (
    <>
      <Header />
      <main className="pt-40 pb-32 grain">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="mb-32">
            <p className="label-inst mb-8 opacity-80">Operational Methodology · The Catalyst System</p>
            <h1 className="display-page mb-10">
              Not Coaching.<br />
              <em className="text-signal-gold not-italic">Architecture.</em>
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl">
              Catalyst is a professional identity engineering system. We re-architect how the
              global talent market perceives your seniority, authority, and value — so that
              compensation reflects your actual institutional power.
            </p>
          </div>

          {/* ── COMPARISON TABLE ────────────────────────────────────── */}
          <div className="mb-32">
            <p className="label-inst mb-12">Market Differentiation</p>
            <div className="glass overflow-x-auto border border-graphite/40">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-graphite/40">
                    <th className="text-left font-mono text-muted text-[0.6rem] tracking-widest py-6 px-10 w-1/4">CAPABILITY</th>
                    <th className="text-left font-mono text-muted text-[0.6rem] tracking-widest py-6 px-10 w-[37.5%]">TYPICAL APPROACH</th>
                    <th className="text-left font-mono text-signal-gold text-[0.6rem] tracking-widest py-6 px-10 w-[37.5%]">CATALYST SYSTEM</th>
                  </tr>
                </thead>
                <tbody>
                  {differentiators.map((row) => (
                    <tr key={row.capability} className="border-b border-graphite/20 last:border-0">
                      <td className="font-mono text-bone text-[0.7rem] py-8 px-10 align-top uppercase tracking-wider">{row.capability}</td>
                      <td className="font-serif text-muted text-sm py-8 px-10 leading-relaxed italic align-top">{row.typical}</td>
                      <td className="font-serif text-bone text-base py-8 px-10 leading-relaxed align-top">{row.catalyst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── THE CORE PRINCIPLES ─────────────────────────────────── */}
          <div className="mb-32">
            <p className="label-inst mb-12">Institutional Principles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite/40 border border-graphite/40">
              {principles.map((p, i) => (
                <div key={p.title} className="bg-obsidian p-12 flex flex-col gap-6 transition-all duration-500 hover:bg-graphite/20">
                  <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest uppercase">P-0{i + 1}</span>
                  <h3 className="display-card text-2xl">{p.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FINAL CTA ───────────────────────────────────────────── */}
          <div className="border-t border-graphite/40 pt-32 flex flex-col lg:flex-row gap-16 items-center justify-between">
            <div className="max-w-xl">
              <h2 className="display-card text-4xl mb-6 leading-tight">
                Understand the market. <br />
                <em className="text-signal-gold not-italic">Then change the signal.</em>
              </h2>
              <p className="font-serif text-muted text-lg leading-relaxed">
                Start with a directional TPI assessment to see your exact positioning gap.
                No commitment, just data.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <Button href="/tpi" variant="primary" className="w-full sm:w-auto justify-center">
                Calculate TPI Score →
              </Button>
              <Button href="/audit" variant="ghost" className="w-full sm:w-auto justify-center">
                Book Audit — <GeoPrice product="audit" variant="cta" />
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
