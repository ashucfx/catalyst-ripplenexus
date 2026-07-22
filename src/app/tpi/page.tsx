import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TPICalculator } from '@/components/ui/TPICalculator'
import { Disclaimer } from '@/components/ui/Disclaimer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free TPI Score Diagnostic — Catalyst by Ripple Nexus',
  description:
    'Calculate your Talent Positioning Index (TPI) score. 5-question executive diagnostic benchmarking your market visibility, compensation leverage, and ATS pass rates.',
}

export default function TPIPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HERO HEADER ────────────────────────────────────────── */}
          <div className="mb-16 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signal-gold/30 bg-signal-gold/10 font-mono text-[0.6rem] tracking-[0.25em] uppercase text-signal-gold mb-6">
              <span>🏆 Complimentary Diagnostic · Talent Positioning Index</span>
            </div>

            <h1
              className="display-page mb-6 text-bone"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', lineHeight: 1.08 }}
            >
              How Is The Market{' '}
              <em className="not-italic text-gold-gradient">Reading Your Profile?</em>
            </h1>

            <p className="font-serif text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Five strategic questions. Get a directional Talent Positioning Index score showing where your executive positioning currently lands and where your compensation leverage is leaking.
            </p>

            {/* Regional Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                '🇸🇦 Saudi Arabia',
                '🇶🇦 Qatar',
                '🇦🇪 UAE',
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
          </div>

          {/* ── CALCULATOR CONTAINER ────────────────────────────────── */}
          <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-2xl backdrop-blur-xl mb-20">
            <TPICalculator />
          </div>

          {/* ── NEXT STEPS CALLOUT ──────────────────────────────────── */}
          <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="display-card text-2xl sm:text-3xl mb-3 text-bone">
                Ready for Full <em className="text-signal-gold not-italic">Executive Positioning?</em>
              </h2>
              <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">
                Explore our flagship Career Booster &amp; Premium Plus packages or request a 1-on-1 strategy consultation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link
                href="/blueprint"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
              >
                View Flagship Packages →
              </Link>
              <Link
                href="/request"
                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-signal-gold/50 transition-colors whitespace-nowrap"
              >
                Book Strategy Call ↗
              </Link>
            </div>
          </div>

          <Disclaimer variant="compact" className="mt-14 pt-8 border-t border-white/[0.05]" />

        </div>
      </main>
      <Footer />
    </>
  )
}
