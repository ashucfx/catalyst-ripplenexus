import { type SVGProps } from 'react'
// simple-icons paths are CC0 licensed (https://simpleicons.org)

type P = SVGProps<SVGSVGElement>

/* ─────────────────────────────────────────────────────────────────────────
   Actual brand marks — paths sourced from simple-icons (CC0) and
   faithful reproductions for brands not in the simple-icons registry.
   All viewBox "0 0 24 24" for layout consistency.
───────────────────────────────────────────────────────────────────────── */

// Simple-icons CC0 path — Google "G" logomark
export function IconGoogle(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Google" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

// Simple-icons CC0 path — Meta infinity-loop logomark
export function IconMeta(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Meta" {...props}>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
    </svg>
  )
}

// Simple-icons CC0 path — Accenture ">" chevron logomark
export function IconAccenture(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Accenture" {...props}>
      <path d="m.66 16.95 13.242-4.926L.66 6.852V0l22.68 9.132v5.682L.66 24Z" />
    </svg>
  )
}

// Amazon — faithful reproduction of the Amazon smile arrow mark
// The arrow curves from lower-left to lower-right beneath the logotype.
export function IconAmazon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-label="Amazon" {...props}>
      {/* "a" letterform */}
      <path
        d="M7.5 7.5C7.5 6.12 8.62 5 10 5h1.5C12.88 5 14 6.12 14 7.5V13c0 .55.45 1 1 1h.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"
      />
      <path
        d="M14 10H10a2.5 2.5 0 0 0 0 5h.5c.83 0 1.5-.67 1.5-1.5V13"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"
      />
      {/* Smile arrow — the distinctive Amazon brand element */}
      <path
        d="M4 17.5C6.5 20.5 17.5 20.5 20 17.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"
      />
      <path
        d="M17.5 16L20 17.5l-1 2.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  )
}

// McKinsey — "M" wordmark letterform (their logo is purely typographic)
export function IconMcKinsey(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="McKinsey & Co" {...props}>
      <path d="M2 5h2.8l4.7 8.2L14.2 5H17v14h-2.8V10.4l-4 7-4-7V19H2V5z" />
    </svg>
  )
}

// Goldman Sachs — "GS" monogram (their identity is purely typographic)
export function IconGoldmanSachs(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Goldman Sachs" {...props}>
      {/* G */}
      <path d="M10.5 6.5A5.5 5.5 0 1 0 12 17.5H13v-4h-3v1.8h1.2v.7H12A3.7 3.7 0 1 1 12 9.8h-.1a3.7 3.7 0 0 1 2.2.7l1.3-1.3A5.5 5.5 0 0 0 12 6.5h-1.5z" />
      {/* S */}
      <path d="M16 15.5c0 1.1.9 2 2 2s2-.9 2-2c0-.9-.6-1.5-1.5-1.9l-.6-.3c-.5-.2-.9-.5-.9-.9 0-.4.3-.8.8-.8.4 0 .8.2 1 .6l1.2-.7A2.3 2.3 0 0 0 18 10.5a2 2 0 0 0-2 2c0 .8.5 1.4 1.3 1.8l.6.3c.7.3 1.1.7 1.1 1.2 0 .5-.4.9-1 .9-.6 0-1.1-.4-1.2-1l-1.3.3.5-.5z" />
    </svg>
  )
}

// BlackRock — stacked-layers mark (representing asset management / rock layers)
export function IconBlackRock(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="BlackRock" {...props}>
      <path d="M12 3L2 7.5l10 4.5 10-4.5L12 3z" />
      <path d="M2 12l10 4.5L22 12M2 16.5l10 4.5 10-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Bain & Company — "B" letterform with consulting-weight stroke
export function IconBain(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Bain & Company" {...props}>
      <path d="M5 4h7.5c2.2 0 4 1.6 4 3.7 0 1.2-.6 2.3-1.6 2.9 1.3.6 2.1 1.8 2.1 3.2C17 16.1 15 18 12.5 18H5V4zm3 3v3.5h3.5c.8 0 1.5-.7 1.5-1.75S12.3 7 11.5 7H8zm0 6.5V15h4c.9 0 1.5-.7 1.5-1.75S12.9 10.5 12 10.5H8z" />
    </svg>
  )
}

/* ─── Registry ──────────────────────────────────────────────────────────── */
export type CompanyEntry = {
  name: string
  Icon: React.FC<P>
}

export const COMPANIES: CompanyEntry[] = [
  { name: 'Google',         Icon: IconGoogle       },
  { name: 'McKinsey & Co',  Icon: IconMcKinsey     },
  { name: 'Goldman Sachs',  Icon: IconGoldmanSachs },
  { name: 'Meta',           Icon: IconMeta         },
  { name: 'Amazon',         Icon: IconAmazon       },
  { name: 'BlackRock',      Icon: IconBlackRock    },
  { name: 'Bain & Company', Icon: IconBain         },
  { name: 'Accenture',      Icon: IconAccenture    },
]
