'use client'

import { PRICING } from '@/lib/constants/pricing'
import { INTL_USD } from '@/lib/constants/international-pricing'
import { useGeo } from '@/hooks/useGeo'

export type GeoPriceProduct = keyof typeof PRICING

// 'card'     — large serif price
// 'hero'     — audit page hero: big price
// 'cta'      — inline price string only (for button labels)
// 'inline'   — same as cta, alias
// 'inaction' — "cost of inaction" counter-price
export type GeoPriceVariant = 'card' | 'hero' | 'cta' | 'inline' | 'inaction'

interface GeoPriceProps {
  product?: GeoPriceProduct
  variant?: GeoPriceVariant
  className?: string
}

function fmtUSD(n: number) {
  return `$${n}`
}

function fmtINR(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`
}

// Map PRICING product keys to INTL_USD keys
const PRODUCT_TO_INTL: Record<GeoPriceProduct, keyof typeof INTL_USD['A']> = {
  audit:     'audit',
  sprint:    'careerBooster',
  blueprint: 'premiumPlus',
  executive: 'premiumPlus',
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
    const intlKey = PRODUCT_TO_INTL[product]
    const usd     = INTL_USD[geo.band][intlKey]
    price = fmtUSD(usd)
  } else {
    // Still loading — show nothing to avoid flash
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

  // 'cta' | 'inline'
  return <span className={className}>{price}</span>
}
