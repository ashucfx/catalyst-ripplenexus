-- Audit Portal: tracks paid one-time access and LLM-generated reports
CREATE TABLE IF NOT EXISTS audit_portals (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token               TEXT        UNIQUE NOT NULL,
  email               TEXT        NOT NULL,
  payment_id          TEXT        NOT NULL UNIQUE,   -- one portal per payment, enforced at DB level
  status              TEXT        NOT NULL DEFAULT 'pending',
  -- status values: 'pending' (paid, no intake yet) | 'ready' (report generated)
  intake_data         JSONB,
  report_data         JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  report_generated_at TIMESTAMPTZ
);

-- RLS: server-only access via service_role_key; no client-side reads allowed
ALTER TABLE audit_portals ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS audit_portals_token_idx      ON audit_portals(token);
CREATE INDEX IF NOT EXISTS audit_portals_email_idx      ON audit_portals(email);
CREATE INDEX IF NOT EXISTS audit_portals_payment_id_idx ON audit_portals(payment_id);
