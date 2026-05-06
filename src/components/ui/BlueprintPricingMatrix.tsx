'use client'

import { useGeo } from '@/hooks/useGeo'

export function BlueprintPricingMatrix() {
  const geo = useGeo()
  const isIndia = geo?.isIndia ?? false

  if (isIndia) {
    return (
      <div className="border border-graphite/40">
        <div className="bg-obsidian p-10">
          <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest uppercase mb-8">India · Domestic Market</p>
          <div className="space-y-6">
            {[
              { l: 'Mid-Level (6–10y)', p: '₹9,999' },
              { l: 'Senior (11–20y)',   p: '₹14,999' },
            ].map((row) => (
              <div key={row.l} className="flex justify-between items-center border-b border-graphite/40 pb-4">
                <span className="font-serif text-bone">{row.l}</span>
                <span className="font-mono text-signal-gold text-sm">{row.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-graphite/40">
      <div className="bg-obsidian p-10">
        <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest uppercase mb-8">Global · US / UK / UAE</p>
        <div className="space-y-6">
          {[
            { l: 'Manager → Director',  p: '$349' },
            { l: 'Director → VP / Board', p: '$499' },
          ].map((row) => (
            <div key={row.l} className="flex justify-between items-center border-b border-graphite/40 pb-4">
              <span className="font-serif text-bone">{row.l}</span>
              <span className="font-mono text-signal-gold text-sm">{row.p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
