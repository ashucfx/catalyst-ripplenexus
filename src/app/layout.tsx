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

const BASE = 'https://www.catalyst.theripplenexus.com'

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
    'best resume writing service India',
    'executive resume writer',
    'ATS optimized resume',
    'LinkedIn profile optimization service',
    'salary benchmarking tool',
    'career coach Dubai UAE',
    'executive coaching Singapore',
    'resume writing service for senior professionals',
    'how to negotiate salary offer',
    'career relocation consultant',
    'India to Singapore career move',
    'India to Dubai career relocation',
    'executive job search strategy',
    'career positioning for directors and VPs',
    'C-suite career advisory',
    'talent positioning index',
    'best career coach for engineers India',
    'executive resume rewrite service',
    'LinkedIn banner design for professionals',
    'cover letter writing service executives',
  ],
  authors: [{ name: 'Ripple Nexus' }],
  openGraph: {
    title: 'Catalyst — Get Paid What You\'re Actually Worth',
    description: '79% of senior professionals earn 10–35% below their market rate. Catalyst fixes that. Average client salary uplift: $47,000.',
    type: 'website',
    siteName: 'Catalyst by Ripple Nexus',
    url: BASE,
    locale: 'en_IN',
    images: [
      {
        url: `${BASE}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Catalyst by Ripple Nexus — Executive Career Positioning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalyst — Get Paid What You\'re Actually Worth',
    description: '79% of senior professionals earn 10–35% below their market rate. Catalyst fixes that.',
    images: [`${BASE}/twitter-image`],
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
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${BASE}/#organization`,
      name: 'Catalyst by Ripple Nexus',
      alternateName: 'Catalyst TPA',
      url: BASE,
      description: 'Executive talent positioning architecture and professional identity engineering for senior professionals, directors, VPs, and C-Suite leaders across India, UAE/GCC, Singapore/ASEAN, United States, United Kingdom, and Europe. Average client salary uplift: $47,000.',
      foundingDate: '2024',
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'Country', name: 'United Arab Emirates' },
        { '@type': 'Country', name: 'Saudi Arabia' },
        { '@type': 'Country', name: 'Singapore' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Australia' },
      ],
      serviceType: ['Career Positioning Consultancy', 'Executive Career Coaching', 'Resume Writing Service', 'LinkedIn Optimization', 'Salary Negotiation Consulting'],
      knowsAbout: ['Talent Positioning Architecture', 'Executive Compensation Benchmarking', 'ATS Optimization', 'LinkedIn Profile Optimization', 'Narrative Discretion', 'Professional Identity Engineering', 'Salary Negotiation Strategy'],
      slogan: 'Get Paid What You\'re Actually Worth',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '48',
        bestRating: '5',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Catalyst Career Positioning Services',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Market Value Audit',
            itemListElement: [{
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Market Value Audit', url: `${BASE}/audit`, description: 'Confidential 48-hour analyst-prepared evaluation including ATS gap profile, TPI diagnostic, compensation benchmarking, and 90-day positioning roadmap.' },
              price: '199',
              priceCurrency: 'USD',
            }],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Career Booster Package',
            itemListElement: [{
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Career Booster Package', url: `${BASE}/blueprint`, description: 'Executive resume rewrite (ATS 98%+), full LinkedIn profile optimization, custom banner & DP direction kit, tailored cover letter, and recruiter outreach DM templates.' },
            }],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Sovereign Executive Suite',
            itemListElement: [{
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Sovereign Executive Suite', url: `${BASE}/executive`, description: 'Confidential C-Suite positioning: identity masking, narrative discretion, digital estate hygiene, and high-stakes equity negotiation coaching.' },
            }],
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Catalyst by Ripple Nexus',
      publisher: { '@id': `${BASE}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE}/intelligence?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE}/#webpage`,
      url: BASE,
      name: 'Catalyst — Get Paid What You\'re Actually Worth',
      isPartOf: { '@id': `${BASE}/#website` },
      about: { '@id': `${BASE}/#organization` },
      description: '79% of senior professionals earn 10–35% below their market rate. Catalyst re-engineers executive positioning to command premium compensation. Average salary uplift: $47,000.',
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Catalyst by Ripple Nexus?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Catalyst is a premier executive career positioning and talent identity engineering consultancy by Ripple Nexus. It helps senior professionals, directors, and C-Suite leaders get paid their fair market value through algorithmic ATS-compliant resume architecture, LinkedIn optimization, compensation benchmarking, and strategic narrative engineering. Average client salary uplift is $47,000.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is Catalyst different from resume writing services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Traditional resume writers focus on formatting and grammar. Catalyst treats positioning as an economic and behavioral engineering problem: analyzing ATS algorithms (achieving 98%+ pass rates on Workday, Greenhouse, Lever, Taleo), building candidate leverage through narrative architecture, aligning identity to market demand curves, and preparing candidates for 75th-to-90th percentile executive compensation negotiations.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Talent Positioning Index (TPI)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The TPI is Catalyst\'s proprietary 100-point diagnostic metric measuring an executive\'s narrative differentiation, market demand alignment, ATS visibility, and compensation leverage. A complimentary TPI diagnostic is available at catalyst.theripplenexus.com/tpi.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which regions does Catalyst serve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Catalyst operates globally with deep localization for India (Bengaluru, Mumbai, Delhi-NCR, Hyderabad), Singapore & ASEAN, UAE & GCC (Dubai, Abu Dhabi, Riyadh), United States, United Kingdom, Europe, and Australia/New Zealand.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the average salary increase with Catalyst?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Catalyst clients achieve an average salary uplift of $47,000 USD (median +42% increase). For senior cross-border moves (e.g. India to Singapore or UAE), uplifts of +55% to +70% are documented across 48+ verified case studies.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get started with Catalyst?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with the free Talent Positioning Index diagnostic at catalyst.theripplenexus.com/tpi, order a confidential Market Value Audit (delivered in 48 hours) at catalyst.theripplenexus.com/audit, or request a strategy consultation at catalyst.theripplenexus.com/request.',
          },
        },
      ],
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
