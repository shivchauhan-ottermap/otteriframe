-- ============================================================
-- RUN THIS FILE in Supabase → SQL Editor (one time)
-- Ottermap 72-hour technical challenge submissions
-- ============================================================

create table if not exists public.ottermap_challenge_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_id text unique not null,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  phone_normalized text not null default '',
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  step text not null default 'challenge'
    check (step in ('register', 'challenge', 'submit', 'done')),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'expired')),
  deliverable_repo text default '',
  deliverable_weights text default '',
  deliverable_summary text default '',
  deliverable_samples text default '',
  submit_notes text default '',
  submitted_at timestamptz,
  time_used text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ottermap_challenge_email_unique
  on public.ottermap_challenge_submissions (lower(trim(email)))
  where email <> '';

create unique index if not exists ottermap_challenge_phone_unique
  on public.ottermap_challenge_submissions (phone_normalized)
  where phone_normalized <> '';

create or replace function public.normalize_phone(p text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(p, ''), '\D', '', 'g');
$$;

alter table public.ottermap_challenge_submissions enable row level security;

drop policy if exists "public can insert ottermap challenges" on public.ottermap_challenge_submissions;
drop policy if exists "public can update ottermap challenges" on public.ottermap_challenge_submissions;
drop policy if exists "admins can read ottermap challenges" on public.ottermap_challenge_submissions;

create policy "public can insert ottermap challenges"
  on public.ottermap_challenge_submissions for insert to public with check (true);

create policy "public can update ottermap challenges"
  on public.ottermap_challenge_submissions for update to public using (true) with check (true);

create policy "admins can read ottermap challenges"
  on public.ottermap_challenge_submissions for select to authenticated
  using (
    exists (
      select 1 from public.admins
      where lower(admins.email) = lower(auth.jwt() ->> 'email')
    )
  );

create or replace function public.start_ottermap_challenge(payload jsonb)
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
    select 1 from public.ottermap_challenge_submissions
    where lower(trim(email)) = lower(trim(payload->>'email'))
  ) then
    raise exception 'email_already_registered';
  end if;

  if exists (
    select 1 from public.ottermap_challenge_submissions
    where phone_normalized = v_phone_normalized
  ) then
    raise exception 'phone_already_registered';
  end if;

  insert into public.ottermap_challenge_submissions (
    submission_id,
    name,
    email,
    phone,
    phone_normalized,
    started_at,
    deadline_at,
    step,
    status
  )
  values (
    payload->>'submission_id',
    trim(payload->>'name'),
    trim(payload->>'email'),
    trim(payload->>'phone'),
    v_phone_normalized,
    v_started_at,
    v_deadline_at,
    'challenge',
    'in_progress'
  );

  return jsonb_build_object(
    'submission_id', payload->>'submission_id',
    'started_at', v_started_at,
    'deadline_at', v_deadline_at,
    'step', 'challenge',
    'status', 'in_progress'
  );
end;
$$;

create or replace function public.save_ottermap_challenge(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.ottermap_challenge_submissions%rowtype;
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.ottermap_challenge_submissions
  where submission_id = payload->>'submission_id'
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if rec.status = 'submitted' then
    raise exception 'submission_already_completed';
  end if;

  if now() > rec.deadline_at then
    update public.ottermap_challenge_submissions
    set status = 'expired', step = 'register', updated_at = now()
    where submission_id = payload->>'submission_id';
    raise exception 'time_expired';
  end if;

  update public.ottermap_challenge_submissions
  set
    step = case when payload ? 'step' then payload->>'step' else step end,
    deliverable_repo = case when payload ? 'deliverable_repo' then payload->>'deliverable_repo' else deliverable_repo end,
    deliverable_weights = case when payload ? 'deliverable_weights' then payload->>'deliverable_weights' else deliverable_weights end,
    deliverable_summary = case when payload ? 'deliverable_summary' then payload->>'deliverable_summary' else deliverable_summary end,
    deliverable_samples = case when payload ? 'deliverable_samples' then payload->>'deliverable_samples' else deliverable_samples end,
    submit_notes = case when payload ? 'submit_notes' then payload->>'submit_notes' else submit_notes end,
    updated_at = now()
  where submission_id = payload->>'submission_id';
end;
$$;

create or replace function public.submit_ottermap_challenge(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.ottermap_challenge_submissions%rowtype;
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.ottermap_challenge_submissions
  where submission_id = payload->>'submission_id'
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if rec.status = 'submitted' then
    raise exception 'submission_already_completed';
  end if;

  if now() > rec.deadline_at then
    update public.ottermap_challenge_submissions
    set status = 'expired', step = 'register', updated_at = now()
    where submission_id = payload->>'submission_id';
    raise exception 'time_expired';
  end if;

  update public.ottermap_challenge_submissions
  set
    status = 'submitted',
    step = 'done',
    deliverable_repo = coalesce(payload->>'deliverable_repo', deliverable_repo),
    deliverable_weights = coalesce(payload->>'deliverable_weights', deliverable_weights),
    deliverable_summary = coalesce(payload->>'deliverable_summary', deliverable_summary),
    deliverable_samples = coalesce(payload->>'deliverable_samples', deliverable_samples),
    submit_notes = coalesce(payload->>'submit_notes', submit_notes),
    submitted_at = coalesce((payload->>'submitted_at')::timestamptz, now()),
    time_used = payload->>'time_used',
    updated_at = now()
  where submission_id = payload->>'submission_id';
end;
$$;

create or replace function public.get_ottermap_challenge_state(p_submission_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.ottermap_challenge_submissions%rowtype;
  v_expired boolean;
begin
  if coalesce(p_submission_id, '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.ottermap_challenge_submissions
  where submission_id = p_submission_id;

  if not found then
    raise exception 'submission_not_found';
  end if;

  v_expired := now() > rec.deadline_at;

  if v_expired and rec.status = 'in_progress' then
    update public.ottermap_challenge_submissions
    set status = 'expired', step = 'register', updated_at = now()
    where submission_id = p_submission_id;

    rec.status := 'expired';
    rec.step := 'register';
  end if;

  return jsonb_build_object(
    'submission_id', rec.submission_id,
    'name', rec.name,
    'email', rec.email,
    'phone', rec.phone,
    'started_at', rec.started_at,
    'deadline_at', rec.deadline_at,
    'step', rec.step,
    'status', rec.status,
    'deliverable_repo', rec.deliverable_repo,
    'deliverable_weights', rec.deliverable_weights,
    'deliverable_summary', rec.deliverable_summary,
    'deliverable_samples', rec.deliverable_samples,
    'submit_notes', rec.submit_notes,
    'submitted_at', rec.submitted_at,
    'time_used', rec.time_used,
    'is_expired', v_expired,
    'can_submit', rec.status = 'in_progress' and not v_expired
  );
end;
$$;

grant execute on function public.start_ottermap_challenge(jsonb) to anon, authenticated, public;
grant execute on function public.save_ottermap_challenge(jsonb) to anon, authenticated, public;
grant execute on function public.submit_ottermap_challenge(jsonb) to anon, authenticated, public;
grant execute on function public.get_ottermap_challenge_state(text) to anon, authenticated, public;

notify pgrst, 'reload schema';
