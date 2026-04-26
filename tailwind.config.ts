import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Exact spec values — Catalyst Brand System PDF */
        obsidian:         '#0A0B0D',   /* Primary ground dark (60%)          */
        'obsidian-light': '#111417',   /* Intermediate surface               */
        bone:             '#F4F1EB',   /* Primary ground light (60% inverse) */
        graphite:         '#1F2226',   /* Component surface dark (30%)       */
        'graphite-light': '#262B31',   /* Graphite hover/active              */
        parchment:        '#E6DFD1',   /* Component surface light (30%)      */
        'signal-gold':    '#B8935B',   /* Accent — CTAs, TPI, Inflection     */
        'catalyst-ink':   '#0E1A3A',   /* Data visualization only            */
        muted:            '#7A7A82',
        'muted-light':    '#9A9A9F',
      },
      fontFamily: {
        /* GT Sectra substitute — Cormorant is the closest open editorial serif */
        serif: ['var(--font-cormorant)', 'Georgia', '"Times New Roman"', 'serif'],
        /* Söhne substitute — Inter has the same precision grotesque register */
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        /* Berkeley Mono substitute — JetBrains Mono */
        mono: ['var(--font-mono)', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem,8vw,7rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem,6vw,5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2rem,4vw,3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem,3vw,2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        editorial: ['1.75rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.35em' }],
      },
      maxWidth: {
        editorial: '68ch',
        dossier: '120ch',
      },
      animation: {
        reveal:       'reveal 0.9s ease-out forwards',
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        marquee:      'marqueeScroll 28s linear infinite',
        'gold-pulse':  'goldRingPulse 4s ease-in-out infinite',
        'glow-text':  'goldTextGlow 5s ease-in-out infinite',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        marqueeScroll: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        goldRingPulse: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(184,147,91,0.12), 0 0 30px rgba(184,147,91,0.06)', borderColor: 'rgba(184,147,91,0.4)' },
          '50%':       { boxShadow: '0 0 0 1px rgba(184,147,91,0.22), 0 0 55px rgba(184,147,91,0.14)', borderColor: 'rgba(184,147,91,0.7)' },
        },
        goldTextGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(184,147,91,0.3))' },
          '50%':       { filter: 'drop-shadow(0 0 50px rgba(184,147,91,0.55))' },
        },
      },
    },
  },
  plugins: [],
}

export default config
