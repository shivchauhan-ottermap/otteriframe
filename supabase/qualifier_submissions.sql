-- Run this in the Supabase SQL Editor before using the qualifier app.

create table if not exists public.qualifier_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_id text unique not null,
  name text not null,
  email text not null,
  phone text not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  time_used text,
  part_a text default '',
  part_b text default '',
  part_c1 text default '',
  part_c2 text default '',
  part_c3 text default '',
  part_d1 text default '',
  part_d2 text default '',
  part_e text default '',
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'expired'))
);

alter table public.qualifier_submissions enable row level security;

drop policy if exists "anon can insert qualifier submissions" on public.qualifier_submissions;
drop policy if exists "public can insert qualifier submissions" on public.qualifier_submissions;
create policy "public can insert qualifier submissions"
  on public.qualifier_submissions
  for insert
  to public
  with check (true);

drop policy if exists "anon can update qualifier submissions" on public.qualifier_submissions;
drop policy if exists "public can update qualifier submissions" on public.qualifier_submissions;
create policy "public can update qualifier submissions"
  on public.qualifier_submissions
  for update
  to public
  using (true)
  with check (true);

-- No public read — admins only (see supabase/admins.sql)
drop policy if exists "anon can select qualifier submissions" on public.qualifier_submissions;
