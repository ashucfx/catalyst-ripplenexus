'use client'

import { PRICING } from '@/lib/constants/pricing'
import { useGeo } from '@/hooks/useGeo'

export type GeoPriceProduct = keyof typeof PRICING

// 'card'     — large serif price
// 'hero'     — audit page hero: big price
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
  const geo = useGeo()
  const isIndia = geo?.isIndia ?? false

  if (variant === 'inaction') {
    const label = geo?.isIndia === true ? '₹40L+' : '$50K+'
    return <span className={className}>{label}</span>
  }

  if (!product) return null

  const pricing = PRICING[product]
  const price = isIndia ? fmtINR(pricing.inr) : fmtUSD(pricing.usd)

  if (variant === 'hero') {
    return (
      <div className={`flex items-baseline gap-4 ${className ?? ''}`}>
        <span className="font-serif text-bone text-5xl">{price}</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={className}>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="display-card text-5xl">{price}</span>
        </div>
      </div>
    )
  }

  // 'cta' | 'inline'
  return <span className={className}>{price}</span>
}
