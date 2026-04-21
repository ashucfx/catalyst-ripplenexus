'use client'

import Link from 'next/link'
import { useState } from 'react'
import { InflectionMark } from '@/components/ui/InflectionMark'

const nav = [
  { label: 'How It Works', href: '/system' },
  { label: 'Services', href: '/audit' },
  { label: 'Platform', href: '/platform' },
  { label: 'Intelligence', href: '/intelligence' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-obsidian/95 backdrop-blur-sm border-b border-graphite">
      <div className="max-w-dossier mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Brand mark */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <InflectionMark size="sm" />
            <div className="flex flex-col">
              <span
                className="font-serif text-bone tracking-[-0.03em] leading-none"
                style={{ fontSize: '1.3rem', fontWeight: 400 }}
              >
                CATALYST
              </span>
              <span className="label-inst" style={{ fontSize: '0.46rem', letterSpacing: '0.28em' }}>
                A RIPPLE NEXUS INSTITUTION
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-muted text-[0.68rem] tracking-[0.16em] uppercase
                           hover:text-bone transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs — free first, paid second */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tpi"
              className="font-sans text-signal-gold text-[0.65rem] tracking-[0.18em] uppercase
                         hover:text-bone transition-colors duration-200 border border-signal-gold/30
                         px-4 py-2 hover:border-bone/40"
            >
              Free TPI Score
            </Link>
            <Link
              href="/request"
              className="inline-flex items-center bg-signal-gold text-obsidian
                         px-5 py-2.5 font-sans text-[0.63rem] tracking-[0.18em] uppercase
                         hover:bg-bone transition-colors duration-200"
            >
              Book Audit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`block w-5 h-px bg-bone transition-all duration-200 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-bone transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-bone transition-all duration-200 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-graphite border-t border-graphite/60">
          <div className="px-6 py-6 flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-bone text-[0.75rem] tracking-[0.2em] uppercase"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="rule" />
            <Link
              href="/tpi"
              className="inline-flex justify-center border border-signal-gold text-signal-gold px-5 py-3
                         font-sans text-[0.65rem] tracking-[0.2em] uppercase text-center"
              onClick={() => setOpen(false)}
            >
              Free TPI Score
            </Link>
            <Link
              href="/request"
              className="inline-flex justify-center bg-signal-gold text-obsidian px-5 py-3
                         font-sans text-[0.65rem] tracking-[0.2em] uppercase text-center"
              onClick={() => setOpen(false)}
            >
              Book Audit — $499
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
