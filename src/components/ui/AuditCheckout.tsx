'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PaymentButton } from '@/components/ui/PaymentButton'

export function AuditCheckout() {
  const router                    = useRouter()
  const [email,   setEmail]       = useState('')
  const [error,   setError]       = useState('')
  const [success, setSuccess]     = useState(false)
  const [ready,   setReady]       = useState(false)

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setReady(true)
  }

  function handleSuccess() {
    setSuccess(true)
    setTimeout(() => router.push('/audit/success'), 1500)
  }

  if (success) {
    return (
      <div className="border border-signal-gold/30 bg-graphite/10 p-8 text-center">
        <p className="label-inst mb-3">Payment received.</p>
        <p className="font-serif text-bone text-xl font-light">Redirecting you now…</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">

      {/* Price Clarity Box */}
      <div className="border border-graphite bg-graphite/20 p-5 mb-6">
        <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-3">ELITE AUDIT — PRICING</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-muted text-[0.55rem] tracking-widest">INDIA (INR)</p>
            <p className="font-serif text-bone text-2xl">₹49,999</p>
            <p className="font-mono text-muted text-[0.55rem]">Razorpay · UPI · Cards</p>
          </div>
          <div className="w-px h-10 bg-graphite" />
          <div className="text-right">
            <p className="font-mono text-muted text-[0.55rem] tracking-widest">GLOBAL (USD)</p>
            <p className="font-serif text-bone text-2xl">$999</p>
            <p className="font-mono text-muted text-[0.55rem]">PayPal · Cards</p>
          </div>
        </div>
        <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest mt-3 pt-3 border-t border-graphite">
          ↳ Your payment method is automatically selected based on your location.
        </p>
      </div>

      {!ready ? (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4" noValidate>
          <label className="font-mono text-muted text-[0.6rem] tracking-widest">
            YOUR EMAIL — WHERE WE SEND THE BOOKING CONFIRMATION
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="bg-transparent border border-graphite px-5 py-4 font-sans text-bone text-sm
                       focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40"
          />
          {error && <p className="font-sans text-signal-gold text-xs">{error}</p>}
          <button
            type="submit"
            className="bg-signal-gold text-obsidian px-8 py-4 font-sans text-[0.7rem]
                       tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                       cursor-pointer"
          >
            Continue to Payment →
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border-b border-graphite pb-4 flex items-center justify-between">
            <p className="font-sans text-muted text-sm">{email}</p>
            <button
              onClick={() => setReady(false)}
              className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
            >
              CHANGE
            </button>
          </div>
          <PaymentButton
            product="audit"
            email={email}
            onSuccess={handleSuccess}
            onError={(msg) => setError(msg)}
            labelINR="Pay ₹49,999 — Book Elite Audit →"
            labelUSD="Pay $999 USD — Book Elite Audit →"
          />
          {error && <p className="font-sans text-signal-gold text-xs text-center">{error}</p>}
        </div>
      )}

      <p className="font-mono text-muted text-[0.6rem] tracking-widest text-center mt-6">
        Secure checkout · 100% refundable if we can&apos;t schedule within 7 days
      </p>
    </div>
  )
}

