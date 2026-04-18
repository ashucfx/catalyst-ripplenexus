import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16 min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="label-inst mb-6">404 — Not Located</p>
            <hr className="rule mb-10 w-16" style={{ borderColor: '#B8935B' }} />
            <h1
              className="font-serif text-bone font-light leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.025em' }}
            >
              This page does not<br />
              <em className="text-signal-gold not-italic">exist in this system.</em>
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed mb-12">
              The dossier you requested has not been filed, has been moved, or does not exist
              at this address. Return to the system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/" variant="primary">
                Return to the System →
              </Button>
              <Button href="/intelligence" variant="ghost">
                Browse Intelligence
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
