export type Brand = 'catalyst' | 'ripple_nexus' | 'clientforge';

export type PaymentProvider = 'razorpay' | 'paypal' | 'bank_transfer' | 'stripe';

export type PaymentRail = 'domestic_card' | 'intl_card' | 'bank_wire' | 'ach' | 'sepa' | 'wallet';

export interface CostProfile {
  id: string;
  brand: Brand;
  provider: PaymentProvider;
  rail_type: PaymentRail;
  currency: string; // Specific code like 'USD', 'INR', or 'ALL'
  percentage_fee: number; // e.g. 0.02 for 2%
  fixed_fee: number; // e.g. 0.30 for $0.30 or 3.00 for ₹3.00
  fx_spread_percentage: number; // e.g. 0.02 for 2%
  intermediary_fixed_fee: number; // e.g. $15 for wire transfers
  dispute_reserve_rate: number; // e.g. 0.005 for 0.5%
  risk_buffer_percentage: number; // e.g. 0.01 for 1% FX volatility safety buffer
  min_charge_amount: number;
  is_active: boolean;
  effective_from?: string;
  effective_until?: string | null;
  metadata?: Record<string, unknown>;
}

export interface CurrencyProfile {
  code: string;
  name: string;
  symbol: string;
  minor_unit: number;
  is_receiving_currency: boolean;
  is_settlement_currency: boolean;
  default_settlement_currency: string;
  fx_route_mode: 'DIRECT' | 'MULTI_HOP';
  multi_hop_intermediary?: string | null;
  is_active: boolean;
}

export interface FxRoute {
  id: string;
  from_currency: string;
  to_currency: string;
  base_exchange_rate: number;
  spread_percentage: number;
  safety_buffer_percentage: number;
  source: 'manual' | 'ecb' | 'open_exchange_rates';
  last_updated_at?: string;
}

export interface FxConversionPath {
  isMultiHop: boolean;
  sourceCurrency: string;
  targetCurrency: string;
  intermediaryCurrency?: string;
  routes: Array<{
    routeId: string;
    from: string;
    to: string;
    baseRate: number;
    spreadRate: number;
    safetyBufferRate: number;
    effectiveRate: number;
  }>;
  totalEffectiveExchangeRate: number;
  totalSpreadPercentage: number;
  totalSafetyBufferPercentage: number;
}

export interface PricingCalculationInput {
  baseRevenueAmount: number; // The target net revenue amount
  baseRevenueCurrency: string; // Currency of base revenue (e.g. 'USD' or 'INR')
  clientCurrency: string; // The currency client pays in (e.g. 'USD', 'GBP', 'EUR', 'CHF')
  paymentMethod: PaymentProvider;
  railType?: PaymentRail;
  brand?: Brand;
  customProfileId?: string;
  taxRate?: number; // e.g. 0.18 for 18% GST/VAT if applicable, defaults to 0
  referenceId?: string; // booking_id or invoice_id
  referenceType?: string; // 'booking', 'invoice', 'order'
}

export interface CostBreakdown {
  providerFeeVariableRate: number;
  providerFeeVariableAmount: number;
  providerFeeFixedAmount: number;
  fxSpreadRate: number;
  fxSpreadAmount: number;
  intermediaryFixedAmount: number;
  disputeReserveRate: number;
  disputeReserveAmount: number;
  riskBufferRate: number;
  riskBufferAmount: number;
  totalVariableRate: number;
  totalFixedCosts: number;
  totalEstimatedCosts: number;
}

export interface GrossUpPricingResult {
  baseRevenueAmount: number;
  baseRevenueCurrency: string;
  clientCurrency: string;
  targetNetRevenueInClientCurrency: number;
  
  costProfileUsed: CostProfile;
  fxRouteApplied: FxConversionPath | null;
  costBreakdown: CostBreakdown;
  
  // Mathematical gross-up
  grossClientPriceUnrounded: number;
  finalClientPrice: number; // Rounded up to nearest minor unit
  verifiedNetAfterRounding: number; // Guaranteed >= targetNetRevenueInClientCurrency
  expectedSurplusAfterRounding: number; // verifiedNet - targetNet
  
  // Tax layer (strictly separated from business revenue)
  taxRate: number;
  taxAmount: number;
  commercialSubtotal: number; // = finalClientPrice
  invoiceTotalAmount: number; // = finalClientPrice + taxAmount
  
  quoteGeneratedAt: string;
}

export interface RevenueProtectionSnapshot extends GrossUpPricingResult {
  id?: string;
  referenceId?: string;
  referenceType?: string;
  brand: Brand;
  paymentMethod: PaymentProvider;
  status: 'QUOTED' | 'ACCEPTED' | 'SETTLED' | 'CANCELLED';
  createdAt?: string;
}

export interface SettlementRecordInput {
  snapshotId?: string;
  gatewayTransactionId: string;
  paymentMethod: PaymentProvider;
  paidClientCurrency: string;
  paidClientAmount: number;
  settledCurrency: string;
  settledAmountNet: number;
  actualProviderFee?: number;
  actualFxRate?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface SettlementReconciliationResult {
  settlementRecordId?: string;
  snapshotId?: string;
  estimatedTargetNet: number;
  settledAmountNet: number;
  settledCurrency: string;
  
  // Performance & Integrity
  profitSurplus: number; // > 0 if we received more than target net
  leakageShortfall: number; // > 0 if actual net was less than target net (0 = zero leakage)
  feeVariance: number; // actualProviderFee - estimatedProviderFee
  fxVariance: number; // actualFxCost - estimatedFxCost
  protectionCoverageRatio: number; // settledAmountNet / estimatedTargetNet (e.g. 1.002 = 100.2% protected)
  
  isFullyProtected: boolean; // True if settledAmountNet >= estimatedTargetNet
  reconciliationTimestamp: string;
}

export interface PricingRecommendation {
  profileId: string;
  sampleSize: number;
  observedMeanCostRate: number;
  observedP95CostRate: number;
  observedP99CostRate: number;
  currentConfiguredRate: number;
  recommendedRate: number;
  suggestedAction: 'MAINTAIN' | 'INCREASE_BUFFER' | 'REDUCE_BUFFER';
  status: 'PENDING' | 'APPLIED' | 'DISMISSED';
}
