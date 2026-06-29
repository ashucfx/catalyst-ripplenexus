import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TPICalculator } from '@/components/ui/TPICalculator'

export const metadata: Metadata = {
  title: 'Free TPI Score — How Is the Market Reading You?',
  description:
    'A five-question self-assessment. Get a directional Talent Positioning Index score and see where your positioning likely stands.',
}

export default function TPIPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16 min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          <div className="mb-16 max-w-2xl">
            <p className="label-inst mb-6">Free — No commitment required</p>
            <hr className="rule mb-10 w-16" />
            <h1 className="display-editorial mb-6">
              How is the market likely reading you?
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed">
              Five questions, about five minutes. You will get a directional Talent
              Positioning Index score: a quick read on where your positioning likely
              stands and where the biggest gap sits. This is a fast self-assessment,
              not a full audit. For the precise, analyst-prepared version, the Market
              Value Audit goes deeper.
            </p>
          </div>

          <TPICalculator />

        </div>
      </main>
      <Footer />
    </>
  )
}
