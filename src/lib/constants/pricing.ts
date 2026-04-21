export const PRICING = {
  audit: {
    usd: 49900, // Cents ($499.00)
    inr: 1499900, // Paise (₹14,999.00) - Unified standard for Indian market
  },
} as const;

export function getPriceUSD(product: keyof typeof PRICING) {
  return PRICING[product]?.usd || 0;
}

export function getPriceINR(product: keyof typeof PRICING) {
  return PRICING[product]?.inr || 0;
}
