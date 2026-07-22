import Link from 'next/link'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Disclaimer } from '@/components/ui/Disclaimer'

const links = {
  Services: [
    { label: 'Career Booster Package', href: '/blueprint' },
    { label: 'Executive Resume Rewrite', href: '/blueprint' },
    { label: 'LinkedIn Profile & Banner', href: '/blueprint' },
    { label: 'Market Value Audit', href: '/audit' },
  ],
  Testimonials: [
    { label: 'Verified Reviews', href: '/testimonials' },
    { label: 'ASEAN & APAC Stories', href: '/testimonials?region=ASEAN' },
    { label: 'Dubai & GCC Stories', href: '/testimonials?region=GCC' },
    { label: 'Global Successes', href: '/testimonials?region=Global' },
  ],
  Optimization: [
    { label: 'Country Optimization', href: '/blueprint' },
    { label: 'Multi-Lingual Support', href: '/blueprint' },
    { label: 'Free Resume TPI Score', href: '/tpi' },
    { label: 'Executive Suite', href: '/executive' },
  ],
  Company: [
    { label: 'Ripple Nexus', href: 'https://www.theripplenexus.com' },
    { label: 'Get Started', href: '/blueprint' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--obsidian)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Main footer grid */}
      <div className="max-w-dossier mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-16">

          {/* Brand column */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-4 group" aria-label="Catalyst Home">
              <InflectionMark size="sm" />
              <div>
                <p className="display-card text-xl">CATALYST</p>
                <p className="label-inst opacity-50" style={{ fontSize: '0.38rem', letterSpacing: '0.3em' }}>
                  BY RIPPLE NEXUS
                </p>
              </div>
            </Link>

            <p className="font-serif text-muted text-base leading-relaxed italic max-w-xs">
              &ldquo;We do not write resumes. We engineer how the market perceives you.&rdquo;
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {['🇮🇳 🇦🇪 🇺🇸 🇸🇬 🇦🇺 🇬🇧', 'Career Positioning', 'ATS 98%+ Guarantee'].map((badge) => (
                <span key={badge} className="trust-badge" style={{ fontSize: '0.55rem' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-6">
              <p className="label-inst" style={{ opacity: 0.75, fontSize: '0.55rem' }}>{group}</p>
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-mono text-muted text-[0.6rem] tracking-[0.18em] uppercase 
                                 hover:text-signal-gold transition-colors duration-250"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Full disclaimer */}
      <div className="max-w-dossier mx-auto px-6 lg:px-12 pb-12">
        <Disclaimer variant="full" />
      </div>

      {/* Thin gold separator */}
      <div className="gold-bar mx-6 lg:mx-12" />

      {/* Footer base */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-dossier mx-auto px-6 lg:px-12 py-8 
                        flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <p className="font-mono text-muted text-[0.52rem] tracking-[0.25em] uppercase opacity-40">
            © {new Date().getFullYear()} RIPPLE NEXUS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms',   href: '/terms' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-muted text-[0.52rem] tracking-[0.25em] uppercase 
                           hover:text-bone transition-colors opacity-50 hover:opacity-100"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
