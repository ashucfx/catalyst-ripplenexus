import Link from 'next/link'
import { InflectionMark } from '@/components/ui/InflectionMark'
import { Disclaimer } from '@/components/ui/Disclaimer'

function FooterIcon({ type, className = 'w-4 h-4' }: { type: string; className?: string }) {
  switch (type) {
    case 'rocket':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.24A4.5 4.5 0 003.75 18a.75.75 0 00.75.75c1.077 0 2.073-.418 2.818-1.102l1.644-1.643" />
        </svg>
      )
    case 'crown':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2zm0-4l3-8 4 4 2-5 2 5 4-4 3 8H3z" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'star':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    default:
      return null
  }
}

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
              <p className="font-mono text-xs text-signal-gold font-bold mb-1 flex items-center gap-2">
                <FooterIcon type="shield" className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>98%+ ATS Pass Rate Guarantee</span>
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
                <Link href="/blueprint" className="font-medium text-bone hover:text-signal-gold transition-colors inline-flex items-center gap-2">
                  <FooterIcon type="rocket" className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Career Booster Package</span>
                </Link>
                <p className="text-[0.68rem] text-muted/80 leading-tight mt-0.5 pl-5.5">
                  Resume Rewrite + LinkedIn Bio &amp; Banner Kit + Tailored Cover Letter
                </p>
              </li>
              <li className="pt-2 border-t border-white/[0.06]">
                <Link href="/blueprint" className="font-medium text-bone hover:text-signal-gold transition-colors inline-flex items-center gap-2">
                  <FooterIcon type="crown" className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>Premium Plus Package</span>
                </Link>
                <p className="text-[0.68rem] text-signal-gold/90 font-medium leading-tight mt-0.5 pl-5.5">
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
                <Link
                  href="/checkout"
                  className="font-medium text-bone hover:text-signal-gold transition-colors inline-flex items-center gap-1"
                >
                  <span>Self-Service Checkout</span>
                  <span className="text-signal-gold text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/request"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Submit Enterprise Inquiry</span>
                  <span className="text-muted/60 text-[10px]">→</span>
                </Link>
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
                <Link href="/testimonials?region=PH" className="hover:text-bone transition-colors">
                  🇵🇭 Philippines BPO &amp; Tech Leadership
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=MY_SG" className="hover:text-bone transition-colors">
                  🇲🇾 🇸🇬 Malaysia &amp; Singapore Tech Hubs
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=ZA" className="hover:text-bone transition-colors">
                  🇿🇦 South Africa Mining &amp; FinTech
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=IR_ME" className="hover:text-bone transition-colors">
                  🇮🇷 Tehran Petrochemical &amp; Tech Systems
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=KR_APAC" className="hover:text-bone transition-colors">
                  🇰🇷 South Korea Semiconductor &amp; AI
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=AU_NZ" className="hover:text-bone transition-colors">
                  🇦🇺 Australia &amp; NZ ASX-50 Hubs
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=GCC" className="hover:text-bone transition-colors">
                  🇸🇦 🇦🇪 🇶🇦 Saudi, Dubai &amp; Qatar Giga-Projects
                </Link>
              </li>
              <li>
                <Link href="/testimonials?region=EUR_US" className="hover:text-bone transition-colors">
                  🇨🇭 🇬🇧 🇺🇸 Swiss Banking, UK &amp; US Markets
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
