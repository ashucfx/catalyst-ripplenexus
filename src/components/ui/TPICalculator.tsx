'use client'

import { useState } from 'react'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { Button } from '@/components/ui/Button'
import { GeoPrice } from '@/components/ui/GeoPrice'

// ─── Types ─────────────────────────────────────────────────────────────

type Answers = {
  seniority: string
  geography: string
  salaryBand: string
  lastRaise: string
  sector: string
}

const empty: Answers = {
  seniority: '',
  geography: '',
  salaryBand: '',
  lastRaise: '',
  sector: '',
}

// ─── Score Engine ──────────────────────────────────────────────────────

function computeTPI(a: Answers): { score: number; gaps: string[]; message: string } {
  let score = 52

  const seniorityMap: Record<string, number> = {
    'Manager (4–8 yrs)': -6,
    'Senior Manager (8–12 yrs)': -9,
    'Director (12–16 yrs)': -7,
    'VP / Head of (15+ yrs)': -4,
    'C-Suite / MD': -2,
  }
  score += seniorityMap[a.seniority] ?? 0

  const geoMap: Record<string, number> = {
    'India — Tier 1': -5,
    'India — Tier 2/3': -9,
    'UAE / GCC': +3,
    'UK': +1,
    'US': +2,
    'Singapore': +2,
  }
  score += geoMap[a.geography] ?? 0

  const salaryMap: Record<string, number> = {
    'Below ₹15L / $18K': -10,
    '₹15L–30L / $18K–36K': -8,
    '₹30L–60L / $36K–72K': -5,
    '₹60L–1Cr / $72K–120K': -3,
    '₹1Cr+ / $120K+': 0,
  }
  score += salaryMap[a.salaryBand] ?? 0

  const raiseMap: Record<string, number> = {
    'Within 12 months': +2,
    '1–2 years ago': -3,
    '2–3 years ago': -7,
    '3+ years ago': -12,
  }
  score += raiseMap[a.lastRaise] ?? 0

  const sectorMap: Record<string, number> = {
    'Technology / SaaS': +3,
    'Private Equity / VC': +4,
    'Financial Services': +1,
    'Consulting': +2,
    'Manufacturing / Industrial': -3,
    'Government / Public Sector': -5,
    'Other': -1,
  }
  score += sectorMap[a.sector] ?? 0

  score = Math.max(34, Math.min(76, score))

  const gaps: string[] = []
  if (score < 45) gaps.push('Salary significantly below market rate for your seniority')
  if (score < 55) gaps.push('Positioning signals not matching your experience level')
  if (a.lastRaise === '2–3 years ago' || a.lastRaise === '3+ years ago')
    gaps.push('Salary anchoring from a stale negotiation')
  if (a.geography === 'India — Tier 2/3' || a.geography === 'India — Tier 1')
    gaps.push('GCC / international market opportunity not yet captured')
  if (a.seniority === 'Senior Manager (8–12 yrs)' || a.seniority === 'Director (12–16 yrs)')
    gaps.push('Mid-career plateau — most common and most correctable')

  const message =
    score >= 70
      ? 'Your positioning is above average. There is still a meaningful gap the full Audit will quantify.'
      : score >= 55
      ? 'You are positioned below your potential. The gap is correctable and we can show you exactly how.'
      : 'Significant positioning gap identified. Every year this continues compounds your loss.'

  return { score, gaps, message }
}

const steps = [
  {
    id: 'seniority',
    question: 'Current Professional Seniority',
    sub: 'Select the level that best reflects your institutional authority.',
    options: ['Manager (4–8 yrs)', 'Senior Manager (8–12 yrs)', 'Director (12–16 yrs)', 'VP / Head of (15+ yrs)', 'C-Suite / MD'],
  },
  {
    id: 'geography',
    question: 'Primary Economic Market',
    sub: 'The market where you are currently being priced.',
    options: ['India — Tier 1', 'India — Tier 2/3', 'UAE / GCC', 'UK', 'US', 'Singapore'],
  },
  {
    id: 'salaryBand',
    question: 'Current Compensation (Annual CTC)',
    sub: 'Base + Bonus + Fixed Allowances.',
    options: ['Below ₹15L / $18K', '₹15L–30L / $18K–36K', '₹30L–60L / $36K–72K', '₹60L–1Cr / $72K–120K', '₹1Cr+ / $120K+'],
  },
  {
    id: 'lastRaise',
    question: 'Recency of Last Signal Event',
    sub: 'Meaningful salary increase (>5% real term).',
    options: ['Within 12 months', '1–2 years ago', '2–3 years ago', '3+ years ago'],
  },
  {
    id: 'sector',
    question: 'Industrial Domain',
    sub: 'Primary sector of your current employer.',
    options: ['Technology / SaaS', 'Private Equity / VC', 'Financial Services', 'Consulting', 'Manufacturing / Industrial', 'Other'],
  },
]

