import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Catalyst by Ripple Nexus — Executive Career Positioning'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0A0B0D',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Inflection mark */}
          <svg width="36" height="46" viewBox="0 0 96 120" fill="none">
            <polygon points="0,120 22,120 96,0 74,0" fill="#F4F1EB" />
            <polygon points="96,0 74,0 50,38 72,38" fill="#B8935B" />
            <circle cx="85" cy="12" r="4" fill="#0A0B0D" />
          </svg>
          <span
            style={{
              color: '#B8935B',
              fontSize: '14px',
              fontFamily: 'Helvetica, sans-serif',
              letterSpacing: '6px',
              textTransform: 'uppercase',
            }}
          >
            A RIPPLE NEXUS INSTITUTION
          </span>
        </div>

        {/* Central text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#F4F1EB',
              fontSize: '64px',
              lineHeight: 1.1,
              letterSpacing: '-2px',
              fontWeight: 400,
              maxWidth: '900px',
            }}
          >
            Get Paid What You&apos;re Actually Worth
          </div>
          <div
            style={{
              color: '#8B8681',
              fontSize: '22px',
              lineHeight: 1.5,
              maxWidth: '800px',
              fontWeight: 400,
            }}
          >
            Executive career positioning &amp; professional identity engineering.
            Average salary uplift: $47,000.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1F2226',
            paddingTop: '20px',
          }}
        >
          <span
            style={{
              color: '#B8935B',
              fontSize: '13px',
              fontFamily: 'Helvetica, sans-serif',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            CATALYST
          </span>
          <span
            style={{
              color: '#8B8681',
              fontSize: '14px',
              fontFamily: 'Helvetica, sans-serif',
            }}
          >
            catalyst.theripplenexus.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
