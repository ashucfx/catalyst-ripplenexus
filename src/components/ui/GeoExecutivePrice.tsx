'use client'

import { useGeo } from '@/hooks/useGeo'

interface Props {
  className?: string
}

export function GeoExecutivePrice({ className }: Props) {
  const geo = useGeo()
  const isIndia = geo?.isIndia ?? false

  const label = isIndia ? '₹5,00,000 – ₹15,00,000+' : '$5,000 – $15,000+'

  return <span className={className}>{label}</span>
}
