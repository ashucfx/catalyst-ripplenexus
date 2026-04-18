import type { Metadata } from 'next'
import { Cormorant, Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

// GT Sectra → Cormorant (editorial serif)
const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Söhne → Inter (precision grotesque)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Berkeley Mono → JetBrains Mono (data layer)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const BASE = 'https://www.catalystripple.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Catalyst — Get Paid What You\'re Actually Worth',
    template: '%s — Catalyst',
  },
  description:
    'Catalyst engineers the career positioning of senior professionals in India, UAE, and US. Not resume writing. A complete re-architecture of how the global talent market values you. Average salary uplift: $47K.',
  keywords: [
    'executive career coach India',
    'salary negotiation consultant',
    'career positioning consultant',
    'LinkedIn optimization for executives',
    'how to get promoted to VP',
    'executive personal branding India',
    'career pivot strategy',
    'GCC career opportunities India professionals',
    'market value audit',
    'talent positioning',
    'career coach for senior professionals',
    'executive branding India',
    'career strategy consultant',
    'how to increase salary India',
    'professional identity engineering',
  ],
  authors: [{ name: 'Ripple Nexus Institution' }],
  openGraph: {
    title: 'Catalyst — Get Paid What You\'re Actually Worth',
    description: '79% of senior professionals earn 10–35% below their market rate. Catalyst fixes that. Average client salary uplift: $47,000.',
    type: 'website',
    siteName: 'Catalyst by Ripple Nexus',
    url: BASE,
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Catalyst — Career Positioning Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalyst — Get Paid What You\'re Actually Worth',
    description: '79% of senior professionals earn 10–35% below their market rate. Catalyst fixes that.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: BASE,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Catalyst by Ripple Nexus',
      url: BASE,
      description: 'Career positioning and professional identity engineering for senior professionals in India, UAE, and US.',
      areaServed: ['India', 'United Arab Emirates', 'United Kingdom', 'United States'],
      serviceType: 'Career Positioning Consultancy',
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Catalyst',
      publisher: { '@id': `${BASE}/#organization` },
    },
    {
      '@type': 'Service',
      '@id': `${BASE}/audit#service`,
      name: 'Market Value Audit',
      provider: { '@id': `${BASE}/#organization` },
      description: 'A 45-minute positioning diagnostic that surfaces your Talent Positioning Index, ATS gap profile, and salary benchmark vs. market.',
      offers: {
        '@type': 'Offer',
        price: '499',
        priceCurrency: 'USD',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
