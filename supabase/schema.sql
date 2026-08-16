-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- to set up the tables the studio site needs.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- bookings: consultation requests from the /booking flow
-- ---------------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  service_type text not null check (
    service_type in ('web-design', 'development', 'branding', '3d-animation')
  ),
  date date not null,
  time_slot text not null,
  message text,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'completed', 'cancelled')
  ),
  -- A long random code, private to the person who booked. Emailed to
  -- them as part of their confirmation link (/booking-status/CODE) so
  -- they can check their own booking's status without any account or
  -- password. Not guessable like an email address would be.
  private_code text not null unique default encode(gen_random_bytes(16), 'hex'),
  -- prevents two people double-booking the exact same slot at the DB level
  unique (date, time_slot)
);

-- If you already ran an earlier version of this schema, run this to add
-- the new column to your existing bookings table (safe to re-run):
alter table bookings
  add column if not exists private_code text unique
  default encode(gen_random_bytes(16), 'hex');
alter table bookings alter column private_code set not null;

-- ---------------------------------------------------------------
-- inquiries: general contact-form submissions (not ready to book)
-- ---------------------------------------------------------------
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null
);

-- ---------------------------------------------------------------
-- projects: case studies shown on /work
-- ---------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  cover_image text,
  tags text[],
  case_study_content jsonb
);

-- ---------------------------------------------------------------
-- slot_locks: a PII-free mirror of (date, time_slot) used only for
-- availability + realtime. Supabase Realtime broadcasts the FULL row
-- to subscribers, so we never put bookings itself on the realtime
-- publication — that would leak name/email/message to anyone
-- listening on the channel. This table exists purely so the booking
-- page can query and subscribe to something safe to expose.
-- ---------------------------------------------------------------
create table if not exists slot_locks (
  date date not null,
  time_slot text not null,
  primary key (date, time_slot)
);

create or replace function sync_slot_lock()
returns trigger as $$
begin
  insert into slot_locks (date, time_slot)
  values (new.date, new.time_slot)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger bookings_lock_slot
  after insert on bookings
  for each row execute function sync_slot_lock();

-- ---------------------------------------------------------------
-- Row Level Security
-- Public site can INSERT bookings/inquiries but never read them back
-- (only the admin, via the service role key or an authenticated
-- admin session, should be able to SELECT bookings directly).
-- slot_locks is readable by anyone — it carries no personal data.
-- ---------------------------------------------------------------
alter table bookings enable row level security;
alter table inquiries enable row level security;
alter table projects enable row level security;
alter table slot_locks enable row level security;

create policy "Anyone can submit a booking"
  on bookings for insert
  to anon
  with check (true);

create policy "Anyone can read slot availability"
  on slot_locks for select
  to anon
  using (true);

create policy "Anyone can submit an inquiry"
  on inquiries for insert
  to anon
  with check (true);

create policy "Anyone can read published projects"
  on projects for select
  to anon
  using (true);

-- ---------------------------------------------------------------
-- Realtime: broadcast slot_locks changes so the booking page can
-- show "this slot was just taken" live, without exposing PII.
-- ---------------------------------------------------------------
alter publication supabase_realtime add table slot_locks;
