'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { PaymentButton } from '@/components/ui/PaymentButton';
import {
  PackageSlug,
  ExperienceTier,
  PACKAGES,
  EXPERIENCE_TIER_LABELS,
  DynamicPriceQuote,
} from '@/lib/payment/dynamicPricing';

const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', label: 'USD ($) — US & Global' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) — India Domestic' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) — United Kingdom' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) — Eurozone' },
  { code: 'AED', symbol: 'AED', label: 'AED (د.إ) — UAE & Gulf' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$) — Singapore' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF (Fr.) — Switzerland' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$) — Canada' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD (AU$) — Australia' },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialPkg = (searchParams.get('pkg') as PackageSlug) || 'CAREER_BOOSTER';

  const [pkgSlug, setPkgSlug] = useState<PackageSlug>(
    PACKAGES[initialPkg] ? initialPkg : 'CAREER_BOOSTER'
  );
  const [expTier, setExpTier] = useState<ExperienceTier>('3_8');
  const [country, setCountry] = useState('US');
  const [currency, setCurrency] = useState('USD');

  // Customer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetRegion, setTargetRegion] = useState('US / Global');

  // Pricing Quote State
  const [quote, setQuote] = useState<DynamicPriceQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [paidTx, setPaidTx] = useState<{ method: string; id: string } | null>(null);

  // Auto-detect visitor geo
  useEffect(() => {
    fetch('/api/geo')
      .then((r) => r.json())
      .then((geo) => {
        if (geo?.country) setCountry(geo.country);
        if (geo?.currency) setCurrency(geo.currency);
      })
      .catch(() => {});
  }, []);

  // Fetch Real-Time Dynamic Quote
  const fetchQuote = useCallback(async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: pkgSlug,
          experienceTier: expTier,
          countryCode: country,
          currencyCode: currency,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setQuote(d.data);
      }
    } catch (err) {
      console.error('Failed to load quote:', err);
    } finally {
      setLoadingQuote(false);
    }
  }, [pkgSlug, expTier, country, currency]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const activePackage = PACKAGES[pkgSlug];
  const inputCls =
    'w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-xs text-bone focus:outline-none focus:border-signal-gold transition-colors placeholder:text-muted/40';

  if (isSuccess && paidTx) {
    return (
      <main className="pt-36 pb-28 grain min-h-screen">
        <div className="max-w-2xl mx-auto px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-obsidian border border-emerald-500/30 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-3xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <div>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold block mb-2">
                PAYMENT CONFIRMED · ORDER RECEIVED
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-bone font-bold">
                Welcome to Catalyst by Ripple Nexus
              </h1>
            </div>
            <p className="text-xs text-muted leading-relaxed font-sans max-w-md mx-auto">
              Your order for <strong className="text-bone">{activePackage.name}</strong> has been logged into ClientForge CRM. A senior executive consultant has been assigned to your intake profile.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-muted">
                <span>Client Name:</span>
                <span className="text-bone">{name}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Notification Email:</span>
                <span className="text-bone">{email}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Payment Method:</span>
                <span className="text-bone uppercase">{paidTx.method}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Transaction Ref:</span>
                <span className="text-signal-gold font-bold">{paidTx.id}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/book"
                className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#9B7844] text-[#0A0B0D] font-mono text-xs font-bold tracking-widest uppercase rounded-full hover:brightness-110 transition-all shadow-md text-center"
              >
                Schedule Kickoff Call →
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 border border-white/20 text-bone font-mono text-xs uppercase tracking-widest rounded-full hover:bg-white/5 transition-all text-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 sm:pt-36 pb-28 grain min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* ── TOP HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signal-gold/30 bg-signal-gold/10 font-mono text-[0.65rem] tracking-[0.25em] uppercase text-signal-gold mb-4">
            <span>🛡️ Dynamic Protected Checkout · Instant Fulfillment</span>
          </div>
          <h1
            className="display-page text-bone mb-4"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.1 }}
          >
            Self-Service <em className="not-italic text-gold-gradient">Executive Checkout.</em>
          </h1>
          <p className="text-muted text-xs sm:text-sm font-serif max-w-xl mx-auto">
            Choose your career transformation package. Real-time regional pricing with 100% protected revenue, instant portal issuance, and priority consultant matching.
          </p>
        </div>

        {/* ── PACKAGE SELECTOR TABS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {(Object.keys(PACKAGES) as PackageSlug[]).map((slug) => {
            const p = PACKAGES[slug];
            const isSelected = pkgSlug === slug;
            return (
              <button
                key={slug}
                onClick={() => setPkgSlug(slug)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-signal-gold/10 border-signal-gold shadow-lg shadow-signal-gold/10'
                    : 'bg-obsidian/60 border-white/10 hover:border-white/25'
                }`}
              >
                {p.badge && (
                  <span className="text-[9px] font-mono uppercase tracking-wider text-signal-gold block mb-1">
                    {p.badge}
                  </span>
                )}
                <div className="font-bold text-xs sm:text-sm text-bone font-serif">
                  {p.name}
                </div>
                <div className="text-[10px] text-muted font-sans mt-1 line-clamp-1">
                  {p.turnaroundDays}-day turnaround
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: DELIVERABLES & CUSTOMER DETAILS ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Experience Tier Selector */}
            <div className="p-6 rounded-2xl bg-obsidian border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
                  Select Experience Level
                </span>
                <span className="text-[10px] font-mono text-muted">
                  Calibrated for ATS benchmarks
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(EXPERIENCE_TIER_LABELS) as ExperienceTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setExpTier(tier)}
                    className={`py-2.5 px-3 rounded-xl text-center text-xs font-mono transition-all ${
                      expTier === tier
                        ? 'bg-signal-gold text-[#0A0B0D] font-bold shadow'
                        : 'bg-white/[0.03] border border-white/10 text-muted hover:text-bone'
                    }`}
                  >
                    {EXPERIENCE_TIER_LABELS[tier].split(' ')[0]}
                    <span className="block text-[9px] opacity-75 font-normal">
                      {EXPERIENCE_TIER_LABELS[tier].split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="p-6 rounded-2xl bg-obsidian border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-base font-bold text-bone">
                  {activePackage.name} Deliverables
                </h3>
                <span className="text-xs font-mono text-signal-gold">
                  ⏱ {activePackage.turnaroundDays} Business Days
                </span>
              </div>
              <ul className="space-y-3">
                {activePackage.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-bone/90">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Candidate Details Form */}
            <div className="p-6 rounded-2xl bg-obsidian border border-white/10 space-y-4">
              <h3 className="font-mono text-xs text-signal-gold uppercase tracking-wider font-bold">
                Client Profile &amp; Fulfillment Destination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                    Direct Email (for deliverables) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                    Target Role / Title
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. VP of Product / Tech Lead"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                    Target Geography
                  </label>
                  <input
                    type="text"
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value)}
                    placeholder="e.g. United States / Dubai / Singapore"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: PRICING & PAYMENT CHECKOUT ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-obsidian border border-white/15 shadow-2xl space-y-6 sticky top-28">
              {/* Currency & Region Selector */}
              <div>
                <label className="block font-mono text-[10px] text-muted uppercase mb-1.5">
                  Billing Currency &amp; Country
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-bone focus:outline-none focus:border-signal-gold"
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code} className="bg-obsidian text-bone">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {quote?.isMaximizedYield && (
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-signal-gold/80">
                    <span>★</span>
                    <span>Executive Tier {quote.pricingBand} Positioning Applied</span>
                  </div>
                )}
              </div>

              {/* Price Summary Display */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted">{activePackage.name}</span>
                  <span className="font-mono text-bone">
                    {loadingQuote ? '...' : `${quote?.clientCurrency} ${quote?.finalClientPrice.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted">Regional Safety &amp; Clearing Buffer</span>
                  <span className="font-mono text-emerald-400">Included (0% Surcharge)</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                      Total Investment
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Zero hidden transaction fees
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-signal-gold">
                      {loadingQuote ? '...' : `${quote?.clientCurrency} ${quote?.finalClientPrice.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Rail Selector & Button */}
              <div className="pt-2">
                {!name || !email ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                    <p className="text-xs font-mono text-muted mb-2">
                      Please enter your name and email above to unlock checkout rails.
                    </p>
                    <button
                      disabled
                      className="w-full py-3 rounded-full font-mono text-xs uppercase font-bold tracking-widest bg-white/5 text-muted cursor-not-allowed border border-white/5"
                    >
                      Fill Name &amp; Email to Pay →
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-3">
                      Select Payment Method:
                    </span>
                    <PaymentButton
                      product={`package:${pkgSlug}`}
                      email={email}
                      amountIntl={quote?.finalClientPrice}
                      currencyIntl={quote?.clientCurrency}
                      description={`${activePackage.name} (${EXPERIENCE_TIER_LABELS[expTier]})`}
                      onSuccess={(data) => {
                        setPaidTx(data);
                        setIsSuccess(true);
                      }}
                      onError={(msg) => setErrorMsg(msg)}
                    />
                  </div>
                )}

                {errorMsg && (
                  <p className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-lg font-mono">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] font-mono text-muted/70 text-center">
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  🔒 256-Bit SSL Encryption
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  ⚡ Instant CRM Portal Token
                </div>
              </div>
            </div>
          </div>
        </div>

        <Disclaimer variant="compact" className="mt-20 pt-8 border-t border-white/[0.05]" />
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen bg-obsidian flex items-center justify-center font-mono text-xs text-signal-gold">
            Loading Secure Checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}
