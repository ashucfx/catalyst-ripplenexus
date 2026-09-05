import {
  PackageSlug,
  ExperienceTier,
  PricingBand,
  PackageDefinition,
  DynamicPricingParams,
  DynamicPriceQuote,
} from './types';
import { calculateClientPrice } from '../costEngine';
import { getBand } from '@/lib/constants/international-pricing';
import { Decimal, toDecimal } from '../costEngine/decimal';

export const PACKAGES: Record<PackageSlug, PackageDefinition> = {
  CAREER_BOOSTER: {
    slug: 'CAREER_BOOSTER',
    name: 'Career Booster Package',
    badge: '★ Most Popular Choice',
    tagline: 'RESUME · LINKEDIN · BANNER & DP · COVER LETTER',
    deliverables: [
      'Executive ATS 98%+ Resume Rewrite',
      'Full LinkedIn Profile Rewrite & Search Algorithm Optimization',
      'Custom LinkedIn Banner & Executive Headshot Direction Kit',
      'Complimentary Custom Cover Letter tailored by country',
      'Regional Market Optimization (US / UK / GCC / ASEAN / APAC)',
      'Recruiter Outreach DM & Cold Networking Script Templates',
    ],
    turnaroundDays: 4,
    featured: true,
  },
  PREMIUM_PLUS: {
    slug: 'PREMIUM_PLUS',
    name: 'Premium Plus Suite',
    badge: 'Executive & C-Suite',
    tagline: 'CAREER BOOSTER + PERSONAL PORTFOLIO SHOWCASE WEBSITE',
    deliverables: [
      'Everything included in Career Booster Package',
      'Custom Hosted Personal Portfolio Website Showcase',
      'Multi-Lingual CV Adaptation (English + 1 Secondary Language)',
      'Executive Salary & Offer Negotiation Playbook',
      '1-on-1 Confidential Executive Pitch Guidance Call (45 mins)',
      'Dedicated Priority Revision Turnaround (24–48 hours)',
    ],
    turnaroundDays: 6,
  },
  AUDIT: {
    slug: 'AUDIT',
    name: 'Market Value Audit & Strategy Call',
    badge: '48-Hour Turnaround',
    tagline: 'ATS REPORT · TALENT POSITIONING SCORE · 1-ON-1 STRATEGY CALL',
    deliverables: [
      'Comprehensive ATS & Recruiter Screen Diagnostic Report',
      'Talent Positioning Score (TPI) Benchmarking',
      '3 Highest-Leverage Line-by-Line Achievement Rewrites',
      'Global Compensation & Market Value Benchmark',
      '45-Minute 1-on-1 Video Strategy Consultation with Lead Consultant',
    ],
    turnaroundDays: 2,
  },
  EXECUTIVE: {
    slug: 'EXECUTIVE',
    name: 'C-Suite Sovereign Executive Suite',
    badge: 'Confidential & Bespoke',
    tagline: 'BOARD-LEVEL BRANDING · BIO · HEADHUNTER SYNDICATION',
    deliverables: [
      'Confidential C-Suite & Board of Directors Executive Dossier',
      'Executive Biography & Thought Leadership One-Pager',
      'Bespoke Sovereign Portfolio Website with Private Domain',
      'Confidential Global Headhunter Network Placement Strategy',
      '90-Minute Strategic Advisory & Compensation Structuring Call',
    ],
    turnaroundDays: 7,
  },
};

export const EXPERIENCE_TIER_LABELS: Record<ExperienceTier, string> = {
  '0_2': 'Foundation (0–2 yrs)',
  '3_8': 'Professional (3–8 yrs)',
  '9_15': 'Senior / Director (9–15 yrs)',
  '15_plus': 'Executive / C-Suite (15+ yrs)',
};

/**
 * Base USD Net Targets by Band and Experience Tier (before cost-engine gross-up)
 */
