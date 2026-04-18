// The Inflection — Catalyst's primary brand mark.
// Two strokes meet at a 74° offset vertex: bone trajectory + Signal Gold intervention.
// Geometry derived from the brand system document.

interface InflectionMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: { w: 24, h: 30 },
  md: { w: 40, h: 50 },
  lg: { w: 64, h: 80 },
  xl: { w: 96, h: 120 },
}

export function InflectionMark({ size = 'md', className = '' }: InflectionMarkProps) {
  const { w, h } = sizes[size]
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 96 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Catalyst — The Inflection"
      role="img"
    >
      {/* Stroke A — Bone trajectory: the career path already in motion */}
      <polygon points="0,120 22,120 96,0 74,0" fill="#F4F1EB" />
      {/* Stroke B — Signal Gold intervention: the Catalyst redirects the trajectory */}
      <polygon points="96,0 74,0 50,38 72,38" fill="#B8935B" />
      {/* Activation vertex dot — the exact moment the reaction begins */}
      <circle cx="85" cy="12" r="2.5" fill="#0A0B0D" />
    </svg>
  )
}
