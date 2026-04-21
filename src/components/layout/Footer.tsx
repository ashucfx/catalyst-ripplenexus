import Link from 'next/link'
import { InflectionMark } from '@/components/ui/InflectionMark'

const links = {
  Services: [
    { label: 'Market Value Audit', href: '/audit' },
    { label: 'Positioning Blueprint', href: '/blueprint' },
    { label: 'Sovereign Executive Suite', href: '/executive' },
  ],
  Platform: [
    { label: 'Catalyst Platform', href: '/platform' },
    { label: 'Catalyst Lite', href: '/platform#lite' },
    { label: 'Catalyst Pro', href: '/platform#pro' },
    { label: 'Enterprise', href: '/platform#enterprise' },
  ],
  Intelligence: [
    { label: 'The System', href: '/system' },
    { label: 'Research & Reports', href: '/intelligence' },
    { label: 'Case Studies', href: '/intelligence#case-studies' },
  ],
  Institution: [
    { label: 'Ripple Nexus', href: '/' },
    { label: 'Book a Session', href: '/book' },
    { label: 'Request an Audit', href: '/request' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-graphite mt-32">
      {/* Main footer body */}
      <div className="max-w-dossier mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <InflectionMark size="sm" />
              <div>
                <p className="font-serif text-bone text-lg tracking-[-0.02em]">CATALYST</p>
                <p className="label-inst" style={{ fontSize: '0.48rem' }}>A RIPPLE NEXUS INSTITUTION</p>
              </div>
            </Link>
            <p className="font-serif text-muted text-sm leading-relaxed italic">
              &ldquo;We do not write resumes. We engineer the future of the professional elite.&rdquo;
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-4">
              <p className="label-inst">{group}</p>
              <hr className="rule" />
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-sans text-muted text-[0.7rem] tracking-wide hover:text-bone
                                 transition-colors duration-200"
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

      {/* Footer base */}
      <div className="border-t border-graphite">
        <div className="max-w-dossier mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row
                        items-start md:items-center justify-between gap-3">
          <p className="font-mono text-muted text-[0.6rem] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Ripple Nexus Institution. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-mono text-muted text-[0.6rem] tracking-[0.15em] uppercase hover:text-bone transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-mono text-muted text-[0.6rem] tracking-[0.15em] uppercase hover:text-bone transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
