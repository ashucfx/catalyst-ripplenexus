'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function AuditCheckout() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your full name.'); return }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!phone.trim()) { setError('Please enter your phone number.'); return }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role.trim() || 'Senior Leader',
          seniority: '9-15 yrs',
          geography: 'Global',
          service: 'Market Value Audit & Consultation',
          packageSlug: 'AUDIT',
          servicesRequested: ['Market Value Audit'],
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to submit request. Please try again.')
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
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-obsidian border border-signal-gold/40 text-center shadow-xl">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xl mx-auto mb-4">
          ✓
        </div>
        <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block mb-2 font-bold">
          Consultation Request Confirmed
        </span>
        <p className="font-serif text-bone text-lg mb-4">
          Thank you, {name}! Your audit request is registered in our ClientForge CRM.
        </p>
        <p className="font-sans text-muted text-xs leading-relaxed mb-6">
          Our senior analyst will review your background and send your consultation link to <strong className="text-bone">{email}</strong>.
        </p>
        <Link
          href="/book"
          className="inline-block w-full py-3.5 bg-signal-gold text-obsidian font-mono text-xs uppercase tracking-wider font-bold rounded hover:bg-bone transition-all"
        >
          Pick Your Consultation Slot →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl bg-obsidian border border-white/10 shadow-2xl">
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6 text-center">
        <p className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold mb-1">
          ANALYST MARKET VALUE AUDIT
        </p>
        <p className="font-serif text-bone text-sm">
          Comprehensive ATS Score • Benchmarking • Strategic Consultation Call
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <p className="font-sans text-red-400 text-xs p-3 rounded bg-red-950/40 border border-red-900/50">{error}</p>}

        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1">
            Full Name <span className="text-signal-gold">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rachel Tan"
            className="w-full bg-white/[0.04] border border-white/15 rounded px-4 py-3 text-xs text-bone focus:outline-none focus:border-signal-gold"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1">
            Email Address <span className="text-signal-gold">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rachel@company.com"
            className="w-full bg-white/[0.04] border border-white/15 rounded px-4 py-3 text-xs text-bone focus:outline-none focus:border-signal-gold"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1">
            Phone / WhatsApp <span className="text-signal-gold">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+65 9123 4567"
            className="w-full bg-white/[0.04] border border-white/15 rounded px-4 py-3 text-xs text-bone focus:outline-none focus:border-signal-gold"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1">
            Target Position / Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Director of Engineering / Lead PM"
            className="w-full bg-white/[0.04] border border-white/15 rounded px-4 py-3 text-xs text-bone focus:outline-none focus:border-signal-gold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-signal-gold text-obsidian px-6 py-4 font-sans text-xs font-bold tracking-[0.2em] uppercase rounded hover:bg-bone transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Registering Request...' : 'Request Analyst Audit Consultation →'}
        </button>
      </form>

      <p className="font-mono text-muted text-[0.55rem] tracking-widest text-center mt-4 opacity-70">
        ✓ Confidential • Registered in ClientForge Leads Flywheel • 24-hr response
      </p>
    </div>
  )
}
