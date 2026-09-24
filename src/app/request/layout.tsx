import type { Metadata } from 'next'

const BASE = 'https://www.catalyst.theripplenexus.com'

export const metadata: Metadata = {
  title: 'Request a Strategy Consultation — Catalyst by Ripple Nexus',
  description:
    'Submit a confidential consultation request. Our senior positioning analysts will evaluate your profile, career goals, and target market to recommend the right Catalyst package for your executive trajectory.',
  alternates: { canonical: `${BASE}/request` },
  openGraph: {
    title: 'Request a Strategy Consultation — Catalyst by Ripple Nexus',
    description: 'Submit a confidential consultation request. Senior positioning analysts evaluate your profile and recommend the right package.',
    url: `${BASE}/request`,
    type: 'website',
    siteName: 'Catalyst by Ripple Nexus',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Catalyst Consultation Request' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Strategy Consultation — Catalyst',
    description: 'Confidential executive career consultation with senior Catalyst positioning analysts.',
    images: ['/og-image.png'],
  },
}

export default function RequestLayout({ children }: { children: React.ReactNode }) {
  return children
}
