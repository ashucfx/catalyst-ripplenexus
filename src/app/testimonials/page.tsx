'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { TESTIMONIALS_DATA } from '@/data/testimonialsData'
import { GeoPrice } from '@/components/ui/GeoPrice'
import Link from 'next/link'

export default function TestimonialsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL')
  const [selectedPackage, setSelectedPackage] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredTestimonials = useMemo(() => {
    return TESTIMONIALS_DATA.filter((t) => {
      // Region filter
      if (selectedRegion !== 'ALL' && t.region !== selectedRegion) {
        return false
      }
      // Package filter
      if (selectedPackage !== 'ALL') {
        if (selectedPackage === 'BOOSTER' && !t.servicePackage.includes('Booster')) return false
        if (selectedPackage === 'MULTILINGUAL' && !t.servicePackage.includes('Multi-Lingual')) return false
        if (selectedPackage === 'US_APAC' && !t.servicePackage.includes('US') && !t.servicePackage.includes('UK')) return false
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchName = t.name.toLowerCase().includes(query)
        const matchRole = t.role.toLowerCase().includes(query)
        const matchLocation = t.location.toLowerCase().includes(query)
        const matchOutcome = t.companyOutcome.toLowerCase().includes(query)
        const matchQuote = t.quote.toLowerCase().includes(query)
        return matchName || matchRole || matchLocation || matchOutcome || matchQuote
      }

      return true
    })
  }, [selectedRegion, selectedPackage, searchQuery])

  return (
    <>
      <Header />

      <main className="pt-36 pb-32 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          {/* ═══════════════════════════════════════════════════════════
              HERO SECTION
          ════════════════════════════════════════════════════════════ */}
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signal-gold/30 bg-signal-gold/10 font-mono text-[0.6rem] tracking-[0.25em] uppercase text-signal-gold mb-6">
              <span>★ Verified Success Stories</span> • <span>ASEAN • APAC • GCC • Global</span>
            </div>

            <h1
              className="display-page mb-8 text-bone"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)', lineHeight: 1.08 }}
            >
              Real Career Outcomes.{' '}
              <em className="not-italic text-gold-gradient">Proven Salary Hikes.</em>
            </h1>

            <p className="font-serif text-muted text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
              Discover how ambitious professionals across Singapore, India, Dubai, Sydney, and global tech hubs transformed their resumes, LinkedIn profiles, and regional positioning to land high-paying offers.
            </p>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-obsidian/60 border border-white/10 backdrop-blur-xl">
              <div className="p-4 border-r border-white/10 last:border-0 text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-signal-gold mb-1">4.98 / 5</p>
                <p className="font-sans text-xs text-muted">Average Client Rating</p>
              </div>
              <div className="p-4 border-r border-white/10 last:border-0 text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-bone mb-1">+38%</p>
                <p className="font-sans text-xs text-muted">Average Pay Hike</p>
              </div>
              <div className="p-4 border-r border-white/10 last:border-0 text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-signal-gold mb-1">94%</p>
                <p className="font-sans text-xs text-muted">Recruiter Interview Rate</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-bone mb-1">14 Days</p>
                <p className="font-sans text-xs text-muted">Average Time to Interview</p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              FILTER & SEARCH BAR
          ════════════════════════════════════════════════════════════ */}
          <div className="mb-14 p-6 rounded-xl bg-obsidian/80 border border-white/10 backdrop-blur-lg flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search Input */}
            <div className="w-full lg:w-72 relative">
              <input
                type="text"
                placeholder="Search by role, city, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-2.5 text-xs text-bone placeholder:text-muted/50 focus:outline-none focus:border-signal-gold/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-muted hover:text-bone"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center">
              <span className="font-mono text-[0.55rem] tracking-widest uppercase text-muted mr-2">Region:</span>
              {[
                { id: 'ALL', label: 'All Markets' },
                { id: 'ASEAN', label: '🇸🇬 ASEAN' },
                { id: 'APAC', label: '🇮🇳 🇦🇺 APAC' },
                { id: 'GCC', label: '🇦🇪 GCC / Middle East' },
                { id: 'Global', label: '🇺🇸 🇬🇧 Global' },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
                    selectedRegion === reg.id
                      ? 'bg-signal-gold text-obsidian font-bold shadow-md'
                      : 'bg-white/[0.03] text-muted hover:text-bone hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            {/* Package Filter Buttons */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <span className="font-mono text-[0.55rem] tracking-widest uppercase text-muted mr-1">Package:</span>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="bg-white/[0.04] border border-white/15 text-bone text-xs font-mono rounded px-3 py-2 focus:outline-none focus:border-signal-gold/60"
              >
                <option value="ALL" className="bg-obsidian text-bone">All Service Packages</option>
                <option value="BOOSTER" className="bg-obsidian text-bone">Career Booster Suite</option>
                <option value="MULTILINGUAL" className="bg-obsidian text-bone">Multi-Lingual Support</option>
                <option value="US_APAC" className="bg-obsidian text-bone">US / Global Relocation</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8 px-2">
            <p className="font-mono text-xs text-muted">
              Showing <span className="text-bone font-bold">{filteredTestimonials.length}</span> verified candidate reviews
            </p>
            {(selectedRegion !== 'ALL' || selectedPackage !== 'ALL' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedRegion('ALL')
                  setSelectedPackage('ALL')
                  setSearchQuery('')
                }}
                className="font-mono text-[0.55rem] uppercase tracking-widest text-signal-gold hover:underline"
              >
                Reset Filters ↺
              </button>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
              TESTIMONIALS GRID
          ════════════════════════════════════════════════════════════ */}
          {filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              {filteredTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-xl border border-white/10 bg-obsidian/40 mb-24">
              <p className="font-serif text-bone text-xl mb-2">No matching reviews found</p>
              <p className="font-sans text-xs text-muted mb-6">Try clearing your search query or selecting &quot;All Markets&quot;</p>
              <button
                onClick={() => {
                  setSelectedRegion('ALL')
                  setSelectedPackage('ALL')
                  setSearchQuery('')
                }}
                className="px-6 py-2.5 bg-signal-gold text-obsidian font-mono text-xs uppercase tracking-widest font-bold rounded"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TRANSFORMATION SHOWCASE / COMPARISON SECTION
          ═══════════════════════════════════════════════════════════ */}
          <div className="p-10 lg:p-16 rounded-2xl bg-gradient-to-b from-obsidian via-black to-obsidian border border-white/10 mb-24">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-signal-gold block mb-3">
                The Catalyst Standard
              </span>
              <h2 className="display-section text-3xl lg:text-4xl text-bone mb-4">
                What Changes When We Rewrite Your Professional Brand?
              </h2>
              <p className="font-serif text-muted text-base leading-relaxed">
                Recruiters spend 6 seconds scanning your profile. Here is how we turn a passive CV into an irresistible executive magnet.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weak Resume Before */}
              <div className="p-8 rounded-xl bg-red-950/20 border border-red-900/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">❌ Before: Average Resume Bullet</span>
                  <span className="text-xs text-red-400 font-mono">0% Recruiter Interest</span>
                </div>
                <div className="p-4 rounded bg-black/60 font-mono text-xs text-muted/80 leading-relaxed mb-4 border border-red-900/20">
                  &ldquo;Responsible for managing a team of product managers and launching new features on the mobile app. Worked closely with engineering and marketing teams to improve user engagement.&rdquo;
                </div>
                <ul className="space-y-2 text-xs text-muted">
                  <li className="flex items-center gap-2">⚠️ Lacks quantifiable business ROI or dollar impact</li>
                  <li className="flex items-center gap-2">⚠️ Missing ATS keywords like Product Strategy, Retention, CAC</li>
                  <li className="flex items-center gap-2">⚠️ Sounds like a general list of day-to-day duties</li>
                </ul>
              </div>

              {/* High Impact Catalyst After */}
              <div className="p-8 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">✓ After: Catalyst Executive Metric</span>
                  <span className="text-xs text-emerald-400 font-mono">98% ATS Match • High Recall</span>
                </div>
                <div className="p-4 rounded bg-black/60 font-mono text-xs text-bone leading-relaxed mb-4 border border-emerald-800/30">
                  &ldquo;Spearheaded end-to-end mobile product roadmap for 1.4M active users across ASEAN, driving +34% MoM user retention and generating $4.2M net ARR; scaled high-performing squad of 12 PMs and engineers.&rdquo;
                </div>
                <ul className="space-y-2 text-xs text-bone/90">
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">✓ Quantified revenue impact ($4.2M net ARR) and scale</li>
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">✓ High-velocity ATS optimized keywords and leadership signals</li>
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">✓ Custom regional framing for Singapore & APAC markets</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              FINAL CTA BANNER
          ════════════════════════════════════════════════════════════ */}
          <div className="text-center p-12 lg:p-20 rounded-2xl bg-gradient-to-r from-signal-gold/10 via-obsidian to-signal-gold/10 border border-signal-gold/30 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-signal-gold to-transparent" />
            <h2 className="display-card text-3xl lg:text-5xl text-bone mb-6">
              Ready to Upgrade Your Market Value?
            </h2>
            <p className="font-serif text-muted text-lg max-w-xl mx-auto mb-10">
              Get your Resume rewritten by executive experts, paired with custom LinkedIn banner & DP directions and country-specific optimization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/blueprint"
                className="bg-signal-gold text-obsidian px-10 py-5 font-sans text-xs font-bold tracking-[0.25em] uppercase rounded btn-primary-glow hover:bg-bone transition-all"
              >
                View Career Booster Pricing — <GeoPrice product="sprint" variant="cta" /> →
              </Link>
              <Link
                href="/audit"
                className="border border-white/20 text-bone px-8 py-5 font-sans text-xs tracking-[0.22em] uppercase rounded hover:border-signal-gold/40 transition-colors"
              >
                Get Market Value Audit →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
