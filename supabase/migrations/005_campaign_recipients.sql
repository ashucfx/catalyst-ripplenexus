-- 005_campaign_recipients.sql
-- Tracks which subscribers received each campaign (for per-lead history + selective send)

create table if not exists campaign_recipients (
  id          uuid        primary key default gen_random_uuid(),
  campaign_id uuid        not null references newsletters(id) on delete cascade,
  email       text        not null,
  sent_at     timestamptz not null default now()
);

create index if not exists campaign_recipients_campaign_idx on campaign_recipients (campaign_id);
create index if not exists campaign_recipients_email_idx    on campaign_recipients (email);
create unique index if not exists campaign_recipients_unique on campaign_recipients (campaign_id, email);
