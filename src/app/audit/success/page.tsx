import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Payment Confirmed — Catalyst Audit',
  robots: { index: false, follow: false },
}

export default function AuditSuccessPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#050507',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>

        {/* Logo */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '18px', color: '#F4F1EB', letterSpacing: '-0.02em' }}>
            CATALYST
          </p>
          <p style={{ margin: '4px 0 0 0', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#B8935B', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            A RIPPLE NEXUS INSTITUTION
          </p>
        </div>

        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#B8935B',
            flexShrink: 0,
          }} />
          <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#B8935B', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Payment Confirmed
          </p>
        </div>

        {/* Headline */}
        <p style={{ margin: '0 0 12px 0', fontFamily: 'Georgia, serif', fontSize: '38px', color: '#F4F1EB', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Your portal is<br />
          <em style={{ color: '#B8935B' }}>on its way.</em>
        </p>

        <p style={{ margin: '0 0 48px 0', fontFamily: 'Georgia, serif', fontSize: '16px', color: '#8B8681', lineHeight: 1.7 }}>
          We&rsquo;ve dispatched your private portal link. Open it, complete the 5-minute intake,
          and your Talent Positioning Index report is generated instantly — no scheduling, no waiting.
        </p>

        {/* Email instruction box */}
        <div style={{
          border: '1px solid rgba(184,147,91,0.25)',
          background: 'rgba(184,147,91,0.04)',
          padding: '24px 28px',
          marginBottom: '40px',
        }}>
          <p style={{ margin: '0 0 10px 0', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#B8935B', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Check your inbox now
          </p>
          <p style={{ margin: '0 0 14px 0', fontFamily: 'Georgia, serif', fontSize: '15px', color: '#F4F1EB', lineHeight: 1.5 }}>
            Subject line:{' '}
            <em style={{ color: '#B8935B' }}>Your Catalyst Audit Portal — Complete Your Intake</em>
          </p>
          <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8B8681', lineHeight: 1.6 }}>
            The email typically arrives within 30 seconds. If you don&rsquo;t see it in 5 minutes,
            check your spam folder or promotions tab.
          </p>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ margin: '0 0 20px 0', fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#8B8681', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            What happens next
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { n: '01', text: 'Open the private portal link from your email.' },
              { n: '02', text: 'Complete the 5-minute professional intake — role, compensation, goals.' },
              { n: '03', text: 'Your TPI score, salary benchmark, ATS analysis, and 90-day roadmap are generated in under 90 seconds.' },
              { n: '04', text: 'Download your full intelligence report as a branded PDF.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#B8935B', letterSpacing: '0.2em', flexShrink: 0, paddingTop: '3px' }}>
                  {s.n}
                </span>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '14px', color: '#8B8681', lineHeight: 1.65 }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/" style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '10px',
            color: '#8B8681',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            ← Return home
          </Link>
          <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#8B8681', letterSpacing: '0.1em' }}>
            Questions?{' '}
            <a href="mailto:catalyst@theripplenexus.com" style={{ color: '#B8935B', textDecoration: 'none' }}>
              catalyst@theripplenexus.com
            </a>
          </p>
        </div>

      </div>
    </main>
  )
}
