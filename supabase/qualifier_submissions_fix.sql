-- Run this in the Supabase SQL Editor if answer columns are missing or updates fail.

alter table public.qualifier_submissions add column if not exists part_a text default '';
alter table public.qualifier_submissions add column if not exists part_b text default '';
alter table public.qualifier_submissions add column if not exists part_c1 text default '';
alter table public.qualifier_submissions add column if not exists part_c2 text default '';
alter table public.qualifier_submissions add column if not exists part_c3 text default '';
alter table public.qualifier_submissions add column if not exists part_d1 text default '';
alter table public.qualifier_submissions add column if not exists part_d2 text default '';
alter table public.qualifier_submissions add column if not exists part_e text default '';
alter table public.qualifier_submissions add column if not exists submitted_at timestamptz;
alter table public.qualifier_submissions add column if not exists time_used text;
alter table public.qualifier_submissions add column if not exists status text default 'in_progress';

-- Insert/update for all roles (anon + authenticated)
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
