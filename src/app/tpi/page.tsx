import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TPICalculator } from '@/components/ui/TPICalculator'

export const metadata: Metadata = {
  title: 'Free TPI Score — How Much Is the Market Undervaluing You?',
  description:
    'Get your free Talent Positioning Index score in 5 minutes. Discover exactly how much the market is undervaluing you — and what to do about it.',
}

export default function TPIPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16 min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          <div className="mb-16 max-w-2xl">
            <p className="label-inst mb-6">Free — No commitment required</p>
            <hr className="rule mb-10 w-16" style={{ borderColor: '#B8935B' }} />
            <h1
              className="font-serif text-bone font-light leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}
            >
              How much is the market undervaluing you?
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed">
              Five questions. Five minutes. Your Talent Positioning Index (TPI) score —
              a single number that tells you where you stand in the market, and
              what it is costing you every year to stay there.
            </p>
          </div>

          <TPICalculator />

        </div>
      </main>
      <Footer />
    </>
  )
}
