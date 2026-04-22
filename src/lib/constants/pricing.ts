export const PRICING = {
  audit: {
    usd: 19900,   // Cents ($199.00)
    inr: 599900,  // Paise (₹5,999.00)
  },
  sprint: {
    usd: 49900,   // Cents ($499.00)
    inr: 1499900, // Paise (₹14,999.00)
  },
} as const;

export function getPriceUSD(product: keyof typeof PRICING) {
  return PRICING[product]?.usd || 0;
}

export function getPriceINR(product: keyof typeof PRICING) {
  return PRICING[product]?.inr || 0;
}
