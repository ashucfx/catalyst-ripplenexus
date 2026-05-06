-- Migration: enforce payment integrity on audit_portals
-- Run once in Supabase Dashboard → SQL Editor

-- 1. Make payment_id NOT NULL (backfill any nulls first if they exist)
UPDATE audit_portals SET payment_id = 'legacy_' || id::text WHERE payment_id IS NULL;
ALTER TABLE audit_portals ALTER COLUMN payment_id SET NOT NULL;

-- 2. Add UNIQUE constraint so createPortalIfNotExists is race-safe at DB level
ALTER TABLE audit_portals ADD CONSTRAINT audit_portals_payment_id_key UNIQUE (payment_id);

-- 3. Enable RLS — portal data contains personal career/salary info; block anon key reads
ALTER TABLE audit_portals ENABLE ROW LEVEL SECURITY;

-- 4. Add index for payment_id lookups (used by createPortalIfNotExists)
CREATE INDEX IF NOT EXISTS audit_portals_payment_id_idx ON audit_portals(payment_id);
