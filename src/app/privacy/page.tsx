import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Catalyst collects, uses, and protects your personal information.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">

            <p className="label-inst mb-6">Legal</p>
            <h1 className="font-serif text-bone font-light leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-16">
              LAST UPDATED: APRIL 2025
            </p>

            <div className="flex flex-col gap-12">

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">1. Who we are</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  Catalyst is operated by Ripple Nexus Institution (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
                  This policy explains how we handle personal information submitted through
                  catalystripple.com and related services.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">2. Information we collect</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Contact information', body: 'Name, email address, and professional role — provided when you submit an enquiry or subscribe to the Intelligence Brief.' },
                    { label: 'Self-reported professional data', body: 'Seniority level, geography, salary band, sector, and career context — provided when you use the TPI calculator or the Request form. This information is used solely to produce your assessment and personalise our outreach.' },
                    { label: 'Usage data', body: 'Standard server logs including IP address, browser type, and pages visited — collected automatically for security and performance monitoring. We do not currently operate advertising tracking pixels.' },
                  ].map((item) => (
                    <div key={item.label} className="border-l border-signal-gold/30 pl-4">
                      <p className="font-sans text-bone text-sm font-medium mb-1">{item.label}</p>
                      <p className="font-sans text-muted text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">3. How we use your information</h2>
                <ul className="flex flex-col gap-2">
                  {[
                    'To respond to your enquiry and deliver any requested assessment.',
                    'To send the Intelligence Brief newsletter (only if you subscribed).',
                    'To send your TPI score report to the email address you provided.',
                    'To notify our team of new enquiries so we can follow up.',
                    'To prevent spam and abuse via rate limiting and honeypot techniques.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-signal-gold text-xs mt-1 shrink-0">—</span>
                      <span className="font-sans text-muted text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-muted text-sm leading-relaxed mt-4">
                  We do not sell, rent, or share your personal information with third parties
                  for their marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">4. Third-party services</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { name: 'Resend', purpose: 'Transactional email delivery (enquiry confirmations, TPI score reports, welcome emails). Privacy policy: resend.com/legal/privacy-policy' },
                    { name: 'Kit (ConvertKit)', purpose: 'Newsletter subscriber list management. You may unsubscribe at any time via the link in any email. Privacy policy: kit.com/privacy' },
                    { name: 'Vercel', purpose: 'Website hosting and infrastructure. Privacy policy: vercel.com/legal/privacy-policy' },
                  ].map((svc) => (
                    <div key={svc.name} className="border-l border-graphite pl-4">
                      <p className="font-sans text-bone text-sm font-medium mb-1">{svc.name}</p>
                      <p className="font-sans text-muted text-sm leading-relaxed">{svc.purpose}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">5. Data retention</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  Enquiry data is retained for as long as necessary to conduct and follow up
                  on the business relationship. Newsletter subscriber data is retained until
                  you unsubscribe. You may request deletion of your data at any time by
                  emailing us directly.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">6. Your rights</h2>
                <p className="font-sans text-muted text-sm leading-relaxed mb-3">
                  Depending on your jurisdiction, you may have the right to access, correct,
                  or delete your personal data; to object to or restrict processing; and to
                  data portability. To exercise any of these rights, contact us at the email
                  below. We will respond within 30 days.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">7. Security</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  All data is transmitted over HTTPS. We do not store payment card information.
                  Access to enquiry data is restricted to authorised personnel only.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">8. Changes to this policy</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  We may update this policy from time to time. Material changes will be
                  communicated via the website or by email to active subscribers.
                </p>
              </section>

              <section className="border-t border-graphite pt-8">
                <h2 className="font-serif text-bone text-xl font-light mb-4">Contact</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  For privacy enquiries or data requests, email{' '}
                  <a href="mailto:privacy@catalystripple.com"
                     className="text-signal-gold hover:text-bone transition-colors">
                    privacy@catalystripple.com
                  </a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
