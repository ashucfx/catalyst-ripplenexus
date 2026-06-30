'use client'

import { useGeo } from '@/hooks/useGeo'
import { INTL_USD } from '@/lib/constants/international-pricing'
import type { Band } from '@/lib/constants/international-pricing'

/* ── India: INR tiered pricing (per service + bundle) ─────────────────── */

const INR_TIERS = [
  { label: '0–2 yrs',  resume: 999,   linkedin: 499,  portfolio: 2499  },
  { label: '3–8 yrs',  resume: 1999,  linkedin: 999,  portfolio: 3999  },
  { label: '9–15 yrs', resume: 3499,  linkedin: 1999, portfolio: 12999 },
  { label: '15+ yrs',  resume: 4999,  linkedin: 2999, portfolio: 19999 },
]

function fmtINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function inrBooster(t: typeof INR_TIERS[0]) {
  return Math.round((t.resume + t.linkedin) * 0.85)
}

function inrPremium(t: typeof INR_TIERS[0]) {
  return Math.round((t.resume + t.linkedin + t.portfolio) * 0.80)
}

function IndiaTable() {
  return (
    <div className="overflow-x-auto border border-graphite/40">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-graphite/40 bg-obsidian">
            <th className="text-left font-mono text-muted text-[0.55rem] tracking-widest py-5 px-8 w-48">SERVICE</th>
            {INR_TIERS.map(t => (
              <th key={t.label} className="text-right font-mono text-muted text-[0.55rem] tracking-widest py-5 px-6">{t.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Resume Rewrite</td>
            {INR_TIERS.map(t => (
              <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmtINR(t.resume)}</td>
            ))}
          </tr>
          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">LinkedIn Optimisation</td>
            {INR_TIERS.map(t => (
              <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmtINR(t.linkedin)}</td>
            ))}
          </tr>
          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Cover Letter</td>
            {INR_TIERS.map(t => (
              <td key={t.label} className="text-right py-5 px-6">
                <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest">Complimentary</span>
              </td>
            ))}
          </tr>
          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Portfolio Website</td>
            {INR_TIERS.map(t => (
              <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmtINR(t.portfolio)}</td>
            ))}
          </tr>
          <tr>
            <td colSpan={5} className="py-3 px-8" style={{ background: 'rgba(184,147,91,0.04)', borderTop: '1px solid rgba(184,147,91,0.12)', borderBottom: '1px solid rgba(184,147,91,0.12)' }}>
              <span className="font-mono text-signal-gold/50 text-[0.5rem] tracking-[0.3em] uppercase">Bundle Pricing · Cover letter complimentary with every package</span>
            </td>
          </tr>
          <tr className="border-b border-graphite/20" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <td className="py-6 px-8">
              <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider mb-1">Career Booster</p>
              <p className="font-sans text-muted text-[0.65rem] leading-snug">Resume + LinkedIn + Cover Letter</p>
              <p className="font-mono text-signal-gold/40 text-[0.5rem] tracking-wider mt-1">15% off</p>
            </td>
            {INR_TIERS.map(t => (
              <td key={t.label} className="text-right py-6 px-6">
                <p className="font-serif text-signal-gold text-base">{fmtINR(inrBooster(t))}</p>
              </td>
            ))}
          </tr>
          <tr style={{ background: 'rgba(184,147,91,0.03)' }}>
            <td className="py-6 px-8">
              <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider mb-1">Premium Plus</p>
              <p className="font-sans text-muted text-[0.65rem] leading-snug">All 4 services · Cover Letter included</p>
              <p className="font-mono text-signal-gold/40 text-[0.5rem] tracking-wider mt-1">20% off</p>
            </td>
            {INR_TIERS.map(t => (
              <td key={t.label} className="text-right py-6 px-6">
                <p className="font-serif text-signal-gold text-base">{fmtINR(inrPremium(t))}</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ── International: USD package pricing by band ───────────────────────── */

const PACKAGES: { key: keyof typeof INTL_USD['A']; name: string; desc: string }[] = [
  {
    key:  'audit',
    name: 'Market Value Audit',
    desc: 'Analyst-prepared positioning report · TPI score · Three highest-leverage next moves',
  },
  {
    key:  'careerBooster',
    name: 'Career Booster',
    desc: 'Resume rewrite · LinkedIn full profile · Cover letter (complimentary) · 15% bundle saving',
  },
  {
    key:  'premiumPlus',
    name: 'Premium Plus',
    desc: 'Everything in Career Booster + Personal Portfolio Website · Cover letter (complimentary) · 20% bundle saving',
  },
]

const BAND_LABEL: Record<Band, string> = {
  A: 'US · UK · EU · AU · CA · SG',
  B: 'UAE · Gulf · Japan · Korea · Singapore region',
  C: 'Latin America · SE Asia · South Africa · Eastern Europe',
  D: 'South Asia · Africa · Developing markets',
}

function IntlTable({ band }: { band: Band }) {
  const prices = INTL_USD[band]

  return (
    <div className="border border-graphite/40">
      <div className="py-4 px-8 border-b border-graphite/30 flex items-center gap-3" style={{ background: 'rgba(10,11,13,0.8)' }}>
        <span className="font-mono text-muted/40 text-[0.5rem] tracking-widest uppercase">Region</span>
        <span className="font-mono text-signal-gold/70 text-[0.5rem] tracking-widest uppercase">{BAND_LABEL[band]}</span>
        <span className="font-mono text-muted/30 text-[0.5rem] tracking-widest uppercase ml-4">· Prices in USD</span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-graphite/40 bg-obsidian">
            <th className="text-left font-mono text-muted text-[0.55rem] tracking-widest py-5 px-8 w-52">PACKAGE</th>
            <th className="text-left font-mono text-muted text-[0.55rem] tracking-widest py-5 px-8">INCLUDES</th>
            <th className="text-right font-mono text-muted text-[0.55rem] tracking-widest py-5 px-8 w-28">PRICE</th>
          </tr>
        </thead>
        <tbody>
          {PACKAGES.map((pkg, i) => (
            <tr
              key={pkg.key}
              className="border-b border-graphite/20 hover:bg-graphite/10 transition-colors last:border-0"
              style={{ background: i === 2 ? 'rgba(184,147,91,0.02)' : 'var(--obsidian)' }}
            >
              <td className="py-7 px-8">
                <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider">{pkg.name}</p>
              </td>
              <td className="py-7 px-8">
                <p className="font-sans text-muted text-xs leading-relaxed">{pkg.desc}</p>
              </td>
              <td className="text-right py-7 px-8">
                <p className="font-serif text-signal-gold text-xl">${prices[pkg.key]}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="py-3 px-8 border-t border-graphite/20" style={{ background: 'rgba(10,11,13,0.6)' }}>
        <p className="font-mono text-muted/40 text-[0.48rem] tracking-widest">
          Location-adjusted pricing. Final rate confirmed at checkout based on your billing location.
        </p>
      </div>
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────────────────── */

export function BlueprintPricingMatrix() {
  const geo = useGeo()

  if (!geo) {
    return (
      <div className="border border-graphite/40 p-12 bg-obsidian">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-32 bg-graphite/40 rounded" />
          <div className="h-3 w-56 bg-graphite/20 rounded" />
        </div>
      </div>
    )
  }

  return geo.isIndia ? <IndiaTable /> : <IntlTable band={geo.band} />
}
