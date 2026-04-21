'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

const steps = [
  { id: 1, label: 'Profile' },
  { id: 2, label: 'Objective' },
  { id: 3, label: 'Service' },
]

const seniorities = [
  'Manager (4–8 years)',
  'Senior Manager / Lead (8–12 years)',
  'Director (10–15 years)',
  'VP / Head of (12–18 years)',
  'C-Suite / MD / Partner',
]

const geographies = [
  'India — Tier 1 (Mumbai, Delhi, Bangalore, Hyderabad)',
  'India — Other cities',
  'UAE / GCC',
  'United Kingdom',
  'United States',
  'Singapore / SEA',
  'Other',
]

const goals = [
  'Understand my true market value',
  'Break through a career plateau',
  'Transition to a new sector or geography',
  'Secure a board or advisory seat',
  'Negotiate a higher compensation package',
  'Position for a C-suite role within 12–24 months',
  'Reposition after redundancy or a career gap',
]

const timelines = [
  'Immediate — actively searching now',
  'Within 3 months',
  'Within 6 months',
  '12 months or more — strategic planning',
]

const services = [
  { label: 'Market Value Audit', price: '$499 / ₹15,000', desc: 'Start here — 45-min diagnostic, TPI score, salary benchmark.' },
  { label: 'Positioning Blueprint', price: '$1,500–$3,500', desc: 'Complete identity re-architecture. CV, LinkedIn, narrative strategy.' },
  { label: 'Sovereign Executive Suite', price: '$5,000–$15,000+', desc: 'White-glove C-suite and board positioning.' },
  { label: 'Catalyst Pro Platform', price: '$199/month', desc: 'Self-serve SaaS — joining the waitlist.' },
  { label: 'Not sure yet', price: '', desc: 'We will recommend the right tier after reviewing your profile.' },
]

type FormData = {
  name:      string
  email:     string
  role:      string
  seniority: string
  geography: string
  goals:     string[]
  timeline:  string
  context:   string
  service:   string
  referral:  string
}

const empty: FormData = {
  name: '', email: '', role: '', seniority: '', geography: '',
  goals: [], timeline: '', context: '', service: '', referral: '',
}

