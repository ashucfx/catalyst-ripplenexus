import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TPIMeter } from '@/components/ui/TPIMeter'
import { AuditCheckout } from '@/components/ui/AuditCheckout'
import { GeoPrice } from '@/components/ui/GeoPrice'
import { Disclaimer } from '@/components/ui/Disclaimer'

export const metadata: Metadata = {
  title: 'Market Value Audit — AI Positioning Intelligence',
  description:
    'Submit your professional profile and receive an AI-generated Talent Positioning Index report in 90 seconds. Salary benchmark, ATS analysis, and a 90-day repositioning roadmap.',
}

export default function AuditPage() {
  return (
    <>
      <Header />
      <main className="grain">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden pt-44 pb-32"
          style={{ background: '#050507' }}
        >
          {/* Background layers */}
          <div className="absolute inset-0 dot-field" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0 beam-tr" />

          {/* Top hairline */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(184,147,91,0.7), transparent)' }}
          />

          <div className="max-w-dossier mx-auto px-6 lg:px-12 relative z-10">

            {/* Status */}
            <div className="live-badge mb-12 inline-flex">
              <span className="pulse-dot" />
              AI-Powered · Report in 90 Seconds
            </div>

            <p className="label-inst mb-6 opacity-70">Tier I Intelligence · Market Value Audit</p>
            <h1
              className="display-page mb-10 max-w-3xl"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 1.02 }}
            >
              Know exactly what
              <br />
              <em className="text-gold-gradient not-italic">you&apos;re worth.</em>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
              <p className="font-serif text-muted leading-relaxed max-w-xl" style={{ fontSize: '1.3rem' }}>
                Information asymmetry about your true market worth is the most expensive
                mistake a senior professional can make. This AI diagnostic eliminates it —
                in 90 seconds.
              </p>
              <div className="lg:text-right">
                <div className="flex items-baseline lg:justify-end gap-4 mb-2">
                  <GeoPrice product="audit" variant="hero" />
                </div>
                <p className="font-mono text-signal-gold text-[0.6rem] tracking-[0.3em] uppercase">
                  Fixed Fee · AI Report Delivered Instantly
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-dossier mx-auto px-6 lg:px-12 py-32">

          {/* ── CORE THESIS ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40 items-start">

            <div>
              <p className="label-inst mb-8">The Thesis</p>
              <h2 className="display-card text-3xl leading-tight mb-8">
                The market is mispricing you because you are sending the wrong signals.
              </h2>
              <div className="prose-catalyst">
                <p>
                  Most senior professionals negotiate from an uninformed baseline, anchored to
                  a salary set years ago. This Audit is a surgical diagnostic that exposes the
                  Gap — the compounding annual loss that accrues while you remain underpositioned.
                </p>
                <p>
                  We don&apos;t look at your skills. We look at your{' '}
                  <strong>Market Power.</strong> We identify the exact levers that will move
                  your Talent Positioning Index from a generic high-performer to a recognised
                  institutional asset.
                </p>
              </div>
            </div>

            {/* Sample output */}
            <div
              className="p-10 border border-white/[0.08]"
              style={{
                background: 'rgba(10,11,13,0.8)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <p className="label-inst mb-10">Sample Audit Output</p>
              <div className="flex flex-col items-center gap-12">
                <TPIMeter score={67} size={160} />
                <div className="w-full space-y-5">
                  {[
                    { label: 'Sector Alignment',  value: 'Finance — Mid-Market PE', score: '61/100' },
                    { label: 'ATS Compatibility', value: '73% — Critical gaps detected', score: 'LOW' },
                    { label: 'Narrative Clarity', value: 'Generalist signals dominant', score: '54/100' },
                    { label: 'Salary Variance',   value: '₹14.2L vs. ₹18.5L market', score: '-23%' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-end border-b border-white/[0.07] pb-3">
                      <div>
                        <p className="font-mono text-muted text-[0.6rem] tracking-widest uppercase mb-1">{row.label}</p>
                        <p className="font-sans text-bone text-xs">{row.value}</p>
                      </div>
                      <span className="font-mono text-signal-gold text-[0.65rem]">{row.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── DELIVERABLES ────────────────────────────────────── */}
          <div className="mb-40">
            <p className="label-inst mb-12">What You Receive</p>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-px"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                {
                  title: 'AI Positioning Report',
                  desc: 'Instant AI-generated analysis of your market position across 5 dimensions. Delivered in 90 seconds — no scheduling, no waiting.',
                },
                {
                  title: 'Proprietary TPI Score',
                  desc: 'A data-backed index across Narrative, Signal, Sector, ATS, and Compensation. Benchmarked against your seniority and geography.',
                },
                {
                  title: 'ATS Gap Analysis',
                  desc: 'Your profile run through Workday, Greenhouse, and Lever simulations. We show you exactly what the algorithms see.',
                },
                {
                  title: 'Live Market Benchmark',
                  desc: 'Compensation intelligence from live global data. Your current package vs. real-time market demand for your profile.',
                },
                {
                  title: '90-Day Roadmap',
                  desc: 'The three highest-leverage positioning moves you can make in the next 90 days. Specific. Measurable. Strategic.',
                },
                {
                  title: 'Branded PDF Report',
                  desc: 'Download your full intelligence report as a premium PDF. Share it, reference it, act on it.',
                },
              ].map((d) => (
                <div key={d.title} className="card-glow p-10 flex flex-col gap-5">
                  <h3 className="display-card text-xl">{d.title}</h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── HOW IT WORKS ─────────────────────────────────────── */}
          <div className="mb-40">
            <p className="label-inst mb-12">How It Works</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {[
                { n: '01', title: 'Pay',      desc: 'Fixed fee. No subscriptions, no upsells. $99 USD or ₹2,999 INR.' },
                { n: '02', title: 'Portal',   desc: 'Receive a private portal link in your inbox immediately after payment.' },
                { n: '03', title: 'Intake',   desc: 'Complete a 5-minute professional intake — your role, compensation, and goals.' },
                { n: '04', title: 'Report',   desc: 'Your AI-generated TPI report is ready in 90 seconds. Download the PDF.' },
              ].map((s) => (
                <div key={s.n} className="p-10" style={{ background: 'var(--obsidian-light)' }}>
                  <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-6">{s.n}</p>
                  <h4 className="display-card text-2xl mb-4">{s.title}</h4>
                  <p className="font-sans text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CHECKOUT ────────────────────────────────────────── */}
          <section id="book" className="border-t border-white/[0.07] pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              <div>
                <p className="label-inst mb-8">Get Your Report</p>
                <h2 className="display-card text-4xl leading-tight mb-8">
                  Begin your Audit.{' '}
                  <br />
                  <em className="text-signal-gold not-italic">Report in 90 seconds.</em>
                </h2>
                <div className="prose-catalyst mb-8">
                  <p>
                    Pay once, receive your private portal link immediately. Complete a
                    5-minute intake and the AI generates your full positioning intelligence
                    report instantly — no human scheduling required.
                  </p>
                  <p className="text-sm italic">
                    Anchored against a $5,000–$10,000 immediate salary gain.
                    At <GeoPrice product="audit" variant="cta" />, this is a 50×–100× return on investment.
                  </p>
                </div>
                <Disclaimer variant="compact" className="mb-12" />
              </div>

              <div
                className="relative p-12 border border-white/[0.08]"
                style={{
                  background: 'rgba(10,11,13,0.8)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 20px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="absolute -top-px left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(184,147,91,0.8), transparent)' }}
                />
                <div className="absolute -top-4 -right-4 bg-signal-gold text-obsidian px-4 py-1 font-mono text-[0.6rem] tracking-widest font-bold uppercase shadow-xl flex items-center gap-1">
                  Fixed Fee: <GeoPrice product="audit" variant="cta" />
                </div>
                <AuditCheckout />
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
