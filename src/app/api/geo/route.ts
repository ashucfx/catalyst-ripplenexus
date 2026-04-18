import { NextResponse } from 'next/server'
import { getGeo } from '@/lib/geo'

export async function GET() {
  const geo = await getGeo()
  return NextResponse.json(geo, {
    headers: {
      // Cache per-user for 1 hour — country doesn't change mid-session
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
