import { CurrencyProfile } from './types';
import { getDb } from '@/lib/db/supabase';

export const DEFAULT_CURRENCY_PROFILES: Record<string, CurrencyProfile> = {
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: true,
    default_settlement_currency: 'INR',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: true,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    minor_unit: 2,
    is_receiving_currency: false,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'MULTI_HOP',
    multi_hop_intermediary: 'USD',
    is_active: true,
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'AU$',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    minor_unit: 2,
    is_receiving_currency: true,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    minor_unit: 0,
    is_receiving_currency: false,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: null,
    is_active: true,
  },
};

export async function getCurrencyProfile(currencyCode: string): Promise<CurrencyProfile> {
  const code = currencyCode.toUpperCase();
  const db = getDb();

  try {
    if (db) {
      const { data, error } = await db
        .from('currency_profiles')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (data && !error) {
        return data as CurrencyProfile;
      }
    }
  } catch (err) {
    console.warn(`[CurrencyProfile] Fallback to in-memory for ${code}:`, err);
  }

  if (DEFAULT_CURRENCY_PROFILES[code]) {
    return DEFAULT_CURRENCY_PROFILES[code];
  }

  // Generic fallback for any other ISO currency
  return {
    code,
    name: code,
    symbol: code,
    minor_unit: 2,
    is_receiving_currency: false,
    is_settlement_currency: false,
    default_settlement_currency: 'USD',
    fx_route_mode: 'DIRECT',
    multi_hop_intermediary: 'USD',
    is_active: true,
  };
}
