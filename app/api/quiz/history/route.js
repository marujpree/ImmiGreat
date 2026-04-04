import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/quiz/history?limit=10
 *
 * Returns the user's completed exam and combo quiz attempts, newest first.
 * Each attempt includes its per-question answers with question text.
 */
export async function GET(request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50)

  // Fetch completed exam/combo attempts
  const { data: attempts, error: attemptsError } = await supabase
    .from('practice_attempts')
    .select('id, mode, score_percent, started_at, completed_at')
    .eq('user_id', user.id)
    .in('mode', ['exam', 'combo'])
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (attemptsError) {
    console.error('[/api/quiz/history] Attempts query error:', attemptsError)
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 })
  }

  if (!attempts || attempts.length === 0) {
    return NextResponse.json({ attempts: [] })
  }

  // Fetch answers for all these attempts in one query
  const attemptIds = attempts.map(a => a.id)

  const { data: answers, error: answersError } = await supabase
    .from('practice_attempt_answers')
    .select('attempt_id, is_correct, typed_answer, civics_questions(question_text, official_answer, category)')
    .in('attempt_id', attemptIds)
    .order('created_at', { ascending: true })

  if (answersError) {
    console.error('[/api/quiz/history] Answers query error:', answersError)
    // Return attempts without answers rather than failing entirely
    return NextResponse.json({ attempts: attempts.map(a => ({ ...a, answers: [] })) })
  }

  // Group answers by attempt_id
  const answersByAttempt = {}
  for (const ans of answers || []) {
    if (!answersByAttempt[ans.attempt_id]) answersByAttempt[ans.attempt_id] = []
    answersByAttempt[ans.attempt_id].push({
      isCorrect: ans.is_correct,
      userAnswer: ans.typed_answer,
      questionText: ans.civics_questions?.question_text,
      officialAnswer: ans.civics_questions?.official_answer,
      category: ans.civics_questions?.category,
    })
  }

  const result = attempts.map(attempt => ({
    id: attempt.id,
    mode: attempt.mode,
    scorePercent: attempt.score_percent,
    completedAt: attempt.completed_at,
    answers: answersByAttempt[attempt.id] || [],
  }))

  return NextResponse.json({ attempts: result })
}
