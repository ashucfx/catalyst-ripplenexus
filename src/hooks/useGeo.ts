'use client'

import { useEffect, useState } from 'react'
import type { GeoResponse } from '@/lib/geo'

export function useGeo(): GeoResponse | null {
  const [geo, setGeo] = useState<GeoResponse | null>(null)

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(setGeo)
      .catch(() => setGeo({ country: 'US', isIndia: false, currency: 'USD', paymentMethod: 'paypal' }))
  }, [])

  return geo
}
