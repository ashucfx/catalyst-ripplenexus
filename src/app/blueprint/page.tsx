import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Positioning Blueprint — Tier II',
  description:
    'The primary revenue driver. A complete re-engineering of the professional persona for those aiming for Director/VP and above.',
}

export default function BlueprintPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <p className="label-inst mb-6">Tier II — Core Offer · Primary Revenue Driver</p>
            <hr className="rule mb-10 w-16 border-signal-gold" style={{ borderColor: '#B8935B' }} />
            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.025em' }}>
              The Positioning Blueprint
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl mb-4">
              A complete re-engineering of your professional persona. From Experienced Generalist
              to Niche Authority. The mid-career plateau ends here.
            </p>
            <div className="flex items-baseline gap-4 mt-8">
              <span className="font-serif text-bone text-4xl">$1,500 – $3,500</span>
              <span className="font-serif text-muted text-xl">/ ₹1,00,000 – ₹2,50,000</span>
            </div>
            <p className="font-mono text-muted text-xs tracking-widest mt-2">
              ANCHORED AGAINST $20,000–$50,000 ANNUAL SALARY INCREASE
            </p>
          </div>

          {/* The crisis this solves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <p className="label-inst mb-6">The Problem It Solves</p>
              <h2 className="font-serif text-bone text-2xl font-light mb-6">
                The Mid-Career Plateau is not a skills problem.
              </h2>
              <div className="prose-catalyst">
                <p>
                  Research identifies the mid-career segment (ages 43–62) as the most vulnerable
                  and the most lucrative. These professionals are experiencing the &ldquo;two-edged
                  problem&rdquo; of skill obsolescence anxiety and career plateauing simultaneously.
                </p>
                <p>
                  The stagnation is not caused by lack of skill. It is caused by a failure of
                  <strong> signaling</strong>. Their experience is real. Their positioning does not
                  communicate it to the market. Fifteen years of expertise is being read as
                  &ldquo;expensive generalist&rdquo; by the ATS systems and headhunters who hold
                  the keys to the next role.
                </p>
                <p>
                  The Positioning Blueprint re-engineers the signal, not the CV.
                </p>
              </div>
            </div>

            {/* Emotional drivers */}
            <div className="border border-graphite p-8 bg-graphite/20">
              <p className="label-inst mb-6">The Psychology of This Buyer</p>
              <div className="flex flex-col gap-6">
                {[
                  { type: 'Real Problem', text: 'Skill obsolescence, technological anxiety, feeling overtaken by younger, cheaper talent.' },
                  { type: 'Emotional Driver', text: '"Identity Moratorium" — a disconnection from the professional self. Resentment toward the workplace. Loss of professional purpose.' },
                  { type: 'Buying Trigger', text: '"The Second Act" — a methodology that transforms decades of experience into a Sovereign Identity capable of commanding premium compensation in the digital economy.' },
                ].map((item) => (
                  <div key={item.type} className="border-b border-graphite pb-6 last:border-0 last:pb-0">
                    <p className="label-inst mb-2">{item.type}</p>
                    <p className="font-serif text-muted text-base leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-10">What You Receive — The Full Blueprint</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
              {[
                {
                  module: '01',
                  title: 'Executive CV with Impact-Driven Architecture',
                  desc: 'Not a summary of your past. A strategic document architected to signal a specific future role. ATS-stress-tested. Built on signaling theory, not template.',
                },
                {
                  module: '02',
                  title: 'LinkedIn Strategic Authority Suite',
                  desc: 'Complete LinkedIn reconstruction. Headline, About, Experience, Featured — all re-engineered to function as "signal reconstruction" assets, not a digital CV.',
                },
                {
                  module: '03',
                  title: 'Targeted Market Positioning Report',
                  desc: 'Maps your Talent Positioning Index against high-growth sectors. GCCs, PE funds, SaaS scaleups. Where your profile generates maximum market heat.',
                },
                {
                  module: '04',
                  title: 'Narrative Discretion Briefing',
                  desc: 'What to emphasize. What to omit. How to frame the trajectory from where you are to where the market will pay. The single most important document in the system.',
                },
                {
                  module: '05',
                  title: 'ATS Stress Testing',
                  desc: 'Every deliverable run through our proprietary ATS Simulator. Workday. Greenhouse. Lever. Your materials will pass, not be filtered.',
                },
                {
                  module: '06',
                  title: '30-Day Delivery + Human/AI Collaboration',
                  desc: 'Human architects handle strategy, discretion, and psychological positioning. AI handles the first 70% of drafting. You get institutional-quality output at speed.',
                },
              ].map((d) => (
                <div key={d.module} className="bg-obsidian p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-signal-gold text-xs tracking-widest">{d.module}</span>
                    <hr className="flex-1 rule" />
                  </div>
                  <h3 className="font-serif text-bone text-xl font-light">{d.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Global pricing */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-10">Pricing — India & Global</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
              <div className="bg-obsidian p-8">
                <p className="label-inst mb-4">India Market</p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-graphite">
                      <th className="text-left font-mono text-muted text-[0.6rem] tracking-widest py-2">SENIORITY</th>
                      <th className="text-right font-mono text-muted text-[0.6rem] tracking-widest py-2">PACKAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: 'Mid Level (6–10y)', price: '₹1,00,000' },
                      { role: 'Senior (11–15y)', price: '₹2,50,000' },
                    ].map((r) => (
                      <tr key={r.role} className="border-b border-graphite">
                        <td className="font-serif text-bone py-3">{r.role}</td>
                        <td className="font-mono text-signal-gold text-right py-3">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-obsidian p-8">
                <p className="label-inst mb-4">US / UK / UAE</p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-graphite">
                      <th className="text-left font-mono text-muted text-[0.6rem] tracking-widest py-2">LEVEL</th>
                      <th className="text-right font-mono text-muted text-[0.6rem] tracking-widest py-2">PACKAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: 'Manager → Director', price: '$1,500' },
                      { role: 'Director → VP', price: '$2,500–$3,500' },
                    ].map((r) => (
                      <tr key={r.role} className="border-b border-graphite">
                        <td className="font-serif text-bone py-3">{r.role}</td>
                        <td className="font-mono text-signal-gold text-right py-3">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-graphite pt-16 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <p className="font-serif text-signal-gold italic text-2xl mb-2">
                From Experienced Generalist → Niche Authority.
              </p>
              <p className="font-sans text-muted text-sm">30-day delivery. Human + AI architecture.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Button href="/request" variant="primary">
                Engage the Blueprint →
              </Button>
              <Button href="/audit" variant="ghost">
                Start with the Audit first
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
