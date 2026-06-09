-- Admin access for /admin dashboard
-- Passwords are stored securely in Supabase Auth (not in this table).
--
-- Setup steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Supabase Dashboard → Authentication → Users → Add user (email + password)
-- 3. Insert the same email here:
--    insert into public.admins (email) values ('admin@ottermap.com');

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row"
  on public.admins
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Only admins can read submissions (remove public read access)
drop policy if exists "anon can select qualifier submissions" on public.qualifier_submissions;

-- Ensure candidates can still insert/update (including when admin session is active in same browser)
drop policy if exists "public can insert qualifier submissions" on public.qualifier_submissions;
create policy "public can insert qualifier submissions"
  on public.qualifier_submissions
  for insert
  to public
  with check (true);

drop policy if exists "public can update qualifier submissions" on public.qualifier_submissions;
create policy "public can update qualifier submissions"
  on public.qualifier_submissions
  for update
  to public
  using (true)
  with check (true);

drop policy if exists "admins can read submissions" on public.qualifier_submissions;
create policy "admins can read submissions"
  on public.qualifier_submissions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where lower(admins.email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Helper: check if an email is an admin (used after login)
create or replace function public.is_admin(check_email text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(check_email)
  );
$$;

grant execute on function public.is_admin(text) to authenticated;
