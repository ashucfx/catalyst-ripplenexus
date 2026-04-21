-- ─── BOOKING SYSTEM SCHEMA ──────────────────────────────────────────────────
-- Run this AFTER schema.sql (which creates the other 5 tables)

-- Meeting types: audit (paid), strategy (free), blueprint (free)
CREATE TABLE IF NOT EXISTS meeting_types (
  id            TEXT PRIMARY KEY,               -- 'audit', 'strategy', 'blueprint'
  name          TEXT NOT NULL,
  duration_min  INTEGER NOT NULL DEFAULT 45,
  price_usd     INTEGER NOT NULL DEFAULT 0,     -- cents
  price_inr     INTEGER NOT NULL DEFAULT 0,     -- paise
  description   TEXT NOT NULL DEFAULT '',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE meeting_types ENABLE ROW LEVEL SECURITY;

-- Availability rules: which days/hours the admin is available
CREATE TABLE IF NOT EXISTS availability_rules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun
  start_time    TEXT NOT NULL,  -- 'HH:MM' in admin timezone
  end_time      TEXT NOT NULL,  -- 'HH:MM' in admin timezone
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;

-- Blocked specific dates (holidays, vacations)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date  DATE NOT NULL UNIQUE,
  reason        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_type_id TEXT NOT NULL REFERENCES meeting_types(id),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  company         TEXT,
  message         TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  timezone        TEXT NOT NULL,              -- client's IANA tz
  status          TEXT NOT NULL DEFAULT 'pending_payment'
                  CHECK (status IN ('pending_payment','confirmed','cancelled','no_show')),
  payment_id      TEXT,                       -- Razorpay/PayPal capture ID
  payment_method  TEXT,                       -- 'razorpay' | 'paypal' | null (free)
  cancel_token    TEXT UNIQUE,                -- HMAC-signed token for self-cancel
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT,
  reminder_1h_sent  BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_24h_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS bookings_no_double_book_idx 
  ON bookings (starts_at) 
  WHERE status IN ('confirmed', 'pending_payment');

CREATE INDEX IF NOT EXISTS bookings_starts_at_idx   ON bookings (starts_at);
CREATE INDEX IF NOT EXISTS bookings_email_idx        ON bookings (email);
CREATE INDEX IF NOT EXISTS bookings_status_idx       ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_cancel_token_idx ON bookings (cancel_token);

-- ─── SEED DATA ───────────────────────────────────────────────────────────────

INSERT INTO meeting_types (id, name, duration_min, price_usd, price_inr, description) VALUES
  ('audit',     'Market Value Audit',    45, 49900, 1499900,  'A 45-minute positioning diagnostic. Surfaces your Talent Positioning Index, ATS gap profile, and salary benchmark vs. market.'),
  ('strategy',  'Strategy Call',         30, 0,     0,         'A free 30-minute call to explore if Catalyst is the right fit for your career goals.'),
  ('blueprint', 'Blueprint Session',     60, 0,     0,         'A free 60-minute deep-dive session for executive career architecture planning.')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  duration_min = EXCLUDED.duration_min,
  price_usd    = EXCLUDED.price_usd,
  price_inr    = EXCLUDED.price_inr,
  description  = EXCLUDED.description;

-- Default availability: Mon–Fri, 10:00–18:00 IST
INSERT INTO availability_rules (day_of_week, start_time, end_time) VALUES
  (1, '10:00', '18:00'),
  (2, '10:00', '18:00'),
  (3, '10:00', '18:00'),
  (4, '10:00', '18:00'),
  (5, '10:00', '18:00')
ON CONFLICT DO NOTHING;