const BASE_NET_USD_BY_BAND: Record<
  PricingBand,
  Record<PackageSlug, Record<ExperienceTier, number>>
> = {
  // Band A — High Willingness to Pay (US, UK, AU, CA, SG, CH, Western Europe)
  A: {
    AUDIT: { '0_2': 129, '3_8': 149, '9_15': 179, '15_plus': 199 },
    CAREER_BOOSTER: { '0_2': 179, '3_8': 349, '9_15': 699, '15_plus': 899 },
    PREMIUM_PLUS: { '0_2': 349, '3_8': 699, '9_15': 1199, '15_plus': 1499 },
    EXECUTIVE: { '0_2': 799, '3_8': 1299, '9_15': 1899, '15_plus': 2499 },
  },
  // Band B — High-Income GCC & East Asia (UAE, Saudi Arabia, Qatar, Japan, Korea)
  B: {
    AUDIT: { '0_2': 99, '3_8': 119, '9_15': 149, '15_plus': 169 },
    CAREER_BOOSTER: { '0_2': 149, '3_8': 279, '9_15': 549, '15_plus': 699 },
    PREMIUM_PLUS: { '0_2': 299, '3_8': 579, '9_15': 999, '15_plus': 1249 },
    EXECUTIVE: { '0_2': 699, '3_8': 1099, '9_15': 1599, '15_plus': 2099 },
  },
  // Band C — Mid-Tier (Malaysia, South Africa, Poland, Mexico, Brazil)
  C: {
    AUDIT: { '0_2': 69, '3_8': 79, '9_15': 99, '15_plus': 119 },
    CAREER_BOOSTER: { '0_2': 99, '3_8': 189, '9_15': 369, '15_plus': 479 },
    PREMIUM_PLUS: { '0_2': 199, '3_8': 399, '9_15': 699, '15_plus': 899 },
    EXECUTIVE: { '0_2': 499, '3_8': 799, '9_15': 1199, '15_plus': 1599 },
  },
  // Band D — Accessible / Developing (Philippines, Pakistan, Nigeria, Egypt)
  D: {
    AUDIT: { '0_2': 42, '3_8': 49, '9_15': 69, '15_plus': 79 },
    CAREER_BOOSTER: { '0_2': 69, '3_8': 109, '9_15': 199, '15_plus': 269 },
    PREMIUM_PLUS: { '0_2': 139, '3_8': 249, '9_15': 449, '15_plus': 579 },
    EXECUTIVE: { '0_2': 349, '3_8': 549, '9_15': 849, '15_plus': 1099 },
  },
  // Dedicated INR Tier for India
  IN: {
    AUDIT: { '0_2': 2999, '3_8': 2999, '9_15': 3999, '15_plus': 4999 },
    CAREER_BOOSTER: { '0_2': 2548, '3_8': 5499, '9_15': 9999, '15_plus': 14999 },
    PREMIUM_PLUS: { '0_2': 5597, '3_8': 11999, '9_15': 19999, '15_plus': 29999 },
    EXECUTIVE: { '0_2': 14999, '3_8': 24999, '9_15': 39999, '15_plus': 59999 },
  },
};

/**
 * Psychological charm pricing helper:
 * Rounds an unrounded amount to clean consumer price points ending in 9, 49, 99, 499, etc.
 */
