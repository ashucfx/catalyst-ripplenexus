'use client'

import { useState } from 'react'

type Props = { plan?: string }

export function PlatformWaitlist({ plan }: Props) {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/platform-waitlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, plan, honeypot: '' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-signal-gold/30 bg-graphite/10 p-6">
        <p className="label-inst mb-2">You&apos;re on the list.</p>
        <p className="font-sans text-muted text-sm">
          We&apos;ll email you when early access opens{plan ? ` — ${plan} tier` : ''}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
        onChange={() => {}}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        autoComplete="email"
        disabled={loading}
        className="w-full bg-transparent border border-graphite px-5 py-3.5 font-sans text-bone text-sm
                   focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-signal-gold text-obsidian px-6 py-3.5 font-sans text-[0.65rem] tracking-[0.2em]
                   uppercase hover:bg-bone transition-colors duration-200 whitespace-nowrap
                   cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-center"
      >
        {loading ? 'Joining…' : 'Join Waitlist →'}
      </button>
      {error && (
        <p className="font-sans text-signal-gold text-xs mt-1">{error}</p>
      )}
    </form>
  )
}
