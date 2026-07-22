'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { TESTIMONIALS_DATA } from '@/data/testimonialsData'
import Link from 'next/link'

// ─── Data: Packages (Consultation & Scope Centric) ───────────────────

const selectionPlans = [
  {
    tier: 'I',
    name: 'Market Value Audit',
    subtitle: 'RESUME & MARKET VALUE EVALUATION',
    anchor: 'Delivered in 48 hours. Confidential.',
    badge: 'Confidential Evaluation',
    deliverables: [
      'Detailed ATS & Resume Audit Report',
      'Talent Positioning Score (TPI)',
      '3 Highest-leverage bullet rewrites',
      'Market value & compensation benchmark',
    ],
    href: '/audit',
    ctaPrimary: 'Request Market Audit →',
    ctaSecondary: 'Direct Self-Service',
    checkoutUrl: 'https://clientforge.theripplenexus.com/inquire?service=AUDIT',
  },
  {
    tier: 'II',
    name: 'Career Booster Package',
    subtitle: 'RESUME · LINKEDIN · BANNER & DP · COVER LETTER',
    anchor: 'Complimentary Cover Letter included. Tailored by country.',
    badge: '★ Most Popular Choice',
    deliverables: [
      'Executive Resume Rewrite (ATS 98%+ score)',
      'LinkedIn Full Profile Rewrite (Headline, Bio, Work)',
      'Custom LinkedIn Banner & DP Direction Kit',
      'Complimentary Custom Cover Letter',
      'Country-Specific Optimization (ASEAN / APAC / GCC)',
      'Recruiter Outreach DM Templates',
    ],
    href: '/request',
    ctaPrimary: 'Book Strategy Call →',
    ctaSecondary: 'Self-Service Checkout',
    checkoutUrl: 'https://clientforge.theripplenexus.com/checkout?pkg=CAREER_BOOSTER',
    featured: true,
  },
  {
    tier: 'III',
    name: 'Premium Plus Suite',
    subtitle: 'CAREER BOOSTER + PERSONAL PORTFOLIO WEBSITE',
    anchor: 'Everything in Booster + Custom Career Showcase Website.',
    badge: 'Executive & C-Suite',
    deliverables: [
      'Everything included in Career Booster',
      'Personal Web Portfolio Showcase',
      'Multi-Lingual CV Adaptation (English + 1 Language)',
      'Salary & Offer Negotiation Playbook',
      '1-on-1 Executive Pitch Guidance',
    ],
    href: 'https://clientforge.theripplenexus.com/inquire?pkg=PREMIUM_PLUS',
    ctaPrimary: 'Request Custom Proposal →',
    ctaSecondary: 'Self-Service Checkout',
    checkoutUrl: 'https://clientforge.theripplenexus.com/checkout?pkg=PREMIUM_PLUS',
  },
]

// ─── Data: Regional Strategies ───────────────────────────────────────

const regionalData = [
  {
    region: 'ASEAN (Singapore, Malaysia, Indonesia, Vietnam)',
    flag: '🇸🇬 🇲🇾 🇮🇩 🇻🇳',
    desc: 'Focused on cross-border leadership, Employment Pass (EP) eligibility, regional scale, and concise 2-page metric-driven formatting.',
    highlights: ['ATS keywords tuned for Singapore FinTech & Tech hubs', 'Visa & relocation signaling', 'Regional growth metrics framing'],
  },
  {
    region: 'GCC / Middle East (Dubai, Abu Dhabi, Saudi Arabia)',
    flag: '🇦🇪 🇸🇦 🇶🇦',
    desc: 'Emphasizes tax-free compensation readiness, sovereign project management, and Arabic/English dual presentation options.',
    highlights: ['Dubai & Riyadh recruiter standards', 'Bilingual English/Arabic options available', 'Mega-project & enterprise scale storytelling'],
  },
  {
    region: 'APAC (India, Australia, Hong Kong)',
    flag: '🇮🇳 🇦🇺 🇭🇰',
    desc: 'Bridges massive engineering/operations scale to international recruiter expectations with high-impact outcome metrics.',
    highlights: ['Translating high-volume scale to global standards', 'Australian 2-3 page tailored templates', 'FAANG & Unicorn ATS compliance'],
  },
  {
    region: 'Global / Western (USA, UK, Canada, EU)',
    flag: '🇺🇸 🇬🇧 🇨🇦 🇪🇺',
    desc: 'Strict 1-2 page executive formatting, zero fluff, aggressive achievement bullets, and high-converting recruiter DMs.',
    highlights: ['US 1-Page / 2-Page hard formats', 'UK Tier-2 sponsorship positioning', 'Remote USD dollar impact storytelling'],
  },
]

