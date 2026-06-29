'use client'

import { useState } from 'react'
import { Button } from './Button'

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

export function NewsletterForm() {
  const [email,     setEmail]     = useState('')
  const [dialCode,  setDialCode]  = useState('+91')
  const [phone,     setPhone]     = useState('')
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
      const phoneValue = phone.trim() ? `${dialCode}${phone.trim()}` : undefined
      const res = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, phone: phoneValue, honeypot: '' }),
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
        <p className="label-inst mb-4">Access Confirmed</p>
        <p className="display-card text-2xl mb-4">
          Intelligence Brief registered.
        </p>
        <p className="font-serif text-muted text-lg leading-relaxed">
          Your first brief will arrive soon. Check your inbox to confirm.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        onChange={() => {}}
      />

      {/* Email */}
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

      {/* Phone (optional) */}
      <div className="flex gap-0">
        <select
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          disabled={loading}
          className="bg-graphite/30 border border-graphite/60 border-r-0 px-3 py-5 font-mono text-muted text-xs
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
          placeholder="Mobile number (optional)"
          autoComplete="tel"
          disabled={loading}
          className="flex-1 bg-graphite/20 border border-graphite/60 px-6 py-5 font-sans text-bone text-base
                     focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40 transition-all duration-300"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full justify-center py-6"
      >
        {loading ? 'PROCESSING...' : 'JOIN THE BRIEF →'}
      </Button>

      {error && <p className="font-sans text-signal-gold text-xs">{error}</p>}
      <p className="font-mono text-muted text-[0.55rem] tracking-[0.3em] uppercase opacity-40">
        High-trust communication · No marketing spam · One-click removal
      </p>
    </form>
  )
}
