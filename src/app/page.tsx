'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GeoPrice } from '@/components/ui/GeoPrice'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { TESTIMONIALS_DATA } from '@/data/testimonialsData'
import Link from 'next/link'

// ─── Data: Packages ───────────────────────────────────────────────────

const selectionPlans = [
  {
    tier: 'I',
    product: 'audit' as const,
    name: 'Market Value Audit',
    subtitle: 'RESUME & MARKET VALUE EVALUATION',
    anchor: 'Delivered in 48 hours. Confidential.',
    roi: 'Standard',
    deliverables: [
      'Detailed ATS & Resume Audit Report',
      'Talent Positioning Score (TPI)',
      '3 Highest-leverage bullet rewrites',
      'Market value & compensation benchmark',
    ],
    transformation: 'Uncertainty → Market Clarity',
    href: '/audit',
    ctaBase: 'Get Audit Report',
  },
  {
    tier: 'II',
    product: 'sprint' as const,
    name: 'Career Booster Package',
    subtitle: 'RESUME · LINKEDIN · BANNER & DP · COVER LETTER',
    anchor: 'Complimentary Cover Letter included. Tailored by country.',
    roi: 'Most Popular',
    deliverables: [
      'Executive Resume Rewrite (ATS 98%+ score)',
      'LinkedIn Full Profile Rewrite (Headline, Bio, Work)',
      'Custom LinkedIn Banner & DP Direction Kit',
      'Complimentary Custom Cover Letter',
      'Country-Specific Optimization (ASEAN / APAC / GCC)',
      'Recruiter Outreach DM Templates',
    ],
    transformation: 'Invisible CV → Recruiter Magnet',
    href: '/blueprint',
    ctaBase: 'Get Career Booster',
    featured: true,
  },
  {
    tier: 'III',
    product: 'blueprint' as const,
    name: 'Premium Plus Suite',
    subtitle: 'CAREER BOOSTER + PERSONAL PORTFOLIO WEBSITE',
    anchor: 'Everything in Booster + Custom Career Showcase Website.',
    roi: '20% off',
    deliverables: [
      'Everything included in Career Booster',
      'Personal Web Portfolio Showcase',
      'Multi-Lingual CV Adaptation (English + 1 Language)',
      'Salary & Offer Negotiation Playbook',
      '1-on-1 Executive Pitch Guidance',
    ],
    transformation: 'Positioned → Industry Authority',
    href: '/blueprint',
    ctaBase: 'View Premium Pricing',
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

// ─── Page Component ──────────────────────────────────────────────────

export default function HomePage() {
  const [activeRegion, setActiveRegion] = useState(0)
  const [currentSalary, setCurrentSalary] = useState(80000)

  const estimatedHike = Math.round(currentSalary * 0.35)
  const newSalary = currentSalary + estimatedHike

  return (
    <>
      <Header />

      <main className="grain">
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION — HIGH IMPACT & JARGON-FREE
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
                'linear-gradient(90deg, transparent 0%, rgba(184,147,91,0.7) 40%, rgba(184,147,91,0.9) 50%, rgba(184,147,91,0.7) 60%, transparent 100%)',
            }}
          />

          <div className="relative z-10 max-w-dossier mx-auto px-6 lg:px-12">
            {/* Live Regional Coverage Chip */}
            <div className="live-badge mb-10 inline-flex items-center gap-2">
              <span className="pulse-dot" />
              <span>Career Booster Active • 🇸🇬 SG • 🇮🇳 IN • 🇦🇪 UAE • 🇦🇺 AU • 🇺🇸 US • 🇲🇾 MY • 🇮🇩 ID</span>
            </div>

            {/* Main Headline */}
            <h1
              className="display-hero mb-8 max-w-5xl"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6.8rem)', lineHeight: 1.05 }}
            >
              Skyrocket Your Career &amp; Land{' '}
              <em className="text-gold-gradient not-italic text-glow-gold">High-Paying Global Roles.</em>
            </h1>

            {/* Clear Subheadline */}
            <p
              className="font-serif text-muted leading-relaxed mb-12 max-w-3xl"
              style={{ fontSize: 'clamp(1.15rem, 2vw, 1.45rem)' }}
            >
              Professional <strong className="text-bone font-medium">Executive Resume Rewrites</strong>,{' '}
              <strong className="text-bone font-medium">LinkedIn Profile &amp; Custom Banner Design</strong>,{' '}
              <strong className="text-bone font-medium">Tailored Cover Letters</strong>, and{' '}
              <strong className="text-bone font-medium">Multi-Lingual Country Optimization</strong> across ASEAN, APAC, Middle East &amp; Global markets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-14">
              <div className="shimmer-trigger w-full sm:w-auto">
                <Link
                  href="/blueprint"
                  id="hero-cta-primary"
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-signal-gold text-obsidian
                             px-10 py-5 font-sans text-xs font-bold tracking-[0.22em] uppercase
                             btn-primary-glow hover:bg-bone transition-all duration-300 rounded"
                >
                  Get Career Booster Package — <GeoPrice product="sprint" variant="cta" />
                  <span className="text-sm">→</span>
                </Link>
                <div className="shimmer-bar" />
              </div>

              <Link
                href="/testimonials"
                id="hero-cta-secondary"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 text-bone border border-white/20
                           px-9 py-5 font-sans text-xs tracking-[0.2em] uppercase rounded
                           hover:border-signal-gold/40 hover:bg-white/[0.04] transition-all duration-300"
              >
                ★ Verified Testimonials (4.98/5)
              </Link>
            </div>

            {/* Feature Trust Pills */}
            <div className="flex flex-wrap gap-3 mb-16">
              {[
                '✓ ATS 98%+ Pass Rate Guarantee',
                '✓ Custom LinkedIn Banner & DP Directions',
                '✓ Free Custom Cover Letter Included',
                '✓ Multi-Lingual Support (ENG, CHN, JPN, BHS, GER, FRA)',
                '✓ Country Tailored (ASEAN, GCC, APAC, US/EU)',
              ].map((t) => (
                <span
                  key={t}
                  className="font-mono text-[0.62rem] text-bone bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: 'Resume Rewrite', desc: 'ATS optimized, quantified bullet points, PDF & Word' },
                  { title: 'LinkedIn Overhaul', desc: 'Headline, Bio, Work history + Custom Banner & DP' },
                  { title: 'Cover Letter', desc: 'Custom strategic cover letter for targeted job apps' },
                  { title: 'Country Optimization', desc: 'Adapted for Singapore, Dubai, Sydney, US/EU norms' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <p className="font-mono text-signal-gold text-xs font-bold uppercase tracking-wider mb-1">
                      {item.title}
                    </p>
                    <p className="font-sans text-muted text-xs leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SERVICE BREAKDOWN — EVERYTHING COVERED
        ════════════════════════════════════════════════════════════ */}
        <section className="relative px-6 lg:px-12 py-36 bg-obsidian border-t border-b border-white/[0.06]">
          <div className="max-w-dossier mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-3">
                Complete Career Transformation
              </span>
              <h2 className="display-section text-3xl sm:text-5xl text-bone mb-6">
                Everything You Need to Command Higher Compensation.
              </h2>
              <p className="font-serif text-muted text-lg leading-relaxed">
                We remove the guesswork. We rebuild your professional brand across every touchpoint so recruiters pursue you instead of you chasing them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/40 transition-all duration-300">
                <span className="font-mono text-signal-gold text-sm font-bold block mb-3">01. EXECUTIVE RESUME REWRITE</span>
                <h3 className="font-serif text-bone text-xl font-semibold mb-3">ATS 98%+ Optimized CV</h3>
                <p className="font-sans text-muted text-xs leading-relaxed mb-4">
                  We rewrite your entire resume from scratch, converting weak task lists into high-leverage revenue and scale metrics.
                </p>
                <ul className="space-y-2 font-mono text-[0.62rem] text-bone/80">
                  <li>✓ Formatted in editable MS Word + PDF</li>
                  <li>✓ Keyword-matched for ATS screeners</li>
                  <li>✓ Quantified achievement metrics</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/40 transition-all duration-300">
                <span className="font-mono text-signal-gold text-sm font-bold block mb-3">02. LINKEDIN PROFILE &amp; BANNER</span>
                <h3 className="font-serif text-bone text-xl font-semibold mb-3">Full Profile &amp; Custom Banner</h3>
                <p className="font-sans text-muted text-xs leading-relaxed mb-4">
                  High-converting Headline, story-driven About section, and featured achievements plus **Custom LinkedIn Banner** and **Display Picture (DP)** style guidelines.
                </p>
                <ul className="space-y-2 font-mono text-[0.62rem] text-bone/80">
                  <li>✓ Custom high-res LinkedIn Banner design</li>
                  <li>✓ Profile Photo (DP) background &amp; tone guide</li>
                  <li>✓ Recruiter search algorithm optimization</li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/40 transition-all duration-300">
                <span className="font-mono text-signal-gold text-sm font-bold block mb-3">03. COMPLIMENTARY COVER LETTER</span>
                <h3 className="font-serif text-bone text-xl font-semibold mb-3">Targeted Cover Letter</h3>
                <p className="font-sans text-muted text-xs leading-relaxed mb-4">
                  Included free with every Career Booster package. A persuasive narrative letter tailored to your dream role or cold recruiter pitch.
                </p>
                <ul className="space-y-2 font-mono text-[0.62rem] text-bone/80">
                  <li>✓ Adaptable template for job postings</li>
                  <li>✓ Executive summary narrative</li>
                  <li>✓ Direct HR pitch email format</li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/40 transition-all duration-300">
                <span className="font-mono text-signal-gold text-sm font-bold block mb-3">04. COUNTRY-BASED OPTIMIZATION</span>
                <h3 className="font-serif text-bone text-xl font-semibold mb-3">ASEAN, APAC, GCC &amp; Global</h3>
                <p className="font-sans text-muted text-xs leading-relaxed mb-4">
                  Specific formatting, tone, length, and compliance standards for **Singapore, Dubai/UAE, India, Australia, US, UK, Indonesia, and Vietnam**.
                </p>
                <ul className="space-y-2 font-mono text-[0.62rem] text-bone/80">
                  <li>✓ Regional recruiter standards compliance</li>
                  <li>✓ Visa / Relocation status positioning</li>
                  <li>✓ Local currency &amp; market alignment</li>
                </ul>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/40 transition-all duration-300">
                <span className="font-mono text-signal-gold text-sm font-bold block mb-3">05. MULTI-LINGUAL CV SUPPORT</span>
                <h3 className="font-serif text-bone text-xl font-semibold mb-3">Multi-Lingual Adaptation</h3>
                <p className="font-sans text-muted text-xs leading-relaxed mb-4">
                  Need a dual-language CV for global markets? We support **English, Mandarin Chinese, Japanese, Bahasa Melayu/Indonesia, German, French, and Spanish**.
                </p>
                <ul className="space-y-2 font-mono text-[0.62rem] text-bone/80">
                  <li>✓ Native professional translation</li>
                  <li>✓ Cultural terminology adaptation</li>
                  <li>✓ Dual-column or separate PDF options</li>
                </ul>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 hover:border-signal-gold/40 transition-all duration-300">
                <span className="font-mono text-signal-gold text-sm font-bold block mb-3">06. RECRUITER &amp; SALARY KIT</span>
                <h3 className="font-serif text-bone text-xl font-semibold mb-3">Outreach &amp; Negotiation Guide</h3>
                <p className="font-sans text-muted text-xs leading-relaxed mb-4">
                  Includes ready-to-send LinkedIn DM templates to decision-makers and our proven salary negotiation playbook to maximize your offer.
                </p>
                <ul className="space-y-2 font-mono text-[0.62rem] text-bone/80">
                  <li>✓ Cold recruiter InMail scripts</li>
                  <li>✓ Salary &amp; bonus negotiation scripts</li>
                  <li>✓ 1-Page Executive Pitch Bio</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            INTERACTIVE COUNTRY & REGIONAL STRATEGY SWITCHER
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-32 bg-black/40">
          <div className="max-w-dossier mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-2">
                Tailored for Regional Success
              </span>
              <h2 className="display-section text-3xl text-bone mb-4">
                Country &amp; Market Optimization
              </h2>
              <p className="font-serif text-muted text-sm leading-relaxed">
                What works in Silicon Valley won&apos;t work in Singapore or Dubai. See how we adapt your profile per region.
              </p>
            </div>

            {/* Region Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {regionalData.map((reg, idx) => (
                <button
                  key={reg.region}
                  onClick={() => setActiveRegion(idx)}
                  className={`px-5 py-3 rounded font-mono text-xs tracking-wider transition-all duration-200 ${
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
            <div className="p-8 lg:p-12 rounded-2xl bg-obsidian/80 border border-white/10 backdrop-blur-xl max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{regionalData[activeRegion].flag}</span>
                <h3 className="font-serif text-bone text-2xl font-bold">
                  {regionalData[activeRegion].region}
                </h3>
              </div>

              <p className="font-serif text-muted text-base leading-relaxed mb-8">
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
        <section className="px-6 lg:px-12 py-36 bg-obsidian border-t border-white/[0.06]">
          <div className="max-w-dossier mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-2">
                  Proven Career Impact
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

            <div className="text-center pt-8">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-3 border border-signal-gold/40 text-signal-gold px-8 py-4 font-mono text-xs tracking-[0.2em] uppercase rounded hover:bg-signal-gold hover:text-obsidian transition-all duration-300 font-bold"
              >
                Explore Full Testimonials Hub →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            INTERACTIVE SALARY HIKE ESTIMATOR
        ════════════════════════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-28 bg-gradient-to-b from-black via-obsidian to-black border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto p-10 lg:p-14 rounded-2xl bg-obsidian border border-white/10 backdrop-blur-xl text-center">
            <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-2">
              Calculate Your Potential Gain
            </span>
            <h2 className="display-card text-3xl text-bone mb-4">
              Estimated Salary Hike Calculator
            </h2>
            <p className="font-serif text-muted text-sm mb-10">
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
                <p className="font-mono text-2xl font-bold text-emerald-400">+${estimatedHike.toLocaleString()}</p>
              </div>
              <div className="text-center pl-4">
                <p className="font-mono text-[0.58rem] text-muted uppercase tracking-wider mb-1">Target Package</p>
                <p className="font-mono text-2xl font-bold text-signal-gold">${newSalary.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRICING MATRIX
        ════════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="relative px-6 lg:px-12 py-36 overflow-hidden"
          style={{ background: '#060608', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-dossier mx-auto relative">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <span className="eyebrow mb-4 inline-block">Transparent Pricing</span>
              <h2 className="display-section text-4xl mb-4">
                Simple Packages.{' '}
                <em className="not-italic text-gold-gradient">Maximum Career ROI.</em>
              </h2>
              <p className="font-serif text-muted text-base leading-relaxed">
                Choose the service level that fits your target level. Complimentary Cover Letter included with Career Booster.
              </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectionPlans.map((plan) => (
                <div
                  key={plan.tier}
                  className={`flex flex-col p-10 rounded-2xl relative transition-all duration-300 ${
                    plan.featured
                      ? 'bg-obsidian border-2 border-signal-gold shadow-2xl shadow-signal-gold/10'
                      : 'bg-obsidian/60 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-signal-gold text-obsidian font-mono text-[0.6rem] tracking-widest uppercase font-bold px-4 py-1 rounded-full">
                      ★ Most Popular Choice
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
                      Tier {plan.tier}
                    </span>
                    <span className="font-mono text-[0.58rem] tracking-widest uppercase text-muted bg-white/[0.04] px-2.5 py-1 rounded">
                      {plan.roi}
                    </span>
                  </div>

                  <h3 className="display-card text-2xl text-bone mb-1">{plan.name}</h3>
                  <p className="font-mono text-muted text-[0.52rem] tracking-widest uppercase mb-8">
                    {plan.subtitle}
                  </p>

                  <div className="pb-8 mb-8 border-b border-white/[0.08]">
                    <GeoPrice product={plan.product} variant="card" />
                    {plan.anchor && (
                      <p className="font-sans text-muted text-xs leading-relaxed italic mt-2">{plan.anchor}</p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-4 mb-10 flex-1">
                    {plan.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="text-signal-gold text-[10px] mt-1 shrink-0">◈</span>
                        <span className="font-sans text-muted text-xs leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link
                      href={plan.href}
                      className={`w-full flex justify-center items-center gap-2 py-4 font-sans text-xs font-bold tracking-[0.2em] uppercase rounded transition-all duration-300 ${
                        plan.featured
                          ? 'bg-signal-gold text-obsidian hover:bg-bone btn-primary-glow'
                          : 'border border-white/20 text-bone hover:border-signal-gold/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      {plan.ctaBase} — <GeoPrice product={plan.product} variant="cta" /> <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Disclaimer variant="compact" className="mt-12 max-w-2xl mx-auto text-center" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA — DIRECT & DISCREET
        ════════════════════════════════════════════════════════════ */}
        <section
          className="relative px-6 lg:px-12 py-44 overflow-hidden text-center"
          style={{ background: '#030304' }}
        >
          <div className="max-w-dossier mx-auto relative z-10">
            <span className="eyebrow mb-8 inline-block">Take Action</span>

            <h2
              className="display-page mb-10 mx-auto max-w-4xl text-bone"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', lineHeight: 1.05 }}
            >
              Don&apos;t Let an Average Resume<br />
              <em className="not-italic text-gold-gradient text-glow-gold">Hold Back Your True Value.</em>
            </h2>

            <p className="font-serif text-muted text-lg max-w-xl mx-auto mb-12">
              Transform your resume, LinkedIn profile, custom banner, and cover letter into an irresistible recruiter magnet today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/blueprint"
                id="footer-cta-primary"
                className="inline-flex items-center gap-3 bg-signal-gold text-obsidian
                           px-12 py-5 font-sans text-xs font-bold tracking-[0.22em] uppercase rounded
                           btn-primary-glow hover:bg-bone transition-all duration-300"
              >
                Get Career Booster Package — <GeoPrice product="sprint" variant="cta" />
                <span>→</span>
              </Link>

              <Link
                href="/testimonials"
                className="inline-flex items-center gap-3 text-bone border border-white/20
                           px-9 py-5 font-sans text-xs tracking-[0.2em] uppercase rounded
                           hover:border-signal-gold/40 transition-all duration-300"
              >
                Read Verified Testimonials
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