export function roundToCharmPrice(amount: Decimal | number, currency: string): number {
  const d = toDecimal(amount);
  const curr = currency.toUpperCase();

  if (curr === 'INR') {
    // For INR, round to nearest 99 or 499
    const val = Math.ceil(d.toNumber() / 100) * 100 - 1;
    return Math.max(val, 99);
  }

  if (curr === 'AED') {
    // For AED, round to nearest 49 or 99
    const val = Math.ceil(d.toNumber() / 50) * 50 - 1;
    return Math.max(val, 49);
  }

  // USD, GBP, EUR, CHF, CAD, AUD, SGD:
  // For small amounts (< $100): round to x9 (e.g. 49, 79, 89, 99)
  // For medium amounts ($100-$1000): round to x49 or x99 (e.g. 149, 349, 699, 899)
  // For large amounts (> $1000): round to x99 (e.g. 1199, 1499, 2499)
  const num = Math.ceil(d.toNumber());
  if (num < 100) {
    return Math.ceil(num / 10) * 10 - 1;
  }
  if (num < 1000) {
    const rem = num % 100;
    if (rem <= 49) {
      return Math.floor(num / 100) * 100 + 49;
    }
    return Math.floor(num / 100) * 100 + 99;
  }
  return Math.ceil(num / 100) * 100 - 1;
}

/**
 * Calculates dynamically maximized revenue quote for any package and region,
 * and feeds it directly into the Cost Engine for 0% revenue loss gross-up.
 */
export async function getDynamicPriceQuote(params: DynamicPricingParams): Promise<DynamicPriceQuote> {
  const {
    packageSlug,
    experienceTier = '3_8',
    countryCode,
    currencyCode,
    paymentMethod,
    taxRate = 0,
  } = params;

  const pkg = PACKAGES[packageSlug];
  if (!pkg) {
    throw new Error(`Unknown package slug: ${packageSlug}`);
  }

  const country = (countryCode || 'US').toUpperCase();
  const isIndia = country === 'IN';
  const band: PricingBand = isIndia ? 'IN' : getBand(country);

  // 1. Resolve base target net revenue
  let targetRevenue = BASE_NET_USD_BY_BAND[band]?.[packageSlug]?.[experienceTier];
  if (!targetRevenue) {
    targetRevenue = BASE_NET_USD_BY_BAND.A[packageSlug][experienceTier];
  }

  const targetCurrency = isIndia ? 'INR' : 'USD';
  const clientCurr = (currencyCode || (isIndia ? 'INR' : 'USD')).toUpperCase();

  // 2. Select payment method default if unspecified
  const defaultMethod = isIndia
    ? 'razorpay'
    : clientCurr === 'USD'
    ? 'paypal'
    : 'razorpay';

  const method = paymentMethod || defaultMethod;

  // 3. Yield multiplier description for analytics
  const yieldMultipliers: Record<PricingBand, number> = {
    A: 1.5,
    B: 1.25,
    C: 0.85,
    D: 0.55,
    IN: 1.0,
  };
  const yieldMultiplier = yieldMultipliers[band];

  // 4. Feed Base Revenue into the Cost Engine
  const costSnapshot = await calculateClientPrice({
    baseRevenueAmount: targetRevenue,
    baseRevenueCurrency: targetCurrency,
    clientCurrency: clientCurr,
    paymentMethod: method,
    taxRate,
    brand: 'catalyst',
    referenceType: 'package_checkout',
  });

  // 5. Apply psychological charm rounding to final price
  const charmedClientPrice = roundToCharmPrice(costSnapshot.finalClientPrice, clientCurr);

  // Ensure charmed price never falls below the mathematically verified client price
  const finalPrice = Math.max(charmedClientPrice, costSnapshot.finalClientPrice);

  const commercialSubtotal = finalPrice;
  const taxAmount = taxRate > 0 ? Math.round(commercialSubtotal * taxRate * 100) / 100 : 0;
  const invoiceTotalAmount = commercialSubtotal + taxAmount;

  return {
    package: pkg,
    experienceTier,
    experienceTierLabel: EXPERIENCE_TIER_LABELS[experienceTier],
    countryCode: country,
    pricingBand: band,
    targetNetRevenue: targetRevenue,
    targetCurrency,
    isMaximizedYield: band === 'A' || band === 'B',
    yieldMultiplier,
    costEngineSnapshot: costSnapshot,
    finalClientPrice: finalPrice,
    clientCurrency: clientCurr,
    commercialSubtotal,
    taxAmount,
    invoiceTotalAmount,
  };
}
