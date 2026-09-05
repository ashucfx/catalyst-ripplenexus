/**
 * Bank Transfer Library
 *
 * Handles international bank transfer instructions, reconciliation references,
 * and currency→rail mapping for the Razorpay MoneySaver receiving accounts.
 *
 * Account details are stored in the international_bank_accounts table
 * (configured by admin from Razorpay dashboard — never auto-created via API).
 */

import { randomBytes } from 'crypto'
import { getDb } from '@/lib/db/supabase'

// ── Currency → Transfer Rail ────────────────────────────────────────────────

export const CURRENCY_RAIL: Record<string, { rail: string; clientLabel: string; symbol: string }> = {
  USD: { rail: 'ACH',   clientLabel: 'ACH Bank Transfer',        symbol: '$'  },
  GBP: { rail: 'FPS',   clientLabel: 'UK Bank Transfer',          symbol: '£'  },
  EUR: { rail: 'SEPA',  clientLabel: 'SEPA Bank Transfer',        symbol: '€'  },
  CAD: { rail: 'EFT',   clientLabel: 'Canadian Bank Transfer',    symbol: 'CA$' },
  AUD: { rail: 'NPP',   clientLabel: 'Australian Bank Transfer',  symbol: 'A$' },
  DKK: { rail: 'LOCAL', clientLabel: 'Danish Bank Transfer',      symbol: 'kr.' },
  AED: { rail: 'LOCAL', clientLabel: 'UAE Bank Transfer',         symbol: 'AED' },
  SGD: { rail: 'LOCAL', clientLabel: 'Singapore Bank Transfer',   symbol: 'S$' },
  CNY: { rail: 'LOCAL', clientLabel: 'China Bank Transfer',       symbol: '¥'  },
  CHF: { rail: 'SWIFT', clientLabel: 'Swiss Bank Transfer',       symbol: 'CHF' },
  SEK: { rail: 'LOCAL', clientLabel: 'Swedish Bank Transfer',     symbol: 'kr' },
}

// Fallback for any currency not in the map above
export const SWIFT_FALLBACK = { rail: 'SWIFT', clientLabel: 'International Wire Transfer', symbol: '' }

export function getCurrencyInfo(currency: string) {
  return CURRENCY_RAIL[currency.toUpperCase()] ?? SWIFT_FALLBACK
}

// ── Bank Account Type ────────────────────────────────────────────────────────

export interface BankAccount {
  id:                    string
  currency:              string
  rail:                  string
  status:                'active' | 'coming_soon' | 'requested' | 'disabled'
  account_name:          string
  bank_name:             string | null
  account_number:        string | null
  iban:                  string | null
  sort_code:             string | null
  routing_number:        string | null
  swift_bic:             string | null
  reference_instructions: string | null
  additional_notes:      string | null
  created_at:            string
  updated_at:            string
}

export interface BankTransferInstruction {
  id:                 string
  reconciliation_ref: string
  product:            string
  email:              string
  currency:           string
  amount:             number
  bank_account_id:    string | null
  status:             'pending' | 'received' | 'settled' | 'manually_reconciled' | 'expired'
  matched_payment_id: string | null
  notes:              string | null
  client_confirmed_at:    string | null
  client_sender_bank:     string | null
  client_transaction_ref: string | null
  client_notes:           string | null
  created_at:         string
  updated_at:         string
}

// ── Reconciliation Reference Generator ──────────────────────────────────────

const PREFIX = process.env.BANK_TRANSFER_REF_PREFIX ?? 'RN'

/**
 * Generates a unique reconciliation reference.
 * Format: RN-YYYYMMDD-XXXXXX (6 alphanumeric, uppercase, no ambiguous chars)
 * Example: RN-20260823-A4K2M9
 */
export function generateReconciliationRef(): string {
  const today = new Date()
  const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '')
  // Use 4 random bytes → 8 hex chars → take first 6, uppercase
  const random = randomBytes(4).toString('hex').toUpperCase().slice(0, 6)
  return `${PREFIX}-${yyyymmdd}-${random}`
}

// ── DB Operations ────────────────────────────────────────────────────────────

/**
 * Fetch the active bank account for a given currency.
 * Returns null if no active account is configured.
 */
