import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { GeoPrice } from '@/components/ui/GeoPrice'
import { BlueprintPricingMatrix } from '@/components/ui/BlueprintPricingMatrix'
import { Disclaimer } from '@/components/ui/Disclaimer'

export const metadata: Metadata = {
  title: 'Services & Pricing — Catalyst by Ripple Nexus',
  description:
    'Career Booster and Premium Plus packages. Resume rewrite, LinkedIn optimisation, cover letter, and portfolio website. Priced by experience level.',
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
              Services &amp; Pricing
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
              <p className="font-serif text-muted text-xl leading-relaxed max-w-xl">
                Every service is priced by experience level. Cover letter is complimentary
                with any package. Bundle for 15% or 20% off.
              </p>
              <div className="lg:text-right">
                <p className="font-mono text-signal-gold text-[0.6rem] tracking-[0.3em] uppercase">India · UAE · US · UK · GCC</p>
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
                  desc: 'A full rewrite of your resume, structured to signal seniority and authority for the specific role you are targeting. Not a reformatting. A rebuild.',
                },
                {
                  id: '02',
                  title: 'LinkedIn Full Profile',
                  desc: 'Headline, About, and Experience rewritten for positioning. Banner design and profile photo direction included. Every visible surface rebuilt for how you want to be read.',
                },
                {
                  id: '03',
                  title: 'Cover Letter',
                  desc: 'A tailored cover letter that bridges your experience to the specific mandate of the role. Not a summary of your CV. A narrative argument for why you are the right hire.',
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
            <BlueprintPricingMatrix />
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
