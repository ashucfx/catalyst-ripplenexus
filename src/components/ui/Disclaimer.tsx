type DisclaimerProps = {
  // 'full'    — complete paragraph, used in footer
  // 'compact' — condensed block, used near CTAs and pricing
  variant?: 'full' | 'compact'
  className?: string
}

export function Disclaimer({ variant = 'compact', className = '' }: DisclaimerProps) {
  if (variant === 'full') {
    return (
      <div className={`pt-8 ${className}`}>
        {/* Label */}
        <p
          className="font-mono mb-3"
          style={{
            fontSize:      '0.55rem',
            letterSpacing: '0.4em',
            color:         'rgba(184,147,91,0.55)',
            textTransform: 'uppercase',
          }}
        >
          Disclaimer
        </p>
        <p
          className="font-mono leading-loose"
          style={{
            fontSize:      '0.6rem',
            letterSpacing: '0.06em',
            color:         'rgba(170,170,178,0.65)',
            lineHeight:    1.9,
          }}
        >
          Catalyst provides professional repositioning intelligence, positioning strategy, and
          advisory services. <strong style={{ color: 'rgba(244,241,235,0.5)', fontWeight: 500 }}>
          We do not guarantee employment, salary increases, promotions, or specific career outcomes.
          </strong>{' '}
          Results vary significantly based on individual experience, qualifications, interview
          performance, market conditions, geographic location, industry dynamics, employer
          requirements, and many other factors outside our control. Catalyst repositions how
          the market perceives your professional value — actual outcomes depend on you and
          the decisions of third parties, including employers. Case studies and metrics
          reflect individual client results and are not representative of typical outcomes.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <p
        className="font-mono leading-relaxed"
        style={{
          fontSize:      '0.58rem',
          letterSpacing: '0.07em',
          color:         'rgba(138,138,148,0.75)',
          lineHeight:    1.8,
        }}
      >
        <span
          style={{
            color:         'rgba(184,147,91,0.65)',
            letterSpacing: '0.25em',
            fontSize:      '0.52rem',
            textTransform: 'uppercase',
            marginRight:   '0.5em',
          }}
        >
          Note:
        </span>
        Results are not guaranteed. Outcomes depend on your experience, interview performance,
        market conditions, employer decisions, and many factors outside our control.
        Catalyst repositions your professional signal — results are yours to create.
      </p>
    </div>
  )
}
