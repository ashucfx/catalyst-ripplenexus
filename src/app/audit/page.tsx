import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { AuditCheckout } from '@/components/ui/AuditCheckout'

export const metadata: Metadata = {
  title: 'Market Value Audit — Tier I',
  description:
    'A 45-minute intelligence session that surfaces your Talent Positioning Index, ATS gap profile, and the exact repositioning moves that will compound your market value.',
}

export default function AuditPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <p className="label-inst mb-6">Tier I — Entry Offer</p>
            <hr className="rule mb-10 w-16 border-signal-gold" style={{ borderColor: '#B8935B' }} />
            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.025em' }}>
              Market Value Audit
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl mb-4">
              Information asymmetry regarding your true market worth is the single most
              expensive mistake a professional can make. This audit eliminates it.
            </p>
            <div className="flex items-baseline gap-4 mt-8">
              <span className="font-serif text-bone text-4xl">$499</span>
              <span className="font-serif text-muted text-xl">/ ₹15,000</span>
              <span className="font-mono text-muted text-xs tracking-widest ml-2">FIXED FEE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">

            {/* What it solves */}
            <div>
              <p className="label-inst mb-6">The Problem It Solves</p>
              <h2 className="font-serif text-bone text-2xl font-light mb-6">
                You are pricing yourself wrong.
              </h2>
              <div className="prose-catalyst">
                <p>
                  Approximately 79% of professionals are operating with salary ceilings that are
                  10–35% below their actual market rate. They are not underskilled. They are
                  underpositioned.
                </p>
                <p>
                  The Market Value Audit is a low-friction entry point designed to expose the{' '}
                  <strong>Cost of Inaction</strong> — the compounding annual loss that accrues
                  every year you negotiate from an uninformed baseline.
                </p>
                <p>
                  Anchored against the potential <strong>$5,000–$10,000 immediate salary gain</strong>{' '}
                  from better negotiation in the next role conversation.
                </p>
              </div>
            </div>

            {/* TPI Demo */}
            <div className="bg-graphite border border-graphite/50 p-8">
              <p className="label-inst mb-6">Sample Audit Output</p>
              <div className="flex flex-col items-center gap-8">
                <TPIMeter score={67} size={140} />
                <div className="w-full">
                  {[
                    { label: 'Sector Alignment', value: 'Finance — Mid-Market PE', score: '61/100' },
                    { label: 'ATS Pass Rate', value: '73% (target: 90%+)', score: 'Gap: High' },
                    { label: 'Narrative Clarity', value: 'Generalist signals dominant', score: '54/100' },
                    { label: 'Salary Positioning', value: '₹14.2L vs. ₹18.5L market', score: '-23%' },
                  ].map((row) => (
                    <div key={row.label}
                         className="flex justify-between items-center py-3 border-b border-graphite">
                      <div>
                        <p className="font-mono text-muted text-[0.6rem] tracking-widest">{row.label}</p>
                        <p className="font-sans text-bone text-xs mt-0.5">{row.value}</p>
                      </div>
                      <span className="font-mono text-signal-gold text-xs">{row.score}</span>
                    </div>
                  ))}
                </div>
                <p className="font-sans text-muted text-xs leading-relaxed text-center">
                  This is an illustrative output. Your actual TPI is calculated from live market
                  benchmarks and your specific profile data.
                </p>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-10">What You Receive</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
              {[
                {
                  title: '45-min Assessment',
                  desc: 'A structured intelligence session with a Catalyst Executive Architect. Behavioral psychology-informed. Not a coaching call — a diagnostic.',
                },
                {
                  title: 'Talent Positioning Index (TPI)',
                  desc: 'Your proprietary market score across five dimensions: narrative clarity, signal strength, sector alignment, ATS performance, and salary positioning.',
                },
                {
                  title: 'ATS Gap Analysis',
                  desc: 'Every deliverable run through our proprietary ATS Simulator. Mimics Workday, Greenhouse, and Lever. You see exactly what a machine sees.',
                },
                {
                  title: 'Salary Benchmark Report',
                  desc: 'Hyper-local compensation data from Ravio, Taggd, and Lightcast. Your current package vs. what your role is paying in the market right now.',
                },
                {
                  title: 'Priority Repositioning Map',
                  desc: 'The three highest-leverage moves you can make in the next 90 days to increase your market value. Sequenced and specific.',
                },
                {
                  title: 'Pathway Recommendation',
                  desc: 'Whether the Positioning Blueprint or Sovereign Executive Suite is the right next step — and why. No upsell pressure. Just the honest answer.',
                },
              ].map((d) => (
                <div key={d.title} className="bg-obsidian p-8">
                  <h3 className="font-serif text-bone text-xl font-light mb-4">{d.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation */}
          <div className="mb-20 border-t border-graphite pt-16 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <p className="label-inst mb-4">The Transformation</p>
              <div className="flex items-center gap-4">
                <p className="font-serif text-muted text-2xl italic">Uncertainty</p>
                <span className="text-signal-gold text-2xl">→</span>
                <p className="font-serif text-signal-gold text-2xl">Clarity on Market Value</p>
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="font-serif text-bone text-4xl mb-2">$499</p>
              <p className="font-sans text-muted text-sm">vs. $5,000–$10,000 immediate salary gain</p>
              <p className="font-mono text-signal-gold text-xs tracking-widest mt-2">10–20× RETURN POTENTIAL</p>
            </div>
          </div>

          {/* CTA — live checkout */}
          <div className="border-t border-graphite pt-16">
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="font-serif text-bone text-3xl font-light mb-4">
                Book your Audit now.
              </h2>
              <p className="font-serif text-muted text-lg">
                45 minutes. Your TPI score. A repositioning map that changes the next negotiation.
              </p>
            </div>
            <AuditCheckout />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
