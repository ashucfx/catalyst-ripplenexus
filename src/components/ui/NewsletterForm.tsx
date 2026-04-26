'use client'

import { useState } from 'react'
import { Button } from './Button'

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
        body:    JSON.stringify({ email, honeypot: '' }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="glass p-10 border border-signal-gold/30">
        <p className="label-inst mb-4">Verification Sent</p>
        <p className="display-card text-2xl mb-4">
          Institutional access confirmed.
        </p>
        <p className="font-serif text-muted text-lg leading-relaxed">
          The first Intelligence Brief arrives this Thursday. Check your inbox to finalize.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        onChange={() => {}}
      />
      <div className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Professional Email Address"
          autoComplete="email"
          disabled={loading}
          required
          className="w-full bg-graphite/20 border border-graphite/60 px-6 py-5 font-sans text-bone text-base
                     focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40 transition-all duration-300"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full justify-center py-6"
        >
          {loading ? 'PROCESSING...' : 'JOIN THE BRIEF →'}
        </Button>
      </div>
      {error && <p className="font-sans text-signal-gold text-xs">{error}</p>}
      <p className="font-mono text-muted text-[0.55rem] tracking-[0.3em] uppercase opacity-40">
        High-trust communication · No marketing spam · One-click removal
      </p>
    </form>
  )
}