export default function Home() {
  const [activeRegion, setActiveRegion] = useState(0)
  const [currentSalary, setCurrentSalary] = useState(120000)

  // 35% estimated hike calculation
  const estimatedHike = Math.round(currentSalary * 0.35)
  const newSalary = currentSalary + estimatedHike

  return (
    <>
      <Header />

      <main className="grain">
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION — HIGH IMPACT & EXECUTIVE
        ════════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-36 pb-28"
          style={{ background: '#050507' }}
        >
          {/* Ambient lighting */}
          <div className="absolute inset-0 dot-field opacity-40 pointer-events-none" />
          <div className="absolute inset-0 beam-tr pointer-events-none" />
          <div className="absolute inset-0 beam-bl pointer-events-none" />

          {/* Top hairline gradient */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.7) 40%, rgba(197,160,89,0.9) 50%, rgba(197,160,89,0.7) 60%, transparent 100%)',
            }}
          />

          <div className="relative z-10 max-w-dossier mx-auto px-6 lg:px-12">
            {/* Live Regional Coverage Bar — Clean Flex Wrap Badges matching Footer */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Executive Talent Pipeline Live</span>
              </div>

              {[
                { flag: '🇸🇦', name: 'Saudi Arabia' },
                { flag: '🇶🇦', name: 'Qatar' },
                { flag: '🇦🇪', name: 'UAE / Dubai' },
                { flag: '🇮🇳', name: 'India' },
                { flag: '🇲🇾', name: 'Malaysia' },
                { flag: '🇨🇭', name: 'Switzerland' },
                { flag: '🇦🇺', name: 'Australia & NZ' },
                { flag: '🇺🇸', name: 'USA & UK' },
              ].map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-bone font-sans text-xs font-medium hover:border-[#C5A059]/40 transition-all"
                >
                  <span className="text-sm">{c.flag}</span>
                  <span>{c.name}</span>
                </span>
              ))}
            </div>

            {/* Main Headline */}
            <h1
              className="display-hero mb-8 max-w-5xl tracking-tight text-bone font-serif font-bold"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)', lineHeight: 1.08 }}
            >
              Break Through Career Ceilings &amp; Land{' '}
              <em className="text-gold-gradient not-italic text-glow-gold">High-Paying Executive Roles.</em>
            </h1>

            {/* Clear Subheadline */}
            <p className="font-sans text-muted/90 leading-relaxed mb-10 max-w-3xl text-base sm:text-lg font-normal">
              Transform your career narrative with metric-driven <strong className="text-bone font-semibold">Executive Resume Rewrites</strong>,{' '}
              <strong className="text-bone font-semibold">LinkedIn Profile &amp; Custom Banner Designs</strong>,{' '}
              <strong className="text-bone font-semibold">Tailored Cover Letters</strong>, and{' '}
              <strong className="text-bone font-semibold">Multi-Lingual Country Optimization</strong> across GCC, ASEAN, APAC &amp; Global markets.
            </p>

            {/* Premium Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-12 w-full sm:w-auto">
              <Link
                href="/request"
                id="hero-cta-primary"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] px-7 py-3.5 font-mono text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#C5A059]/20 hover:brightness-110 transition-all duration-300 whitespace-nowrap"
              >
                <span>Book Strategy Consultation</span>
                <span className="text-sm font-bold">→</span>
              </Link>

              <a
                href="https://clientforge.theripplenexus.com/checkout?pkg=CAREER_BOOSTER"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-secondary"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-bone border border-white/20 px-6 py-3.5 font-mono text-xs font-semibold tracking-widest uppercase rounded-full hover:border-[#C5A059]/60 hover:bg-white/[0.05] transition-all duration-300 whitespace-nowrap"
              >
                <span>Self-Service Checkout</span>
                <span className="text-muted/60 text-xs font-mono">↗</span>
              </a>

              <Link
                href="/testimonials"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-signal-gold bg-white/[0.03] border border-white/10 px-5 py-3.5 font-mono text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-white/[0.08] transition-all duration-300 whitespace-nowrap"
              >
                <span>★ 48 Client Reviews</span>
                <span className="font-mono text-bone text-xs">5.0</span>
              </Link>
            </div>

            {/* Feature Trust Pills */}
            <div className="flex flex-wrap gap-2.5 mb-16">
              {[
                '✓ ATS 98%+ Pass Rate Guarantee',
                '✓ Custom LinkedIn Banner & DP Directions',
                '✓ Free Custom Cover Letter Included',
                '✓ Multi-Lingual Support (ENG, CHN, JPN, BHS, GER, FRA)',
                '✓ Country Tailored (ASEAN, GCC, APAC, US/EU)',
              ].map((t) => (
                <span
                  key={t}
                  className="font-mono text-[0.62rem] text-bone bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* What is Included Overview Bar */}
            <div className="pt-10 border-t border-white/[0.08]">
              <p className="font-mono text-muted text-[0.52rem] tracking-[0.3em] uppercase mb-6 opacity-60">
                What your Career Booster Package includes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Resume Rewrite', desc: 'ATS optimized, quantified bullet points, PDF & Word' },
                  { title: 'LinkedIn Overhaul', desc: 'Headline, Bio, Work history + Custom Banner & DP' },
                  { title: 'Cover Letter', desc: 'Custom strategic cover letter for targeted job apps' },
                  { title: 'Country Optimization', desc: 'Adapted for Singapore, Dubai, Sydney, US/EU norms' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="font-mono text-xs text-signal-gold mb-1 font-semibold">{item.title}</p>
                    <p className="font-sans text-xs text-muted/80 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CLIENTFORGE PORTAL ACCESS (DIRECT SELF-SERVICE & INQUIRY)
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-16 bg-gradient-to-b from-black via-obsidian/90 to-black border-t border-white/[0.06]">
          <div className="max-w-dossier mx-auto p-6 sm:p-10 lg:p-12 rounded-2xl bg-black/60 border border-signal-gold/30 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-gold/10 border border-signal-gold/30 font-mono text-[0.58rem] tracking-widest uppercase text-signal-gold mb-3">
                ⚡ ClientForge Portal Integration
              </span>
              <h2 className="display-card text-xl sm:text-2xl lg:text-3xl text-bone mb-2">
                Prefer Self-Service Instant Checkout or Custom Enterprise Proposals?
              </h2>
              <p className="font-serif text-muted text-xs sm:text-sm leading-relaxed">
                Book directly on our live ClientForge portal for instant self-service package checkout, or submit custom enterprise requirements directly into our CRM flywheel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto shrink-0">
              <a
                href="https://clientforge.theripplenexus.com/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs uppercase tracking-widest font-bold rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
              >
                Self-Service Checkout ↗
              </a>
              <a
                href="https://clientforge.theripplenexus.com/inquire"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 border border-white/20 text-bone font-mono text-xs uppercase tracking-widest text-center rounded-full hover:border-signal-gold/50 transition-all whitespace-nowrap"
              >
                Submit Direct Inquiry ↗
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            INTERACTIVE COUNTRY & REGIONAL STRATEGY SWITCHER
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-28 bg-black/40 border-t border-white/[0.06]">
          <div className="max-w-dossier mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-2">
                Tailored for Regional Success
              </span>
              <h2 className="display-section text-3xl text-bone mb-3">
                Country &amp; Market Optimization
              </h2>
              <p className="font-serif text-muted text-sm leading-relaxed">
                What works in Silicon Valley won&apos;t work in Singapore or Dubai. See how we adapt your profile per region.
              </p>
            </div>

            {/* Region Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {regionalData.map((reg, idx) => (
                <button
                  key={reg.region}
                  onClick={() => setActiveRegion(idx)}
                  className={`px-4 py-2.5 rounded-full font-mono text-xs tracking-wider transition-all duration-200 ${
                    activeRegion === idx
                      ? 'bg-signal-gold text-obsidian font-bold shadow-lg'
                      : 'bg-white/[0.04] text-muted hover:text-bone border border-white/10'
                  }`}
                >
                  {reg.flag} {reg.region.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Active Region Display Box */}
            <div className="p-6 sm:p-10 lg:p-12 rounded-2xl bg-obsidian/80 border border-white/10 backdrop-blur-xl max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{regionalData[activeRegion].flag}</span>
                <h3 className="font-serif text-bone text-xl sm:text-2xl font-bold">
                  {regionalData[activeRegion].region}
                </h3>
              </div>

              <p className="font-serif text-muted text-sm sm:text-base leading-relaxed mb-8">
                {regionalData[activeRegion].desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                {regionalData[activeRegion].highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2.5">
                    <span className="text-signal-gold text-sm mt-0.5">◈</span>
                    <span className="font-sans text-xs text-bone/90 leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FEATURED TESTIMONIALS SHOWCASE
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-32 bg-obsidian border-t border-white/[0.06]">
          <div className="max-w-dossier mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-2">
                  Proven Executive Impact
                </span>
                <h2 className="display-section text-3xl sm:text-4xl text-bone">
                  Verified Candidate Success Stories
                </h2>
              </div>

              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-signal-gold hover:text-bone transition-colors"
              >
                View All Reviews (100% Verified) →
              </Link>
            </div>

            {/* Testimonials Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {TESTIMONIALS_DATA.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>

            <div className="text-center pt-6">
              <Link
                href="/testimonials"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-signal-gold/40 text-signal-gold px-6 py-3 font-mono text-xs tracking-wider uppercase rounded-full hover:bg-signal-gold hover:text-obsidian transition-all duration-300 font-bold text-center"
              >
                <span className="hidden sm:inline">Explore Full Testimonials Hub (48 Reviews) →</span>
                <span className="sm:hidden">Explore 48 Reviews Hub →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            INTERACTIVE SALARY HIKE ESTIMATOR
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-28 bg-gradient-to-b from-black via-obsidian to-black border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto p-6 sm:p-10 lg:p-12 rounded-2xl bg-obsidian border border-white/10 backdrop-blur-xl text-center">
            <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-2">
              Calculate Your Potential Gain
            </span>
            <h2 className="display-card text-2xl sm:text-3xl text-bone mb-3">
              Estimated Salary Hike Calculator
            </h2>
            <p className="font-serif text-muted text-xs sm:text-sm mb-8">
              On average, candidates with optimized Executive resumes &amp; LinkedIn positioning command a 35% salary increase.
            </p>

            <div className="space-y-6 max-w-lg mx-auto mb-10">
              <div className="flex justify-between items-center text-xs font-mono text-muted">
                <span>Current Annual Compensation:</span>
                <span className="text-bone font-bold text-base">${currentSalary.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="40000"
                max="300000"
                step="5000"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(Number(e.target.value))}
                className="w-full accent-signal-gold cursor-pointer"
              />
              <div className="flex justify-between text-[0.58rem] font-mono text-muted/60">
                <span>$40K</span>
                <span>$150K</span>
                <span>$300K+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 rounded-xl bg-white/[0.03] border border-white/10 max-w-lg mx-auto">
              <div className="text-center border-r border-white/10 pr-4">
                <p className="font-mono text-[0.58rem] text-muted uppercase tracking-wider mb-1">Estimated Annual Hike (+35%)</p>
                <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">+${estimatedHike.toLocaleString()}</p>
              </div>
              <div className="text-center pl-4">
                <p className="font-mono text-[0.58rem] text-muted uppercase tracking-wider mb-1">Target Package</p>
                <p className="font-mono text-xl sm:text-2xl font-bold text-signal-gold">${newSalary.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SERVICE & EXECUTIVE CONSULTATION MATRIX
        ════════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="relative px-6 lg:px-12 py-32 overflow-hidden"
          style={{ background: '#060608', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-dossier mx-auto relative">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <span className="eyebrow mb-3 inline-block">Bespoke Scope &amp; Consultation</span>
              <h2 className="display-section text-3xl sm:text-4xl mb-3">
                Executive Service Suites.{' '}
                <em className="not-italic text-gold-gradient">Tailored Career Strategy.</em>
              </h2>
              <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">
                Senior leadership positioning is custom-scoped via 1-on-1 Strategy Consultation or instantly accessible via ClientForge self-service.
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectionPlans.map((plan) => (
                <div
                  key={plan.tier}
                  className={`flex flex-col p-8 rounded-2xl relative transition-all duration-300 ${
                    plan.featured
                      ? 'bg-obsidian border-2 border-signal-gold shadow-2xl shadow-signal-gold/10'
                      : 'bg-obsidian/60 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-signal-gold text-obsidian font-mono text-[0.6rem] tracking-widest uppercase font-bold px-4 py-1 rounded-full whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
                      Tier {plan.tier}
                    </span>
                    {!plan.featured && (
                      <span className="font-mono text-[0.58rem] tracking-widest uppercase text-muted bg-white/[0.04] px-2.5 py-1 rounded">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="display-card text-xl sm:text-2xl text-bone mb-1">{plan.name}</h3>
                  <p className="font-mono text-muted text-[0.52rem] tracking-widest uppercase mb-6">
                    {plan.subtitle}
                  </p>

                  <div className="pb-6 mb-6 border-b border-white/[0.08]">
                    <p className="font-mono text-xs font-bold text-bone uppercase tracking-wider">
                      Custom Scope via Strategy Call
                    </p>
                    <p className="font-sans text-muted text-xs leading-relaxed italic mt-1">{plan.anchor}</p>
                  </div>

                  <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                    {plan.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5">
                        <span className="text-signal-gold text-[10px] mt-1 shrink-0">◈</span>
                        <span className="font-sans text-muted text-xs leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto space-y-2.5">
                    <Link
                      href={plan.href}
                      className={`w-full flex justify-center items-center gap-2 py-3 px-4 font-mono text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 whitespace-nowrap ${
                        plan.featured
                          ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] hover:brightness-110 shadow-md shadow-[#C5A059]/20'
                          : 'border border-white/20 text-bone hover:border-signal-gold/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{plan.ctaPrimary}</span>
                    </Link>

                    <a
                      href={plan.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex justify-center items-center gap-1.5 py-2 font-mono text-[0.62rem] text-muted hover:text-signal-gold tracking-widest uppercase transition-colors whitespace-nowrap"
                    >
                      <span>{plan.ctaSecondary} (ClientForge) ↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <Disclaimer variant="compact" className="mt-12 max-w-2xl mx-auto text-center" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA — DIRECT & DISCREET
        ═══════════════════════════════════════════════════════════ */}
        <section
          className="relative px-6 lg:px-12 py-36 overflow-hidden text-center"
          style={{ background: '#030304' }}
        >
          <div className="max-w-dossier mx-auto relative z-10">
            <span className="eyebrow mb-6 inline-block">Take Action</span>

            <h2
              className="display-page mb-8 mx-auto max-w-4xl text-bone"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', lineHeight: 1.08 }}
            >
              Don&apos;t Let an Average Resume<br />
              <em className="not-italic text-gold-gradient text-glow-gold">Hold Back Your True Value.</em>
            </h2>

            <p className="font-serif text-muted text-base sm:text-lg max-w-xl mx-auto mb-10">
              Transform your resume, LinkedIn profile, custom banner, and cover letter into an irresistible recruiter magnet today.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-xl mx-auto">
              <Link
                href="/request"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#C5A059]/20 hover:brightness-110 transition-all text-center whitespace-nowrap"
              >
                Book Executive Consultation →
              </Link>
              <a
                href="https://clientforge.theripplenexus.com/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full hover:border-signal-gold/50 hover:bg-white/[0.05] transition-all text-center whitespace-nowrap"
              >
                Instant Self-Service Portal ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
