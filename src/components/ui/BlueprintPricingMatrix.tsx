const TIERS = [
  { label: '0–2 yrs',  resume: 999,   linkedin: 499,  portfolio: 2499  },
  { label: '3–8 yrs',  resume: 1999,  linkedin: 999,  portfolio: 3999  },
  { label: '9–15 yrs', resume: 3499,  linkedin: 1999, portfolio: 12999 },
  { label: '15+ yrs',  resume: 4999,  linkedin: 2999, portfolio: 19999 },
]

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function booster(t: typeof TIERS[0]) {
  return Math.round((t.resume + t.linkedin) * 0.85)
}

function premium(t: typeof TIERS[0]) {
  return Math.round((t.resume + t.linkedin + t.portfolio) * 0.80)
}

export function BlueprintPricingMatrix() {
  return (
    <div className="overflow-x-auto border border-graphite/40">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-graphite/40 bg-obsidian">
            <th className="text-left font-mono text-muted text-[0.55rem] tracking-widest py-5 px-8 w-48">
              SERVICE
            </th>
            {TIERS.map(t => (
              <th key={t.label} className="text-right font-mono text-muted text-[0.55rem] tracking-widest py-5 px-6">
                {t.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>

          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Resume Rewrite</td>
            {TIERS.map(t => (
              <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmt(t.resume)}</td>
            ))}
          </tr>

          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">LinkedIn Optimisation</td>
            {TIERS.map(t => (
              <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmt(t.linkedin)}</td>
            ))}
          </tr>

          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Cover Letter</td>
            {TIERS.map(t => (
              <td key={t.label} className="text-right py-5 px-6">
                <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest">Complimentary</span>
              </td>
            ))}
          </tr>

          <tr className="border-b border-graphite/20 bg-obsidian hover:bg-graphite/10 transition-colors">
            <td className="font-mono text-bone text-[0.58rem] py-5 px-8 uppercase tracking-wider">Portfolio Website</td>
            {TIERS.map(t => (
              <td key={t.label} className="text-right font-serif text-bone text-sm py-5 px-6">{fmt(t.portfolio)}</td>
            ))}
          </tr>

          <tr>
            <td colSpan={5} className="py-3 px-8" style={{ background: 'rgba(184,147,91,0.04)', borderTop: '1px solid rgba(184,147,91,0.15)', borderBottom: '1px solid rgba(184,147,91,0.15)' }}>
              <span className="font-mono text-signal-gold/50 text-[0.5rem] tracking-[0.3em] uppercase">Bundle Pricing · Cover letter complimentary with every package</span>
            </td>
          </tr>

          <tr className="border-b border-graphite/20" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <td className="py-6 px-8">
              <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider mb-1">Career Booster</p>
              <p className="font-sans text-muted text-[0.65rem] leading-snug">Resume + LinkedIn + Cover Letter</p>
              <p className="font-mono text-signal-gold/40 text-[0.5rem] tracking-wider mt-1">15% off</p>
            </td>
            {TIERS.map(t => (
              <td key={t.label} className="text-right py-6 px-6">
                <p className="font-serif text-signal-gold text-base">{fmt(booster(t))}</p>
              </td>
            ))}
          </tr>

          <tr style={{ background: 'rgba(184,147,91,0.03)' }}>
            <td className="py-6 px-8">
              <p className="font-mono text-signal-gold text-[0.58rem] uppercase tracking-wider mb-1">Premium Plus</p>
              <p className="font-sans text-muted text-[0.65rem] leading-snug">All 4 services · Cover Letter included</p>
              <p className="font-mono text-signal-gold/40 text-[0.5rem] tracking-wider mt-1">20% off</p>
            </td>
            {TIERS.map(t => (
              <td key={t.label} className="text-right py-6 px-6">
                <p className="font-serif text-signal-gold text-base">{fmt(premium(t))}</p>
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  )
}
