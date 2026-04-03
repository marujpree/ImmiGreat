-- ImmiGreat / CitizenReady app schema + RLS
-- Run in Supabase SQL editor (or as a migration) on your target project.

create extension if not exists pgcrypto;

-- -----------------------------
-- Shared trigger for updated_at
-- -----------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------
-- Protect server-computed columns from client writes
-- Only service_role (Edge Functions) may change these.
-- Authenticated clients have the value silently preserved.
-- ---------------------------------------------------
create or replace function public.protect_score_percent()
returns trigger
language plpgsql
as $$
begin
  -- current_user is 'authenticated' for JWT callers, 'service_role' for Edge Functions
  if current_user = 'authenticated' then
    new.score_percent = old.score_percent;
  end if;
  return new;
end;
$$;

create or replace function public.protect_mastery_columns()
returns trigger
language plpgsql
as $$
begin
  if current_user = 'authenticated' then
    new.mastery_score   = old.mastery_score;
    new.times_seen      = old.times_seen;
    new.times_correct   = old.times_correct;
    new.last_reviewed_at = old.last_reviewed_at;
  end if;
  return new;
end;
$$;

create or replace function public.protect_srs_columns()
returns trigger
language plpgsql
as $$
begin
  if current_user = 'authenticated' then
    new.ease_factor   = old.ease_factor;
    new.interval_days = old.interval_days;
    new.repetitions   = old.repetitions;
    new.due_at        = old.due_at;
  end if;
  return new;
end;
$$;

-- -----------------------------
-- Profiles (1:1 with auth.users)
-- -----------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

-- -----------------------------
-- Civics question bank
-- -----------------------------
create table if not exists public.civics_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  official_answer text not null,
  category text,
  source_version text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.civics_questions enable row level security;

-- Read-only for signed-in users. Writes are expected via service role.
create policy "civics_questions_select_authenticated"
on public.civics_questions
for select
using (auth.uid() is not null);

create table if not exists public.civics_question_choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.civics_questions(id) on delete cascade,
  choice_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_civics_question_choices_question_id
  on public.civics_question_choices(question_id);

alter table public.civics_question_choices enable row level security;

create policy "civics_question_choices_select_authenticated"
on public.civics_question_choices
for select
using (auth.uid() is not null);

-- -----------------------------
-- User progress + spaced repetition
-- -----------------------------
create table if not exists public.user_question_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.civics_questions(id) on delete cascade,
  times_seen integer not null default 0,
  times_correct integer not null default 0,
  mastery_score numeric(5,2) not null default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_user_question_progress unique (user_id, question_id)
);

create index if not exists idx_user_question_progress_user_id
  on public.user_question_progress(user_id);

create index if not exists idx_user_question_progress_question_id
  on public.user_question_progress(question_id);

create trigger set_user_question_progress_updated_at
before update on public.user_question_progress
for each row execute function public.set_updated_at();

create trigger protect_mastery_columns
before update on public.user_question_progress
for each row execute function public.protect_mastery_columns();

alter table public.user_question_progress enable row level security;

create policy "uqp_select_own"
on public.user_question_progress
for select
using (user_id = auth.uid());

create policy "uqp_insert_own"
on public.user_question_progress
for insert
with check (user_id = auth.uid());

create policy "uqp_update_own"
on public.user_question_progress
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "uqp_delete_own"
on public.user_question_progress
for delete
using (user_id = auth.uid());

create table if not exists public.spaced_repetition_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.civics_questions(id) on delete cascade,
  ease_factor numeric(4,2) not null default 2.50,
  interval_days integer not null default 1,
  repetitions integer not null default 0,
  due_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_spaced_repetition_user_question unique (user_id, question_id)
);

create index if not exists idx_spaced_repetition_cards_user_id
  on public.spaced_repetition_cards(user_id);

create index if not exists idx_spaced_repetition_cards_due_at
  on public.spaced_repetition_cards(due_at);

