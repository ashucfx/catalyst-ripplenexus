import { CostProfile, PaymentProvider, PaymentRail, Brand } from './types';
import { getDb } from '@/lib/db/supabase';

export const DEFAULT_COST_PROFILES: Record<string, CostProfile> = {
  RAZORPAY_DOMESTIC_INR: {
    id: 'RAZORPAY_DOMESTIC_INR',
    brand: 'catalyst',
    provider: 'razorpay',
    rail_type: 'domestic_card',
    currency: 'INR',
    percentage_fee: 0.02, // 2.0%
    fixed_fee: 0.0,
    fx_spread_percentage: 0.0,
    intermediary_fixed_fee: 0.0,
    dispute_reserve_rate: 0.0,
    risk_buffer_percentage: 0.005, // 0.5% safety buffer
    min_charge_amount: 100.0,
    is_active: true,
  },
  RAZORPAY_INTL_CARD: {
    id: 'RAZORPAY_INTL_CARD',
    brand: 'catalyst',
    provider: 'razorpay',
    rail_type: 'intl_card',
    currency: 'ALL',
    percentage_fee: 0.03, // 3.0% international card fee
    fixed_fee: 0.0,
    fx_spread_percentage: 0.02, // 2.0% currency conversion markup
    intermediary_fixed_fee: 0.0,
    dispute_reserve_rate: 0.005, // 0.5% dispute reserve
    risk_buffer_percentage: 0.01, // 1.0% FX volatility buffer
    min_charge_amount: 10.0,
    is_active: true,
  },
  PAYPAL_STANDARD: {
    id: 'PAYPAL_STANDARD',
    brand: 'catalyst',
    provider: 'paypal',
    rail_type: 'wallet',
    currency: 'USD',
    percentage_fee: 0.044, // 4.4% cross-border standard
    fixed_fee: 0.30, // $0.30 fixed fee
    fx_spread_percentage: 0.035, // 3.5% PayPal FX spread
    intermediary_fixed_fee: 0.0,
    dispute_reserve_rate: 0.005, // 0.5% dispute reserve
    risk_buffer_percentage: 0.01, // 1.0% safety buffer
    min_charge_amount: 5.0,
    is_active: true,
  },
  BANK_TRANSFER_FPS: {
    id: 'BANK_TRANSFER_FPS',
    brand: 'catalyst',
    provider: 'bank_transfer',
    rail_type: 'bank_wire',
    currency: 'GBP',
    percentage_fee: 0.0,
    fixed_fee: 0.0,
    fx_spread_percentage: 0.005, // 0.5% local clearing spread
    intermediary_fixed_fee: 0.0,
    dispute_reserve_rate: 0.0,
    risk_buffer_percentage: 0.0025, // 0.25% buffer
    min_charge_amount: 50.0,
    is_active: true,
  },
  BANK_TRANSFER_ACH: {
    id: 'BANK_TRANSFER_ACH',
    brand: 'catalyst',
    provider: 'bank_transfer',
    rail_type: 'ach',
    currency: 'USD',
    percentage_fee: 0.0,
    fixed_fee: 0.0,
    fx_spread_percentage: 0.005,
    intermediary_fixed_fee: 0.0,
    dispute_reserve_rate: 0.0,
    risk_buffer_percentage: 0.0025,
    min_charge_amount: 50.0,
    is_active: true,
  },
  BANK_TRANSFER_SEPA: {
    id: 'BANK_TRANSFER_SEPA',
    brand: 'catalyst',
    provider: 'bank_transfer',
    rail_type: 'sepa',
    currency: 'EUR',
    percentage_fee: 0.0,
    fixed_fee: 0.0,
    fx_spread_percentage: 0.005,
    intermediary_fixed_fee: 0.0,
    dispute_reserve_rate: 0.0,
    risk_buffer_percentage: 0.0025,
    min_charge_amount: 50.0,
    is_active: true,
  },
  BANK_TRANSFER_SWIFT_WIRE: {
    id: 'BANK_TRANSFER_SWIFT_WIRE',
    brand: 'catalyst',
    provider: 'bank_transfer',
    rail_type: 'bank_wire',
    currency: 'ALL',
    percentage_fee: 0.0,
    fixed_fee: 0.0,
    fx_spread_percentage: 0.015, // 1.5% FX spread
    intermediary_fixed_fee: 15.0, // $15 correspondent bank fee
    dispute_reserve_rate: 0.0,
    risk_buffer_percentage: 0.0075, // 0.75% safety buffer
    min_charge_amount: 100.0,
    is_active: true,
  },
};

/**
 * Resolves the appropriate CostProfile based on provider, client currency, and rail type.
 * Queries Supabase `cost_profiles` table, falling back to DEFAULT_COST_PROFILES.
 */
export async function resolveCostProfile(params: {
  provider: PaymentProvider;
  currency: string;
  railType?: PaymentRail;
  brand?: Brand;
  customProfileId?: string;
}): Promise<CostProfile> {
  const { provider, currency, railType, customProfileId } = params;
  const curr = currency.toUpperCase();
  const db = getDb();

  // 1. If explicit profile ID provided, look it up
  if (customProfileId) {
    try {
      if (db) {
        const { data, error } = await db
          .from('cost_profiles')
          .select('*')
          .eq('id', customProfileId)
          .eq('is_active', true)
          .maybeSingle();

        if (data && !error) return data as CostProfile;
      }
    } catch {
      // ignore, proceed to fallback
    }
    if (DEFAULT_COST_PROFILES[customProfileId]) {
      return DEFAULT_COST_PROFILES[customProfileId];
    }
  }

  // 2. Try DB match for provider + currency or provider + ALL
  try {
    if (db) {
      const { data, error } = await db
        .from('cost_profiles')
        .select('*')
        .eq('provider', provider)
        .eq('is_active', true)
        .in('currency', [curr, 'ALL']);

      if (data && !error && data.length > 0) {
        // Prefer exact currency match, then matching railType
        const profiles = data as CostProfile[];
        const exactMatch = profiles.find((p: CostProfile) => p.currency === curr && (!railType || p.rail_type === railType));
        if (exactMatch) return exactMatch;

        const currMatch = profiles.find((p: CostProfile) => p.currency === curr);
        if (currMatch) return currMatch;

        const anyMatch = profiles.find((p: CostProfile) => !railType || p.rail_type === railType);
        if (anyMatch) return anyMatch;

        return profiles[0];
      }
    }
  } catch (err) {
    console.warn('[CostProfile] Falling back to default profiles:', err);
  }

  // 3. In-memory baseline resolution
  if (provider === 'razorpay') {
    if (curr === 'INR') return DEFAULT_COST_PROFILES.RAZORPAY_DOMESTIC_INR;
    return DEFAULT_COST_PROFILES.RAZORPAY_INTL_CARD;
  }

  if (provider === 'paypal') {
    return DEFAULT_COST_PROFILES.PAYPAL_STANDARD;
  }

  if (provider === 'bank_transfer') {
    if (curr === 'GBP') return DEFAULT_COST_PROFILES.BANK_TRANSFER_FPS;
    if (curr === 'USD') return DEFAULT_COST_PROFILES.BANK_TRANSFER_ACH;
    if (curr === 'EUR') return DEFAULT_COST_PROFILES.BANK_TRANSFER_SEPA;
    return DEFAULT_COST_PROFILES.BANK_TRANSFER_SWIFT_WIRE;
  }

  // Generic fallback
  return DEFAULT_COST_PROFILES.RAZORPAY_INTL_CARD;
}
