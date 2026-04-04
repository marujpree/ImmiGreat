import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabase'

/**
 * POST /api/quiz/submit
 * Body: {
 *   attemptId: string,
 *   questionId: string,
 *   isCorrect: boolean,
 *   typedAnswer: string,
 *   inputMode: 'typed' | 'spoken',
 *   responseTimeMs?: number,
 *   isFinal?: boolean   -- true when this is the last question; triggers score calculation
 * }
 *
 * Saves the answer, updates user_question_progress, and runs the SM-2 SRS algorithm.
 * SRS writes use the admin client because the DB trigger blocks authenticated client writes.
 *
 * Returns: { ok: true } or on isFinal: { ok: true, scorePercent: number }
 */
export async function POST(request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    attemptId,
    questionId,
    isCorrect,
    typedAnswer,
    inputMode = 'typed',
    responseTimeMs,
    isFinal = false,
  } = body

  if (!attemptId || !questionId || typeof isCorrect !== 'boolean') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 1. Save the answer to practice_attempt_answers
  const { error: answerError } = await supabase
    .from('practice_attempt_answers')
    .insert({
      attempt_id: attemptId,
      question_id: questionId,
      selected_answer: typedAnswer,
      typed_answer: typedAnswer,
      is_correct: isCorrect,
      input_mode: inputMode,
      response_time_ms: responseTimeMs ?? null,
    })

  if (answerError) {
    console.error('[/api/quiz/submit] Answer insert error:', answerError)
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 })
  }

  // 2. Run SRS update using admin client (bypasses the protect_srs_columns trigger)
  const admin = createAdminClient()

  // Quality score for SM-2: 5=perfect, 4=correct hesitation, 3=correct difficult, 2=incorrect easy, 1=incorrect, 0=blackout
  const quality = isCorrect ? (responseTimeMs && responseTimeMs < 5000 ? 5 : 4) : 1

  // Fetch existing SRS card (or create new one)
  const { data: existingCard } = await admin
    .from('spaced_repetition_cards')
    .select('id, ease_factor, interval_days, repetitions')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .single()

  const ef = existingCard?.ease_factor ?? 2.50
  const reps = existingCard?.repetitions ?? 0
  const interval = existingCard?.interval_days ?? 1

  // SM-2 algorithm
  const { newEf, newInterval, newReps } = sm2(ef, interval, reps, quality)
  const dueAt = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString()

  if (existingCard) {
    await admin
      .from('spaced_repetition_cards')
      .update({
        ease_factor: newEf,
        interval_days: newInterval,
        repetitions: newReps,
        due_at: dueAt,
      })
      .eq('id', existingCard.id)
  } else {
    await admin
      .from('spaced_repetition_cards')
      .insert({
        user_id: user.id,
        question_id: questionId,
        ease_factor: newEf,
        interval_days: newInterval,
        repetitions: newReps,
        due_at: dueAt,
      })
  }

  // 3. Update user_question_progress using admin client
  const { data: existingProgress } = await admin
    .from('user_question_progress')
    .select('id, times_seen, times_correct, mastery_score')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .single()

  const newTimesSeen = (existingProgress?.times_seen ?? 0) + 1
  const newTimesCorrect = (existingProgress?.times_correct ?? 0) + (isCorrect ? 1 : 0)
  const newMastery = Math.round((newTimesCorrect / newTimesSeen) * 100) / 100

  if (existingProgress) {
    await admin
      .from('user_question_progress')
      .update({
        times_seen: newTimesSeen,
        times_correct: newTimesCorrect,
        mastery_score: newMastery,
        last_reviewed_at: new Date().toISOString(),
      })
      .eq('id', existingProgress.id)
  } else {
    await admin
      .from('user_question_progress')
      .insert({
        user_id: user.id,
        question_id: questionId,
        times_seen: newTimesSeen,
        times_correct: newTimesCorrect,
        mastery_score: newMastery,
        last_reviewed_at: new Date().toISOString(),
      })
  }

  // 4. If this is the final question, calculate and save the attempt score
  if (isFinal) {
    const { data: answers } = await supabase
      .from('practice_attempt_answers')
      .select('is_correct')
      .eq('attempt_id', attemptId)

    const total = answers?.length ?? 0
    const correct = answers?.filter(a => a.is_correct).length ?? 0
    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0

    await admin
      .from('practice_attempts')
      .update({
        score_percent: scorePercent,
        completed_at: new Date().toISOString(),
        duration_seconds: null,
      })
      .eq('id', attemptId)

    return NextResponse.json({ ok: true, scorePercent, correct, total })
  }

  return NextResponse.json({ ok: true })
}

/**
 * SM-2 spaced repetition algorithm.
 * Returns new ease_factor, interval_days, and repetitions.
 */
function sm2(ef, interval, reps, quality) {
  let newEf = ef
  let newReps = reps
  let newInterval = interval

  if (quality >= 3) {
    if (reps === 0) newInterval = 1
    else if (reps === 1) newInterval = 6
    else newInterval = Math.round(interval * ef)
    newReps = reps + 1
  } else {
    newReps = 0
    newInterval = 1
  }

  newEf = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEf < 1.3) newEf = 1.3
  newEf = Math.round(newEf * 100) / 100

  return { newEf, newInterval, newReps }
}
