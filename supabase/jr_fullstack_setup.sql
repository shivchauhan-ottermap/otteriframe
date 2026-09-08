-- ============================================================
-- RUN THIS FILE in Supabase → SQL Editor (one time)
-- Junior Full Stack qualifier (/jr-fullstack) submissions
-- Separate from qualifier_submissions, trra_submissions,
-- and ottermap_challenge_submissions.
-- ============================================================

create table if not exists public.jr_fullstack_submissions (
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

create unique index if not exists jr_fullstack_submissions_email_unique
  on public.jr_fullstack_submissions (lower(trim(email)))
  where email <> '';

create unique index if not exists jr_fullstack_submissions_phone_unique
  on public.jr_fullstack_submissions (phone_normalized)
  where phone_normalized <> '';

create or replace function public.normalize_phone(p text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(p, ''), '\D', '', 'g');
$$;

alter table public.jr_fullstack_submissions enable row level security;

drop policy if exists "public can insert jr fullstack submissions" on public.jr_fullstack_submissions;
drop policy if exists "public can update jr fullstack submissions" on public.jr_fullstack_submissions;
drop policy if exists "admins can read jr fullstack submissions" on public.jr_fullstack_submissions;

create policy "public can insert jr fullstack submissions"
  on public.jr_fullstack_submissions for insert to public with check (true);

create policy "public can update jr fullstack submissions"
  on public.jr_fullstack_submissions for update to public using (true) with check (true);

create policy "admins can read jr fullstack submissions"
  on public.jr_fullstack_submissions for select to authenticated
  using (
    exists (
      select 1 from public.admins
      where lower(admins.email) = lower(auth.jwt() ->> 'email')
    )
  );

create or replace function public.start_jr_fullstack_submission(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_started_at timestamptz := now();
  v_deadline_at timestamptz := now() + interval '45 minutes';
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
    select 1 from public.jr_fullstack_submissions
    where lower(trim(email)) = lower(trim(payload->>'email'))
  ) then
    raise exception 'email_already_registered';
  end if;

  if exists (
    select 1 from public.jr_fullstack_submissions
    where phone_normalized = v_phone_normalized
  ) then
    raise exception 'phone_already_registered';
  end if;

  insert into public.jr_fullstack_submissions (
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

create or replace function public.save_jr_fullstack_answers(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.jr_fullstack_submissions%rowtype;
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.jr_fullstack_submissions
  where submission_id = payload->>'submission_id'
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if rec.status = 'submitted' then
    raise exception 'submission_already_completed';
  end if;

  if now() > rec.deadline_at then
    update public.jr_fullstack_submissions
    set status = 'expired', updated_at = now()
    where submission_id = payload->>'submission_id';
    raise exception 'time_expired';
  end if;

  update public.jr_fullstack_submissions
  set
    answers = coalesce(payload->'answers', answers),
    updated_at = now()
  where submission_id = payload->>'submission_id';
end;
$$;

create or replace function public.submit_jr_fullstack_submission(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.jr_fullstack_submissions%rowtype;
begin
  if coalesce(payload->>'submission_id', '') = '' then
    raise exception 'submission_id is required';
  end if;

  select * into rec
  from public.jr_fullstack_submissions
  where submission_id = payload->>'submission_id'
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if rec.status = 'submitted' then
    raise exception 'submission_already_completed';
  end if;

  if now() > rec.deadline_at then
    update public.jr_fullstack_submissions
    set status = 'expired', updated_at = now()
    where submission_id = payload->>'submission_id';
    raise exception 'time_expired';
  end if;

  update public.jr_fullstack_submissions
  set
    status = 'submitted',
    answers = coalesce(payload->'answers', answers),
    submitted_at = coalesce((payload->>'submitted_at')::timestamptz, now()),
    time_used = payload->>'time_used',
    updated_at = now()
  where submission_id = payload->>'submission_id';
end;
$$;

grant execute on function public.start_jr_fullstack_submission(jsonb) to anon, authenticated, public;
grant execute on function public.save_jr_fullstack_answers(jsonb) to anon, authenticated, public;
grant execute on function public.submit_jr_fullstack_submission(jsonb) to anon, authenticated, public;

notify pgrst, 'reload schema';
