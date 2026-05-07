-- 004_crm_contacts.sql
-- Per-contact CRM record: status, notes, manual override, soft-delete

create table if not exists crm_contacts (
  id               uuid        primary key default gen_random_uuid(),
  email            text        not null unique,
  status           text        not null default 'lead'
                               check (status in ('lead', 'warm', 'qualified', 'cold', 'churned')),
  notes            text,
  manual_override  boolean     not null default false,
  deleted          boolean     not null default false,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists crm_contacts_email_idx   on crm_contacts (email);
create index if not exists crm_contacts_status_idx  on crm_contacts (status) where not deleted;
create index if not exists crm_contacts_deleted_idx on crm_contacts (deleted);
