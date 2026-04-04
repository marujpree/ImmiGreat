-- 006_english_tracking.sql
-- Adds english_test_attempts table for tracking reading/writing test progress.
-- Adds site_resources table for storing admin-managed file URLs (word banks, etc.).
-- Run in Supabase SQL editor AFTER 005.

-- ─────────────────────────────────────────────
-- 1. English test attempts
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.english_test_attempts (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type     text        NOT NULL CHECK (test_type IN ('reading', 'writing')),
  correct_count int         NOT NULL,
  total         int         NOT NULL DEFAULT 3,
  passed        boolean     NOT NULL,   -- correct_count >= 2
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eta_user_type_created
  ON public.english_test_attempts(user_id, test_type, created_at DESC);

ALTER TABLE public.english_test_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "eta_select_own" ON public.english_test_attempts;
DROP POLICY IF EXISTS "eta_insert_own" ON public.english_test_attempts;

CREATE POLICY "eta_select_own"
  ON public.english_test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "eta_insert_own"
  ON public.english_test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 2. Site resources (admin-managed key/value store)
--    Used for word bank file URLs, etc.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_resources (
  key        text        PRIMARY KEY,
  value      text        NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_resources_public_read" ON public.site_resources;

CREATE POLICY "site_resources_public_read"
  ON public.site_resources FOR SELECT
  USING (true);

-- Note: writes are managed directly via the Supabase dashboard
-- using the service role key, or via the /api/admin/word-bank route
-- which uses createAdminClient() and checks ADMIN_EMAIL.

-- ─────────────────────────────────────────────
-- 3. Supabase Storage bucket for word bank files
-- ─────────────────────────────────────────────
-- Run this separately in the Supabase SQL editor or Storage UI:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('word-banks', 'word-banks', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "word_banks_public_read"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'word-banks');
