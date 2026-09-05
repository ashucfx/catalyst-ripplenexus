-- ══════════════════════════════════════════════════════════════════════
-- Migration 006: International Bank Transfer Support
-- Run once in Supabase Dashboard → SQL Editor → New query
-- Safe to run on production — all changes are additive
-- Existing payments rows are NOT affected
-- ══════════════════════════════════════════════════════════════════════

-- ── 1. Extend payments.method CHECK constraint ─────────────────────────
--    Adds 'bank_transfer' and 'razorpay_intl' to the allowed method values.
--    Existing rows (method='razorpay' or 'paypal') are unaffected.
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_method_check;
ALTER TABLE payments
  ADD CONSTRAINT payments_method_check
  CHECK (method IN ('razorpay', 'paypal', 'bank_transfer', 'razorpay_intl'));

-- ── 2. Add reconciliation_ref column to payments ───────────────────────
--    Used to link bank transfer instructions to payment records.
--    Nullable — only set for bank_transfer payments.
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS reconciliation_ref TEXT UNIQUE;

-- Index for reconciliation reference lookups
CREATE INDEX IF NOT EXISTS idx_payments_reconciliation_ref
  ON payments (reconciliation_ref)
  WHERE reconciliation_ref IS NOT NULL;

-- ── 3. Create international_bank_accounts table ────────────────────────
--    Admin-managed receiving accounts (configured from Razorpay dashboard).
--    No secrets stored here — only the bank account details shown to clients.
CREATE TABLE IF NOT EXISTS international_bank_accounts (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  currency               TEXT        NOT NULL,  -- GBP, USD, EUR, AUD, CAD, DKK, AED, SGD...
  rail                   TEXT        NOT NULL,  -- FPS, ACH, SEPA, NPP, EFT, LOCAL, SWIFT
  -- status values:
  --   active        → shown to clients when invoice currency matches
  --   coming_soon   → hidden from clients, shown in admin as planned
  --   requested     → in progress with provider (e.g. AED)
  --   disabled      → previously active, now turned off
  status                 TEXT        NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'coming_soon', 'requested', 'disabled')),
  account_name           TEXT        NOT NULL,  -- "Ripple Nexus"
  bank_name              TEXT,                  -- "Barclays UK"
  account_number         TEXT,                  -- Used for GBP FPS, USD ACH
  iban                   TEXT,                  -- Used for EUR SEPA
  sort_code              TEXT,                  -- GBP FPS
  routing_number         TEXT,                  -- USD ACH
  swift_bic              TEXT,                  -- SWIFT fallback
  reference_instructions TEXT,                  -- "Always include the RN- reference"
  additional_notes       TEXT,                  -- e.g. "Transfers typically take 1-2 business days"
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE international_bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bank_accounts_currency
  ON international_bank_accounts (currency);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_status
  ON international_bank_accounts (status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bank_accounts_currency_rail_active
  ON international_bank_accounts (currency, rail)
  WHERE status = 'active';

-- ── 4. Create bank_transfer_instructions table ─────────────────────────
--    One row per bank transfer payment attempt.
--    Stores the reconciliation reference and links to bank account + payment.
CREATE TABLE IF NOT EXISTS bank_transfer_instructions (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The reference shown to the client, e.g. RN-20260823-A4K2M9
  reconciliation_ref  TEXT        UNIQUE NOT NULL,
  product             TEXT        NOT NULL,  -- 'audit' | 'booking:UUID' | 'sprint' etc.
  email               TEXT        NOT NULL,
  currency            TEXT        NOT NULL,
  amount              NUMERIC(12,2) NOT NULL,
  bank_account_id     UUID        REFERENCES international_bank_accounts(id),
  -- status values:
  --   pending              → instructions generated, payment not yet received
  --   received             → payment confirmed (auto or manual)
  --   settled              → funds settled to our bank
  --   manually_reconciled  → admin manually matched and confirmed
  --   expired              → no payment received within 7 days
  status              TEXT        NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'received', 'settled', 'manually_reconciled', 'expired')),
  matched_payment_id  UUID        REFERENCES payments(id),
  notes               TEXT,       -- Admin notes on reconciliation
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bank_transfer_instructions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bti_ref
  ON bank_transfer_instructions (reconciliation_ref);
CREATE INDEX IF NOT EXISTS idx_bti_email
  ON bank_transfer_instructions (email);
CREATE INDEX IF NOT EXISTS idx_bti_status
  ON bank_transfer_instructions (status);
CREATE INDEX IF NOT EXISTS idx_bti_currency
  ON bank_transfer_instructions (currency);
CREATE INDEX IF NOT EXISTS idx_bti_created
  ON bank_transfer_instructions (created_at DESC);

-- ── 5. Pre-seed currency status reference data (admin guidance only) ───
--    Insert placeholder rows for coming-soon currencies so admin can see them.
--    These have status='coming_soon' and no account details.
--    Admin can update these to 'active' once accounts are ready.

-- AED: requested but not yet active
INSERT INTO international_bank_accounts (currency, rail, status, account_name)
VALUES ('AED', 'LOCAL', 'requested', 'Ripple Nexus')
ON CONFLICT DO NOTHING;

-- SGD, CNY, CHF, SEK: coming soon
INSERT INTO international_bank_accounts (currency, rail, status, account_name)
VALUES
  ('SGD', 'LOCAL',  'coming_soon', 'Ripple Nexus'),
  ('CNY', 'LOCAL',  'coming_soon', 'Ripple Nexus'),
  ('CHF', 'SWIFT',  'coming_soon', 'Ripple Nexus'),
  ('SEK', 'LOCAL',  'coming_soon', 'Ripple Nexus')
ON CONFLICT DO NOTHING;
