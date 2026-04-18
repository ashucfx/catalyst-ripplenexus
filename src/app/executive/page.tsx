import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Sovereign Executive Suite — Tier III',
  description:
    'The premium offer for CEOs, CFOs, Managing Directors, and Board aspirants. Identity masking, narrative discretion, and high-stakes negotiation coaching.',
}

export default function ExecutivePage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <p className="label-inst mb-6">Tier III — Premium Offer</p>
            <hr className="rule mb-10 w-16 border-signal-gold" style={{ borderColor: '#B8935B' }} />
            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.025em' }}>
              The Sovereign<br />Executive Suite
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl mb-4">
              For senior leaders, the resume is merely a compliance document. The real work
              happens in the management of the Digital Estate and the Narrative Discretion.
              The risk is not unemployment — it is Reputational Impairment.
            </p>
            <div className="flex items-baseline gap-4 mt-8">
              <span className="font-serif text-bone text-4xl">$5,000 – $15,000+</span>
              <span className="font-serif text-muted text-xl">/ ₹5,00,000 – ₹15,00,000+</span>
            </div>
            <p className="font-mono text-muted text-xs tracking-widest mt-2">
              RISK PREMIUM PRICING · A FRACTION OF A $500,000+ TOTAL COMPENSATION PACKAGE
            </p>
          </div>

          {/* Psychology */}
          <div className="border border-signal-gold/20 bg-graphite/10 p-10 mb-20">
            <p className="label-inst mb-6">The Behavioral Psychology of the High-Ticket Buyer</p>
            <p className="font-serif text-muted text-lg leading-relaxed max-w-3xl mb-6">
              Senior executives are not moved by Shame Marketing or Urgency Drama. They operate
              from a <span className="text-bone font-medium">Risk Premium mindset</span> — they
              invest because they believe in their own potential to yield a return on that
              investment.
            </p>
            <p className="font-serif text-muted text-lg leading-relaxed max-w-3xl">
              The Sovereign Executive Suite responds to this with Co-creation-based Messaging. We
              do not &ldquo;fix&rdquo; the executive. We{' '}
              <span className="text-signal-gold italic">Recognize</span> them as a powerful leader
              and partner to architect their next decade of dominance. This psychological alignment
              is the ultimate defense against AI — an algorithm cannot offer the Emotional
              Experience of Recognition that a high-level leader craves.
            </p>
          </div>

          {/* Problems at this level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite mb-20">
            {[
              {
                type: 'Real Problems',
                items: [
                  'Navigating Headhunter Politics',
                  'Securing Board of Director seats',
                  'Managing visibility without triggering internal audits',
                  'Protecting the Digital Estate',
                ],
              },
              {
                type: 'Emotional Drivers',
                items: [
                  'Desire to be recognized as a Strategic Pillar',
                  'The subconscious need to be seen as a powerful leader',
                  'Fear of narrative risk and reputational impairment',
                  'The need for a Mis-hire-proof identity',
                ],
              },
              {
                type: 'Buying Trigger',
                items: [
                  '"The Unfair Advantage"',
                  'A Strategic Architect who handles market positioning complexity',
                  'Freedom to focus entirely on leadership legacy',
                  'The Sovereign Network as a permanent, compounding asset',
                ],
              },
            ].map((col) => (
              <div key={col.type} className="bg-obsidian p-8">
                <p className="label-inst mb-4">{col.type}</p>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-signal-gold mt-1 text-xs shrink-0">—</span>
                      <span className="font-serif text-muted text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Deliverables */}
          <div className="mb-20 border-t border-graphite pt-16">
            <p className="label-inst mb-10">The White-Glove Deliverable Set</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite">
              {[
                {
                  n: '01',
                  title: 'White Glove Executive Branding Brief',
                  detail: '90-minute deep discovery session. Neuroscience-informed. Consultants use Nervous System Awareness techniques to uncover the True North and handle the emotional complexity of career transitions at this level.',
                },
                {
                  n: '02',
                  title: 'Board-Ready Governance Portfolio',
                  detail: 'Complete board candidacy architecture. Governance narrative, committee alignment, stakeholder positioning, and the digital presence calibration required for board search mandates.',
                },
                {
                  n: '03',
                  title: 'Identity Masking & Stealth Mode Algorithm Briefing',
                  detail: 'A methodology for managing visibility without triggering competitive intelligence systems, internal succession anxieties, or recruiter-market contamination. The most discreet service in the suite.',
                },
                {
                  n: '04',
                  title: 'Digital Estate Management Protocol',
                  detail: 'Comprehensive audit and management of the executive\'s online presence. What appears. What doesn\'t. How to maintain Narrative Discretion across all digital touchpoints.',
                },
                {
                  n: '05',
                  title: 'High-Stakes Negotiation & Offer Risk Coaching',
                  detail: 'Specific compensation negotiation preparation for total packages above $500,000. Equity positioning, RSU structures, deferred compensation, and board fee negotiation.',
                },
                {
                  n: '06',
                  title: 'Sovereign Network Onboarding',
                  detail: 'Exclusive access to the Catalyst alumni network of repositioned executives. Being "Catalyst Architected" becomes a signal of quality to headhunters and search firms.',
                },
              ].map((d) => (
                <div key={d.n} className="bg-obsidian p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-signal-gold text-xs tracking-widest">{d.n}</span>
                    <hr className="flex-1 rule" />
                  </div>
                  <h3 className="font-serif text-bone text-xl font-light">{d.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation */}
          <div className="mb-20 border-t border-graphite pt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="label-inst mb-4">The Transformation</p>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-muted text-2xl italic">Operational Executive</p>
                  <span className="text-signal-gold text-2xl">→</span>
                  <p className="font-serif text-signal-gold text-2xl">Institutional Asset</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif text-bone text-4xl mb-1">$5,000–$15,000+</p>
                <p className="font-sans text-muted text-sm">vs. $500,000+ total compensation package</p>
                <p className="font-mono text-signal-gold text-xs tracking-widest mt-2">
                  THE SERVICE IS THE INSURANCE POLICY
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-graphite pt-16">
            <p className="font-serif text-muted text-xl italic max-w-2xl mb-4">
              &ldquo;A strategic architect who handles the complexities of market positioning so
              you can focus on your leadership legacy.&rdquo;
            </p>
            <p className="font-sans text-muted text-sm mb-10">
              This suite is available by application. Enquiries are handled with absolute discretion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/request" variant="primary">
                Request a Confidential Consultation →
              </Button>
              <Button href="/audit" variant="ghost">
                Begin with the Audit
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
