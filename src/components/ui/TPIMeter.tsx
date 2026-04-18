'use client'

// Talent Positioning Index meter — circular gauge, Signal Gold arc.
// Used in the platform preview and Tier 1 audit deliverable mockup.

interface TPIMeterProps {
  score?: number
  size?: number
  showLabel?: boolean
}

export function TPIMeter({ score = 67, size = 120, showLabel = true }: TPIMeterProps) {
  const r = 46
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle cx="50" cy="50" r={r} stroke="#1F2226" strokeWidth="4" fill="none" />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={r}
            stroke="#B8935B" strokeWidth="4" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
          />
        </svg>
        {/* Score overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'none' }}
        >
          <span className="font-mono text-signal-gold font-light" style={{ fontSize: size * 0.22 }}>
            {score}
          </span>
          <span className="font-mono text-muted" style={{ fontSize: size * 0.09 }}>
            /100
          </span>
        </div>
      </div>
      {showLabel && (
        <p className="label-inst text-center text-muted">Talent Positioning Index</p>
      )}
    </div>
  )
}
