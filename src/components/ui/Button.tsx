import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'text'
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-3 font-sans transition-all duration-300 cursor-pointer'

  const variants = {
    // Signal Gold fill — reserved for single primary CTA per page
    primary:
      'text-obsidian bg-signal-gold px-8 py-4 text-[0.7rem] tracking-[0.2em] uppercase hover:bg-bone',
    // Ghost border — secondary actions
    ghost:
      'text-bone border border-graphite px-8 py-4 text-[0.7rem] tracking-[0.2em] uppercase hover:border-signal-gold hover:text-signal-gold',
    // Text arrow — inline CTAs
    text: 'text-signal-gold text-[0.7rem] tracking-[0.2em] uppercase group hover:text-bone',
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
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
