-- 004_schema_cleanup.sql
-- Drops tables that were planned but never implemented.
-- Adds missing columns to practice_attempt_answers.
-- Fixes the practice_attempts mode CHECK constraint.
-- Run in Supabase SQL editor.

-- ─────────────────────────────────────────────
-- 1. Drop unused tables (safe — no app code references these)
-- ─────────────────────────────────────────────

-- AI chat feature (dropped)
drop table if exists public.ai_chat_messages cascade;
drop table if exists public.ai_chat_sessions cascade;

-- Multiple-choice answers (never used — validation is AI-based)
drop table if exists public.civics_question_choices cascade;

-- Resource directory (hardcoded in UI, no DB integration)
drop table if exists public.user_saved_resources cascade;
drop table if exists public.resource_items cascade;

-- Settlement checklist (never implemented)
drop table if exists public.user_checklist_items cascade;
drop table if exists public.checklist_templates cascade;

-- User profiles (never queried in app code)
drop table if exists public.profiles cascade;

-- ─────────────────────────────────────────────
-- 2. Add missing columns to practice_attempt_answers
--    (the submit route inserts these but they weren't in the original schema)
-- ─────────────────────────────────────────────
alter table public.practice_attempt_answers
  add column if not exists typed_answer text,
  add column if not exists input_mode text default 'typed' check (input_mode in ('typed', 'spoken'));

-- ─────────────────────────────────────────────
-- 3. Fix practice_attempts mode CHECK constraint
--    (original schema was missing 'review', 'mastered', and 'combo')
-- ─────────────────────────────────────────────
alter table public.practice_attempts
  drop constraint if exists practice_attempts_mode_check;

alter table public.practice_attempts
  add constraint practice_attempts_mode_check
  check (mode in ('practice', 'quiz', 'exam', 'review', 'mastered', 'combo'));
