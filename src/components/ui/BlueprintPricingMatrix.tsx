'use client'

import Link from 'next/link'

export function BlueprintPricingMatrix() {
  return (
    <div className="space-y-8">
      {/* ── Consultation Scope Header Card ────────────────────────────── */}
      <div
        className="p-8 lg:p-12 rounded-2xl border border-signal-gold/30 backdrop-blur-xl relative overflow-hidden"
        style={{ background: 'rgba(12, 13, 16, 0.85)' }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-signal-gold to-transparent" />

        <div className="max-w-3xl">
          <span className="font-mono text-xs text-signal-gold tracking-[0.25em] uppercase font-bold block mb-3">
            Bespoke Executive Scope &amp; Consultation
          </span>
          <h3 className="font-serif text-bone text-2xl lg:text-3xl font-bold mb-4">
            Bespoke Executive Positioning for Senior Leaders &amp; Executives
          </h3>
          <p className="font-serif text-muted text-base leading-relaxed mb-8">
            Every candidate&apos;s career trajectory is unique. We evaluate your target experience tier (Mid-Career 3–8 yrs, Senior 9–15 yrs, C-Suite 15+ yrs) and market region (ASEAN, GCC, APAC, Global) during a 1-on-1 Strategy Consultation to deliver customized positioning.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/request"
              className="bg-gradient-to-r from-signal-gold via-amber-400 to-yellow-500 text-obsidian px-8 py-4 font-sans text-xs font-bold tracking-wider uppercase rounded-full text-center shadow-lg shadow-signal-gold/15 hover:brightness-110 transition-all"
            >
              Book Strategy Consultation →
            </Link>

            <a
              href="https://clientforge.theripplenexus.com/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-bone px-7 py-4 font-sans text-xs font-semibold tracking-wider uppercase rounded-full text-center hover:border-signal-gold/40 hover:bg-white/[0.05] transition-all"
            >
              ClientForge Self-Service Checkout ↗
            </a>

            <a
              href="https://clientforge.theripplenexus.com/inquire"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted hover:text-signal-gold tracking-wider uppercase text-center py-2 transition-colors"
            >
              Submit Enterprise Inquiry ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── Feature Comparison Matrix Table ───────────────────────────── */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-obsidian/70">
        <div className="py-4 px-8 border-b border-white/10 bg-black/80 flex items-center justify-between">
          <span className="font-mono text-signal-gold text-xs tracking-widest uppercase font-bold">
            Executive Deliverables &amp; Inclusions
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">
            All Markets: 🇸🇦 🇶🇦 🇦🇪 🇮🇳 🇲🇾 🇨🇭 🇦🇺 🇺🇸
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="text-left font-mono text-muted text-xs tracking-widest py-4 px-8 w-64">FEATURE / DELIVERABLE</th>
                <th className="text-center font-mono text-muted text-xs tracking-widest py-4 px-6">MID-CAREER (3–8 YRS)</th>
                <th className="text-center font-mono text-signal-gold text-xs tracking-widest py-4 px-6 font-bold">SENIOR LEADERSHIP (9–15 YRS)</th>
                <th className="text-center font-mono text-muted text-xs tracking-widest py-4 px-6">C-SUITE &amp; EXECUTIVE (15+ YRS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              <tr className="hover:bg-white/[0.02]">
                <td className="font-mono text-bone py-4 px-8 uppercase font-semibold">Executive Resume Rewrite</td>
                <td className="text-center text-emerald-400 font-mono">✓ ATS 98%+ Pass</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ Metric-Driven Dossier</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ C-Suite Executive Dossier</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="font-mono text-bone py-4 px-8 uppercase font-semibold">LinkedIn Profile Overhaul</td>
                <td className="text-center text-emerald-400 font-mono">✓ Full Rewrite</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ Full Rewrite + SEO Bio</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ Thought Leadership Brand</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="font-mono text-bone py-4 px-8 uppercase font-semibold">LinkedIn Banner &amp; DP Kit</td>
                <td className="text-center text-emerald-400 font-mono">✓ Custom Banner</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ Custom Banner &amp; DP Kit</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ Executive Studio Asset Pack</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="font-mono text-bone py-4 px-8 uppercase font-semibold">Tailored Cover Letter</td>
                <td className="text-center text-signal-gold font-mono">Complimentary</td>
                <td className="text-center text-signal-gold font-mono font-bold">Complimentary</td>
                <td className="text-center text-signal-gold font-mono font-bold">Complimentary Executive Pitch</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="font-mono text-bone py-4 px-8 uppercase font-semibold">Country Market Optimization</td>
                <td className="text-center text-muted font-mono">ASEAN / APAC</td>
                <td className="text-center text-bone font-mono font-semibold">GCC / ASEAN / APAC / US / EU</td>
                <td className="text-center text-bone font-mono font-bold">Global Multi-Country Norms</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="font-mono text-bone py-4 px-8 uppercase font-semibold">Multi-Lingual Adaptation</td>
                <td className="text-center text-muted font-mono">Optional Add-on</td>
                <td className="text-center text-emerald-400 font-mono">✓ Dual-Language Pack</td>
                <td className="text-center text-emerald-400 font-mono font-bold">✓ Full Multi-Lingual Suite</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
