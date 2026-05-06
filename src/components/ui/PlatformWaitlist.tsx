'use client'

import { useState } from 'react'

const COUNTRY_CODES = [
  { code: '+91',  label: 'IN +91'  },
  { code: '+971', label: 'AE +971' },
  { code: '+1',   label: 'US +1'   },
  { code: '+44',  label: 'GB +44'  },
  { code: '+65',  label: 'SG +65'  },
  { code: '+61',  label: 'AU +61'  },
  { code: '+49',  label: 'DE +49'  },
  { code: '+33',  label: 'FR +33'  },
  { code: '+81',  label: 'JP +81'  },
  { code: '+86',  label: 'CN +86'  },
]

type Props = { plan?: string }

export function PlatformWaitlist({ plan }: Props) {
  const [email,     setEmail]     = useState('')
  const [dialCode,  setDialCode]  = useState('+91')
  const [phone,     setPhone]     = useState('')
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
      const phoneValue = phone.trim() ? `${dialCode}${phone.trim()}` : undefined
      const res  = await fetch('/api/platform-waitlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, plan, phone: phoneValue, honeypot: '' }),
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
        <p className="label-inst mb-2">Position confirmed.</p>
        <p className="font-sans text-muted text-sm">
          You&apos;ll be notified when early access opens{plan ? ` — ${plan} tier` : ''}. Launch pricing is yours permanently.
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

      {/* Phone (optional) */}
      <div className="flex gap-0">
        <select
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          disabled={loading}
          className="bg-obsidian border border-graphite border-r-0 px-2 py-3.5 font-mono text-muted text-[0.6rem]
                     focus:outline-none focus:border-signal-gold/60 shrink-0"
        >
          {COUNTRY_CODES.map(c => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile (optional)"
          autoComplete="tel"
          disabled={loading}
          className="flex-1 bg-transparent border border-graphite px-4 py-3.5 font-sans text-bone text-sm
                     focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40 disabled:opacity-50"
        />
      </div>

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