export async function getActiveAccount(currency: string): Promise<BankAccount | null> {
  const db = getDb()
  if (!db) return null
  const { data, error } = await db
    .from('international_bank_accounts')
    .select('*')
    .eq('currency', currency.toUpperCase())
    .eq('status', 'active')
    .maybeSingle()
  if (error) {
    console.error('[bankTransfer] getActiveAccount error:', error.message)
    return null
  }
  return data as BankAccount | null
}

/**
 * Fetch all bank accounts (all statuses) — for admin display.
 */
export async function getAllAccounts(): Promise<BankAccount[]> {
  const db = getDb()
  if (!db) return []
  const { data, error } = await db
    .from('international_bank_accounts')
    .select('*')
    .order('currency', { ascending: true })
  if (error) {
    console.error('[bankTransfer] getAllAccounts error:', error.message)
    return []
  }
  return (data ?? []) as BankAccount[]
}

/**
 * Create a bank transfer instruction record.
 * Retries up to 3 times if the generated reference collides (extremely unlikely).
 */
export async function createBankTransferInstruction(params: {
  product:        string
  email:          string
  currency:       string
  amount:         number
  bankAccountId:  string | null
}): Promise<BankTransferInstruction> {
  const db = getDb()
  if (!db) throw new Error('Database not configured')

  for (let attempt = 0; attempt < 3; attempt++) {
    const reconciliation_ref = generateReconciliationRef()
    const { data, error } = await db
      .from('bank_transfer_instructions')
      .insert({
        reconciliation_ref,
        product:         params.product,
        email:           params.email,
        currency:        params.currency.toUpperCase(),
        amount:          params.amount,
        bank_account_id: params.bankAccountId,
        status:          'pending',
      })
      .select('*')
      .single()

    if (!error && data) return data as BankTransferInstruction
    if (error && error.code !== '23505') throw new Error(`createBankTransferInstruction: ${error.message}`)
    // 23505 = unique violation on reconciliation_ref — retry with new ref
  }
  throw new Error('Failed to generate unique reconciliation reference after 3 attempts')
}

/**
 * Fetch a bank transfer instruction by its reconciliation reference.
 */
export async function getBankTransferInstruction(ref: string): Promise<BankTransferInstruction | null> {
  const db = getDb()
  if (!db) return null
  const { data, error } = await db
    .from('bank_transfer_instructions')
    .select('*')
    .eq('reconciliation_ref', ref)
    .maybeSingle()
  if (error) {
    console.error('[bankTransfer] getBankTransferInstruction error:', error.message)
    return null
  }
  return data as BankTransferInstruction | null
}

/**
 * List pending bank transfer instructions — for admin reconciliation queue.
 */
export async function getPendingInstructions(limit = 100): Promise<BankTransferInstruction[]> {
  const db = getDb()
  if (!db) return []
  const { data, error } = await db
    .from('bank_transfer_instructions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[bankTransfer] getPendingInstructions error:', error.message)
    return []
  }
  return (data ?? []) as BankTransferInstruction[]
}

/**
 * Mark a bank transfer instruction as manually reconciled and link to the payment UUID.
 */
export async function reconcileInstruction(params: {
  ref:          string
  paymentUuid?: string | null
  notes?:       string
}): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Database not configured')

  let matchedId = params.paymentUuid ?? null

  // Fallback: if UUID wasn't passed directly, resolve from payments by reconciliation_ref
  if (!matchedId) {
    const { data: p } = await db
      .from('payments')
      .select('id')
      .eq('reconciliation_ref', params.ref)
      .maybeSingle()
    if (p?.id) matchedId = p.id
  }

  const { error } = await db
    .from('bank_transfer_instructions')
    .update({
      status:             'manually_reconciled',
      matched_payment_id: matchedId,
      notes:              params.notes ?? null,
      updated_at:         new Date().toISOString(),
    })
    .eq('reconciliation_ref', params.ref)
  if (error) throw new Error(`reconcileInstruction: ${error.message}`)
}

/**
 * Format an amount with its currency symbol.
 */
export function formatAmount(amount: number, currency: string): string {
  const info = getCurrencyInfo(currency)
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${info.symbol}${formatted} ${currency.toUpperCase()}`
}
