'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { useGeo } from '@/hooks/useGeo'

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

// Canonical salary band data — internal key kept for scoring, display is geo-conditional
const salaryBandOptions = [
  { key: 'Below ₹15L / $18K',    inr: 'Below ₹15L', usd: 'Below $18K'  },
  { key: '₹15L–30L / $18K–36K',  inr: '₹15L–30L',   usd: '$18K–36K'   },
  { key: '₹30L–60L / $36K–72K',  inr: '₹30L–60L',   usd: '$36K–72K'   },
  { key: '₹60L–1Cr / $72K–120K', inr: '₹60L–1Cr',   usd: '$72K–120K'  },
  { key: '₹1Cr+ / $120K+',       inr: '₹1Cr+',      usd: '$120K+'     },
]

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
    options: [],  // populated dynamically from salaryBandOptions based on geo
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
  const geo      = useGeo()
  const isIndia  = geo?.isIndia ?? false

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(empty)
  const [emailStep, setEmailStep] = useState(false)
  const [email,     setEmail]     = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ReturnType<typeof computeTPI> | null>(null)

  const totalSteps = steps.length
  const step = steps[currentStep]

  // For salary band step, show only geo-appropriate labels but store canonical key for scoring
  const displayOptions = step.id === 'salaryBand'
    ? salaryBandOptions.map(b => isIndia ? b.inr : b.usd)
    : step.options

  function selectOption(displayLabel: string) {
    let storedValue = displayLabel
    if (step.id === 'salaryBand') {
      const band = salaryBandOptions.find(b => b.inr === displayLabel || b.usd === displayLabel)
      storedValue = band?.key ?? displayLabel
    }
    const newAnswers = { ...answers, [step.id]: storedValue }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8 pb-8 border-b border-white/10">
            <TPIMeter score={result.score} size={160} />
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-signal-gold font-bold block mb-2">
                Talent Positioning Index
              </span>
              <h2 className="display-card text-2xl sm:text-3xl text-bone mb-3">
                {result.score < 45 ? 'Significant Signaling Gap' : result.score < 62 ? 'Moderate Underpositioning' : 'High Performance Signal'}
              </h2>
              <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">{result.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-signal-gold font-bold block mb-4">
                Critical Gaps Detected
              </span>
              <ul className="space-y-3">
                {result.gaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-3">
                    <span className="text-signal-gold text-xs shrink-0 mt-0.5">◈</span>
                    <span className="font-sans text-muted text-xs sm:text-sm leading-relaxed">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-signal-gold/10 p-6 rounded-xl border border-signal-gold/30">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-signal-gold font-bold block mb-2">
                The Economic Loss
              </span>
              <p className="display-card text-2xl text-bone mb-1">{annualCost}</p>
              <p className="font-sans text-muted text-[0.7rem] uppercase tracking-wider">Compounding Annual Cost of Inaction</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/request"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all whitespace-nowrap"
            >
              Book Strategy Call →
            </Link>
            <Link
              href="/blueprint"
              className="flex-1 px-6 py-3.5 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-signal-gold/40 transition-colors whitespace-nowrap"
            >
              View Flagship Packages ↗
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="font-mono text-xs uppercase tracking-widest text-signal-gold font-bold block mb-4">
              Index Scale Reference
            </span>
            <div className="space-y-3">
              {[
                { range: '75–100', l: 'Optimal Signal', c: 'text-signal-gold' },
                { range: '60–74', l: 'Underperforming', c: 'text-bone' },
                { range: '45–59', l: 'Critical Gap', c: 'text-muted' },
                { range: '0–44', l: 'Institutional Risk', c: 'text-muted' },
              ].map((r) => (
                <div key={r.range} className={`flex justify-between items-center pb-2.5 border-b border-white/5 ${r.c}`}>
                  <span className="font-mono text-xs tracking-wider">{r.range}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider">{r.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="font-mono text-xs uppercase tracking-widest text-signal-gold font-bold block mb-2">
              Next Action
            </span>
            <p className="font-serif text-muted text-xs leading-relaxed italic">
              This score is directional. A 45-minute Analyst Audit surfaces the surgical moves needed to reclaim your true market value.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (emailStep) {
    return (
      <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-xl bg-white/[0.02] border border-white/10 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-signal-gold font-bold block mb-2">
          Diagnostic Evaluation Complete
        </span>
        <h2 className="display-card text-2xl text-bone mb-3">Where should we deliver your TPI Analysis?</h2>
        <p className="font-serif text-muted text-sm leading-relaxed mb-6">
          Your calculation is ready. Enter your executive email to view your score and private positioning report.
        </p>
        <form onSubmit={submitEmail} className="flex flex-col gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rachel@company.com"
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-4 py-3.5 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors"
          />
          {emailError && <p className="font-sans text-red-400 text-xs text-left">{emailError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center shadow-md hover:brightness-110 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            {loading ? 'CALCULATING SCORE...' : 'SHOW MY TPI SCORE →'}
          </button>
          <p className="font-mono text-muted text-[0.6rem] tracking-widest uppercase opacity-60">
            🔒 Strictly Confidential · No Marketing Spam
          </p>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-signal-gold uppercase tracking-widest font-bold">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C5A059] transition-all duration-500 rounded-full"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question & Subtitle */}
      <div className="mb-6">
        <h2 className="display-card text-xl sm:text-2xl text-bone mb-2 leading-snug">
          {step.question}
        </h2>
        <p className="font-serif text-muted text-xs sm:text-sm">
          {step.sub}
        </p>
      </div>

      {/* Modern, Compact Grid of Option Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {displayOptions.map((option) => (
          <button
            key={option}
            onClick={() => selectOption(option)}
            className="text-left px-4 py-3.5 border border-white/10 bg-white/[0.03] hover:border-signal-gold/60 hover:bg-signal-gold/10 font-sans text-xs sm:text-sm text-bone rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md"
          >
            <span className="font-medium pr-2">{option}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-signal-gold text-xs shrink-0">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
