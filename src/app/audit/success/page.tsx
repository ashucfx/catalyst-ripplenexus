import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Payment Confirmed — Catalyst Audit',
  robots: { index: false, follow: false },
}

export default function AuditSuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16 min-h-screen flex items-center">
        <div className="max-w-dossier mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-xl">
            <p className="label-inst mb-6">Confirmed</p>
            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}>
              Your Audit is booked.
            </h1>
            <p className="font-serif text-muted text-lg leading-relaxed mb-4">
              Payment received. A Catalyst architect will contact you within 24 hours to schedule
              your 45-minute Market Value Audit session.
            </p>
            <p className="font-serif text-muted text-lg leading-relaxed mb-12">
              Check your inbox for a confirmation. If you don&apos;t see it within 5 minutes,
              check your spam folder.
            </p>
            <div className="border border-graphite p-8 mb-12">
              <p className="label-inst mb-4">What happens next</p>
              <div className="flex flex-col gap-4">
                {[
                  { n: '01', step: 'You receive a calendar invite within 24 hours.' },
                  { n: '02', step: 'Your 45-minute diagnostic session is conducted by a Catalyst architect.' },
                  { n: '03', step: 'You receive your TPI score, salary benchmark, ATS analysis, and repositioning map within 48 hours of the session.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-4 items-start">
                    <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest mt-1 shrink-0">{s.n}</span>
                    <p className="font-sans text-muted text-sm leading-relaxed">{s.step}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button href="/" variant="ghost">Back to home</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
