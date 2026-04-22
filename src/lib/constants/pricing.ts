export const PRICING = {
  audit: {
    usd: 99900, // Cents ($999.00)
    inr: 4999900, // Paise (₹49,999.00)
  },
} as const;

export function getPriceUSD(product: keyof typeof PRICING) {
  return PRICING[product]?.usd || 0;
}

export function getPriceINR(product: keyof typeof PRICING) {
  return PRICING[product]?.inr || 0;
}
