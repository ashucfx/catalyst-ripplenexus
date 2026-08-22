'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { TESTIMONIALS_DATA } from '@/data/testimonialsData'

interface PackageItem {
  id: string
  title: string
  desc: string
  href: string
  badge: string
  iconType: 'rocket' | 'crown' | 'audit' | 'tpi' | 'star'
  iconBg: string
  iconColor: string
}

const packageItems: PackageItem[] = [
  {
    id: 'career-booster',
    title: 'Career Booster Package',
    desc: 'Resume Rewrite + ATS 98% + LinkedIn Bio & Banner + Cover Letter',
    href: '/blueprint#career-booster',
    badge: '★ Most Popular',
    iconType: 'rocket',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    iconColor: 'text-[#D4AF37]',
  },
  {
    id: 'premium-plus',
    title: 'Premium Plus Suite',
    desc: 'Career Booster + Custom Personal Web Portfolio Showcase Site',
    href: '/blueprint#premium-plus',
    badge: 'Executive & C-Suite',
    iconType: 'crown',
    iconBg: 'bg-[#C5A059]/10 border-[#C5A059]/30',
    iconColor: 'text-[#C5A059]',
  },
  {
    id: 'market-audit',
    title: 'Market Value Audit',
    desc: 'Analyst-prepared 48-hour CV evaluation & compensation benchmark',
    href: '/audit',
    badge: 'Delivered in 48h',
    iconType: 'audit',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'tpi-score',
    title: 'Free TPI Score Diagnostic',
    desc: 'Talent Positioning Index diagnostic score & gap assessment',
    href: '/tpi',
    badge: '100% Free',
    iconType: 'tpi',
    iconBg: 'bg-yellow-500/10 border-yellow-500/30',
    iconColor: 'text-amber-400',
  },
]

