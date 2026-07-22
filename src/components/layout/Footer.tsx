import Link from 'next/link'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Disclaimer } from '@/components/ui/Disclaimer'

export function Footer() {
  return (
    <footer className="relative bg-black/90 text-bone border-t border-white/10 overflow-hidden">
      {/* Top subtle gold hairline gradient */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(184,147,91,0.6) 40%, rgba(184,147,91,0.9) 50%, rgba(184,147,91,0.6) 60%, transparent 100%)',
        }}
      />

      {/* Main Footer Container */}
      <div className="max-w-dossier mx-auto px-6 lg:px-12 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-2 flex flex-col gap-6 pr-0 lg:pr-6">
            <Link href="/" className="flex items-center gap-3 group" aria-label="Catalyst Home">
              <InflectionMark size="sm" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-bone text-xl font-bold tracking-tight text-gradient">
                  CATALYST
                </span>
                <span className="font-mono text-[0.52rem] tracking-[0.3em] uppercase text-signal-gold/80 mt-1">
                  BY RIPPLE NEXUS
                </span>
              </div>
            </Link>

            <p className="font-serif text-muted/90 text-sm leading-relaxed italic max-w-sm">
              &ldquo;We do not write generic resumes. We engineer high-authority executive positioning to maximize your market value.&rdquo;
            </p>

            {/* National Coverage Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                '🇸🇦 KSA',
                '🇶🇦 QTR',
                '🇦🇪 UAE',
                '🇮🇳 IN',
                '🇲🇾 MY',
                '🇨🇭 CH',
                '🇦🇺 ANZ',
                '🇺🇸 US',
              ].map((flag) => (
                <span
                  key={flag}
                  className="font-mono text-xs text-bone bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-md"
                >
                  {flag}
                </span>
              ))}
            </div>

            {/* High Trust Callout */}
            <div className="p-4 rounded-xl bg-signal-gold/10 border border-signal-gold/30 mt-2 max-w-sm">
              <p className="font-mono text-xs text-signal-gold font-bold mb-1">
                ★ 98%+ ATS Pass Rate Guarantee
              </p>
              <p className="font-sans text-xs text-muted/90 leading-snug">
                Over 1,400+ professionals promoted across GCC, ASEAN, APAC &amp; Global tech/enterprise markets.
              </p>
            </div>
          </div>

          {/* Column 2: Flagship Packages */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
              Flagship Packages
            </p>
            <ul className="flex flex-col gap-3 text-xs">
              <li>
                <Link href="/blueprint" className="font-medium text-bone hover:text-signal-gold transition-colors block">
                  🚀 Career Booster Package
                </Link>
                <p className="text-[0.68rem] text-muted/80 leading-tight mt-0.5">
                  Resume Rewrite + LinkedIn Bio &amp; Banner Kit + Tailored Cover Letter
                </p>
              </li>
              <li className="pt-2 border-t border-white/[0.06]">
                <Link href="/blueprint" className="font-medium text-bone hover:text-signal-gold transition-colors block">
                  👑 Premium Plus Package
                </Link>
                <p className="text-[0.68rem] text-signal-gold/90 font-medium leading-tight mt-0.5">
                  Includes Booster + Personal Web Portfolio Showcase Website
                </p>
              </li>
              <li className="pt-2 border-t border-white/[0.06]">
                <Link href="/audit" className="text-muted hover:text-bone transition-colors">
                  Market Value Audit (48-Hr)
                </Link>
              </li>
              <li>
                <Link href="/tpi" className="text-muted hover:text-bone transition-colors">
                  Free Talent Score (TPI)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ClientForge Portal & Direct Checkout */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
              ClientForge Direct Portals
            </p>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <a
                  href="https://clientforge.theripplenexus.com/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-bone hover:text-signal-gold transition-colors inline-flex items-center gap-1"
                >
                  <span>Self-Service Checkout</span>
                  <span className="text-signal-gold text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://clientforge.theripplenexus.com/inquire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Submit Enterprise Inquiry</span>
                  <span className="text-muted/60 text-[10px]">↗</span>
                </a>
              </li>
              <li className="pt-2 border-t border-white/[0.06]">
                <Link href="/request" className="text-signal-gold font-medium hover:underline inline-flex items-center gap-1">
                  <span>Book 1-on-1 Strategy Call</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Regional Markets & Legal */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
              Regional Markets &amp; Trust
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-muted">
              <li>
                <Link href="/testimonials?region=KSA" className="hover:text-bone transition-colors">
                  🇸🇦 Saudi Arabia (10 Reviews)
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=QTR" className="hover:text-bone transition-colors">
                  🇶🇦 Qatar Energy &amp; FinTech (8)
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=UAE" className="hover:text-bone transition-colors">
                  🇦🇪 Dubai &amp; Abu Dhabi (8)
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=IND" className="hover:text-bone transition-colors">
                  🇮🇳 India Tech, PE &amp; EV (8)
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=ASEAN" className="hover:text-bone transition-colors">
                  🇲🇾 🇸🇬 Malaysia &amp; Singapore (8)
                </Link>
              </li>
              <li className="pt-2 border-t border-white/[0.06]">
                <Link href="/privacy" className="hover:text-bone transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-bone transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Block */}
        <div className="pt-8 border-t border-white/10 mb-8">
          <Disclaimer variant="compact" />
        </div>

        {/* Bottom Base */}
        <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <p className="font-mono text-xs text-muted/60">
            © {new Date().getFullYear()} RIPPLE NEXUS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
