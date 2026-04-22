export const PRICING = {
  audit: {
    usd: 9900,    // $99
    inr: 299900,  // ₹2,999
  },
  sprint: {
    usd: 19900,   // $199
    inr: 599900,  // ₹5,999
  },
  blueprint: {
    usd: 34900,   // $349
    inr: 999900,  // ₹9,999
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
