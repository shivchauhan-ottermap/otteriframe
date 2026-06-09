-- ============================================================
-- RUN THIS ENTIRE FILE in Supabase → SQL Editor (one time)
-- Then test with a fresh incognito window
-- ============================================================

-- 1. Table + columns
create table if not exists public.qualifier_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_id text unique not null,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
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

-- 2. RLS
alter table public.qualifier_submissions enable row level security;

drop policy if exists "anon can insert qualifier submissions" on public.qualifier_submissions;
drop policy if exists "anon can update qualifier submissions" on public.qualifier_submissions;
drop policy if exists "anon can select qualifier submissions" on public.qualifier_submissions;
drop policy if exists "public can insert qualifier submissions" on public.qualifier_submissions;
drop policy if exists "public can update qualifier submissions" on public.qualifier_submissions;
drop policy if exists "admins can read submissions" on public.qualifier_submissions;

create policy "public can insert qualifier submissions"
  on public.qualifier_submissions for insert to public with check (true);

create policy "public can update qualifier submissions"
  on public.qualifier_submissions for update to public using (true) with check (true);

create policy "admins can read submissions"
  on public.qualifier_submissions for select to authenticated
  using (
    exists (
      select 1 from public.admins
      where lower(admins.email) = lower(auth.jwt() ->> 'email')
    )
  );

-- 3. Save function (bypasses RLS — reliable upsert for answers + submit)
create or replace function public.save_qualifier_answers(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if payload->>'submission_id' is null or payload->>'submission_id' = '' then
    raise exception 'submission_id is required';
  end if;

  insert into public.qualifier_submissions (
    submission_id,
    name,
    email,
    phone,
    started_at,
    part_a,
    part_b,
    part_c1,
    part_c2,
    part_c3,
    part_d1,
    part_d2,
    part_e,
    status,
    submitted_at,
    time_used
  )
  values (
    payload->>'submission_id',
    coalesce(payload->>'name', ''),
    coalesce(payload->>'email', ''),
    coalesce(payload->>'phone', ''),
    coalesce((payload->>'started_at')::timestamptz, now()),
    coalesce(payload->>'part_a', ''),
    coalesce(payload->>'part_b', ''),
    coalesce(payload->>'part_c1', ''),
    coalesce(payload->>'part_c2', ''),
    coalesce(payload->>'part_c3', ''),
    coalesce(payload->>'part_d1', ''),
    coalesce(payload->>'part_d2', ''),
    coalesce(payload->>'part_e', ''),
    coalesce(payload->>'status', 'in_progress'),
    (payload->>'submitted_at')::timestamptz,
    payload->>'time_used'
  )
  on conflict (submission_id) do update set
    part_a = excluded.part_a,
    part_b = excluded.part_b,
    part_c1 = excluded.part_c1,
    part_c2 = excluded.part_c2,
    part_c3 = excluded.part_c3,
    part_d1 = excluded.part_d1,
    part_d2 = excluded.part_d2,
    part_e = excluded.part_e,
    status = case when payload ? 'status' then excluded.status else qualifier_submissions.status end,
    submitted_at = case when payload ? 'submitted_at' then excluded.submitted_at else qualifier_submissions.submitted_at end,
    time_used = case when payload ? 'time_used' then excluded.time_used else qualifier_submissions.time_used end,
    name = case when coalesce(payload->>'name', '') <> '' then excluded.name else qualifier_submissions.name end,
    email = case when coalesce(payload->>'email', '') <> '' then excluded.email else qualifier_submissions.email end,
    phone = case when coalesce(payload->>'phone', '') <> '' then excluded.phone else qualifier_submissions.phone end;
end;
$$;

grant execute on function public.save_qualifier_answers(jsonb) to anon;
grant execute on function public.save_qualifier_answers(jsonb) to authenticated;
grant execute on function public.save_qualifier_answers(jsonb) to public;

-- Refresh API schema cache
notify pgrst, 'reload schema';
