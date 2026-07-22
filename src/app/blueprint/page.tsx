import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlueprintPricingMatrix } from '@/components/ui/BlueprintPricingMatrix'
import { Disclaimer } from '@/components/ui/Disclaimer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Career Booster Services & Pricing — Catalyst by Ripple Nexus',
  description:
    'Executive Resume Rewrite, LinkedIn Profile & Custom Banner Design, Tailored Cover Letters, Country-Based & Multi-Lingual Optimization for ASEAN, APAC, GCC, and Global markets.',
}

export default function BlueprintPage() {
  return (
    <>
      <Header />
      <main className="pt-40 pb-32 grain">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="mb-24 text-center max-w-4xl mx-auto">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-signal-gold block mb-4">
              Career Booster Package &amp; Services
            </span>
            <h1 className="display-page mb-6 text-bone" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}>
              Clear Services.{' '}
              <em className="not-italic text-gold-gradient">Guaranteed Career ROI.</em>
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl mx-auto">
              Every service is tailored by experience level and target market. Complimentary Cover Letter included with every Career Booster package.
            </p>
            <div className="mt-6">
              <span className="font-mono text-signal-gold text-[0.6rem] tracking-[0.3em] uppercase bg-white/[0.03] px-4 py-2 rounded border border-white/10">
                ASEAN (🇸🇬 🇲🇾 🇮🇩 🇻🇳) • APAC (🇮🇳 🇦🇺) • GCC (🇦🇪 🇸🇦) • GLOBAL (🇺🇸 🇬🇧)
              </span>
            </div>
          </div>

          {/* ── THE PROBLEM & SOLUTION ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-28 items-start">
            <div className="p-10 rounded-2xl bg-obsidian border border-white/10">
              <span className="font-mono text-xs uppercase tracking-widest text-signal-gold block mb-3">
                The Career Dilemma
              </span>
              <h2 className="display-card text-2xl text-bone mb-6">
                Most resumes fail because they list duties instead of revenue &amp; scale metrics.
              </h2>
              <div className="space-y-4 font-serif text-muted text-sm leading-relaxed">
                <p>
                  Recruiters and automated ATS scanners receive hundreds of applications daily. If your CV doesn&apos;t quantify your impact within 6 seconds, you get buried in the rejection pile.
                </p>
                <p>
                  Our Career Booster service rebuilds your professional narrative to highlight quantifiable business impact, leadership scope, and regional compliance credentials.
                </p>
              </div>
            </div>

            <div className="p-10 rounded-2xl bg-obsidian border border-white/10">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block mb-3">
                The Catalyst Advantage
              </span>
              <div className="space-y-6">
                {[
                  { title: 'Executive Resume Rewrite', desc: 'Rebuilt for 98%+ ATS keyword pass rates with quantified ROI metrics in Word & PDF formats.' },
                  { title: 'LinkedIn Profile & Custom Banner', desc: 'Recruiter-tuned Headline, story bio, and high-resolution custom LinkedIn Banner design.' },
                  { title: 'Country & Multi-Lingual Support', desc: 'Tailored formatting for Singapore, Dubai, Sydney, US/EU, and multi-lingual options (English, Mandarin, Bahasa, etc.).' },
                ].map((item) => (
                  <div key={item.title} className="border-b border-white/[0.07] pb-4 last:border-0 last:pb-0">
                    <p className="font-mono text-bone text-xs font-bold uppercase tracking-wider mb-1">{item.title}</p>
                    <p className="font-sans text-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── THE SYSTEM: MODULES ─────────────────────────────────── */}
          <div className="mb-28">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-signal-gold block mb-2">Service Breakdown</span>
              <h2 className="display-section text-3xl text-bone">What Is Included In Your Package</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: '01',
                  title: 'Executive Resume Rewrite',
                  desc: 'A full metric-driven rewrite of your CV structured for your specific target role. Guaranteed ATS compliance, high visual hierarchy, and editable Word & PDF files.',
                },
                {
                  id: '02',
                  title: 'LinkedIn Profile & Banner',
                  desc: 'Headline, Bio, and Work history rewritten for max search visibility. Includes custom banner graphic asset and profile display picture (DP) formatting rules.',
                },
                {
                  id: '03',
                  title: 'Complimentary Cover Letter',
                  desc: 'A tailored narrative cover letter that bridges your background to your target company. Ideal for high-stakes applications and direct HR outreach.',
                },
                {
                  id: '04',
                  title: 'Country Market Optimization',
                  desc: 'Adapted to local recruiter preferences in Singapore, UAE, India, Australia, US, and EU with visa status formatting where applicable.',
                },
                {
                  id: '05',
                  title: 'Multi-Lingual Support',
                  desc: 'Dual-language CV translation and adaptation in English, Mandarin Chinese, Japanese, Bahasa, German, French, or Spanish.',
                },
                {
                  id: '06',
                  title: 'Recruiter DMs & Negotiation',
                  desc: 'Ready-to-use InMail outreach templates for hiring managers and our comprehensive salary negotiation playbook to maximize your offer.',
                },
              ].map((m) => (
                <div key={m.id} className="bg-obsidian p-8 rounded-xl border border-white/10 flex flex-col gap-4">
                  <span className="font-mono text-signal-gold text-xs tracking-widest font-bold">{m.id}</span>
                  <h3 className="display-card text-xl text-bone">{m.title}</h3>
                  <p className="font-sans text-muted text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── PRICING MATRIX ──────────────────────────────────────── */}
          <div className="mb-28">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-signal-gold block mb-2">Transparent Investment</span>
              <h2 className="display-section text-3xl text-bone">Choose Your Experience Tier</h2>
            </div>
            <BlueprintPricingMatrix />
          </div>

          {/* ── FINAL CTA ───────────────────────────────────────────── */}
          <div className="border-t border-white/10 pt-20 flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="max-w-xl">
              <h2 className="display-card text-3xl mb-4 text-bone">
                Ready to Upgrade Your <em className="text-signal-gold not-italic">Market Value?</em>
              </h2>
              <p className="font-serif text-muted text-base leading-relaxed">
                Join over 1,400+ professionals who landed top-tier global offers with our Career Booster package.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link
                href="/request"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-signal-gold to-amber-500 text-obsidian font-sans text-xs font-bold tracking-wider uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all"
              >
                Book Strategy Consultation →
              </Link>
              <a
                href="https://clientforge.theripplenexus.com/checkout?pkg=CAREER_BOOSTER"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-bone font-sans text-xs font-semibold tracking-wider uppercase rounded-full text-center hover:border-signal-gold/40 transition-colors"
              >
                Self-Service Checkout ↗
              </a>
            </div>
          </div>

          <Disclaimer variant="compact" className="mt-16 pt-8 border-t border-white/[0.05]" />

        </div>
      </main>
      <Footer />
    </>
  )
}
