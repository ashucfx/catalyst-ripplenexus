'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, honeypot: '' }), // honeypot always empty from real users
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-signal-gold/30 bg-graphite/10 p-8">
        <p className="label-inst mb-3">You&apos;re in.</p>
        <p className="font-serif text-bone text-xl font-light mb-2">
          Welcome email on its way. First brief arrives Thursday.
        </p>
        <p className="font-sans text-muted text-sm leading-relaxed">
          Check your inbox — including spam if you don&apos;t see it within 2 minutes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
        onChange={() => {}} // controlled but ignored
      />
      <div className="flex flex-col sm:flex-row gap-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your professional email"
          autoComplete="email"
          disabled={loading}
          required
          className="flex-1 bg-transparent border border-graphite px-5 py-4 font-sans text-bone text-sm
                     focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40
                     sm:border-r-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-signal-gold text-obsidian px-6 py-4 font-sans text-[0.65rem]
                     tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                     whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Joining…' : 'Join Free →'}
        </button>
      </div>
      {error && <p className="font-sans text-signal-gold text-xs">{error}</p>}
      <p className="font-mono text-muted text-[0.6rem] tracking-widest">
        No spam. Unsubscribe anytime. Your email is never shared or sold.
      </p>
    </form>
  )
}