export function TPICalculator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(empty)
  const [emailStep, setEmailStep] = useState(false)
  const [email,     setEmail]     = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ReturnType<typeof computeTPI> | null>(null)

  const totalSteps = steps.length
  const step = steps[currentStep]

  function selectOption(option: string) {
    const newAnswers = { ...answers, [step.id]: option }
    setAnswers(newAnswers)
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setEmailStep(true)
    }
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setEmailError('')
    setLoading(true)
    const r = computeTPI(answers)
    const annualCost = r.score < 50 ? '$30,000–$50,000' : r.score < 62 ? '$15,000–$30,000' : '$5,000–$15,000'

    try {
      await fetch('/api/tpi', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email,
          score:      r.score,
          gaps:       r.gaps,
          message:    r.message,
          annualCost,
          answers,
          honeypot:   '',
        }),
      })
    } catch {
      // The calculator result should not be blocked by email or CRM delivery failures.
    } finally {
      setLoading(false)
      setResult(r)
    }
  }

  if (result) {
    const annualCost = result.score < 50 ? '$30,000–$50,000' : result.score < 62 ? '$15,000–$30,000' : '$5,000–$15,000'
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-dossier mx-auto">
        <div className="lg:col-span-2 glass p-10 border border-graphite/40">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-12 pb-12 border-b border-graphite/40">
            <TPIMeter score={result.score} size={180} />
            <div>
              <p className="label-inst mb-4">Talent Positioning Index</p>
              <h2 className="display-card text-3xl leading-tight mb-4">
                {result.score < 45 ? 'Significant Signaling Gap' : result.score < 62 ? 'Moderate Underpositioning' : 'High Performance Signal'}
              </h2>
              <p className="font-serif text-muted text-lg leading-relaxed">{result.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="label-inst mb-6">Critical Gaps Detected</p>
              <ul className="space-y-4">
                {result.gaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-4">
                    <span className="text-signal-gold text-[10px] mt-1 shrink-0">◈</span>
                    <span className="font-sans text-muted text-sm leading-relaxed">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-signal-gold/5 p-6 border-l-2 border-signal-gold">
              <p className="label-inst mb-4">The Economic Loss</p>
              <p className="display-card text-2xl mb-2">{annualCost}</p>
              <p className="font-sans text-muted text-xs leading-relaxed uppercase tracking-widest">Compounding Annual Cost of Inaction</p>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-graphite/40 flex flex-col sm:flex-row gap-6">
            <Button href="/request" variant="primary" className="flex-1 justify-center">
              Book Full Audit — <GeoPrice product="audit" variant="cta" />
            </Button>
            <Button href="/blueprint" variant="ghost" className="flex-1 justify-center">
              View Blueprint
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 border border-graphite/40">
            <p className="label-inst mb-6">Index Scale</p>
            <div className="space-y-4">
              {[
                { range: '75–100', l: 'Optimal', c: 'text-signal-gold' },
                { range: '60–74', l: 'Underperforming', c: 'text-bone' },
                { range: '45–59', l: 'Critical Gap', c: 'text-muted' },
                { range: '0–44', l: 'Institutional Risk', c: 'text-muted' },
              ].map((r) => (
                <div key={r.range} className={`flex justify-between items-center pb-3 border-b border-graphite/20 ${r.c}`}>
                  <span className="font-mono text-[0.65rem] tracking-widest">{r.range}</span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest">{r.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 border border-graphite/40">
            <p className="label-inst mb-4">Next Step</p>
            <p className="font-serif text-muted text-sm leading-relaxed italic">
              This score is directional. A 45-minute Audit surfaces the surgical moves
              needed to reclaim your market value.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (emailStep) {
    return (
      <div className="max-w-xl mx-auto glass p-12 border border-graphite/40">
        <p className="label-inst mb-8">Computation Complete</p>
        <h2 className="display-card text-3xl mb-4">Where should we send your Intelligence Brief?</h2>
        <p className="font-serif text-muted text-lg leading-relaxed mb-10">Your TPI score is calculated. We need a professional destination to deliver the full gap analysis.</p>
        <form onSubmit={submitEmail} className="flex flex-col gap-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your professional email"
            className="bg-transparent border border-graphite/60 px-6 py-5 font-sans text-bone text-base focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40"
          />
          {emailError && <p className="font-sans text-signal-gold text-xs">{emailError}</p>}
          <Button type="submit" variant="primary" className="justify-center py-6" disabled={loading}>
            {loading ? 'CALCULATING...' : 'SHOW MY TPI SCORE →'}
          </Button>
          <p className="font-mono text-muted text-[0.5rem] tracking-[0.3em] uppercase opacity-40">Privacy Secured · No Marketing Spam</p>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-16">
        <p className="label-inst mb-6">Diagnostic Stage {currentStep + 1} / {totalSteps}</p>
        <div className="h-[1px] bg-graphite/40">
          <div className="h-full bg-signal-gold transition-all duration-700" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
        </div>
      </div>

      <h2 className="display-card text-3xl mb-2 leading-tight">{step.question}</h2>
      <p className="font-serif text-muted text-lg mb-12">{step.sub}</p>

      <div className="grid grid-cols-1 gap-3 mb-12">
        {step.options.map((option) => (
          <button
            key={option}
            onClick={() => selectOption(option)}
            className="text-left px-8 py-5 border border-graphite/40 bg-graphite/5 font-serif text-bone text-lg hover:border-signal-gold/50 hover:bg-signal-gold/5 transition-all duration-300 group flex items-center justify-between"
          >
            {option}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-signal-gold">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
