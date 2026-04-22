'use client'

import { useState } from 'react'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { Button } from '@/components/ui/Button'

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

  // Seniority — mid-level professionals are most underpriced
  const seniorityMap: Record<string, number> = {
    'Manager (4–8 yrs)': -6,
    'Senior Manager (8–12 yrs)': -9,
    'Director (12–16 yrs)': -7,
    'VP / Head of (15+ yrs)': -4,
    'C-Suite / MD': -2,
  }
  score += seniorityMap[a.seniority] ?? 0

  // Geography — GCC/Western markets have bigger gaps due to tax
  const geoMap: Record<string, number> = {
    'India — Tier 1': -5,
    'India — Tier 2/3': -9,
    'UAE / GCC': +3,
    'UK': +1,
    'US': +2,
    'Singapore': +2,
  }
  score += geoMap[a.geography] ?? 0

  // Salary band vs expected for seniority
  const salaryMap: Record<string, number> = {
    'Below ₹15L / $18K': -10,
    '₹15L–30L / $18K–36K': -8,
    '₹30L–60L / $36K–72K': -5,
    '₹60L–1Cr / $72K–120K': -3,
    '₹1Cr+ / $120K+': 0,
  }
  score += salaryMap[a.salaryBand] ?? 0

  // Last raise — stale anchoring
  const raiseMap: Record<string, number> = {
    'Within 12 months': +2,
    '1–2 years ago': -3,
    '2–3 years ago': -7,
    '3+ years ago': -12,
  }
  score += raiseMap[a.lastRaise] ?? 0

  // Sector — some sectors pay better signal bonuses
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

  // Clamp to 34–76 — leaves room for the full Audit to improve it
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

// ─── Step data ──────────────────────────────────────────────────────────

const steps = [
  {
    id: 'seniority',
    question: 'What is your current level?',
    sub: 'Choose the option that best reflects your role today.',
    options: [
      'Manager (4–8 yrs)',
      'Senior Manager (8–12 yrs)',
      'Director (12–16 yrs)',
      'VP / Head of (15+ yrs)',
      'C-Suite / MD',
    ],
  },
  {
    id: 'geography',
    question: 'Where is your primary market?',
    sub: 'The market you are currently employed in — not where you want to go.',
    options: ['India — Tier 1', 'India — Tier 2/3', 'UAE / GCC', 'UK', 'US', 'Singapore'],
  },
  {
    id: 'salaryBand',
    question: 'What is your current annual salary (CTC)?',
    sub: 'Including base, bonus, and any fixed allowances. Approximate is fine.',
    options: [
      'Below ₹15L / $18K',
      '₹15L–30L / $18K–36K',
      '₹30L–60L / $36K–72K',
      '₹60L–1Cr / $72K–120K',
      '₹1Cr+ / $120K+',
    ],
  },
  {
    id: 'lastRaise',
    question: 'When did you last receive a meaningful salary increase?',
    sub: 'More than 5% above inflation. Not a standard increment.',
    options: [
      'Within 12 months',
      '1–2 years ago',
      '2–3 years ago',
      '3+ years ago',
    ],
  },
  {
    id: 'sector',
    question: 'What sector are you in?',
    sub: 'Your current employer\'s primary industry.',
    options: [
      'Technology / SaaS',
      'Private Equity / VC',
      'Financial Services',
      'Consulting',
      'Manufacturing / Industrial',
      'Government / Public Sector',
      'Other',
    ],
  },
]

