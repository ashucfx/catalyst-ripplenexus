export const PRICING = {
  audit: {
    usd: 9900,    // $99   — fixed fee, all tiers
    inr: 299900,  // ₹2,999 — fixed fee, all tiers
  },
  sprint: {
    // Career Booster: Resume + LinkedIn + Cover Letter (15% off)
    // Prices vary by experience tier — these represent the 3–8 yr starting point
    usd: 14900,   // $149
    inr: 254800,  // ₹2,548 (from)
  },
  blueprint: {
    // Premium Plus: All 4 services (20% off, Cover Letter complimentary)
    // Prices vary by experience tier — these represent the 3–8 yr starting point
    usd: 29900,   // $299
    inr: 559700,  // ₹5,597 (from)
  },
  executive: {
    usd: 49900,   // $499
    inr: 1499900, // ₹14,999
  },
} as const;

export function getPriceUSD(product: keyof typeof PRICING) {
  return PRICING[product]?.usd || 0;
}

export function getPriceINR(product: keyof typeof PRICING) {
  return PRICING[product]?.inr || 0;
}