create trigger set_spaced_repetition_cards_updated_at
before update on public.spaced_repetition_cards
for each row execute function public.set_updated_at();

create trigger protect_srs_columns
before update on public.spaced_repetition_cards
for each row execute function public.protect_srs_columns();

alter table public.spaced_repetition_cards enable row level security;

create policy "src_select_own"
on public.spaced_repetition_cards
for select
using (user_id = auth.uid());

create policy "src_insert_own"
on public.spaced_repetition_cards
for insert
with check (user_id = auth.uid());

create policy "src_update_own"
on public.spaced_repetition_cards
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "src_delete_own"
on public.spaced_repetition_cards
for delete
using (user_id = auth.uid());

-- -----------------------------
-- Practice attempts
-- -----------------------------
create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null default 'practice' check (mode in ('practice', 'quiz', 'exam')),
  score_percent numeric(5,2) check (score_percent between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_practice_attempts_user_id
  on public.practice_attempts(user_id);

create index if not exists idx_practice_attempts_started_at
  on public.practice_attempts(started_at desc);

create trigger protect_score_percent
before update on public.practice_attempts
for each row execute function public.protect_score_percent();

alter table public.practice_attempts enable row level security;

create policy "practice_attempts_select_own"
on public.practice_attempts
for select
using (user_id = auth.uid());

create policy "practice_attempts_insert_own"
on public.practice_attempts
for insert
with check (user_id = auth.uid());

create policy "practice_attempts_update_own"
on public.practice_attempts
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "practice_attempts_delete_own"
on public.practice_attempts
for delete
using (user_id = auth.uid());

create table if not exists public.practice_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.practice_attempts(id) on delete cascade,
  question_id uuid not null references public.civics_questions(id) on delete cascade,
  selected_answer text,
  is_correct boolean not null default false,
  response_time_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_practice_attempt_answers_attempt_id
  on public.practice_attempt_answers(attempt_id);

create index if not exists idx_practice_attempt_answers_question_id
  on public.practice_attempt_answers(question_id);

alter table public.practice_attempt_answers enable row level security;

-- Access controlled by ownership of parent attempt.
create policy "practice_attempt_answers_select_own"
on public.practice_attempt_answers
for select
using (
  exists (
    select 1
    from public.practice_attempts a
    where a.id = practice_attempt_answers.attempt_id
      and a.user_id = auth.uid()
  )
);

create policy "practice_attempt_answers_insert_own"
on public.practice_attempt_answers
for insert
with check (
  exists (
    select 1
    from public.practice_attempts a
    where a.id = practice_attempt_answers.attempt_id
      and a.user_id = auth.uid()
      and a.completed_at is null  -- prevent retroactive answer injection on finished attempts
  )
);

create policy "practice_attempt_answers_update_own"
on public.practice_attempt_answers
for update
using (
  exists (
    select 1
    from public.practice_attempts a
    where a.id = practice_attempt_answers.attempt_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.practice_attempts a
    where a.id = practice_attempt_answers.attempt_id
      and a.user_id = auth.uid()
  )
);

create policy "practice_attempt_answers_delete_own"
on public.practice_attempt_answers
for delete
using (
  exists (
    select 1
    from public.practice_attempts a
    where a.id = practice_attempt_answers.attempt_id
      and a.user_id = auth.uid()
  )
);

-- -----------------------------
-- AI assistant chat history
-- -----------------------------
create table if not exists public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ai_chat_sessions_user_id
  on public.ai_chat_sessions(user_id);

create trigger set_ai_chat_sessions_updated_at
before update on public.ai_chat_sessions
for each row execute function public.set_updated_at();

alter table public.ai_chat_sessions enable row level security;

create policy "ai_chat_sessions_select_own"
on public.ai_chat_sessions
for select
using (user_id = auth.uid());

create policy "ai_chat_sessions_insert_own"
on public.ai_chat_sessions
for insert
with check (user_id = auth.uid());

create policy "ai_chat_sessions_update_own"
on public.ai_chat_sessions
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "ai_chat_sessions_delete_own"
on public.ai_chat_sessions
for delete
using (user_id = auth.uid());

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  token_count integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_chat_messages_session_id
  on public.ai_chat_messages(session_id);

alter table public.ai_chat_messages enable row level security;

create policy "ai_chat_messages_select_own"
on public.ai_chat_messages
for select
using (
  exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = ai_chat_messages.session_id
      and s.user_id = auth.uid()
  )
);

