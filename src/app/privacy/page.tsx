import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Catalyst by Ripple Nexus',
  description: 'How Catalyst collects, uses, and protects your executive data, resume information, and privacy.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* ── HEADER ──────────────────────────────────────────────── */}
          <div className="mb-16 max-w-3xl">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-signal-gold block mb-4">
              Executive Data Protection &amp; Discretion
            </span>
            <h1
              className="display-page mb-4 text-bone"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Privacy <em className="not-italic text-gold-gradient">Policy.</em>
            </h1>
            <p className="font-mono text-muted text-xs tracking-widest uppercase mb-8">
              LAST REVISED: APRIL 2026 · CATALYST BY RIPPLE NEXUS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Quick Navigation Sidebar */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-obsidian border border-white/10 sticky top-32 hidden lg:block">
              <span className="font-mono text-xs font-bold text-signal-gold uppercase tracking-widest block mb-4">
                Data Protection Summary
              </span>
              <nav className="space-y-2.5 font-sans text-xs text-muted">
                {[
                  '1. Data Controller Entity',
                  '2. Information We Collect',
                  '3. Purposes of Processing',
                  '4. Sub-Processors & Infrastructure',
                  '5. Data Retention SLA',
                  '6. Your Executive Privacy Rights',
                  '7. Security Controls',
                  '8. Data Protection Officer',
                ].map((item) => (
                  <div key={item} className="hover:text-bone transition-colors py-1 border-b border-white/[0.05] last:border-0">
                    {item}
                  </div>
                ))}
              </nav>
            </div>

            {/* Privacy Policy Body */}
            <div className="lg:col-span-8 space-y-8">
              <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-lg">
                <h2 className="display-card text-xl sm:text-2xl text-bone mb-4">1. Data Controller Entity</h2>
                <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">
                  Catalyst is operated by Ripple Nexus (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). This Privacy Policy governs how we handle executive profile submissions, consultation forms, and candidate data submitted through catalyst.theripplenexus.com and ClientForge CRM.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-lg">
                <h2 className="display-card text-xl sm:text-2xl text-bone mb-6">2. Information We Collect</h2>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Executive Contact Details',
                      body: 'Full name, email address, phone number, and professional role provided during consultation intake or calculator submissions.',
                    },
                    {
                      label: 'Professional Profile & Compensation Data',
                      body: 'Seniority tier, target geographies, current salary band, sector experience, and career goals. Used strictly to compute your TPI diagnostic score and personalize your strategy session.',
                    },
                    {
                      label: 'Technical Security Logs',
                      body: 'Standard server access logs (IP address, user agent) collected solely for rate limiting, DDoS mitigation, and system health monitoring.',
                    },
                  ].map((item) => (
                    <div key={item.label} className="border-l-2 border-signal-gold/60 pl-4 py-1">
                      <p className="font-mono text-bone text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="font-sans text-muted text-xs sm:text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-lg">
                <h2 className="display-card text-xl sm:text-2xl text-bone mb-4">3. Zero Third-Party Monetization</h2>
                <p className="font-serif text-muted text-sm sm:text-base leading-relaxed mb-4">
                  We maintain an absolute zero-monetization policy regarding client data. Your resume, compensation metrics, and personal details are <strong className="text-bone">never sold, rented, or shared with third-party advertisers or recruitment brokers</strong>.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-lg">
                <h2 className="display-card text-xl sm:text-2xl text-bone mb-6">4. Trusted Technical Sub-Processors</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Resend Inc.', purpose: 'Encrypted transactional email delivery (consultation confirmations and score reports).' },
                    { name: 'ClientForge CRM', purpose: 'Secure client intake and calendar scheduling sync endpoint.' },
                    { name: 'Vercel Inc.', purpose: 'Global edge infrastructure hosting and SSL encryption.' },
                  ].map((svc) => (
                    <div key={svc.name} className="border-b border-white/[0.07] pb-3 last:border-0 last:pb-0">
                      <p className="font-mono text-bone text-xs font-bold uppercase tracking-wider mb-1">{svc.name}</p>
                      <p className="font-sans text-muted text-xs leading-relaxed">{svc.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 sm:p-10 rounded-2xl bg-obsidian border border-white/10 shadow-lg">
                <h2 className="display-card text-xl sm:text-2xl text-bone mb-4">5. Your Privacy &amp; Data Erasure Rights</h2>
                <p className="font-serif text-muted text-sm sm:text-base leading-relaxed">
                  Under global privacy standards (GDPR, CCPA, and DPDP Act India), you retain full rights to request access to your submitted data, request corrections, or request immediate permanent deletion of your profile from our systems at any time.
                </p>
              </div>

              {/* Contact Card */}
              <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-signal-gold/10 via-obsidian to-signal-gold/10 border border-signal-gold/30">
                <h2 className="display-card text-2xl text-bone mb-3">Data Protection Officer</h2>
                <p className="font-serif text-muted text-sm leading-relaxed mb-6">
                  To exercise your data privacy rights or request profile deletion, email our Data Protection Officer directly.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href="mailto:catalyst@theripplenexus.com"
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full text-center hover:brightness-110 transition-all whitespace-nowrap"
                  >
                    Email DPO →
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
