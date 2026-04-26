import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'text' | 'subtle'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-3 font-sans transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'text-obsidian bg-signal-gold px-10 py-5 text-[0.65rem] font-bold tracking-[0.25em] uppercase hover:bg-bone hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-signal-gold/10',
    ghost:
      'text-bone border border-graphite/60 px-10 py-5 text-[0.65rem] font-medium tracking-[0.25em] uppercase hover:border-signal-gold/50 hover:bg-white/5',
    text:
      'text-signal-gold text-[0.6rem] font-bold tracking-[0.3em] uppercase group hover:text-bone',
    subtle:
      'text-muted hover:text-bone text-[0.6rem] tracking-[0.3em] uppercase transition-colors',
  }

  const cls = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
        {variant === 'text' && (
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        )}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  )
}
