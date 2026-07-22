'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { InflectionMark } from '@/components/ui/InflectionMark'

const nav = [
  { label: 'Career Booster', href: '/blueprint' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Market Audit', href: '/audit' },
  { label: 'Free TPI Score', href: '/tpi' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* Detect scroll to tighten header on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-obsidian/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-0'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-white/[0.05] py-0'
      }`}
    >
      {/* Subtle top gold hairline */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(184,147,91,0.6) 40%, rgba(184,147,91,0.8) 50%, rgba(184,147,91,0.6) 60%, transparent 100%)',
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
              <span className="font-mono text-[0.52rem] tracking-[0.3em] uppercase text-signal-gold/80 mt-0.5">
                BY RIPPLE NEXUS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-xs text-muted/90 font-medium tracking-wide hover:text-bone transition-colors duration-200 relative group py-1"
              >
                {item.label}
                {/* Underline reveal on hover */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-signal-gold group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/testimonials"
              className="font-mono text-xs text-muted hover:text-signal-gold transition-colors duration-200 px-3 py-1.5 rounded"
            >
              ★ Testimonials (4.98/5)
            </Link>
            <Link
              href="/request"
              id="header-cta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-signal-gold to-amber-500 text-obsidian px-6 py-2.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase shadow-lg shadow-signal-gold/15 hover:brightness-110 transition-all duration-300 shrink-0"
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
        <div className="px-6 py-8 flex flex-col gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-serif text-xl text-bone hover:text-signal-gold transition-colors py-1 border-b border-white/[0.05]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/request"
              className="bg-gradient-to-r from-signal-gold to-amber-500 text-obsidian px-6 py-3.5 rounded-full font-sans text-xs uppercase tracking-wider text-center font-bold shadow-lg"
              onClick={() => setOpen(false)}
            >
              Book Executive Consultation Call →
            </Link>
            <Link
              href="/testimonials"
              className="border border-white/15 text-bone px-6 py-3 rounded-full font-sans text-xs uppercase tracking-wider text-center hover:border-signal-gold/40 transition-colors"
              onClick={() => setOpen(false)}
            >
              View 48 Candidate Success Stories (4.98 ★)
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
