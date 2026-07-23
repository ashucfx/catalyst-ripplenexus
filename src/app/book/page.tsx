import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getMeetingTypes } from '@/lib/db/bookings'
import { Disclaimer } from '@/components/ui/Disclaimer'

export const metadata: Metadata = {
  title: 'Book a Strategy Consultation Session — Catalyst by Ripple Nexus',
  description: 'Select a 1-on-1 executive strategy session, Market Value Audit, or positioning call with senior Catalyst consultants.',
}

const icons: Record<string, string> = {
  audit:     '📊',
  strategy:  '🎯',
  blueprint: '👑',
}

export default async function BookPage() {
  const meetingTypes = await getMeetingTypes()

  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HERO HEADER ────────────────────────────────────────── */}
          <div className="mb-16 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signal-gold/30 bg-signal-gold/10 font-mono text-[0.6rem] tracking-[0.25em] uppercase text-signal-gold mb-6">
              <span>📅 Interactive Executive Calendar · Strategy Sessions</span>
            </div>

            <h1
              className="display-page mb-6 text-bone"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', lineHeight: 1.08 }}
            >
              Select Your 1-on-1{' '}
              <em className="not-italic text-gold-gradient">Strategy Session.</em>
            </h1>

            <p className="font-serif text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              All sessions are conducted via confidential video call. Choose a slot in your local timezone to lock in your strategy session with an executive consultant.
            </p>

            {/* Regional Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                '🇸🇦 Saudi Arabia',
                '🇶🇦 Qatar',
                '🇦🇪 UAE / Dubai',
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

          {/* ── EMPTY STATE FALLBACK ───────────────────────────────── */}
          {meetingTypes.length === 0 && (
            <div className="max-w-xl mx-auto p-10 text-center rounded-2xl bg-obsidian border border-white/10">
              <p className="font-serif text-muted text-sm leading-relaxed mb-4">
                Scheduling availability is currently updating for next week. Please check back shortly or submit a direct inquiry.
              </p>
              <Link
                href="/request"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs uppercase font-bold tracking-widest rounded-full"
              >
                Submit Consultation Request →
              </Link>
            </div>
          )}

          {/* ── SESSION TYPES GRID ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {meetingTypes.map((mt) => {
              const isPaid = mt.price_usd > 0
              return (
                <div
                  key={mt.id}
                  className="p-8 rounded-2xl bg-obsidian border border-white/15 hover:border-signal-gold/40 shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{icons[mt.id] ?? '◈'}</span>
                      <span
                        className={`font-mono text-[0.6rem] uppercase tracking-widest px-3 py-1 rounded-full font-bold border ${
                          isPaid
                            ? 'border-signal-gold/40 text-signal-gold bg-signal-gold/10'
                            : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                        }`}
                      >
                        {isPaid ? 'Strategy Session' : 'Complimentary'}
                      </span>
                    </div>

                    <h3 className="display-card text-xl sm:text-2xl text-bone mb-3 group-hover:text-signal-gold transition-colors">
                      {mt.name}
                    </h3>
                    <p className="font-sans text-muted text-xs leading-relaxed mb-6">
                      {mt.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider block">
                          Duration
                        </span>
                        <span className="font-mono text-xs text-bone font-bold">
                          {mt.duration_min} minutes
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider block">
                          Format
                        </span>
                        <span className="font-mono text-xs text-signal-gold font-bold">
                          Google Meet
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/book/${mt.id}`}
                      className="w-full block py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center hover:brightness-110 transition-all shadow-md"
                    >
                      Book Session Now →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── HOW IT WORKS ───────────────────────────────────────── */}
          <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-2xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-signal-gold font-bold block mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="display-card text-2xl text-bone mb-8">
              How Scheduling Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  n: '01',
                  title: 'Select Date & Time',
                  desc: 'Pick your preferred date and time slot. Our interactive calendar automatically calculates availability in your local timezone.',
                },
                {
                  n: '02',
                  title: 'Candidate Profile Details',
                  desc: 'Provide your target role and brief context so our executive team can review your background prior to the session.',
                },
                {
                  n: '03',
                  title: 'Instant Calendar Invitation',
                  desc: 'A Google Meet link and interactive .ics calendar invite are instantly dispatched to your email for 1-click sync.',
                },
              ].map((step) => (
                <div key={step.n} className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="font-mono text-signal-gold text-xs font-bold block mb-3">{step.n}</span>
                  <h3 className="display-card text-lg text-bone mb-2">{step.title}</h3>
                  <p className="font-sans text-muted text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Disclaimer variant="compact" className="pt-8 border-t border-white/[0.05]" />

        </div>
      </main>
      <Footer />
    </>
  )
}
