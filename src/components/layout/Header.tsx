'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { InflectionMark } from '@/components/ui/InflectionMark'

const packageItems = [
  {
    title: '🚀 Career Booster Package',
    desc: 'Resume Rewrite + ATS 98% + LinkedIn Bio & Banner + Cover Letter',
    href: '/blueprint#career-booster',
    badge: 'Popular',
  },
  {
    title: '👑 Premium Plus Package',
    desc: 'Career Booster + Personal Web Portfolio Showcase Website',
    href: '/blueprint#premium-plus',
    badge: 'C-Suite',
  },
  {
    title: '📊 Market Value Audit',
    desc: 'Analyst-prepared 48-hour CV & compensation evaluation',
    href: '/audit',
    badge: '48-Hour',
  },
  {
    title: '🏆 Free TPI Score',
    desc: 'Talent Positioning Index diagnostic assessment',
    href: '/tpi',
    badge: 'Free',
  },
]

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
          ? 'bg-obsidian/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-0'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent border-b border-white/[0.05] py-0'
      }`}
    >
      {/* Subtle top gold hairline */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.6) 40%, rgba(197,160,89,0.9) 50%, rgba(197,160,89,0.6) 60%, transparent 100%)',
        }}
      />
      <div className="max-w-dossier mx-auto px-6 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Brand mark */}
          <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Catalyst Home">
            <InflectionMark size="sm" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-bone tracking-tight text-xl font-bold text-gradient">
                CATALYST
              </span>
              <span className="font-mono text-[0.52rem] tracking-[0.3em] uppercase text-muted/70 mt-0.5">
                BY RIPPLE NEXUS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {/* Packages Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="font-sans text-xs text-bone font-semibold tracking-wide hover:text-signal-gold transition-colors duration-200 flex items-center gap-1.5 py-1 focus:outline-none"
                aria-expanded={dropdownOpen}
              >
                <span>Packages &amp; Services</span>
                <span className={`text-[9px] text-signal-gold transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Dropdown Menu Box */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-obsidian/95 border border-white/15 backdrop-blur-2xl rounded-2xl shadow-2xl p-3 mt-1 space-y-1.5 z-50">
                  {packageItems.map((pkg) => (
                    <Link
                      key={pkg.title}
                      href={pkg.href}
                      onClick={() => setDropdownOpen(false)}
                      className="group flex flex-col gap-0.5 p-3 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-bone group-hover:text-signal-gold transition-colors">
                          {pkg.title}
                        </span>
                        <span className="font-mono text-[0.52rem] text-signal-gold bg-signal-gold/10 px-2 py-0.5 rounded-full border border-signal-gold/30">
                          {pkg.badge}
                        </span>
                      </div>
                      <span className="font-sans text-[0.68rem] text-muted leading-snug">
                        {pkg.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/testimonials"
              className="font-sans text-xs text-muted/90 font-medium tracking-wide hover:text-bone transition-colors duration-200 relative group py-1"
            >
              Testimonials
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C5A059] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>

            <Link
              href="/audit"
              className="font-sans text-xs text-muted/90 font-medium tracking-wide hover:text-bone transition-colors duration-200 relative group py-1"
            >
              Market Audit
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C5A059] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>

            <Link
              href="/tpi"
              className="font-sans text-xs text-muted/90 font-medium tracking-wide hover:text-bone transition-colors duration-200 relative group py-1"
            >
              Free TPI Score
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C5A059] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/testimonials"
              className="font-mono text-xs text-muted hover:text-signal-gold transition-colors duration-200 px-3 py-1.5 rounded whitespace-nowrap"
            >
              ★ 48 Client Reviews (5.0)
            </Link>
            <Link
              href="/request"
              id="header-cta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-obsidian px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-widest uppercase shadow-md shadow-[#C5A059]/20 hover:brightness-110 transition-all duration-300 shrink-0 whitespace-nowrap"
            >
              <span>Book Strategy Call</span>
              <span className="text-sm font-bold">→</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 p-2 rounded-lg bg-white/[0.05] border border-white/10"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`block h-0.5 bg-signal-gold transition-all duration-300 ${open ? 'w-5 rotate-45 translate-y-[5px]' : 'w-5'}`} />
            <span className={`block h-0.5 bg-signal-gold transition-all duration-200 ${open ? 'opacity-0 w-3' : 'w-4'}`} />
            <span className={`block h-0.5 bg-signal-gold transition-all duration-300 ${open ? 'w-5 -rotate-45 -translate-y-[5px]' : 'w-5'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu — full viewport overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'rgba(8, 9, 12, 0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="px-6 py-8 flex flex-col gap-5">
          <p className="font-mono text-[0.6rem] text-signal-gold uppercase tracking-widest font-bold">
            Flagship Packages &amp; Services
          </p>

          <Link
            href="/blueprint#career-booster"
            className="font-serif text-lg text-bone hover:text-signal-gold transition-colors py-1 border-b border-white/[0.05]"
            onClick={() => setOpen(false)}
          >
            🚀 Career Booster Package
          </Link>
          <Link
            href="/blueprint#premium-plus"
            className="font-serif text-lg text-bone hover:text-signal-gold transition-colors py-1 border-b border-white/[0.05]"
            onClick={() => setOpen(false)}
          >
            👑 Premium Plus (Includes Portfolio Site)
          </Link>
          <Link
            href="/testimonials"
            className="font-serif text-lg text-bone hover:text-signal-gold transition-colors py-1 border-b border-white/[0.05]"
            onClick={() => setOpen(false)}
          >
            ★ Verified Reviews (48)
          </Link>
          <Link
            href="/audit"
            className="font-serif text-lg text-bone hover:text-signal-gold transition-colors py-1 border-b border-white/[0.05]"
            onClick={() => setOpen(false)}
          >
            📊 Market Value Audit (48-Hr)
          </Link>
          <Link
            href="/tpi"
            className="font-serif text-lg text-bone hover:text-signal-gold transition-colors py-1 border-b border-white/[0.05]"
            onClick={() => setOpen(false)}
          >
            🏆 Free TPI Score
          </Link>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/request"
              className="bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-obsidian px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider text-center font-bold shadow-lg whitespace-nowrap"
              onClick={() => setOpen(false)}
            >
              Book Strategy Consultation →
            </Link>
            <a
              href="https://clientforge.theripplenexus.com/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-bone px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider text-center hover:border-signal-gold/40 transition-colors whitespace-nowrap"
              onClick={() => setOpen(false)}
            >
              ClientForge Self-Service Checkout ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
