import type { Metadata } from 'next'

const BASE = 'https://www.catalyst.theripplenexus.com'

export const metadata: Metadata = {
  title: 'Verified Client Results & Executive Success Stories — Catalyst by Ripple Nexus',
  description:
    '48+ verified executive career transformations. Average $47,000 salary uplift across India, UAE, Singapore, UK, and US. Real placement case studies from senior professionals who repositioned with Catalyst.',
  alternates: { canonical: `${BASE}/testimonials` },
  openGraph: {
    title: 'Verified Client Results — Catalyst by Ripple Nexus',
    description: '48+ verified executive career transformations. Average $47,000 salary uplift across India, UAE, Singapore, US and UK markets.',
    url: `${BASE}/testimonials`,
    type: 'website',
    siteName: 'Catalyst by Ripple Nexus',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Catalyst Client Success Stories' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified Client Results — Catalyst by Ripple Nexus',
    description: '48+ verified executive career transformations. Average $47,000 salary uplift.',
    images: ['/og-image.png'],
  },
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children
}
