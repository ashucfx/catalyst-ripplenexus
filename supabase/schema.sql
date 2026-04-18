-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- All tables use UUIDs and timestamptz. Enable RLS in production per table.

create table if not exists newsletter_subscribers (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  email      text        not null unique
);

create table if not exists tpi_submissions (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  email      text        not null,
  score      integer     not null check (score between 0 and 100),
  seniority  text,
  geography  text,
  salary_band text,
  last_raise text,
  sector     text,
  gaps       text[],
  annual_cost text
);

create table if not exists leads (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name       text        not null,
  email      text        not null,
  role       text,
  seniority  text,
  geography  text,
  goals      text[],
  service    text,
  context    text,
  timeline   text,
  referral   text
);

create table if not exists payments (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  email      text        not null,
  product    text        not null,
  method     text        not null check (method in ('razorpay', 'paypal')),
  amount     numeric(10,2),
  currency   text        not null,
  payment_id text        not null unique,
  order_id   text,
  status     text        not null default 'completed'
);

create table if not exists platform_waitlist (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  email      text        not null unique,
  plan       text
);

-- Indexes for common query patterns
create index if not exists idx_tpi_email    on tpi_submissions (email);
create index if not exists idx_leads_email  on leads (email);
create index if not exists idx_payments_email on payments (email);
