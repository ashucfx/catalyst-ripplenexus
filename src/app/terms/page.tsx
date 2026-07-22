import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Catalyst by Ripple Nexus',
  description: 'Terms governing the use of Catalyst services, executive consultations, and the www.catalyst.theripplenexus.com website.',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="mb-16 max-w-3xl">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-signal-gold block mb-4">
              Legal Framework &amp; Client Agreement
            </span>
            <h1
              className="display-page mb-4 text-bone"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Terms of <em className="not-italic text-gold-gradient">Service.</em>
            </h1>
            <p className="font-mono text-muted text-xs tracking-widest uppercase mb-8">
              LAST REVISED: APRIL 2026 · CATALYST BY RIPPLE NEXUS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Quick Navigation Sidebar */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-obsidian border border-white/10 sticky top-32 hidden lg:block">
              <span className="font-mono text-xs font-bold text-signal-gold uppercase tracking-widest block mb-4">
                Table of Contents
              </span>
              <nav className="space-y-2.5 font-sans text-xs text-muted">
                {[
                  '1. Acceptance of Terms',
                  '2. Scope of Services',
                  '3. Free Diagnostic Tools',
                  '4. Intellectual Property',
                  '5. Outcomes & Guarantees Disclaimer',
                  '6. Executive Platform & Waitlist',
                  '7. Limitation of Liability',
                  '8. Strict Confidentiality',
                  '9. Amendments & Contact',
                ].map((item) => (
                  <div key={item} className="hover:text-bone transition-colors py-1 border-b border-white/[0.05] last:border-0">
                    {item}
                  </div>
                ))}
              </nav>
            </div>

            {/* Terms Content Body */}
            <div className="lg:col-span-8 space-y-8">
              {[
                {
                  id: '1',
                  title: '1. Acceptance of Terms',
                  content:
                    'By accessing catalyst.theripplenexus.com or submitting any request or diagnostic form on this website, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must refrain from using the platform.',
                },
                {
                  id: '2',
                  title: '2. Scope of Executive Services',
                  content:
                    'Catalyst provides high-authority career positioning consultancy, including the Career Booster Package, Premium Plus Web Portfolio Suite, Market Value Audit, and Executive Strategy Consultations. Specific deliverables, scope, and SLA timelines are set out in individual statement of work (SOW) agreements issued prior to client onboarding.',
                },
                {
                  id: '3',
                  title: '3. Free Diagnostic Tools (TPI Score)',
                  content:
                    'The Talent Positioning Index (TPI) calculator is provided free of charge as a directional diagnostic tool. TPI scores are computed from self-reported data and are intended to surface positioning gaps — they do not constitute formal employment guarantees or placement promises.',
                },
                {
                  id: '4',
                  title: '4. Intellectual Property & Brand Rights',
                  content:
                    'All proprietary frameworks, website content, diagnostic algorithms, and visual designs are the exclusive intellectual property of Ripple Nexus. Reproduction or commercial exploitation without prior written consent is strictly prohibited.',
                },
                {
                  id: '5',
                  title: '5. Outcomes & Salary Hike Disclaimer',
                  content:
                    'Case study outcomes and average percentage pay hikes (+35% to +50%) displayed on this website represent verified historical candidate benchmarks. Past performance does not guarantee specific individual compensation outcomes, as final offers depend on market forces, negotiation execution, and employer hiring budgets.',
                },
                {
                  id: '6',
                  title: '6. Executive Platform & Portal Development',
                  content:
                    'Joining the Catalyst Platform waitlist or scheduling an early strategy session registers your priority interest. Platform feature availability, tier pricing, and release dates remain subject to modification prior to official launch.',
                },
                {
                  id: '7',
                  title: '7. Limitation of Liability',
                  content:
                    'To the maximum extent permitted by applicable law, Ripple Nexus and its consultants shall not be liable for indirect, incidental, or consequential damages. Total liability for any claim shall not exceed the fees paid by the client for the specific service rendered.',
                },
                {
                  id: '8',
                  title: '8. Strict Executive Confidentiality',
                  content:
                    'All client engagements, resume rewrites, and consultation discussions are conducted under strict executive non-disclosure standards. We never disclose client identities, career histories, or corporate affiliations to third parties without express written authorization.',
                },
              ].map((section) => (
                <div
                  key={section.id}
                  className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-lg"
                >
                  <h2 className="display-card text-xl sm:text-2xl text-bone mb-4">{section.title}</h2>
                  <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">{section.content}</p>
                </div>
              ))}

              {/* Contact Card */}
              <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-signal-gold/10 via-obsidian to-signal-gold/10 border border-signal-gold/30">
                <h2 className="display-card text-2xl text-bone mb-3">Legal &amp; Compliance Enquiries</h2>
                <p className="font-serif text-muted text-sm leading-relaxed mb-6">
                  For formal legal correspondence, contract inquiries, or corporate compliance questions, contact our executive legal team.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href="mailto:catalyst@theripplenexus.com"
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center hover:brightness-110 transition-all whitespace-nowrap"
                  >
                    Contact Legal Counsel →
                  </a>
                  <Link
                    href="/"
                    className="px-6 py-3 border border-white/20 text-bone font-mono text-xs font-semibold tracking-widest uppercase rounded-full text-center hover:border-signal-gold/50 transition-colors whitespace-nowrap"
                  >
                    ← Return to Home
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
