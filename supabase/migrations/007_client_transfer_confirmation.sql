-- ══════════════════════════════════════════════════════════════════════
-- Migration 007: Client Transfer Confirmation Details
-- Adds columns to track when a client reports they have sent a transfer.
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE bank_transfer_instructions
  ADD COLUMN IF NOT EXISTS client_confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS client_sender_bank TEXT,
  ADD COLUMN IF NOT EXISTS client_transaction_ref TEXT,
  ADD COLUMN IF NOT EXISTS client_notes TEXT;
