-- Migration: internal newsletter system (replaces ConvertKit)
-- Run once in Supabase Dashboard → SQL Editor

-- 1. Enhance newsletter_subscribers
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT;
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

-- 2. Backfill unsubscribe_token for existing rows (uses pgcrypto extension, enabled by default in Supabase)
UPDATE newsletter_subscribers
SET unsubscribe_token = encode(gen_random_bytes(32), 'hex')
WHERE unsubscribe_token IS NULL;

-- 3. Now make it NOT NULL + UNIQUE
ALTER TABLE newsletter_subscribers ALTER COLUMN unsubscribe_token SET NOT NULL;
ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_token_key UNIQUE (unsubscribe_token);

-- 4. Create campaigns table
CREATE TABLE IF NOT EXISTS newsletters (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  subject     TEXT        NOT NULL,
  html        TEXT        NOT NULL,
  segment     TEXT[],                           -- NULL = all active; ['tpi_lead'] = segment only
  sent_count  INTEGER     NOT NULL DEFAULT 0,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS newsletter_subscribers_token_idx   ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx  ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_tags_idx    ON newsletter_subscribers USING GIN(tags);
CREATE INDEX IF NOT EXISTS newsletters_created_at_idx         ON newsletters(created_at DESC);
