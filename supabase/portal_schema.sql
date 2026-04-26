-- Audit Portal: tracks paid one-time access and LLM-generated reports
CREATE TABLE IF NOT EXISTS audit_portals (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token               TEXT        UNIQUE NOT NULL,
  email               TEXT        NOT NULL,
  payment_id          TEXT,
  status              TEXT        NOT NULL DEFAULT 'pending',
  -- status values: 'pending' (paid, no intake yet) | 'ready' (report generated)
  intake_data         JSONB,
  report_data         JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  report_generated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS audit_portals_token_idx ON audit_portals(token);
CREATE INDEX IF NOT EXISTS audit_portals_email_idx ON audit_portals(email);