export default function RequestPage() {
  const [step,      setStep]      = useState(1)
  const [form,      setForm]      = useState<FormData>(empty)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

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
      if (!form.name.trim())     { setError('Please enter your name.'); return false }
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('Please enter a valid email address.'); return false
      }
      if (!form.role.trim())     { setError('Please enter your current role.'); return false }
      if (!form.seniority)       { setError('Please select your seniority level.'); return false }
      if (!form.geography)       { setError('Please select your primary market.'); return false }
    }
    if (step === 2) {
      if (form.goals.length === 0) { setError('Please select at least one goal.'); return false }
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
    if (!form.service) { setError('Please select a service.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, honeypot: '' }),
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
        <main className="pt-32 pb-16 min-h-screen">
          <div className="max-w-dossier mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              <p className="label-inst mb-6">Enquiry Received</p>
              <hr className="rule mb-10 w-16" style={{ borderColor: '#B8935B' }} />
              <h1 className="font-serif text-bone font-light leading-tight mb-8"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}>
                Your enquiry is<br />
                <em className="text-signal-gold not-italic">in trusted hands.</em>
              </h1>
              <div className="border border-signal-gold/30 bg-graphite/10 p-8 mb-10">
                <p className="font-serif text-muted text-lg leading-relaxed mb-3">
                  A Catalyst Executive Architect will review your profile within{' '}
                  <span className="text-bone">24 business hours</span> and reach out to schedule
                  your first conversation.
                </p>
                <p className="font-serif text-muted text-sm leading-relaxed">
                  Check your inbox — a confirmation email is on its way to {form.email}.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite mb-10">
                {[
                  { n: '01', label: 'Profile Review', desc: 'Your submission is benchmarked against current market data before the call.' },
                  { n: '02', label: 'First Conversation', desc: '45 minutes. Diagnostic. You leave with a TPI score and a clear next step.' },
                  { n: '03', label: 'Pathway Brief', desc: 'A written recommendation on which service fits your situation.' },
                ].map((item) => (
                  <div key={item.n} className="bg-obsidian p-6">
                    <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-2">{item.n}</p>
                    <h3 className="font-serif text-bone text-base font-light mb-2">{item.label}</h3>
                    <p className="font-sans text-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="border border-signal-gold/20 bg-graphite/10 p-6 mb-8">
                <p className="label-inst mb-3">Skip the wait — book directly</p>
                <p className="font-sans text-muted text-sm mb-4">
                  If you prefer to schedule immediately, choose a session type and pick a
                  time that works for your timezone.
                </p>
                <Link
                  href="/book"
                  className="inline-block font-sans text-signal-gold text-[0.7rem] tracking-[0.15em]
                             uppercase hover:text-bone transition-colors border-b border-signal-gold/40
                             hover:border-bone pb-0.5"
                >
                  Schedule directly →
                </Link>
              </div>
              <Button href="/" variant="ghost">← Return home</Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="pt-32 pb-16 min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          <div className="mb-12">
            <p className="label-inst mb-6">Confidential Enquiry</p>
            <hr className="rule mb-10 w-16" style={{ borderColor: '#B8935B' }} />
            <h1 className="font-serif text-bone font-light leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}>
              Begin the conversation.
            </h1>
            <p className="font-serif text-muted text-lg leading-relaxed max-w-xl">
              Your answers are reviewed by a Catalyst architect before your first call —
              not processed by an algorithm.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">

              {/* Step indicator */}
              <div className="flex items-center gap-0 mb-10">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div className={`flex items-center gap-2 ${step >= s.id ? 'opacity-100' : 'opacity-30'}`}>
                      <span className={`font-mono text-[0.6rem] tracking-widest w-6 h-6 flex items-center justify-center border ${
                        step === s.id ? 'border-signal-gold text-signal-gold'
                        : step > s.id ? 'border-signal-gold bg-signal-gold text-obsidian'
                        : 'border-graphite text-muted'
                      }`}>
                        {step > s.id ? '✓' : s.id}
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-widest text-muted uppercase">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-8 h-px mx-3 ${step > s.id ? 'bg-signal-gold/50' : 'bg-graphite'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* ── STEP 1: Profile ───────────────────────────────────── */}
              {step === 1 && (
                <form
                  onSubmit={(e) => { e.preventDefault(); next() }}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    aria-hidden="true" style={{ position:'absolute', opacity:0, pointerEvents:'none', height:0 }} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="font-mono text-muted text-[0.6rem] tracking-widest block mb-2">FULL NAME</label>
                      <input id="name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                        placeholder="As it appears professionally" autoComplete="name" required
                        className="w-full bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40" />
                    </div>
                    <div>
                      <label htmlFor="email" className="font-mono text-muted text-[0.6rem] tracking-widest block mb-2">EMAIL ADDRESS</label>
                      <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                        placeholder="Your professional email" autoComplete="email" required
                        className="w-full bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="font-mono text-muted text-[0.6rem] tracking-widest block mb-2">CURRENT ROLE / TITLE</label>
                    <input id="role" type="text" value={form.role} onChange={(e) => set('role', e.target.value)}
                      placeholder="e.g. Head of Finance, VP Marketing, Director of Operations"
                      autoComplete="organization-title"
                      className="w-full bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40" />
                  </div>

                  <div>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">SENIORITY LEVEL</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {seniorities.map((s) => (
                        <button key={s} type="button" onClick={() => set('seniority', s)}
                          className={`text-left px-4 py-3 border font-sans text-sm transition-colors ${
                            form.seniority === s ? 'border-signal-gold text-bone bg-signal-gold/5' : 'border-graphite text-muted hover:border-bone/40 hover:text-bone/70'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">PRIMARY MARKET</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {geographies.map((g) => (
                        <button key={g} type="button" onClick={() => set('geography', g)}
                          className={`text-left px-4 py-3 border font-sans text-sm transition-colors ${
                            form.geography === g ? 'border-signal-gold text-bone bg-signal-gold/5' : 'border-graphite text-muted hover:border-bone/40 hover:text-bone/70'
                          }`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <p className="font-sans text-signal-gold text-sm">{error}</p>}
                  <div className="pt-4 border-t border-graphite">
                    <button type="submit"
                      className="inline-flex items-center gap-3 font-sans text-obsidian bg-signal-gold px-8 py-4 text-[0.7rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer">
                      Continue →
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 2: Objective ─────────────────────────────────── */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-3">WHAT ARE YOU TRYING TO ACHIEVE?</p>
                    <p className="font-sans text-muted text-xs mb-4">Select all that apply.</p>
                    <div className="flex flex-col gap-2">
                      {goals.map((g) => (
                        <button key={g} type="button" onClick={() => toggleGoal(g)}
                          className={`text-left px-4 py-3 border font-sans text-sm transition-colors flex items-start gap-3 ${
                            form.goals.includes(g) ? 'border-signal-gold text-bone bg-signal-gold/5' : 'border-graphite text-muted hover:border-bone/40 hover:text-bone/70'
                          }`}>
                          <span className={`shrink-0 w-4 h-4 border mt-0.5 flex items-center justify-center text-[0.6rem] ${
                            form.goals.includes(g) ? 'border-signal-gold text-signal-gold bg-signal-gold/10' : 'border-graphite'
                          }`}>
                            {form.goals.includes(g) ? '✓' : ''}
                          </span>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">TIMELINE</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {timelines.map((t) => (
                        <button key={t} type="button" onClick={() => set('timeline', t)}
                          className={`text-left px-4 py-3 border font-sans text-sm transition-colors ${
                            form.timeline === t ? 'border-signal-gold text-bone bg-signal-gold/5' : 'border-graphite text-muted hover:border-bone/40 hover:text-bone/70'
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="context" className="font-mono text-muted text-[0.6rem] tracking-widest block mb-2">
                      BIGGEST CAREER BOTTLENECK RIGHT NOW <span className="text-muted/50">(optional — but helps us prepare)</span>
                    </label>
                    <textarea id="context" value={form.context} onChange={(e) => set('context', e.target.value)}
                      rows={4} placeholder="Be direct. This is read by a human, not an algorithm."
                      className="w-full bg-transparent border border-graphite px-4 py-3 font-serif text-bone text-sm leading-relaxed focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40 resize-none" />
                  </div>

                  {error && <p className="font-sans text-signal-gold text-sm">{error}</p>}
                  <div className="flex items-center justify-between pt-4 border-t border-graphite">
                    <button type="button" onClick={back}
                      className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors">
                      ← BACK
                    </button>
                    <button type="button" onClick={next}
                      className="inline-flex items-center gap-3 font-sans text-obsidian bg-signal-gold px-8 py-4 text-[0.7rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer">
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Service ───────────────────────────────────── */}
              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <p className="font-serif text-muted text-base leading-relaxed max-w-lg">
                    Select the service you are enquiring about. If you are unsure, choose the last option —
                    we will recommend the right path after reviewing your profile.
                  </p>

                  <div className="flex flex-col gap-2">
                    {services.map((s) => (
                      <button key={s.label} type="button" onClick={() => set('service', s.label)}
                        className={`text-left px-5 py-4 border transition-colors flex items-start gap-4 ${
                          form.service === s.label ? 'border-signal-gold bg-signal-gold/5' : 'border-graphite hover:border-bone/40'
                        }`}>
                        <span className={`shrink-0 w-3 h-3 border rounded-full mt-1.5 ${
                          form.service === s.label ? 'border-signal-gold bg-signal-gold' : 'border-graphite'
                        }`} />
                        <div>
                          <p className={`font-sans text-sm ${form.service === s.label ? 'text-bone' : 'text-muted'}`}>
                            {s.label}
                            {s.price && <span className="font-mono text-signal-gold text-[0.6rem] tracking-wide ml-3">{s.price}</span>}
                          </p>
                          <p className="font-sans text-muted text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="referral" className="font-mono text-muted text-[0.6rem] tracking-widest block mb-2">
                      HOW DID YOU FIND CATALYST? <span className="text-muted/50">(optional)</span>
                    </label>
                    <input id="referral" type="text" value={form.referral} onChange={(e) => set('referral', e.target.value)}
                      placeholder="LinkedIn, colleague referral, Google, article..."
                      className="w-full bg-transparent border border-graphite px-4 py-3 font-sans text-bone text-sm focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40" />
                  </div>

                  <div className="border border-graphite/40 bg-graphite/10 p-5">
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">DISCRETION ASSURANCE</p>
                    <p className="font-sans text-muted text-xs leading-relaxed">
                      Your enquiry is reviewed only by the Catalyst architect assigned to your case.
                      No information is shared with third parties or used for marketing purposes.
                      See our <a href="/privacy" className="text-signal-gold hover:text-bone underline underline-offset-2">Privacy Policy</a>.
                    </p>
                  </div>

                  {error && <p className="font-sans text-signal-gold text-sm">{error}</p>}
                  <div className="flex items-center justify-between pt-4 border-t border-graphite">
                    <button type="button" onClick={back}
                      className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors">
                      ← BACK
                    </button>
                    <button type="button" onClick={submit} disabled={loading}
                      className="inline-flex items-center gap-3 font-sans text-obsidian bg-signal-gold px-8 py-4 text-[0.7rem] tracking-[0.2em] uppercase hover:bg-bone transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                      {loading ? 'Submitting…' : 'Submit Enquiry →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="border border-graphite p-6">
                <p className="label-inst mb-4">What Happens Next</p>
                <div className="flex flex-col gap-4">
                  {[
                    { n: '01', t: 'Profile Review', d: 'Benchmarked against live market data before the call.' },
                    { n: '02', t: '24-Hour Response', d: 'A Catalyst architect reaches out within one business day.' },
                    { n: '03', t: 'First Conversation', d: '45 minutes. Diagnostic. You receive a TPI score.' },
                    { n: '04', t: 'Pathway Brief', d: 'Written recommendation — no pressure to commit.' },
                  ].map((item) => (
                    <div key={item.n} className="flex gap-3">
                      <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest shrink-0 mt-0.5">{item.n}</span>
                      <div>
                        <p className="font-sans text-bone text-xs font-medium mb-0.5">{item.t}</p>
                        <p className="font-sans text-muted text-xs leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-signal-gold/20 p-6 bg-graphite/5">
                <p className="font-serif text-muted text-sm leading-relaxed italic mb-3">
                  &ldquo;79% of senior professionals are earning 10–35% below their market rate.
                  Not because they lack skill. Because they are underpositioned.&rdquo;
                </p>
                <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest">
                  — CATALYST MARKET INTELLIGENCE, 2026
                </p>
              </div>

              <div className="border border-graphite p-6">
                <p className="label-inst mb-4">Service Reference</p>
                <div className="flex flex-col gap-3">
                  {[
                    { tier: 'Tier I', name: 'Market Value Audit', price: '$499 / ₹15,000', href: '/audit' },
                    { tier: 'Tier II', name: 'Positioning Blueprint', price: '$1,500–$3,500', href: '/blueprint' },
                    { tier: 'Tier III', name: 'Sovereign Executive Suite', price: '$5,000–$15,000+', href: '/executive' },
                  ].map((s) => (
                    <a key={s.tier} href={s.href} className="block border-b border-graphite pb-3 last:border-0 last:pb-0 hover:opacity-80 transition-opacity">
                      <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-0.5">{s.tier}</p>
                      <p className="font-serif text-bone text-sm">{s.name}</p>
                      <p className="font-mono text-signal-gold text-[0.6rem] tracking-wide mt-0.5">{s.price}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