// ─── Component ─────────────────────────────────────────────────────────

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

    const r          = computeTPI(answers)
    const annualCost = r.score < 50
      ? '$30,000–$50,000'
      : r.score < 62
      ? '$15,000–$30,000'
      : '$5,000–$15,000'

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
      // Show result regardless of API outcome — don't block the user
    } catch {
      // Non-blocking: still show the result
    } finally {
      setLoading(false)
      setResult(r)
    }
  }

  function goBack() {
    if (emailStep) {
      setEmailStep(false)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Result screen
  if (result) {
    const annualCost = result.score < 50 ? '$30,000–$50,000' : result.score < 62 ? '$15,000–$30,000' : '$5,000–$15,000'
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
            <TPIMeter score={result.score} size={160} />
            <div>
              <p className="label-inst mb-3">Your TPI Score</p>
              <p className="font-serif text-bone font-light leading-tight mb-4"
                 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>
                {result.score < 45
                  ? 'Significant gap. High correction potential.'
                  : result.score < 62
                  ? 'Below your potential. Correctable.'
                  : 'Above average — but the gap is still there.'}
              </p>
              <p className="font-serif text-muted text-lg leading-relaxed mb-2">{result.message}</p>
              <p className="font-mono text-signal-gold text-sm tracking-wide">
                Estimated annual cost of this gap: {annualCost}
              </p>
            </div>
          </div>

          {result.gaps.length > 0 && (
            <div className="border border-graphite p-8 mb-10">
              <p className="label-inst mb-4">Gaps Identified</p>
              <ul className="flex flex-col gap-3">
                {result.gaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-3">
                    <span className="text-signal-gold mt-1 text-xs shrink-0">—</span>
                    <span className="font-sans text-muted text-sm leading-relaxed">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border border-signal-gold/30 bg-graphite/10 p-8 mb-6">
            <p className="label-inst mb-3">What This Score Means</p>
            <p className="font-serif text-muted text-base leading-relaxed mb-4">
              This is a directional score based on five data points. The full Market Value Audit
              uses live compensation benchmarks from Ravio, Taggd, and Lightcast, your actual
              professional history, and a 45-minute diagnostic conversation with a Catalyst
              architect. It is significantly more precise — and produces a specific, actionable
              repositioning map.
            </p>
            <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest">
              THE AUDIT IS ANCHORED AGAINST A $5,000–$10,000 IMMEDIATE SALARY GAIN
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/request" variant="primary">
              Book the Full Audit — $99 →
            </Button>
            <Button href="/blueprint" variant="ghost">
              View the Positioning Blueprint
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-graphite p-6">
            <p className="label-inst mb-4">TPI Score Reference</p>
            <div className="flex flex-col gap-3">
              {[
                { range: '75–100', label: 'Optimally positioned', color: 'text-signal-gold' },
                { range: '60–74', label: 'Below potential — correctable', color: 'text-bone' },
                { range: '45–59', label: 'Underpositioned — moderate gap', color: 'text-muted' },
                { range: '0–44', label: 'Significant gap — high urgency', color: 'text-muted' },
              ].map((r) => (
                <div key={r.range} className={`flex items-center gap-4 pb-3 border-b border-graphite last:border-0 last:pb-0 ${r.color}`}>
                  <span className="font-mono text-[0.6rem] tracking-widest w-14 shrink-0">{r.range}</span>
                  <span className="font-sans text-xs">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-graphite p-6">
            <p className="label-inst mb-3">Your score: {result.score}</p>
            <p className="font-serif text-muted text-sm leading-relaxed">
              Sent to {email}. Check your inbox for a summary and next-step recommendations.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Email capture step
  if (emailStep) {
    return (
      <div className="max-w-xl">
        <div className="mb-8">
          <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-4">
            STEP 5 OF 5 COMPLETE
          </p>
          <div className="h-1 bg-graphite rounded-full">
            <div className="h-full bg-signal-gold rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <h2 className="font-serif text-bone text-2xl font-light mb-4">
          Where should we send your TPI score?
        </h2>
        <p className="font-serif text-muted text-base leading-relaxed mb-8">
          Your score is calculated. Enter your email to see it — along with the specific gaps
          we identified and what each one is costing you annually.
        </p>

        <form onSubmit={submitEmail} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your professional email"
            autoFocus
            className="bg-transparent border border-graphite px-5 py-4 font-sans text-bone text-sm
                       focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40"
          />
          {emailError && (
            <p className="font-sans text-signal-gold text-xs">{emailError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-signal-gold text-obsidian px-8 py-4 font-sans text-[0.7rem]
                       tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                       cursor-pointer text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating…' : 'Show My TPI Score →'}
          </button>
          <p className="font-mono text-muted text-[0.6rem] tracking-widest">
            No spam. Your email is never shared. Unsubscribe anytime.
          </p>
        </form>

        <button
          onClick={goBack}
          className="mt-8 font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
        >
          ← BACK
        </button>
      </div>
    )
  }

  // Question steps
  return (
    <div className="max-w-2xl">
      {/* Progress bar */}
      <div className="mb-10">
        <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-3">
          QUESTION {currentStep + 1} OF {totalSteps}
        </p>
        <div className="h-0.5 bg-graphite">
          <div
            className="h-full bg-signal-gold transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-serif text-bone text-2xl font-light mb-2 leading-snug">
        {step.question}
      </h2>
      <p className="font-sans text-muted text-sm mb-8">{step.sub}</p>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-8">
        {step.options.map((option) => {
          const selected = answers[step.id as keyof Answers] === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => selectOption(option)}
              className={`text-left px-6 py-4 border font-sans text-sm transition-all duration-150
                          flex items-center gap-4 group ${
                selected
                  ? 'border-signal-gold bg-signal-gold/5 text-bone'
                  : 'border-graphite text-muted hover:border-bone/40 hover:text-bone'
              }`}
            >
              <span
                className={`shrink-0 w-3 h-3 border rounded-full transition-colors ${
                  selected ? 'border-signal-gold bg-signal-gold' : 'border-graphite/60'
                }`}
              />
              {option}
            </button>
          )
        })}
      </div>

      {/* Back */}
      {currentStep > 0 && (
        <button
          onClick={goBack}
          className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
        >
          ← BACK
        </button>
      )}
    </div>
  )
}
