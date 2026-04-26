'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { GeoPrice } from '@/components/ui/GeoPrice'

const nav = [
  { label: 'How It Works', href: '/system' },
  { label: 'Services',     href: '/audit' },
  { label: 'Platform',     href: '/platform' },
  { label: 'Intelligence', href: '/intelligence' },
]

export function Header() {
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  /* Detect scroll to tighten header on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/[0.07] py-0'
          : 'bg-transparent border-b border-transparent py-0'
      }`}
    >
      {/* Gold top hairline — always visible */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(184,147,91,0.65) 35%, rgba(184,147,91,0.9) 50%, rgba(184,147,91,0.65) 65%, transparent 100%)' }}
      />
      <div className="max-w-dossier mx-auto px-6 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Brand mark */}
          <Link href="/" className="flex items-center gap-4 group shrink-0" aria-label="Catalyst Home">
            <InflectionMark size="sm" />
            <div className="flex flex-col leading-none">
              <span
                className="font-serif text-bone tracking-[-0.03em] text-gradient"
                style={{ fontSize: '1.35rem', fontWeight: 400, lineHeight: 1 }}
              >
                CATALYST
              </span>
              <span
                className="label-inst opacity-50"
                style={{ fontSize: '0.4rem', letterSpacing: '0.32em', marginTop: '3px' }}
              >
                BY RIPPLE NEXUS
              </span>
            </div>
          </Link>

          {/* Desktop nav — middle */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-muted text-[0.6rem] tracking-[0.22em] uppercase
                           hover:text-bone transition-colors duration-250 relative group"
              >
                {item.label}
                {/* Underline reveal on hover */}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-signal-gold 
                                 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/tpi"
              className="font-mono text-muted text-[0.58rem] tracking-[0.22em] uppercase
                         hover:text-signal-gold transition-colors duration-250"
            >
              Free TPI
            </Link>
            <Link
              href="/audit"
              id="header-cta"
              className="inline-flex items-center gap-2 bg-signal-gold text-obsidian
                         px-7 py-3 font-sans text-[0.58rem] tracking-[0.22em] uppercase font-bold
                         btn-primary-glow hover:bg-bone transition-all duration-300"
            >
              Get Report — <GeoPrice product="audit" variant="cta" />
              <span className="text-xs">→</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col justify-center gap-[6px] w-8 h-8 p-1"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`block h-px bg-signal-gold transition-all duration-300 ${open ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`} />
            <span className={`block h-px bg-signal-gold transition-all duration-200 ${open ? 'opacity-0 w-4' : 'w-4'}`} />
            <span className={`block h-px bg-signal-gold transition-all duration-300 ${open ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-6'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu — full viewport overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'var(--obsidian)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-8 py-12 flex flex-col gap-8">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="display-card text-2xl hover:text-signal-gold transition-colors"
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-8 mt-4 border-t border-white/[0.07] flex flex-col gap-4">
            <Link
              href="/audit"
              className="bg-signal-gold text-obsidian px-8 py-5 font-sans text-[0.65rem] 
                         tracking-[0.2em] uppercase text-center font-bold"
              onClick={() => setOpen(false)}
            >
              Book Market Value Audit — <GeoPrice product="audit" variant="cta" />
            </Link>
            <Link
              href="/tpi"
              className="border border-white/15 text-bone px-8 py-5 font-sans text-[0.65rem] 
                         tracking-[0.2em] uppercase text-center hover:border-signal-gold/40 transition-colors"
              onClick={() => setOpen(false)}
            >
              Free TPI Assessment
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