create policy "ai_chat_messages_insert_own"
on public.ai_chat_messages
for insert
with check (
  exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = ai_chat_messages.session_id
      and s.user_id = auth.uid()
  )
);

create policy "ai_chat_messages_update_own"
on public.ai_chat_messages
for update
using (
  exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = ai_chat_messages.session_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = ai_chat_messages.session_id
      and s.user_id = auth.uid()
  )
);

create policy "ai_chat_messages_delete_own"
on public.ai_chat_messages
for delete
using (
  exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = ai_chat_messages.session_id
      and s.user_id = auth.uid()
  )
);

-- -----------------------------
-- Resource directory + saved resources
-- -----------------------------
create table if not exists public.resource_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  city text,
  state text,
  zip text,
  url text,
  phone text,
  language_tags text[] not null default '{}',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_resource_items_category
  on public.resource_items(category);

create index if not exists idx_resource_items_state_city
  on public.resource_items(state, city);

create trigger set_resource_items_updated_at
before update on public.resource_items
for each row execute function public.set_updated_at();

alter table public.resource_items enable row level security;

create policy "resource_items_select_authenticated"
on public.resource_items
for select
using (auth.uid() is not null);

create table if not exists public.user_saved_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resource_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint uq_user_saved_resource unique (user_id, resource_id)
);

create index if not exists idx_user_saved_resources_user_id
  on public.user_saved_resources(user_id);

create index if not exists idx_user_saved_resources_resource_id
  on public.user_saved_resources(resource_id);

alter table public.user_saved_resources enable row level security;

create policy "user_saved_resources_select_own"
on public.user_saved_resources
for select
using (user_id = auth.uid());

create policy "user_saved_resources_insert_own"
on public.user_saved_resources
for insert
with check (user_id = auth.uid());

create policy "user_saved_resources_delete_own"
on public.user_saved_resources
for delete
using (user_id = auth.uid());

-- -----------------------------
-- Settlement checklist templates + user items
-- -----------------------------
create table if not exists public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_checklist_templates_category
  on public.checklist_templates(category);

create index if not exists idx_checklist_templates_sort_order
  on public.checklist_templates(sort_order);

create trigger set_checklist_templates_updated_at
before update on public.checklist_templates
for each row execute function public.set_updated_at();

alter table public.checklist_templates enable row level security;

create policy "checklist_templates_select_authenticated"
on public.checklist_templates
for select
using (auth.uid() is not null);

create table if not exists public.user_checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.checklist_templates(id) on delete cascade,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_user_checklist_item unique (user_id, template_id)
);

create index if not exists idx_user_checklist_items_user_id
  on public.user_checklist_items(user_id);

create index if not exists idx_user_checklist_items_status
  on public.user_checklist_items(status);

create trigger set_user_checklist_items_updated_at
before update on public.user_checklist_items
for each row execute function public.set_updated_at();

alter table public.user_checklist_items enable row level security;

create policy "user_checklist_items_select_own"
on public.user_checklist_items
for select
using (user_id = auth.uid());

create policy "user_checklist_items_insert_own"
on public.user_checklist_items
for insert
with check (user_id = auth.uid());

create policy "user_checklist_items_update_own"
on public.user_checklist_items
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "user_checklist_items_delete_own"
on public.user_checklist_items
for delete
using (user_id = auth.uid());
