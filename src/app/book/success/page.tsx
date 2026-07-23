import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Disclaimer } from '@/components/ui/Disclaimer'

export const metadata: Metadata = {
  title: 'Booking Confirmed — Catalyst by Ripple Nexus',
  robots: { index: false, follow: false },
}

export default function BookSuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center p-10 rounded-2xl bg-obsidian border border-white/15 shadow-2xl backdrop-blur-xl">

            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg">
              ✓
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signal-gold/30 bg-signal-gold/10 font-mono text-[0.65rem] tracking-[0.25em] uppercase text-signal-gold mb-4">
              <InflectionMark size="sm" />
              <span>Strategy Session Reserved</span>
            </div>

            <h1 className="display-page text-3xl sm:text-4xl text-bone mb-4">
              Your Strategy Session Is Confirmed!
            </h1>

            <p className="font-serif text-muted text-base leading-relaxed mb-8 max-w-lg mx-auto">
              An interactive calendar invite (`invite.ics`) and your Google Meet room link have been dispatched to your inbox.
            </p>

            <div className="p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/10 text-left mb-8 space-y-4">
              <span className="font-mono text-[0.65rem] text-signal-gold uppercase tracking-widest font-bold block mb-4 border-b border-white/10 pb-3">
                WHAT HAPPENS NEXT
              </span>
              {[
                {
                  n: '01',
                  title: 'Check Your Email Inbox',
                  desc: 'Your .ics calendar invite and Google Meet link have been sent. Click "Yes" in your email inbox to lock it into your calendar.',
                },
                {
                  n: '02',
                  title: 'Executive Analyst Preparation',
                  desc: 'Our team reviews your target role, salary benchmark data, and positioning strategy prior to the call.',
                },
                {
                  n: '03',
                  title: 'The 1-on-1 Consultation',
                  desc: 'Join the Google Meet call at your scheduled time to receive your Talent Positioning Index and executive roadmap.',
                },
              ].map(step => (
                <div key={step.n} className="flex items-start gap-4">
                  <span className="font-mono text-signal-gold text-xs font-bold border border-signal-gold/30 bg-signal-gold/10 px-2.5 py-1 rounded-md shrink-0 mt-0.5">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="display-card text-base text-bone mb-1">{step.title}</h3>
                    <p className="font-sans text-muted text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs uppercase font-bold tracking-widest rounded-full hover:brightness-110 transition-all text-center shadow-md whitespace-nowrap"
              >
                Return to Homepage →
              </Link>
              <Link
                href="/tpi"
                className="px-8 py-3.5 border border-white/20 text-bone hover:border-signal-gold/40 font-mono text-xs uppercase font-semibold tracking-widest rounded-full transition-all text-center whitespace-nowrap"
              >
                Take Free TPI Score →
              </Link>
            </div>

          </div>

          <Disclaimer variant="compact" className="mt-16 pt-8 border-t border-white/[0.05]" />
        </div>
      </main>
      <Footer />
    </>
  )
}
