import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0A0B0D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inflection mark — scaled to fit 32×32 canvas */}
        <svg width="18" height="23" viewBox="0 0 96 120" fill="none">
          <polygon points="0,120 22,120 96,0 74,0" fill="#F4F1EB" />
          <polygon points="96,0 74,0 50,38 72,38" fill="#B8935B" />
          <circle cx="85" cy="12" r="4" fill="#0A0B0D" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
