-- Add phone number collection to newsletter_subscribers and platform_waitlist
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT NULL;

ALTER TABLE platform_waitlist
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT NULL;
