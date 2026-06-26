-- ============================================================
-- RUN THIS FILE in Supabase → SQL Editor (one time)
-- TerraSync Round 2 (/trra) candidate submissions
-- ============================================================

create table if not exists public.trra_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_id text unique not null,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  phone_normalized text not null default '',
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'expired')),
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  time_used text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists trra_submissions_email_unique
  on public.trra_submissions (lower(trim(email)))
  where email <> '';

create unique index if not exists trra_submissions_phone_unique
  on public.trra_submissions (phone_normalized)
  where phone_normalized <> '';

create or replace function public.normalize_phone(p text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(p, ''), '\D', '', 'g');
$$;

alter table public.trra_submissions enable row level security;

drop policy if exists "public can insert trra submissions" on public.trra_submissions;
drop policy if exists "public can update trra submissions" on public.trra_submissions;
drop policy if exists "admins can read trra submissions" on public.trra_submissions;

create policy "public can insert trra submissions"
  on public.trra_submissions for insert to public with check (true);

create policy "public can update trra submissions"
  on public.trra_submissions for update to public using (true) with check (true);

create policy "admins can read trra submissions"
  on public.trra_submissions for select to authenticated
  using (
    exists (
      select 1 from public.admins
      where lower(admins.email) = lower(auth.jwt() ->> 'email')
    )
  );

create or replace function public.start_trra_submission(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_started_at timestamptz := now();
  v_deadline_at timestamptz := now() + interval '72 hours';
  v_phone_normalized text := normalize_phone(payload->>'phone');
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  if coalesce(payload->>'name', '') = '' then
    raise exception 'name is required';
  end if;

  if coalesce(payload->>'email', '') = '' then
    raise exception 'email is required';
  end if;

  if coalesce(v_phone_normalized, '') = '' then
    raise exception 'phone is required';
  end if;

  if exists (
    select 1 from public.trra_submissions
    where lower(trim(email)) = lower(trim(payload->>'email'))
  ) then
    raise exception 'email_already_registered';
  end if;

  if exists (
    select 1 from public.trra_submissions
    where phone_normalized = v_phone_normalized
  ) then
    raise exception 'phone_already_registered';
  end if;

  insert into public.trra_submissions (
    submission_id,
    name,
    email,
    phone,
    phone_normalized,
    started_at,
    deadline_at,
    status,
    answers
  )
  values (
    payload->>'submission_id',
    trim(payload->>'name'),
    trim(payload->>'email'),
    trim(payload->>'phone'),
    v_phone_normalized,
    v_started_at,
    v_deadline_at,
    'in_progress',
    '{}'::jsonb
  );

  return jsonb_build_object(
    'submission_id', payload->>'submission_id',
    'started_at', v_started_at,
    'deadline_at', v_deadline_at,
    'status', 'in_progress'
  );
end;
$$;

create or replace function public.save_trra_answers(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.trra_submissions%rowtype;
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.trra_submissions
  where submission_id = payload->>'submission_id'
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if rec.status = 'submitted' then
    raise exception 'submission_already_completed';
  end if;

  if now() > rec.deadline_at then
    update public.trra_submissions
    set status = 'expired', updated_at = now()
    where submission_id = payload->>'submission_id';
    raise exception 'time_expired';
  end if;

  update public.trra_submissions
  set
    answers = coalesce(payload->'answers', answers),
    updated_at = now()
  where submission_id = payload->>'submission_id';
end;
$$;

create or replace function public.submit_trra_submission(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.trra_submissions%rowtype;
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.trra_submissions
  where submission_id = payload->>'submission_id'
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if rec.status = 'submitted' then
    raise exception 'submission_already_completed';
  end if;

  if now() > rec.deadline_at then
    update public.trra_submissions
    set status = 'expired', updated_at = now()
    where submission_id = payload->>'submission_id';
    raise exception 'time_expired';
  end if;

  update public.trra_submissions
  set
    status = 'submitted',
    answers = coalesce(payload->'answers', answers),
    submitted_at = coalesce((payload->>'submitted_at')::timestamptz, now()),
    time_used = payload->>'time_used',
    updated_at = now()
  where submission_id = payload->>'submission_id';
end;
$$;

create or replace function public.get_trra_submission_state(p_submission_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.trra_submissions%rowtype;
  v_expired boolean;
begin
  if coalesce(p_submission_id, '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.trra_submissions
  where submission_id = p_submission_id;

  if not found then
    raise exception 'submission_not_found';
  end if;

  v_expired := now() > rec.deadline_at;

  if v_expired and rec.status = 'in_progress' then
    update public.trra_submissions
    set status = 'expired', updated_at = now()
    where submission_id = p_submission_id;

    rec.status := 'expired';
  end if;

  return jsonb_build_object(
    'submission_id', rec.submission_id,
    'name', rec.name,
    'email', rec.email,
    'phone', rec.phone,
    'started_at', rec.started_at,
    'deadline_at', rec.deadline_at,
    'status', rec.status,
    'answers', rec.answers,
    'submitted_at', rec.submitted_at,
    'time_used', rec.time_used,
    'is_expired', v_expired,
    'can_submit', rec.status = 'in_progress' and not v_expired
  );
end;
$$;

grant execute on function public.start_trra_submission(jsonb) to anon, authenticated, public;
grant execute on function public.save_trra_answers(jsonb) to anon, authenticated, public;
grant execute on function public.submit_trra_submission(jsonb) to anon, authenticated, public;
grant execute on function public.get_trra_submission_state(text) to anon, authenticated, public;

notify pgrst, 'reload schema';
