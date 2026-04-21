import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing the use of Catalyst services and the www.catalyst.theripplenexus.com website.',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">

            <p className="label-inst mb-6">Legal</p>
            <h1 className="font-serif text-bone font-light leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Terms of Service
            </h1>
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-16">
              LAST UPDATED: APRIL 2025
            </p>

            <div className="flex flex-col gap-12">

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">1. Acceptance</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  By accessing www.catalyst.theripplenexus.com or submitting any form on this website, you
                  agree to be bound by these Terms of Service. If you do not agree, do not
                  use this website. These terms are governed by the laws of India.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">2. Services</h2>
                <p className="font-sans text-muted text-sm leading-relaxed mb-3">
                  Catalyst provides professional career positioning consultancy services including
                  the Market Value Audit, Positioning Blueprint, and Sovereign Executive Suite.
                  Specific deliverables, timelines, and terms for each engagement are set out
                  in a separate client agreement issued before any payment is collected.
                </p>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  Submitting the Request form on this website does not constitute a binding
                  contract. An engagement begins only upon execution of a written agreement
                  and receipt of payment.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">3. Free tools</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  The Talent Positioning Index (TPI) calculator is provided free of charge as
                  an indicative assessment tool. TPI scores are computed from self-reported
                  data and are intended to provide directional insight only — they are not
                  a guarantee of employment outcomes, salary increases, or placement rates.
                  Individual results depend on factors outside Catalyst&apos;s control, including
                  market conditions, candidate effort, and employer decisions.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">4. Intellectual property</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  All content on this website — including text, design, frameworks, and brand
                  assets — is the property of Ripple Nexus Institution and may not be
                  reproduced, distributed, or used commercially without written permission.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">5. Outcomes and results</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  Case study outcomes displayed on this website are illustrative examples based
                  on comparable professional profiles. Past results do not guarantee future
                  outcomes. Salary benchmarks, market data, and positioning assessments reflect
                  conditions at the time of engagement and may change. Catalyst does not
                  guarantee specific salary increases, job placements, or response rates.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">6. Platform (SaaS)</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  The Catalyst Intelligence Platform described on the Platform page is in
                  active development and is not currently available for purchase. Joining the
                  waitlist does not constitute a purchase or a binding commitment by either
                  party. Pricing, features, and availability are subject to change.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">7. Limitation of liability</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  To the maximum extent permitted by applicable law, Ripple Nexus Institution
                  is not liable for any indirect, incidental, or consequential damages arising
                  from the use of this website or Catalyst services. Our total liability for
                  any claim is limited to the amount paid for the specific service giving rise
                  to the claim.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">8. Confidentiality</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  Catalyst treats all client information with strict confidence. We do not
                  disclose client names, profiles, or engagement details without explicit
                  written consent. All case studies are anonymised.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-bone text-xl font-light mb-4">9. Changes</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  We reserve the right to update these terms at any time. Continued use of
                  the website after changes constitutes acceptance of the revised terms.
                </p>
              </section>

              <section className="border-t border-graphite pt-8">
                <h2 className="font-serif text-bone text-xl font-light mb-4">Contact</h2>
                <p className="font-sans text-muted text-sm leading-relaxed">
                  For legal enquiries, email{' '}
                  <a href="mailto:catalyst@theripplenexus.com"
                     className="text-signal-gold hover:text-bone transition-colors">
                    catalyst@theripplenexus.com
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
