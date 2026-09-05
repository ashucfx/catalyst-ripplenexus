/**
 * Payment Method Engine
 *
 * Determines which payment methods are available for a given country and currency.
 * This is the single source of truth for payment routing.
 *
 * Rules:
 *   India (country === 'IN')  → Razorpay INR only (existing checkout.js flow)
 *   International             → Razorpay card (invoice currency) + PayPal + Bank Transfer
 *
 * Bank transfer is only shown when there is an 'active' account configured
 * in the international_bank_accounts table for the invoice currency.
 */

import { getActiveAccount } from '@/lib/payment/bankTransfer'
import type { BankAccount } from '@/lib/payment/bankTransfer'

export type PaymentMethods = {
  /** India only — Razorpay checkout.js (INR, supports UPI/cards/net banking/wallets) */
  razorpayINR: boolean

  /** International — Razorpay card order in invoice currency */
  razorpayCard: boolean

  /** International — PayPal (USD by default, handles currency conversion) */
  paypal: boolean

  /** International — Bank transfer if an active account is configured for this currency */
  bankTransfer: {
    available:   boolean
    account:     BankAccount | null
    rail:        string       // FPS, ACH, SEPA, NPP, EFT, LOCAL, SWIFT
    clientLabel: string       // "UK Bank Transfer", "ACH Bank Transfer", etc.
    symbol:      string       // Currency symbol for display
  }
}

/**
 * Resolve which payment methods are available for a client.
 *
 * @param country  ISO 3166-1 alpha-2 country code (e.g. 'IN', 'GB', 'US')
 * @param currency ISO 4217 currency code (e.g. 'GBP', 'USD', 'EUR')
 */
export async function getPaymentMethods(
  country: string,
  currency: string,
): Promise<PaymentMethods> {
  const isIndia = country.toUpperCase() === 'IN'

  if (isIndia) {
    return {
      razorpayINR:  true,
      razorpayCard: false,
      paypal:       false,
      bankTransfer: { available: false, account: null, rail: '', clientLabel: '', symbol: '' },
    }
  }

  // International: look up bank account in parallel
  const account = await getActiveAccount(currency)

  // Determine rail info from currency
  const { CURRENCY_RAIL, SWIFT_FALLBACK } = await import('@/lib/payment/bankTransfer')
  const currencyInfo = CURRENCY_RAIL[currency.toUpperCase()] ?? SWIFT_FALLBACK

  return {
    razorpayINR:  false,
    razorpayCard: true,   // Always available for international — account has intl enabled
    paypal:       true,   // Always available for international
    bankTransfer: {
      available:   !!account,
      account:     account,
      rail:        currencyInfo.rail,
      clientLabel: currencyInfo.clientLabel,
      symbol:      currencyInfo.symbol,
    },
  }
}

/**
 * Lightweight sync version for server-side rendering when DB lookup isn't needed.
 * Use getPaymentMethods() for accurate bank transfer availability.
 */
export function getBasicPaymentMethods(country: string): {
  razorpayINR: boolean
  razorpayCard: boolean
  paypal: boolean
} {
  const isIndia = country.toUpperCase() === 'IN'
  return {
    razorpayINR:  isIndia,
    razorpayCard: !isIndia,
    paypal:       !isIndia,
  }
}
