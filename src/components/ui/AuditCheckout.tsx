'use client'

import { useState } from 'react'
import Link from 'next/link'

export function AuditCheckout() {
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
      <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-2xl bg-obsidian border-2 border-signal-gold/40 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block mb-2 font-bold">
          Analyst Evaluation Request Registered
        </span>
        <h3 className="display-card text-2xl text-bone mb-3">
          Thank you, {name}!
        </h3>
        <p className="font-serif text-muted text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Your request is registered in ClientForge CRM. A senior analyst is reviewing your target role (<strong className="text-bone">{role || 'Senior Leader'}</strong>) and will send your evaluation details to <strong className="text-bone">{email}</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/book"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs uppercase tracking-widest font-bold rounded-full hover:brightness-110 transition-all text-center shadow-md whitespace-nowrap"
          >
            Pick Consultation Slot Now →
          </Link>
          <a
            href="https://clientforge.theripplenexus.com/checkout?pkg=AUDIT"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 border border-white/20 text-bone font-mono text-xs uppercase tracking-widest font-semibold rounded-full hover:border-signal-gold/40 transition-colors text-center whitespace-nowrap"
          >
            Self-Service Checkout ↗
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/15 shadow-2xl backdrop-blur-xl">
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 mb-8 text-center">
        <span className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold block mb-2">
          📊 Analyst Market Value Audit
        </span>
        <h3 className="display-card text-xl text-bone mb-2">
          Comprehensive ATS Score • Benchmarking • Analyst Strategy Call
        </h3>
        <p className="font-serif text-muted text-xs leading-relaxed">
          Submit your profile details for an analyst-prepared diagnostic report and strategy consultation call.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <p className="font-sans text-red-400 text-xs p-3 rounded-lg bg-red-950/40 border border-red-900/50">{error}</p>}

        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
            Full Name <span className="text-signal-gold">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rachel Tan"
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
              Email Address <span className="text-signal-gold">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rachel@company.com"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
              Phone / WhatsApp <span className="text-signal-gold">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+65 9123 4567"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
            Target Position / Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Director of Engineering / Lead PM"
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] px-7 py-4 font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Registering Request...' : 'Request Analyst Audit Consultation →'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-center">
        <span className="font-mono text-emerald-400 text-[0.62rem] uppercase tracking-wider">
          ✓ Confidential
        </span>
        <span className="font-mono text-muted text-[0.62rem] uppercase tracking-wider">
          • ClientForge CRM Synced
        </span>
        <span className="font-mono text-signal-gold text-[0.62rem] uppercase tracking-wider">
          • 24-Hr Analyst Response
        </span>
      </div>
    </div>
  )
}
