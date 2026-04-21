'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function CancelContent() {
  const params  = useSearchParams()
  const token   = params.get('token') ?? ''
  const [state, setState] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [msg,   setMsg]   = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setMsg('Invalid cancellation link.'); return }
    setState('loading')
    fetch('/api/schedule/cancel', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setState('done') }
        else { setState('error'); setMsg(d.error ?? 'Could not cancel.') }
      })
      .catch(() => { setState('error'); setMsg('Network error.') })
  }, [token])

  return (
    <div className="max-w-lg">
      {state === 'loading' && (
        <p className="font-sans text-muted text-sm">Cancelling your booking…</p>
      )}
      {state === 'done' && (
        <>
          <h1 className="font-serif text-bone font-light text-3xl mb-6">Booking cancelled.</h1>
          <p className="font-sans text-muted text-sm leading-relaxed mb-8">
            Your session has been cancelled and a confirmation sent to your email.
          </p>
          <Link href="/book" className="font-mono text-[0.6rem] tracking-widest text-signal-gold hover:text-bone transition-colors">
            Book a new session →
          </Link>
        </>
      )}
      {state === 'error' && (
        <>
          <h1 className="font-serif text-bone font-light text-3xl mb-6">Unable to cancel.</h1>
          <p className="font-sans text-muted text-sm leading-relaxed mb-8">{msg}</p>
          <Link href="/book" className="font-mono text-[0.6rem] tracking-widest text-signal-gold">
            Return to booking →
          </Link>
        </>
      )}
      {state === 'idle' && (
        <p className="font-sans text-muted text-sm">Loading…</p>
      )}
    </div>
  )
}

export default function CancelPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <p className="label-inst mb-8">Session Cancellation</p>
          <Suspense fallback={<p className="font-sans text-muted text-sm">Loading…</p>}>
            <CancelContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
