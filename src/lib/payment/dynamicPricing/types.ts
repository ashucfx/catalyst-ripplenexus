import { RevenueProtectionSnapshot } from '../costEngine/types';

export type PackageSlug = 'CAREER_BOOSTER' | 'PREMIUM_PLUS' | 'AUDIT' | 'EXECUTIVE';

export type ExperienceTier = '0_2' | '3_8' | '9_15' | '15_plus';

export type PricingBand = 'A' | 'B' | 'C' | 'D' | 'IN';

export interface PackageDefinition {
  slug: PackageSlug;
  name: string;
  badge?: string;
  tagline: string;
  deliverables: string[];
  turnaroundDays: number;
  featured?: boolean;
}

export interface DynamicPricingParams {
  packageSlug: PackageSlug;
  experienceTier?: ExperienceTier;
  countryCode: string;
  currencyCode?: string;
  paymentMethod?: 'razorpay' | 'paypal' | 'bank_transfer';
  taxRate?: number;
}

export interface DynamicPriceQuote {
  package: PackageDefinition;
  experienceTier: ExperienceTier;
  experienceTierLabel: string;
  countryCode: string;
  pricingBand: PricingBand;
  targetNetRevenue: number;
  targetCurrency: string;
  isMaximizedYield: boolean;
  yieldMultiplier: number;
  costEngineSnapshot: RevenueProtectionSnapshot;
  finalClientPrice: number;
  clientCurrency: string;
  commercialSubtotal: number;
  taxAmount: number;
  invoiceTotalAmount: number;
}
