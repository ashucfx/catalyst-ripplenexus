'use client'

import { PRICING } from '@/lib/constants/pricing'
import { INTL_AUDIT_USD, INTL_TIER_PRICES } from '@/lib/constants/international-pricing'
import { useGeo } from '@/hooks/useGeo'
import type { Band } from '@/lib/constants/international-pricing'

export type GeoPriceProduct = keyof typeof PRICING

export type GeoPriceVariant = 'card' | 'hero' | 'cta' | 'inline' | 'inaction'

interface GeoPriceProps {
  product?: GeoPriceProduct
  variant?: GeoPriceVariant
  className?: string
}

function fmtINR(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`
}

function getIntlPrice(product: GeoPriceProduct, band: Band): string {
  switch (product) {
    case 'audit':
      return `$${INTL_AUDIT_USD[band]}`
    case 'sprint': {
      // Career Booster — show 3-8 yr tier as representative price
      const t = INTL_TIER_PRICES[band][1]
      const cb = Math.round((t.resume + t.linkedin) * 0.85)
      return `from $${cb}`
    }
    case 'blueprint':
    case 'executive': {
      // Premium Plus — show 3-8 yr tier as representative price
      const t = INTL_TIER_PRICES[band][1]
      const pp = Math.round((t.resume + t.linkedin + t.portfolio) * 0.80)
      return `from $${pp}`
    }
  }
}

export function GeoPrice({ product, variant = 'inline', className }: GeoPriceProps) {
  const geo = useGeo()

  if (variant === 'inaction') {
    const label = geo?.isIndia === true ? '₹40L+' : '$50K+'
    return <span className={className}>{label}</span>
  }

  if (!product) return null

  let price: string

  if (geo?.isIndia) {
    price = fmtINR(PRICING[product].inr)
  } else if (geo?.band) {
    price = getIntlPrice(product, geo.band as Band)
  } else {
    // Loading — blank to avoid flash
    price = ''
  }

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

  return <span className={className}>{price}</span>
}
