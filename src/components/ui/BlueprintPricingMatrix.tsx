'use client'

import { useGeo } from '@/hooks/useGeo'
import { INTL_TIER_PRICES, INTL_AUDIT_USD } from '@/lib/constants/international-pricing'
import type { Band, IntlTier } from '@/lib/constants/international-pricing'

/* ── India: INR per-service prices ────────────────────────────────────── */

const INR_TIERS = [
  { label: '0–2 yrs',  resume:  999, linkedin:  499, portfolio:  2499 },
  { label: '3–8 yrs',  resume: 1999, linkedin:  999, portfolio:  3999 },
  { label: '9–15 yrs', resume: 3499, linkedin: 1999, portfolio: 12999 },
  { label: '15+ yrs',  resume: 4999, linkedin: 2999, portfolio: 19999 },
]

/* ── Shared computation ────────────────────────────────────────────────── */

function booster(resume: number, linkedin: number) {
  return Math.round((resume + linkedin) * 0.85)
}

function premium(resume: number, linkedin: number, portfolio: number) {
  return Math.round((resume + linkedin + portfolio) * 0.80)
}

/* ── Shared table shell ─────────────────────────────────────────────────── */

interface PriceRow {
  label: string
  resume: number
  linkedin: number
  portfolio: number
}

function PricingTable({
  tiers,
  fmt,
  regionLabel,
}: {
  tiers: PriceRow[]
  fmt: (n: number) => string
  regionLabel?: string
}) {
  return (
    <div className="border border-graphite/40">
      {regionLabel && (
        <div className="py-3 px-8 border-b border-graphite/30 flex items-center gap-3" style={{ background: 'rgba(10,11,13,0.8)' }}>
          <span className="font-mono text-signal-gold/60 text-[0.5rem] tracking-[0.25em] uppercase">{regionLabel}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-graphite/40 bg-obsidian">
              <th className="text-left font-mono text-muted text-[0.55rem] tracking-widest py-5 px-8 w-48">SERVICE</th>
              {tiers.map(t => (
                <th key={t.label} className="text-right font-mono text-muted text-[0.55rem] tracking-widest py-5 px-6">{t.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Resume */}
            <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
              <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Resume Rewrite</td>
              {tiers.map(t => (
                <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmt(t.resume)}</td>
              ))}
            </tr>

            {/* LinkedIn */}
            <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
              <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">LinkedIn Optimisation</td>
              {tiers.map(t => (
                <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmt(t.linkedin)}</td>
              ))}
            </tr>

            {/* Cover Letter — always complimentary */}
            <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
              <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Cover Letter</td>
              {tiers.map(t => (
                <td key={t.label} className="text-right py-5 px-6">
                  <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest">Complimentary</span>
                </td>
              ))}
            </tr>

            {/* Portfolio */}
            <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
              <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Portfolio Website</td>
              {tiers.map(t => (
                <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmt(t.portfolio)}</td>
              ))}
            </tr>

            {/* Bundle separator */}
            <tr>
              <td colSpan={5} className="py-3 px-8" style={{ background: 'rgba(184,147,91,0.04)', borderTop: '1px solid rgba(184,147,91,0.12)', borderBottom: '1px solid rgba(184,147,91,0.12)' }}>
                <span className="font-mono text-signal-gold/50 text-[0.5rem] tracking-[0.3em] uppercase">Bundle Pricing · Cover letter complimentary with every package</span>
              </td>
            </tr>

            {/* Career Booster */}
            <tr className="border-b border-graphite/20" style={{ background: 'rgba(255,255,255,0.01)' }}>
              <td className="py-6 px-8">
                <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider mb-1">Career Booster Package</p>
                <p className="font-sans text-muted text-[0.65rem] leading-snug">Resume + LinkedIn + Banner &amp; DP + Cover Letter</p>
                <p className="font-mono text-signal-gold/40 text-[0.5rem] tracking-wider mt-1">15% off</p>
              </td>
              {tiers.map(t => (
                <td key={t.label} className="text-right py-6 px-6">
                  <p className="font-serif text-signal-gold text-base">{fmt(booster(t.resume, t.linkedin))}</p>
                </td>
              ))}
            </tr>

            {/* Premium Plus */}
            <tr style={{ background: 'rgba(184,147,91,0.03)' }}>
              <td className="py-6 px-8">
                <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider mb-1">Premium Plus</p>
                <p className="font-sans text-muted text-[0.65rem] leading-snug">All 4 services · Cover Letter included</p>
                <p className="font-mono text-signal-gold/40 text-[0.5rem] tracking-wider mt-1">20% off</p>
              </td>
              {tiers.map(t => (
                <td key={t.label} className="text-right py-6 px-6">
                  <p className="font-serif text-signal-gold text-base">{fmt(premium(t.resume, t.linkedin, t.portfolio))}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Audit price row (standalone, fixed per band) ──────────────────────── */

function AuditNote({ label }: { label: string }) {
  return (
    <div className="mt-3 flex items-baseline gap-3 py-4 px-8 border border-graphite/30" style={{ background: 'rgba(10,11,13,0.7)' }}>
      <span className="font-mono text-muted text-[0.55rem] tracking-widest uppercase">Market Value Audit</span>
      <span className="font-mono text-signal-gold text-[0.55rem] tracking-widest">— Fixed fee</span>
      <span className="font-serif text-signal-gold text-base ml-auto">{label}</span>
    </div>
  )
}

/* ── Band label ────────────────────────────────────────────────────────── */

const BAND_REGION: Record<Band, string> = {
  A: 'US · UK · EU · AU · CA · SG — All prices USD',
  B: 'UAE · Gulf · Japan · Korea · HK — All prices USD',
  C: 'Latin America · SE Asia · South Africa · Eastern Europe — All prices USD',
  D: 'South Asia · Africa · Developing markets — All prices USD',
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

  if (geo.isIndia) {
    return (
      <>
        <PricingTable
          tiers={INR_TIERS}
          fmt={n => `₹${n.toLocaleString('en-IN')}`}
          regionLabel="India · All prices INR"
        />
        <AuditNote label="₹2,999 — fixed fee" />
      </>
    )
  }

  const band   = geo.band as Band
  const tiers  = INTL_TIER_PRICES[band] as IntlTier[]
  const audit  = INTL_AUDIT_USD[band]

  return (
    <>
      <PricingTable
        tiers={tiers}
        fmt={n => `$${n.toLocaleString('en-US')}`}
        regionLabel={BAND_REGION[band]}
      />
      <AuditNote label={`$${audit} — fixed fee`} />
    </>
  )
}
