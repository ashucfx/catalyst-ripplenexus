import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlueprintPricingMatrix } from '@/components/ui/BlueprintPricingMatrix'
import { Disclaimer } from '@/components/ui/Disclaimer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Career Booster & Premium Plus Packages — Catalyst by Ripple Nexus',
  description:
    'Executive Resume Rewrite, LinkedIn Profile & Custom Banner Design, Tailored Cover Letters, Personal Web Portfolio Website, Country-Based & Multi-Lingual Optimization.',
}

export default function BlueprintPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-signal-gold block mb-4">
              Executive Packages &amp; Services
            </span>
            <h1 className="display-page mb-6 text-bone" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}>
              Two Flagship Packages.{' '}
              <em className="not-italic text-gold-gradient">Guaranteed Executive ROI.</em>
            </h1>
            <p className="font-serif text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
              Tailored by experience tier and target market. Complimentary Cover Letter included with every Career Booster package.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
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

          {/* ── FLAGSHIP PACKAGES COMPARISON (BOOSTER VS PREMIUM PLUS) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 items-stretch">
            {/* 1. CAREER BOOSTER PACKAGE */}
            <div
              id="career-booster"
              className="p-8 sm:p-10 rounded-2xl bg-obsidian border-2 border-signal-gold/40 shadow-2xl relative flex flex-col justify-between"
            >
              <div className="absolute -top-3.5 left-8 bg-signal-gold text-obsidian font-mono text-[0.6rem] tracking-widest uppercase font-bold px-4 py-1 rounded-full whitespace-nowrap">
                ★ Most Popular Flagship
              </div>

              <div>
                <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold block mb-2">
                  Package 01
                </span>
                <h2 className="display-card text-2xl sm:text-3xl text-bone mb-2">
                  Career Booster Package
                </h2>
                <p className="font-mono text-muted text-xs tracking-wider uppercase mb-6">
                  RESUME · LINKEDIN · BANNER &amp; DP · COVER LETTER
                </p>
                <p className="font-serif text-muted text-sm leading-relaxed mb-8">
                  Engineered for Mid-Career to Senior Leaders seeking higher compensation and recruiter magnet status across GCC, ASEAN, APAC, and Global markets.
                </p>

                <div className="space-y-3.5 mb-10 border-t border-white/10 pt-6">
                  {[
                    'Executive Resume Rewrite (ATS 98%+ pass rate)',
                    'LinkedIn Full Profile Rewrite (Headline, Bio, Work)',
                    'Custom High-Resolution LinkedIn Banner Design',
                    'Display Picture (DP) Formatting Direction Kit',
                    'Complimentary Custom Strategic Cover Letter',
                    'Country Optimization (Singapore, Dubai, Sydney, US)',
                    'Recruiter InMail Outreach DM Templates',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="text-signal-gold text-xs mt-0.5">✓</span>
                      <span className="font-sans text-xs text-bone/90 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/request"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
                >
                  Book Strategy Call →
                </Link>
                <a
                  href="https://clientforge.theripplenexus.com/checkout?pkg=CAREER_BOOSTER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-signal-gold/50 transition-colors whitespace-nowrap"
                >
                  Self-Service Checkout ↗
                </a>
              </div>
            </div>

            {/* 2. PREMIUM PLUS PACKAGE (INCLUDES PORTFOLIO SITE) */}
            <div
              id="premium-plus"
              className="p-8 sm:p-10 rounded-2xl bg-obsidian/90 border-2 border-emerald-500/40 shadow-2xl relative flex flex-col justify-between"
            >
              <div className="absolute -top-3.5 left-8 bg-emerald-500 text-obsidian font-mono text-[0.6rem] tracking-widest uppercase font-bold px-4 py-1 rounded-full whitespace-nowrap">
                👑 C-Suite &amp; Personal Website Included
              </div>

              <div>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-bold block mb-2">
                  Package 02
                </span>
                <h2 className="display-card text-2xl sm:text-3xl text-bone mb-2">
                  Premium Plus Package
                </h2>
                <p className="font-mono text-muted text-xs tracking-wider uppercase mb-6">
                  CAREER BOOSTER + PERSONAL WEB PORTFOLIO SHOWCASE
                </p>
                <p className="font-serif text-muted text-sm leading-relaxed mb-8">
                  For Executives, VPs, and C-Suite Leaders who require an immersive custom Web Portfolio Website to showcase major deals, revenue scale, and media presence.
                </p>

                <div className="space-y-3.5 mb-10 border-t border-white/10 pt-6">
                  {[
                    'Everything included in Career Booster Package',
                    '🌐 Custom Executive Web Portfolio Website',
                    'Hosted custom domain setup & mobile optimization',
                    'Multi-Lingual Adaptation (English + 1 Language)',
                    'Executive Pitch & Media Feature Showcase',
                    'Salary & Offer Negotiation Playbook',
                    '1-on-1 Direct Positioning Strategy Session',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                      <span className="font-sans text-xs text-bone/90 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/request"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-600 text-obsidian font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
                >
                  Request Custom Proposal →
                </Link>
                <a
                  href="https://clientforge.theripplenexus.com/checkout?pkg=PREMIUM_PLUS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-emerald-400/50 transition-colors whitespace-nowrap"
                >
                  Self-Service Checkout ↗
                </a>
              </div>
            </div>
          </div>

          {/* ── THE PROBLEM & SOLUTION ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 items-start">
            <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10">
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

            <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block mb-3">
                The Catalyst Advantage
              </span>
              <div className="space-y-5">
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

          {/* ── PRICING MATRIX ──────────────────────────────────────── */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-mono text-xs tracking-widest uppercase text-signal-gold block mb-2">Scope &amp; Deliverables</span>
              <h2 className="display-section text-3xl text-bone">Choose Your Experience Tier</h2>
            </div>
            <BlueprintPricingMatrix />
          </div>

          {/* ── FINAL CTA ───────────────────────────────────────────── */}
          <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="display-card text-2xl sm:text-3xl mb-3 text-bone">
                Ready to Upgrade Your <em className="text-signal-gold not-italic">Market Value?</em>
              </h2>
              <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">
                Join over 1,400+ professionals who landed top-tier global offers with our Career Booster package.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link
                href="/request"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
              >
                Book Strategy Consultation →
              </Link>
              <a
                href="https://clientforge.theripplenexus.com/checkout?pkg=CAREER_BOOSTER"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-signal-gold/40 transition-colors whitespace-nowrap"
              >
                Self-Service Checkout ↗
              </a>
            </div>
          </div>

          <Disclaimer variant="compact" className="mt-14 pt-8 border-t border-white/[0.05]" />

        </div>
      </main>
      <Footer />
    </>
  )
}
