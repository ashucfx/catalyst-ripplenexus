export const PRICING = {
  audit: {
    usd: 49900, // Cents ($499.00)
    inr: 4199900, // Paise (₹41,999.00) - Matched to USD equivalent
  },
} as const;

export function getPriceUSD(product: keyof typeof PRICING) {
  return PRICING[product]?.usd || 0;
}

export function getPriceINR(product: keyof typeof PRICING) {
  return PRICING[product]?.inr || 0;
}
