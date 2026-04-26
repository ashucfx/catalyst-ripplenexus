import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { GeoPrice } from '@/components/ui/GeoPrice'
import { Disclaimer } from '@/components/ui/Disclaimer'

export const metadata: Metadata = {
  title: 'Positioning Blueprint — Tier III Architecture',
  description:
    'A complete re-engineering of the professional persona for those aiming for Director, VP, and Board-level roles.',
}

export default function BlueprintPage() {
  return (
    <>
      <Header />
      <main className="pt-40 pb-32 grain">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="mb-32">
            <p className="label-inst mb-8 opacity-80">Tier III Engagements · Portfolio Architecture</p>
            <h1 className="display-page mb-10">
              The Positioning Blueprint
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
              <p className="font-serif text-muted text-xl leading-relaxed max-w-xl">
                A complete re-architecture of your professional persona. From
                &ldquo;Experienced Generalist&rdquo; to &ldquo;Niche Authority.&rdquo;
                The mid-career plateau ends here.
              </p>
              <div className="lg:text-right">
                <div className="flex items-baseline lg:justify-end gap-4 mb-2">
                  <GeoPrice product="blueprint" variant="hero" />
                </div>
                <p className="font-mono text-signal-gold text-[0.6rem] tracking-[0.3em] uppercase">30-Day Delivery · Human + AI Collaboration</p>
              </div>
            </div>
          </div>

          {/* ── THE CRISIS ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-start">
            <div className="reveal-on-scroll visible">
              <p className="label-inst mb-8">The Stagnation Thesis</p>
              <h2 className="display-card text-3xl leading-tight mb-8">
                The Mid-Career Plateau is not a skills problem. It is a signaling failure.
              </h2>
              <div className="prose-catalyst">
                <p>
                  Most professionals between 10–25 years of experience suffer from the
                  &ldquo;identity moratorium&rdquo; — a disconnect between their actual
                  institutional depth and how the market perceives them.
                </p>
                <p>
                  Recruiters and ATS systems read 15 years of excellence as &ldquo;expensive
                  generalist&rdquo; because your positioning does not bridge the gap to the
                  future value you bring. The Blueprint re-engineers the signal across
                  every touchpoint.
                </p>
              </div>
            </div>

            <div className="glass p-10 border border-graphite/40">
              <p className="label-inst mb-8">The Psychology of Authority</p>
              <div className="space-y-8">
                {[
                  { label: 'The Problem', text: 'Skill obsolescence anxiety and feeling overtaken by younger talent.' },
                  { label: 'The Reality', text: 'Your experience is your moat, but it is currently invisible to recruiters.' },
                  { label: 'The Solution', text: 'A Sovereign Identity methodology that commands premium compensation.' },
                ].map((item) => (
                  <div key={item.label} className="border-b border-graphite/40 pb-6 last:border-0 last:pb-0">
                    <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest uppercase mb-2">{item.label}</p>
                    <p className="font-serif text-muted text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── THE SYSTEM: MODULES ─────────────────────────────────── */}
          <div className="mb-32">
            <p className="label-inst mb-12">The Blueprint Modules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-graphite/40 border border-graphite/40">
              {[
                {
                  id: '01',
                  title: 'Executive Resume Rewrite',
                  desc: 'A complete structural re-architecture. We don&apos;t summarize your past; we engineer your authority for the next role.',
                },
                {
                  id: '02',
                  title: 'LinkedIn Brand Identity',
                  desc: 'Complete profile reconstruction. Bespoke Banner and DP strategy designed for institutional credibility.',
                },
                {
                  id: '03',
                  title: 'Narrative Cover Letter',
                  desc: 'The narrative key to the boardroom. Bridges the gap between your history and the firm&apos;s specific future.',
                },
                {
                  id: '04',
                  title: 'Market Heat Report',
                  desc: 'Mapping your TPI against high-growth sectors: GCCs, Private Equity, and SaaS Scaleups.',
                },
                {
                  id: '05',
                  title: 'Signal Discretion Brief',
                  desc: 'The definitive guide on what to lead with — and what to strategically omit for maximum leverage.',
                },
                {
                  id: '06',
                  title: 'ATS Stress-Testing',
                  desc: 'Every deliverable run through Workday, Greenhouse, and Lever simulations to ensure algorithmic dominance.',
                },
              ].map((m) => (
                <div key={m.id} className="bg-obsidian p-10 flex flex-col gap-6">
                  <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest">{m.id}</span>
                  <h3 className="display-card text-xl">{m.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── PRICING MATRIX ──────────────────────────────────────── */}
          <div className="mb-32">
            <p className="label-inst mb-12">Engagement Matrix</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite/40 border border-graphite/40">
              <div className="bg-obsidian p-10">
                <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest uppercase mb-8">India · domestic Market</p>
                <div className="space-y-6">
                  {[
                    { l: 'Mid-Level (6–10y)', p: '₹9,999' },
                    { l: 'Senior (11–20y)', p: '₹14,999' },
                  ].map((row) => (
                    <div key={row.l} className="flex justify-between items-center border-b border-graphite/40 pb-4">
                      <span className="font-serif text-bone">{row.l}</span>
                      <span className="font-mono text-signal-gold text-sm">{row.p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-obsidian p-10">
                <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest uppercase mb-8">Global · US / UK / UAE</p>
                <div className="space-y-6">
                  {[
                    { l: 'Manager → Director', p: '$349' },
                    { l: 'Director → VP / Board', p: '$499' },
                  ].map((row) => (
                    <div key={row.l} className="flex justify-between items-center border-b border-graphite/40 pb-4">
                      <span className="font-serif text-bone">{row.l}</span>
                      <span className="font-mono text-signal-gold text-sm">{row.p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── FINAL CTA ───────────────────────────────────────────── */}
          <div className="border-t border-graphite/40 pt-32 flex flex-col md:flex-row gap-16 items-center justify-between">
            <div className="max-w-xl">
              <h2 className="display-card text-3xl mb-6">
                From Experienced Generalist to <em className="text-signal-gold not-italic">Niche Authority.</em>
              </h2>
              <p className="font-serif text-muted text-lg leading-relaxed">
                The Blueprint engagement is a 30-day process. It is the definitive move for
                those aiming for high-status, high-compensation roles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
              <Button href="/request" variant="primary" className="w-full sm:w-auto justify-center">
                Engage the Blueprint →
              </Button>
              <Button href="/audit" variant="ghost" className="w-full sm:w-auto justify-center">
                Audit first
              </Button>
            </div>
          </div>

          <Disclaimer variant="compact" className="mt-16 pt-8 border-t border-white/[0.05]" />

        </div>
      </main>
      <Footer />
    </>
  )
}
