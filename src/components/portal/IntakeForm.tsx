'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SENIORITY_OPTIONS = [
  'Associate / Analyst',
  'Manager',
  'Senior Manager',
  'Director',
  'Senior Director',
  'VP / Head of',
  'SVP / C-Suite',
]

const CURRENCY_OPTIONS = [
  { label: 'INR (₹)', value: 'INR' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'SGD (S$)', value: 'SGD' },
  { label: 'AED (د.إ)', value: 'AED' },
]

interface Props {
  token: string
}

interface FormState {
  name:             string
  title:            string
  seniority:        string
  yearsExperience:  string
  compensation:     string
  currency:         string
  sector:           string
  geography:        string
  targetRole:       string
  biggestChallenge: string
  linkedinUrl:      string
  achievements:     string
}

const EMPTY: FormState = {
  name:             '',
  title:            '',
  seniority:        '',
  yearsExperience:  '',
  compensation:     '',
  currency:         'INR',
  sector:           '',
  geography:        '',
  targetRole:       '',
  biggestChallenge: '',
  linkedinUrl:      '',
  achievements:     '',
}

export function IntakeForm({ token }: Props) {
  const router          = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const required: (keyof FormState)[] = [
      'name', 'title', 'seniority', 'yearsExperience',
      'compensation', 'currency', 'sector', 'geography',
      'targetRole', 'biggestChallenge', 'achievements',
    ]
    for (const f of required) {
      if (!form[f].trim()) {
        setError(`Please fill in: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/audit/intake', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full bg-transparent border border-graphite px-5 py-3 font-sans text-bone text-sm
    focus:outline-none focus:border-signal-gold/60 placeholder:text-muted/40`
  const selectCls = `w-full bg-obsidian border border-graphite px-5 py-3 font-sans text-bone text-sm
    focus:outline-none focus:border-signal-gold/60`
  const labelCls  = 'font-mono text-muted text-[0.6rem] tracking-widest block mb-2'

  return (
    <div>
      <p className="label-inst mb-6">Professional Intake</p>
      <h2 className="display-card text-3xl mb-4 leading-tight">
        Tell us about your market position.
      </h2>
      <p className="font-serif text-muted text-base leading-relaxed mb-12">
        This takes 5 minutes. Your TPI report is generated immediately after submission.
      </p>

      {loading ? (
        <div className="border border-graphite/40 p-16 text-center">
          <p className="label-inst mb-6 animate-pulse text-signal-gold">Generating your report…</p>
          <p className="font-serif text-muted text-lg leading-relaxed max-w-sm mx-auto">
            The Catalyst positioning engine is analysing your data against live market benchmarks.
            This takes 30–90 seconds.
          </p>
          <div className="mt-10 flex justify-center gap-2">
            {[0,1,2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-signal-gold animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>

          {/* ── Personal & Role ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>FULL NAME</label>
              <input type="text" value={form.name} onChange={set('name')}
                placeholder="Priya Mehta" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>CURRENT TITLE</label>
              <input type="text" value={form.title} onChange={set('title')}
                placeholder="Director, Product Management" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>SENIORITY LEVEL</label>
              <select value={form.seniority} onChange={set('seniority')} className={selectCls}>
                <option value="">Select level…</option>
                {SENIORITY_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>TOTAL YEARS OF EXPERIENCE</label>
              <input type="text" value={form.yearsExperience} onChange={set('yearsExperience')}
                placeholder="12 years" className={inputCls} />
            </div>
          </div>

          {/* ── Compensation ── */}
          <div className="border-t border-graphite/40 pt-8">
            <p className="label-inst mb-6">Compensation</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelCls}>ANNUAL COMPENSATION (GROSS)</label>
                <input type="text" value={form.compensation} onChange={set('compensation')}
                  placeholder="₹28,00,000 or $85,000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CURRENCY</label>
                <select value={form.currency} onChange={set('currency')} className={selectCls}>
                  {CURRENCY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Market ── */}
          <div className="border-t border-graphite/40 pt-8">
            <p className="label-inst mb-6">Market Context</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>INDUSTRY / SECTOR</label>
                <input type="text" value={form.sector} onChange={set('sector')}
                  placeholder="FinTech, B2B SaaS, Consulting…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>GEOGRAPHIC MARKET</label>
                <input type="text" value={form.geography} onChange={set('geography')}
                  placeholder="Mumbai, Singapore, London…" className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Goals ── */}
          <div className="border-t border-graphite/40 pt-8">
            <p className="label-inst mb-6">Positioning Goals</p>
            <div className="flex flex-col gap-6">
              <div>
                <label className={labelCls}>TARGET ROLE (NEXT 12–18 MONTHS)</label>
                <input type="text" value={form.targetRole} onChange={set('targetRole')}
                  placeholder="VP of Product, Head of Strategy…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>BIGGEST CAREER CHALLENGE RIGHT NOW</label>
                <textarea value={form.biggestChallenge} onChange={set('biggestChallenge')}
                  placeholder="Describe the single biggest obstacle to your next move…"
                  rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>
          </div>

          {/* ── Evidence ── */}
          <div className="border-t border-graphite/40 pt-8">
            <p className="label-inst mb-6">Evidence of Impact</p>
            <div className="flex flex-col gap-6">
              <div>
                <label className={labelCls}>KEY ACHIEVEMENTS (2–4 RESULTS WITH NUMBERS)</label>
                <textarea value={form.achievements} onChange={set('achievements')}
                  placeholder="Led $12M product launch, grew ARR 140% YoY, reduced churn by 28%…"
                  rows={4} className={`${inputCls} resize-none`} />
                <p className="font-mono text-muted text-[0.55rem] tracking-widest mt-2">
                  The more specific, the more accurate your benchmark.
                </p>
              </div>
              <div>
                <label className={labelCls}>LINKEDIN URL (OPTIONAL)</label>
                <input type="url" value={form.linkedinUrl} onChange={set('linkedinUrl')}
                  placeholder="https://linkedin.com/in/yourprofile" className={inputCls} />
              </div>
            </div>
          </div>

          {error && (
            <p className="font-sans text-signal-gold text-sm border border-signal-gold/30 p-4">
              {error}
            </p>
          )}

          <div className="border-t border-graphite/40 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-signal-gold text-obsidian px-10 py-4 font-sans text-[0.7rem]
                         tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                         cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Generate My TPI Report →
            </button>
            <p className="font-mono text-muted text-[0.55rem] tracking-widest mt-4">
              Your data is encrypted and never shared. Report generated in 30–90 seconds.
            </p>
          </div>

        </form>
      )}
    </div>
  )
}
