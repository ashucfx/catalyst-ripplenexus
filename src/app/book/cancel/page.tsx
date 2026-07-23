'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Disclaimer } from '@/components/ui/Disclaimer'

function CancelContent() {
  const params  = useSearchParams()
  const token   = params.get('token') ?? ''
  const [state, setState] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [msg,   setMsg]   = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setMsg('Invalid or expired cancellation link.'); return }
    setState('loading')
    fetch('/api/schedule/cancel', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setState('done') }
        else { setState('error'); setMsg(d.error ?? 'Could not cancel booking.') }
      })
      .catch(() => { setState('error'); setMsg('Network error. Please try again.') })
  }, [token])

  return (
    <div className="max-w-lg mx-auto p-10 rounded-2xl bg-obsidian border border-white/15 shadow-2xl backdrop-blur-xl text-center">
      {state === 'loading' && (
        <div className="py-8">
          <p className="font-mono text-xs text-signal-gold uppercase tracking-widest animate-pulse font-bold">
            Processing Cancellation Request...
          </p>
        </div>
      )}

      {state === 'done' && (
        <>
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl mx-auto mb-4">
            ✕
          </div>
          <span className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold block mb-2">
            Reservation Released
          </span>
          <h1 className="display-card text-2xl text-bone mb-3">
            Strategy Session Cancelled
          </h1>
          <p className="font-serif text-muted text-xs leading-relaxed mb-6">
            Your appointment has been cancelled and your calendar slot released. A cancellation email has been dispatched.
          </p>
          <Link
            href="/book"
            className="inline-block px-7 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-md"
          >
            Schedule a New Session →
          </Link>
        </>
      )}

      {state === 'error' && (
        <>
          <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center text-2xl mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="display-card text-2xl text-bone mb-3">
            Unable to Process Cancellation
          </h1>
          <p className="font-sans text-muted text-xs leading-relaxed mb-6">{msg}</p>
          <Link
            href="/book"
            className="inline-block px-7 py-3 border border-white/20 text-bone hover:border-signal-gold/40 font-mono text-xs uppercase font-bold tracking-widest rounded-full transition-colors"
          >
            Return to Booking Page →
          </Link>
        </>
      )}

      {state === 'idle' && (
        <p className="font-mono text-xs text-muted">Initializing request...</p>
      )}
    </div>
  )
}

export default function CancelPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <Suspense fallback={
            <div className="max-w-lg mx-auto p-10 text-center rounded-2xl bg-obsidian border border-white/10">
              <p className="font-mono text-xs text-muted">Loading cancellation status...</p>
            </div>
          }>
            <CancelContent />
          </Suspense>

          <Disclaimer variant="compact" className="mt-16 pt-8 border-t border-white/[0.05]" />
        </div>
      </main>
      <Footer />
    </>
  )
}
