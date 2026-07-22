import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuditCheckout } from '@/components/ui/AuditCheckout'
import { Disclaimer } from '@/components/ui/Disclaimer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Market Value Audit & Strategy — Catalyst by Ripple Nexus',
  description:
    'Confidential analyst-prepared evaluation of your executive market positioning, ATS keyword pass rates, compensation benchmarking, and 90-day positioning roadmap.',
}

export default function AuditPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HERO ────────────────────────────────────────────────── */}
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signal-gold/30 bg-signal-gold/10 font-mono text-[0.6rem] tracking-[0.25em] uppercase text-signal-gold mb-6">
              <span>📊 Confidential Analyst Evaluation</span>
            </div>

            <h1
              className="display-page mb-6 text-bone"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)', lineHeight: 1.08 }}
            >
              Know Exactly How{' '}
              <em className="not-italic text-gold-gradient">The Market Reads You.</em>
            </h1>

            <p className="font-serif text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Information asymmetry about your true market value is the single most expensive blind spot in an executive career. Our analyst evaluation surfaces your exact positioning gap.
            </p>

            {/* Coverage Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                '🇸🇦 Saudi Arabia',
                '🇶🇦 Qatar',
                '🇦🇪 UAE / Dubai',
                '🇮🇳 India',
                '🇲🇾 Malaysia',
                '🇨🇭 Switzerland',
                '🇦🇺 ANZ',
                '🇺🇸 Global',
              ].map((flag) => (
                <span
                  key={flag}
                  className="font-mono text-xs text-bone bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full"
                >
                  {flag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
              <Link
                href="/request"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
              >
                Book Strategy Consultation →
              </Link>
              <a
                href="https://clientforge.theripplenexus.com/checkout?pkg=AUDIT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-signal-gold/50 transition-colors whitespace-nowrap"
              >
                Self-Service Checkout ↗
              </a>
            </div>
          </div>

          {/* ── CORE DELIVERABLES GRID ───────────────────────────── */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-signal-gold block mb-2">
                Analyst Deliverables
              </span>
              <h2 className="display-section text-2xl sm:text-3xl text-bone">
                What Your Market Value Audit Covers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  num: '01',
                  title: 'Talent Positioning Index (TPI)',
                  desc: 'Comprehensive diagnostic score benchmarking your resume and LinkedIn narrative against top 5% performers in your target sector.',
                },
                {
                  num: '02',
                  title: '98%+ ATS Keyword Pass Rate',
                  desc: 'In-depth parse audit testing your CV formatting and keywords against enterprise Taleo, Workday, Greenhouse, and Lever scanners.',
                },
                {
                  num: '03',
                  title: 'Recruiter Visibility Audit',
                  desc: 'Evaluation of your LinkedIn headline, SSI score, and searchability metrics across executive search recruiters in GCC, ASEAN, and APAC.',
                },
                {
                  num: '04',
                  title: 'Compensation Benchmarking',
                  desc: 'Real-time compensation data comparing your current pay band against regional market medians in Dubai, Singapore, Bengaluru, and Sydney.',
                },
                {
                  num: '05',
                  title: 'Executive Brand Gap Analysis',
                  desc: 'Identifies specific narrative flaws anchoring you to lower-tier salary bands and provides direct corrective framing.',
                },
                {
                  num: '06',
                  title: '48-Hour Rapid Delivery',
                  desc: 'Analyst-compiled intelligence dossier delivered straight to your private portal with actionable next steps.',
                },
              ].map((m) => (
                <div
                  key={m.num}
                  className="bg-obsidian/90 border border-white/10 p-8 rounded-xl flex flex-col justify-between hover:border-signal-gold/40 transition-colors"
                >
                  <div>
                    <span className="font-mono text-signal-gold text-xs font-bold block mb-3">{m.num}</span>
                    <h3 className="display-card text-xl text-bone mb-3">{m.title}</h3>
                    <p className="font-sans text-muted text-xs leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── INTAKE PROCESS COMPONENT ────────────────────────── */}
          <div className="mb-24">
            <AuditCheckout />
          </div>

          {/* ── DISCLAIMER ──────────────────────────────────────── */}
          <Disclaimer variant="compact" className="pt-8 border-t border-white/[0.05]" />

        </div>
      </main>
      <Footer />
    </>
  )
}
