'use client'

// Cost of Inaction diagram — Tufte-style chart in Signal Gold and Bone.
// Visualises the compounding career cost of delayed repositioning.

export function CostDiagram() {
  return (
    <figure className="w-full my-16" aria-label="Cost of Inaction over time">
      <svg viewBox="0 0 820 310" xmlns="http://www.w3.org/2000/svg" className="w-full">
        {/* Axes */}
        <line x1="80" y1="30" x2="80" y2="250" stroke="#1F2226" strokeWidth="1" />
        <line x1="80" y1="250" x2="790" y2="250" stroke="#1F2226" strokeWidth="1" />

        {/* Horizontal grid reference */}
        <line
          x1="80" y1="150" x2="790" y2="150"
          stroke="#1F2226" strokeWidth="0.5" strokeDasharray="4,10"
        />

        {/* Stagnation curve — flat/declining, muted */}
        <path
          d="M 80,148 C 220,148 320,153 440,162 C 560,171 660,182 790,196"
          stroke="#8B8681" strokeWidth="1.5" fill="none" strokeDasharray="5,5"
        />

        {/* Repositioned trajectory — Signal Gold upward */}
        <path
          d="M 440,162 C 520,138 600,105 680,74 C 730,54 765,42 790,37"
          stroke="#B8935B" strokeWidth="2" fill="none"
        />

        {/* Gap fill */}
        <path
          d="M 440,162 C 520,138 600,105 680,74 C 730,54 765,42 790,37
             L 790,196 C 660,182 560,171 440,162"
          fill="#B8935B" fillOpacity="0.04"
        />

        {/* Intervention vertical */}
        <line
          x1="440" y1="50" x2="440" y2="250"
          stroke="#B8935B" strokeWidth="0.5" strokeOpacity="0.35"
        />
        <circle cx="440" cy="162" r="4" fill="#B8935B" />

        {/* Gap bracket */}
        <line x1="776" y1="37" x2="776" y2="196" stroke="#B8935B" strokeWidth="0.5" />
        <line x1="770" y1="37" x2="782" y2="37" stroke="#B8935B" strokeWidth="0.5" />
        <line x1="770" y1="196" x2="782" y2="196" stroke="#B8935B" strokeWidth="0.5" />

        {/* Labels */}
        <text x="84" y="270" fill="#8B8681" fontFamily="monospace" fontSize="9" letterSpacing="0.12em">TIME →</text>

        <text
          x="440" y="44"
          fill="#B8935B" fontFamily="monospace" fontSize="8.5"
          letterSpacing="0.08em" textAnchor="middle"
        >
          POINT OF INTERVENTION
        </text>

        <text x="648" y="60" fill="#B8935B" fontFamily="monospace" fontSize="8.5" letterSpacing="0.05em">
          REPOSITIONED
        </text>
        <text x="648" y="74" fill="#B8935B" fontFamily="monospace" fontSize="8.5" letterSpacing="0.05em">
          TRAJECTORY
        </text>

        <text x="648" y="200" fill="#8B8681" fontFamily="monospace" fontSize="8.5" letterSpacing="0.05em">
          STAGNATION PATH
        </text>

        <text x="783" y="110" fill="#B8935B" fontFamily="monospace" fontSize="7.5" letterSpacing="0.04em">$10K</text>
        <text x="783" y="122" fill="#B8935B" fontFamily="monospace" fontSize="7.5" letterSpacing="0.04em">–$50K</text>
        <text x="783" y="134" fill="#B8935B" fontFamily="monospace" fontSize="7.5" letterSpacing="0.04em">ANNUAL</text>
        <text x="783" y="146" fill="#B8935B" fontFamily="monospace" fontSize="7.5" letterSpacing="0.04em">COST</text>

        {/* Y axis label */}
        <text
          x="18" y="150"
          fill="#8B8681" fontFamily="monospace" fontSize="9"
          letterSpacing="0.1em" textAnchor="middle"
          transform="rotate(-90,18,150)"
        >
          MARKET VALUE
        </text>
      </svg>
      <figcaption className="label-inst mt-4 text-center">
        The cost of inaction compounds. Every year without repositioning is a year of salary
        ceiling stagnation.
      </figcaption>
    </figure>
  )
}
