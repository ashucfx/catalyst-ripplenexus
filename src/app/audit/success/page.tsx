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
            <p className="label-inst mb-6">Payment Confirmed</p>
            <h1 className="display-editorial mb-6">
              Check your inbox.
            </h1>
            <p className="font-serif text-muted text-lg leading-relaxed mb-4">
              We&apos;ve sent you a private portal link. Open it, complete your 5-minute
              professional intake, and your Talent Positioning Index report is generated
              instantly — no waiting, no scheduling.
            </p>
            <p className="font-serif text-muted text-base leading-relaxed mb-12">
              If you don&apos;t see the email within 5 minutes, check your spam folder.
              The subject line is: <em className="text-bone">Your Catalyst Audit Portal — Complete Your Intake</em>
            </p>
            <div className="border border-graphite p-8 mb-12">
              <p className="label-inst mb-4">What happens next</p>
              <div className="flex flex-col gap-4">
                {[
                  { n: '01', step: 'Open the portal link in your email.' },
                  { n: '02', step: 'Complete the 5-minute professional intake.' },
                  { n: '03', step: 'Your TPI score, salary benchmark, ATS analysis, and 90-day repositioning roadmap are generated in under 90 seconds.' },
                  { n: '04', step: 'Download your full report as a branded PDF.' },
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