function BrandIcon({ type, className = 'w-4 h-4' }: { type: string; className?: string }) {
  switch (type) {
    case 'rocket':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.24A4.5 4.5 0 003.75 18a.75.75 0 00.75.75c1.077 0 2.073-.418 2.818-1.102l1.644-1.643" />
        </svg>
      )
    case 'crown':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2zm0-4l3-8 4 4 2-5 2 5 4-4 3 8H3z" />
        </svg>
      )
    case 'audit':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'tpi':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9 0h-9m4.5-14.25a4.5 4.5 0 00-4.5 4.5v1.5a4.5 4.5 0 009 0v-1.5a4.5 4.5 0 00-4.5-4.5zM3.75 6.75h2.25m12 0h2.25" />
        </svg>
      )
    case 'star':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    default:
      return null
  }
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  /* Detect scroll to tighten header on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 150)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-obsidian/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-0'
          : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent border-b border-white/[0.05] py-0'
      }`}
    >
      {/* Top gold hairline */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.7) 40%, rgba(197,160,89,0.95) 50%, rgba(197,160,89,0.7) 60%, transparent 100%)',
        }}
      />

      <div className="max-w-dossier mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16 sm:h-18' : 'h-20 sm:h-22'}`}>

          {/* Brand mark */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0" aria-label="Catalyst Home">
            <InflectionMark size="sm" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-bone tracking-tight text-xl sm:text-2xl font-bold text-gradient">
                CATALYST
              </span>
              <span className="font-mono text-[0.52rem] sm:text-[0.55rem] tracking-[0.3em] uppercase text-muted/80 mt-0.5">
                BY RIPPLE NEXUS
              </span>
            </div>
          </Link>

          {/* Desktop Breathable & Responsive Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4" aria-label="Main navigation">
            {/* Packages Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="font-sans text-xs xl:text-sm text-bone font-semibold tracking-wide hover:text-signal-gold transition-colors duration-200 flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 focus:outline-none"
                aria-expanded={dropdownOpen}
              >
                <BrandIcon type="rocket" className="w-4 h-4 text-[#D4AF37]" />
                <span>Packages &amp; Services</span>
                <span className={`text-[9px] text-signal-gold transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Glassmorphic Dropdown Menu Box */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-96 bg-obsidian/95 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/90 p-4 mt-1.5 space-y-2 z-50">
                  {packageItems.map((pkg) => (
                    <Link
                      key={pkg.id}
                      href={pkg.href}
                      onClick={() => setDropdownOpen(false)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all"
                    >
                      <div className={`p-2.5 rounded-xl border ${pkg.iconBg} ${pkg.iconColor} shrink-0 mt-0.5 shadow-sm`}>
                        <BrandIcon type={pkg.iconType} className="w-4 h-4" />
                      </div>

                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-bone group-hover:text-signal-gold transition-colors truncate">
                            {pkg.title}
                          </span>
                          <span className="font-mono text-[0.5rem] text-signal-gold bg-signal-gold/10 px-2 py-0.5 rounded-full border border-signal-gold/30 shrink-0">
                            {pkg.badge}
                          </span>
                        </div>
                        <span className="font-sans text-[0.68rem] text-muted leading-snug">
                          {pkg.desc}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/testimonials"
              className="font-sans text-xs xl:text-sm text-muted/90 hover:text-bone font-medium tracking-wide transition-colors duration-200 px-3.5 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 flex items-center gap-2"
            >
              <BrandIcon type="star" className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Testimonials</span>
            </Link>

            <Link
              href="/audit"
              className="font-sans text-xs xl:text-sm text-muted/90 hover:text-bone font-medium tracking-wide transition-colors duration-200 px-3.5 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 flex items-center gap-2"
            >
              <BrandIcon type="audit" className="w-3.5 h-3.5 text-emerald-400" />
              <span>Market Audit</span>
            </Link>

            <Link
              href="/tpi"
              className="font-sans text-xs xl:text-sm text-muted/90 hover:text-bone font-medium tracking-wide transition-colors duration-200 px-3.5 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 flex items-center gap-2"
            >
              <BrandIcon type="tpi" className="w-3.5 h-3.5 text-amber-400" />
              <span>Free TPI Score</span>
            </Link>
          </nav>

          {/* Desktop CTAs (Breathable & High-Impact) */}
          <div className="hidden md:flex items-center gap-3.5 xl:gap-5">
            <Link
              href="/testimonials"
              className="font-mono text-xs text-bone hover:text-signal-gold transition-all duration-200 px-3.5 py-2 rounded-full whitespace-nowrap flex items-center gap-2 bg-white/[0.04] border border-white/15 hover:border-signal-gold/40 shadow-sm"
            >
              <BrandIcon type="star" className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{TESTIMONIALS_DATA.length} Verified Reviews (5.0)</span>
            </Link>
            <Link
              href="/request"
              id="header-cta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] px-6 py-2.5 sm:py-3 rounded-full font-mono text-xs font-bold tracking-widest uppercase shadow-lg shadow-[#C5A059]/25 hover:brightness-110 hover:shadow-[#C5A059]/40 transition-all duration-300 shrink-0 whitespace-nowrap"
            >
              <span>Book Strategy Call</span>
              <span className="text-sm font-bold">→</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 p-2 rounded-xl bg-white/[0.06] border border-white/15 hover:border-signal-gold/40 transition-all"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`block h-0.5 bg-[#C5A059] transition-all duration-300 ${open ? 'w-5 rotate-45 translate-y-[5px]' : 'w-5'}`} />
            <span className={`block h-0.5 bg-[#C5A059] transition-all duration-200 ${open ? 'opacity-0 w-3' : 'w-4'}`} />
            <span className={`block h-0.5 bg-[#C5A059] transition-all duration-300 ${open ? 'w-5 -rotate-45 -translate-y-[5px]' : 'w-5'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu — High Impact Glassmorphic Overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'rgba(8, 9, 12, 0.97)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(197, 160, 89, 0.2)',
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          {/* Header Status Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[0.62rem] text-signal-gold uppercase tracking-widest font-bold">
                Executive Services &amp; Navigation
              </span>
            </div>
            <span className="font-mono text-[0.55rem] text-muted border border-white/10 bg-white/[0.04] px-2 py-0.5 rounded">
              CONFIDENTIAL
            </span>
          </div>

          {/* Mobile Navigation List with Colorful SVG Cards */}
          <div className="flex flex-col gap-2.5">
            {packageItems.map((pkg) => (
              <Link
                key={pkg.id}
                href={pkg.href}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-signal-gold/40 transition-all"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-lg border ${pkg.iconBg} ${pkg.iconColor} shrink-0`}>
                    <BrandIcon type={pkg.iconType} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm font-bold text-bone group-hover:text-signal-gold transition-colors truncate">
                        {pkg.title}
                      </span>
                      <span className="font-mono text-[0.52rem] text-signal-gold bg-signal-gold/10 px-2 py-0.5 rounded-full border border-signal-gold/30 shrink-0">
                        {pkg.badge}
                      </span>
                    </div>
                    <span className="font-sans text-[0.68rem] text-muted/80 leading-snug line-clamp-1">
                      {pkg.desc}
                    </span>
                  </div>
                </div>
                <span className="text-signal-gold text-sm font-bold ml-2 opacity-60 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            ))}

            {/* Testimonials Mobile Card */}
            <Link
              href="/testimonials"
              className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-signal-gold/40 transition-all"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-500/30 text-[#D4AF37] shrink-0">
                  <BrandIcon type="star" className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-bold text-bone group-hover:text-signal-gold transition-colors">
                      Verified Client Reviews
                    </span>
                    <span className="font-mono text-[0.52rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ★ 5.0 Rating
                    </span>
                  </div>
                  <span className="font-sans text-[0.68rem] text-muted/80 leading-snug">
                    Browse {TESTIMONIALS_DATA.length} candidate success stories across 25+ countries
                  </span>
                </div>
              </div>
              <span className="text-signal-gold text-sm font-bold ml-2 opacity-60 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          </div>

          {/* Mobile Actions / Buttons */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
            <Link
              href="/request"
              className="bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest text-center font-bold shadow-lg shadow-[#C5A059]/20 hover:brightness-110 transition-all whitespace-nowrap flex items-center justify-center gap-2"
              onClick={() => setOpen(false)}
            >
              <span>Book Strategy Consultation</span>
              <span className="font-bold text-sm">→</span>
            </Link>
            <a
              href="https://clientforge.theripplenexus.com/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-bone px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest text-center hover:border-signal-gold/50 hover:bg-white/[0.04] transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
              onClick={() => setOpen(false)}
            >
              <span>ClientForge Instant Checkout</span>
              <span className="text-muted/60 text-xs">↗</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
