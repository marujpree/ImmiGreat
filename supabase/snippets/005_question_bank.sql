-- 005_question_bank.sql
-- Adds is_2025_addition flag to civics_questions.
-- Creates user_settings table for storing question bank preference.
-- Run in Supabase SQL editor AFTER 003 and 004.

-- ─────────────────────────────────────────────
-- 1. Add flag to civics_questions
-- ─────────────────────────────────────────────
ALTER TABLE public.civics_questions
  ADD COLUMN IF NOT EXISTS is_2025_addition boolean NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────
-- 2. Mark the 29 questions added in snippet 003
-- ─────────────────────────────────────────────
UPDATE public.civics_questions
SET is_2025_addition = true
WHERE lower(question_text) IN (
  'the u.s. constitution starts with the words "we the people." what does "we the people" mean?',
  'name two important ideas from the declaration of independence and the u.s. constitution.',
  'the words "life, liberty, and the pursuit of happiness" are in what founding document?',
  'many documents influenced the u.s. constitution. name one.',
  'why do u.s. representatives serve shorter terms than u.s. senators?',
  'why does each state have two senators?',
  'the president of the united states can serve only two terms. why?',
  'why is the electoral college important?',
  'how many supreme court justices are usually needed to decide a case?',
  'supreme court justices serve for life. why?',
  'what is the purpose of the 10th amendment?',
  'what are two cabinet-level positions?',
  'there are four amendments to the u.s. constitution about who can vote. describe one of them.',
  'who can vote in federal elections, run for federal office, and serve on a jury in the united states?',
  'name two promises that new citizens make in the oath of allegiance.',
  'how can people become united states citizens?',
  'what are two examples of civic participation in the united states?',
  'why were the federalist papers important?',
  'benjamin franklin is famous for many things. name one.',
  'james madison is famous for many things. name one.',
  'alexander hamilton is famous for many things. name one.',
  'the civil war had many important events. name one.',
  'when did all men get the right to vote?',
  'name one leader of the women''s rights movement in the 1800s.',
  'dwight eisenhower is famous for many things. name one.',
  'name one american indian tribe in the united states.',
  'name one example of an american innovation.',
  'the nation''s first motto was "e pluribus unum." what does that mean?',
  'what is memorial day?',
  'what is veterans day?'
);

-- ─────────────────────────────────────────────
-- 3. Create user_settings table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  question_bank text NOT NULL DEFAULT '2025'
    CHECK (question_bank IN ('legacy', '2025')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own settings" ON public.user_settings;
CREATE POLICY "Users read own settings"
  ON public.user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users upsert own settings" ON public.user_settings;
CREATE POLICY "Users upsert own settings"
  ON public.user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
