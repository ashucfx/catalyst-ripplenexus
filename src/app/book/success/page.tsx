import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InflectionMark } from '@/components/ui/InflectionMark'

export const metadata: Metadata = {
  title: 'Booking Confirmed — Catalyst',
  robots: { index: false, follow: false },
}

export default function BookSuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">

            <div className="flex items-center gap-4 mb-10">
              <InflectionMark size="sm" />
              <p className="label-inst">Session confirmed</p>
            </div>

            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}>
              You are booked.
            </h1>

            <p className="font-serif text-muted text-lg leading-relaxed mb-12">
              A calendar invite and pre-session briefing are on their way to your inbox.
              We review your professional profile before every session — arrive ready to discuss
              your compensation history and target role.
            </p>

            <div className="border border-graphite p-8 mb-10">
              <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-6">WHAT HAPPENS NEXT</p>
              <div className="flex flex-col gap-6">
                {[
                  {
                    n: '01',
                    title: 'Check your inbox',
                    desc: 'Calendar invite + Zoom link arrives within 5 minutes. Check spam if not visible.',
                  },
                  {
                    n: '02',
                    title: 'We prepare',
                    desc: 'We review your LinkedIn profile, sector benchmarks, and compensation data before the session.',
                  },
                  {
                    n: '03',
                    title: 'The session',
                    desc: 'You will leave with a Talent Positioning Index score, salary benchmark, and a clear next step.',
                  },
                ].map(step => (
                  <div key={step.n} className="flex gap-5">
                    <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest mt-1 shrink-0">{step.n}</span>
                    <div>
                      <p className="font-serif text-bone text-base font-light mb-1">{step.title}</p>
                      <p className="font-sans text-muted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-sans text-muted text-sm">
              Need to cancel?{' '}
              <span className="text-bone">Check your confirmation email</span> for the cancellation link —
              available at least 24 hours before your session.
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
