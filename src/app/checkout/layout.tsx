import type { Metadata } from 'next'

const BASE = 'https://www.catalyst.theripplenexus.com'

export const metadata: Metadata = {
  title: 'Secure Checkout — Catalyst by Ripple Nexus',
  description:
    'Secure self-service checkout for Catalyst career positioning packages. Market Value Audit, Career Booster, Premium Plus Suite, and Sovereign Executive Suite. Multi-currency pricing with Razorpay.',
  alternates: { canonical: `${BASE}/checkout` },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Secure Checkout — Catalyst by Ripple Nexus',
    description: 'Secure checkout for executive career positioning packages.',
    url: `${BASE}/checkout`,
    type: 'website',
    siteName: 'Catalyst by Ripple Nexus',
  },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
