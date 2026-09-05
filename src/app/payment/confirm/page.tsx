'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmForm() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  const [senderBank, setSenderBank] = useState('')
  const [transactionRef, setTransactionRef] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!ref) {
    return (
      <div className="text-center">
        <p className="font-sans text-muted text-sm mb-4">Invalid or missing payment reference.</p>
        <Link href="/" className="font-mono text-xs text-signal-gold hover:text-bone">← Return Home</Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/payment/bank-transfer/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, senderBank, transactionRef, notes }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setErrorMsg('Network error. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <span className="text-emerald-400 text-2xl">✓</span>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-bone mb-2 tracking-wide">Confirmation Sent</h2>
          <p className="font-sans text-muted text-sm max-w-sm mx-auto leading-relaxed">
            Thank you. We have notified our finance team to check for your incoming transfer.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/" className="inline-block px-6 py-3 border border-white/10 text-bone font-mono text-xs uppercase tracking-widest rounded-full hover:border-signal-gold/40 hover:text-signal-gold transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const inputCls = "w-full bg-white/[0.03] border border-white/15 rounded-lg px-4 py-3.5 font-sans text-sm text-bone focus:outline-none focus:border-signal-gold transition-colors placeholder:text-muted/40"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl text-bone mb-2 tracking-wide">Confirm Bank Transfer</h2>
        <p className="font-sans text-muted text-sm">
          Let us know that you have sent your payment so we can match it instantly.
        </p>
      </div>

      <div className="p-5 rounded-xl bg-signal-gold/[0.04] border border-signal-gold/20 text-center mb-6">
        <p className="font-mono text-[0.6rem] text-signal-gold uppercase tracking-widest mb-1">Payment Reference</p>
        <p className="font-mono text-xl text-bone font-bold tracking-widest">{ref}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-mono text-[0.65rem] text-muted uppercase tracking-wider mb-2 ml-1">
            Sender Bank Name <span className="text-signal-gold">*</span>
          </label>
          <input
            required
            value={senderBank}
            onChange={e => setSenderBank(e.target.value)}
            placeholder="e.g. Barclays, Chase, HSBC"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block font-mono text-[0.65rem] text-muted uppercase tracking-wider mb-2 ml-1">
            Transaction ID / Reference <span className="text-muted/50 lowercase tracking-normal">(Optional)</span>
          </label>
          <input
            value={transactionRef}
            onChange={e => setTransactionRef(e.target.value)}
            placeholder="Your bank's receipt or transaction number"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block font-mono text-[0.65rem] text-muted uppercase tracking-wider mb-2 ml-1">
            Additional Notes <span className="text-muted/50 lowercase tracking-normal">(Optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Any other details to help us identify your transfer..."
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {errorMsg && (
        <p className="font-sans text-red-400 text-xs p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-center">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-obsidian px-8 py-4 font-mono text-xs font-bold tracking-widest uppercase rounded-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-4"
      >
        {loading ? 'Submitting...' : 'Confirm Transfer Sent →'}
      </button>
    </form>
  )
}

export default function ConfirmTransferPage() {
  return (
    <div className="min-h-screen bg-obsidian grain flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0d0e12] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-signal-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-5 h-5 border-2 border-signal-gold border-t-transparent rounded-full animate-spin" /></div>}>
          <ConfirmForm />
        </Suspense>
      </div>
    </div>
  )
}
