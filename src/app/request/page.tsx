'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

const steps = [
  { id: 1, label: 'Profile & Contact' },
  { id: 2, label: 'Career Goals' },
  { id: 3, label: 'Service & Market' },
]

const seniorities = [
  '0–2 years (Early Career)',
  '3–8 years (Mid Career / Lead)',
  '9–15 years (Senior Manager / Director)',
  '15+ years (VP / C-Suite / Executive)',
]

const geographies = [
  'Singapore / ASEAN Hub 🇸🇬',
  'India — Metro (Bengaluru, Mumbai, Delhi, Hyd) 🇮🇳',
  'UAE / Dubai / GCC 🇦🇪 🇸🇦',
  'Australia / New Zealand 🇦🇺',
  'United States / Remote US 🇺🇸',
  'United Kingdom / Europe 🇬🇧 🇪🇺',
  'Other Global Markets',
]

const goalsList = [
  'Land a high-paying role (+30% to +50% salary hike)',
  'Complete Resume Rewrite & ATS Keyword Pass',
  'LinkedIn Profile & Custom Banner Design',
  'Break through a career plateau to Director / VP level',
  'Target remote US/Global USD roles',
  'Cross-border relocation (Singapore, Dubai, UK visa)',
  'Executive salary & bonus negotiation strategy',
]

const servicesList = [
  {
    slug: 'CAREER_BOOSTER',
    label: 'Career Booster Package',
    tag: 'MOST POPULAR',
    desc: 'Executive Resume Rewrite + LinkedIn Full Profile & Custom Banner Design + Complimentary Cover Letter + Country Optimization.',
  },
  {
    slug: 'AUDIT',
    label: 'Market Value Audit & Strategy Call',
    tag: '48-HR TURNAROUND',
    desc: 'Full resume & market value audit report, TPI score, salary benchmarking, and 45-minute strategic consultation call.',
  },
  {
    slug: 'PREMIUM_PLUS',
    label: 'Premium Plus Suite',
    tag: 'FULL WEBSITES',
    desc: 'Everything in Career Booster + Personal Portfolio Web Showcase + Multi-Lingual CV Adaptation.',
  },
  {
    slug: 'EXECUTIVE',
    label: 'C-Suite Sovereign Executive Suite',
    tag: 'BESPOKE',
    desc: 'White-glove executive branding and confidential board positioning for $250K+ earners.',
  },
]

type FormData = {
  name: string
  email: string
  phone: string
  countryCode: string
  countryName: string
  role: string
  seniority: string
  geography: string
  goals: string[]
  timeline: string
  context: string
  service: string
  packageSlug: string
  referral: string
}

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  countryCode: 'IN',
  countryName: 'India',
  role: '',
  seniority: '',
  geography: '',
  goals: [],
  timeline: 'Immediate — actively applying',
  context: '',
  service: 'Career Booster Package',
  packageSlug: 'CAREER_BOOSTER',
  referral: '',
}

