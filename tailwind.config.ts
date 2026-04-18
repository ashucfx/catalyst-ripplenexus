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
        obsidian: '#0A0B0D',
        bone: '#F4F1EB',
        graphite: '#1F2226',
        parchment: '#E6DFD1',
        'signal-gold': '#B8935B',
        'catalyst-ink': '#0E1A3A',
        muted: '#8B8681',
      },
      fontFamily: {
        // GT Sectra substitute — Cormorant is the closest open editorial serif
        serif: ['var(--font-cormorant)', 'Georgia', '"Times New Roman"', 'serif'],
        // Söhne substitute — Inter has the same precision grotesque register
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Berkeley Mono substitute — JetBrains Mono
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
        reveal: 'reveal 0.9s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
