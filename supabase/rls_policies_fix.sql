-- Fix RLS for qualifier_submissions
-- Run this in Supabase SQL Editor if candidates get:
-- "new row violates row-level security policy for table qualifier_submissions"
--
-- Causes:
-- 1. Missing insert/update policies for anon
-- 2. Admin logged in on same browser — inserts run as "authenticated", not "anon"

alter table public.qualifier_submissions enable row level security;

-- Candidates (anon OR logged-in admin on same browser) can start & save submissions
drop policy if exists "anon can insert qualifier submissions" on public.qualifier_submissions;
drop policy if exists "anon can update qualifier submissions" on public.qualifier_submissions;
drop policy if exists "public can insert qualifier submissions" on public.qualifier_submissions;
drop policy if exists "public can update qualifier submissions" on public.qualifier_submissions;

create policy "public can insert qualifier submissions"
  on public.qualifier_submissions
  for insert
  to public
  with check (true);

create policy "public can update qualifier submissions"
  on public.qualifier_submissions
  for update
  to public
  using (true)
  with check (true);

-- Only admins can read submissions (no public/anon read).
-- Important: the candidate app must NOT use .select() after insert/update —
-- that requires SELECT permission which only admins have.
drop policy if exists "anon can select qualifier submissions" on public.qualifier_submissions;
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