export default function RequestPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleGoal(g: string) {
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(g) ? f.goals.filter((x) => x !== g) : [...f.goals, g],
    }))
  }

  function validateStep(): boolean {
    if (step === 1) {
      if (!form.name.trim()) { setError('Please enter your full name.'); return false }
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('Please enter a valid business or personal email address.'); return false
      }
      if (!form.phone.trim()) { setError('Please enter your phone number with country code.'); return false }
      if (!form.role.trim()) { setError('Please enter your current or target job title.'); return false }
      if (!form.seniority) { setError('Please select your experience level.'); return false }
    }
    if (step === 2) {
      if (!form.geography) { setError('Please select your target market/geography.'); return false }
      if (form.goals.length === 0) { setError('Please select at least one career objective.'); return false }
    }
    setError('')
    return true
  }

  function next() {
    if (validateStep()) setStep((s) => s + 1)
  }

  function back() {
    setError('')
    setStep((s) => s - 1)
  }

  async function submit() {
    if (!form.packageSlug) { setError('Please select a service package.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          servicesRequested: [form.service],
          honeypot: '',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong. Please try again.'); return }
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Confirmation screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <Header />
        <main className="pt-36 pb-24 grain min-h-screen">
          <div className="max-w-dossier mx-auto px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center p-10 rounded-2xl bg-obsidian border border-white/10 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-2xl mx-auto mb-6">
                ✓
              </div>

              <span className="font-mono text-xs text-signal-gold uppercase tracking-[0.25em] block mb-2">
                Consultation Request Received
              </span>

              <h1 className="display-page text-3xl sm:text-4xl text-bone mb-6">
                Your Career Strategy Request Is Registered.
              </h1>

              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 mb-8 text-left space-y-3">
                <p className="font-serif text-muted text-sm leading-relaxed">
                  Our Senior Executive Consultant will review your target role (<strong className="text-bone">{form.role}</strong>) and prepare market benchmarking data before your consultation call.
                </p>
                <p className="font-mono text-xs text-emerald-400">
                  ✓ Confidential Request Registered — Senior Consultant Assigned
                </p>
                <p className="font-mono text-xs text-muted/80">
                  A confirmation email has been dispatched to <span className="text-bone font-bold">{form.email}</span>.
                </p>
              </div>

              {/* Direct Booking Card */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-signal-gold/10 via-obsidian to-signal-gold/10 border border-signal-gold/30 mb-8 text-center">
                <p className="font-mono text-xs text-signal-gold uppercase tracking-wider mb-2 font-bold">
                  ⚡ Prefer Instant Scheduling?
                </p>
                <p className="font-serif text-muted text-sm mb-4">
                  Pick a direct 1-on-1 consultation slot right now on our live calendar.
                </p>
                <Link
                  href="/book"
                  className="inline-flex justify-center items-center gap-2 bg-signal-gold text-obsidian px-8 py-3.5 rounded font-mono text-xs font-bold uppercase tracking-wider btn-primary-glow hover:bg-bone transition-all"
                >
                  Schedule Strategy Session Now →
                </Link>
              </div>

              <Button href="/" variant="ghost" className="w-full justify-center">
                ← Return to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── Form view ────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="pt-36 pb-32 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-signal-gold block mb-3">
              Career Booster &amp; Executive Services
            </span>
            <h1 className="display-page text-3xl sm:text-5xl text-bone mb-6">
              Book Your Strategic Consultation
            </h1>
            <p className="font-serif text-muted text-lg leading-relaxed">
              Fill out your candidate profile below. Our executive team will review your current positioning, ATS compatibility, and target market opportunities.
            </p>
          </div>

          {/* Stepper progress */}
          <div className="max-w-xl mx-auto mb-12 flex items-center justify-between relative px-4">
            <div className="absolute inset-x-8 top-1/2 h-px bg-white/10 -z-10" />
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-obsidian px-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    step === s.id
                      ? 'bg-signal-gold text-obsidian shadow-lg'
                      : step > s.id
                      ? 'bg-emerald-500 text-obsidian'
                      : 'bg-white/10 text-muted border border-white/10'
                  }`}
                >
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className={`font-mono text-[0.6rem] tracking-wider uppercase ${step === s.id ? 'text-signal-gold font-bold' : 'text-muted'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-2xl bg-obsidian border border-white/10 shadow-2xl backdrop-blur-xl">
            {error && (
              <div className="p-4 mb-8 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 font-sans text-xs flex items-center justify-between">
                <span>⚠️ {error}</span>
                <button onClick={() => setError('')} className="text-red-400 font-bold ml-2">✕</button>
              </div>
            )}

            {/* STEP 1: Profile & Contact */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-bone text-xl font-semibold mb-6 border-b border-white/10 pb-4">
                  Step 1: Your Professional Contact Profile
                </h2>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    Full Name <span className="text-signal-gold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rachel Tan / Arjun Mehta"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-signal-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                      Email Address <span className="text-signal-gold">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-signal-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                      Phone Number (WhatsApp) <span className="text-signal-gold">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+65 9123 4567 / +91 98765 43210"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-signal-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    Current or Target Job Title <span className="text-signal-gold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Product Manager / VP of Operations"
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-signal-gold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    Total Work Experience <span className="text-signal-gold">*</span>
                  </label>
                  <select
                    value={form.seniority}
                    onChange={(e) => set('seniority', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-signal-gold"
                  >
                    <option value="" className="bg-obsidian">Select experience tier...</option>
                    {seniorities.map((s) => (
                      <option key={s} value={s} className="bg-obsidian text-bone">{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Career Goals & Target Market */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-bone text-xl font-semibold mb-6 border-b border-white/10 pb-4">
                  Step 2: Target Market &amp; Key Objectives
                </h2>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    Primary Target Geography / Market <span className="text-signal-gold">*</span>
                  </label>
                  <select
                    value={form.geography}
                    onChange={(e) => {
                      const geoVal = e.target.value
                      set('geography', geoVal)
                      if (geoVal.includes('Singapore')) setForm(f => ({ ...f, countryCode: 'SG', countryName: 'Singapore' }))
                      else if (geoVal.includes('UAE') || geoVal.includes('GCC')) setForm(f => ({ ...f, countryCode: 'AE', countryName: 'United Arab Emirates' }))
                      else if (geoVal.includes('Australia')) setForm(f => ({ ...f, countryCode: 'AU', countryName: 'Australia' }))
                      else if (geoVal.includes('United States')) setForm(f => ({ ...f, countryCode: 'US', countryName: 'United States' }))
                      else if (geoVal.includes('United Kingdom')) setForm(f => ({ ...f, countryCode: 'GB', countryName: 'United Kingdom' }))
                      else setForm(f => ({ ...f, countryCode: 'IN', countryName: 'India' }))
                    }}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3 text-sm text-bone focus:outline-none focus:border-signal-gold"
                  >
                    <option value="" className="bg-obsidian">Select target geography...</option>
                    {geographies.map((g) => (
                      <option key={g} value={g} className="bg-obsidian text-bone">{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-3">
                    What are your main goals? (Select all that apply) <span className="text-signal-gold">*</span>
                  </label>
                  <div className="space-y-2.5">
                    {goalsList.map((g) => {
                      const active = form.goals.includes(g)
                      return (
                        <button
                          type="button"
                          key={g}
                          onClick={() => toggleGoal(g)}
                          className={`w-full text-left p-3 rounded-lg border text-xs font-sans transition-all flex items-center justify-between ${
                            active
                              ? 'bg-signal-gold/10 border-signal-gold text-bone font-medium'
                              : 'bg-white/[0.02] border-white/10 text-muted hover:border-white/20'
                          }`}
                        >
                          <span>{g}</span>
                          <span className={`font-mono text-xs font-bold ${active ? 'text-signal-gold' : 'text-muted/40'}`}>
                            {active ? '✓' : '+'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Service & Timeline */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-bone text-xl font-semibold mb-6 border-b border-white/10 pb-4">
                  Step 3: Preferred Package &amp; Timeline
                </h2>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-3">
                    Select Preferred Package <span className="text-signal-gold">*</span>
                  </label>
                  <div className="space-y-3">
                    {servicesList.map((s) => {
                      const active = form.packageSlug === s.slug
                      return (
                        <div
                          key={s.slug}
                          onClick={() => {
                            set('packageSlug', s.slug)
                            set('service', s.label)
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            active
                              ? 'bg-obsidian border-2 border-signal-gold shadow-lg'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-bone">{s.label}</span>
                            <span className="font-mono text-[0.55rem] uppercase tracking-widest text-signal-gold bg-signal-gold/10 border border-signal-gold/30 px-2 py-0.5 rounded">
                              {s.tag}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-muted leading-relaxed">{s.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                    Additional Context or Target Companies (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about specific companies you are targeting, salary expectations, or any custom details..."
                    value={form.context}
                    onChange={(e) => set('context', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-3 text-xs text-bone focus:outline-none focus:border-signal-gold"
                  />
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={back}
                  className="px-6 py-3 border border-white/20 text-bone rounded font-mono text-xs uppercase tracking-widest hover:bg-white/[0.04] transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="px-7 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full shadow-md hover:brightness-110 transition-all whitespace-nowrap"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full shadow-md hover:brightness-110 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Registering...' : 'Submit Request →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
