'use client'

import { useEffect, useState } from 'react'
import { PRICING } from '@/lib/constants/pricing'

export type GeoPriceProduct = keyof typeof PRICING

// 'card'     — large serif price + secondary currency beneath
// 'hero'     — audit page hero: big price + italic secondary
// 'cta'      — inline price string only (for button labels)
// 'inline'   — same as cta, alias
// 'inaction' — "cost of inaction" counter-price ($50K+ / ₹40L+)
export type GeoPriceVariant = 'card' | 'hero' | 'cta' | 'inline' | 'inaction'

interface GeoPriceProps {
  product?: GeoPriceProduct
  variant?: GeoPriceVariant
  className?: string
}

function fmtUSD(cents: number) {
  return `$${Math.round(cents / 100)}`
}

function fmtINR(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`
}

export function GeoPrice({ product, variant = 'inline', className }: GeoPriceProps) {
  const [isIndia, setIsIndia] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(d => setIsIndia(Boolean(d.isIndia)))
      .catch(() => setIsIndia(false))
  }, [])

  // "Cost of Inaction" — no product needed
  if (variant === 'inaction') {
    const label = isIndia === true ? '₹40L+' : '$50K+'
    return <span className={className}>{label}</span>
  }

  if (!product) return null

  const pricing = PRICING[product]
  const usd = fmtUSD(pricing.usd)
  const inr = fmtINR(pricing.inr)

  // While loading show USD — avoids layout shift on non-India traffic (majority)
  const india = isIndia === true
  const primary   = india ? inr : usd
  const secondary = india ? usd : inr

  if (variant === 'hero') {
    return (
      <div className={`flex items-baseline gap-4 ${className ?? ''}`}>
        <span className="font-serif text-bone text-5xl">{primary}</span>
        <span className="font-serif text-muted text-2xl italic">/ {secondary}</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={className}>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="display-card text-5xl">{primary}</span>
          <span className="font-serif text-muted text-xl italic">/ {secondary}</span>
        </div>
      </div>
    )
  }

  // 'cta' | 'inline'
  return <span className={className}>{primary}</span>
}
