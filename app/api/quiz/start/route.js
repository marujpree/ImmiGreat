import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/quiz/start
 * Body: { mode: 'practice' | 'exam' | 'review', category?: string }
 *
 * Creates a practice_attempts row and returns a question batch.
 *
 * Modes:
 *   practice - up to 10 questions filtered by category (or all if no category)
 *   exam     - 10 random questions, weighted toward lower mastery_score
 *   review   - SRS cards due now (due_at <= now())
 *
 * Returns: { attemptId: string, questions: Array<{ id, question_text, official_answer, category }> }
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

  const { mode = 'practice', category } = body

  if (!['practice', 'exam', 'review'].includes(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  }

  let questions = []

  if (mode === 'review') {
    // Fetch SRS cards that are due
    const { data: cards, error } = await supabase
      .from('spaced_repetition_cards')
      .select('question_id, civics_questions(id, question_text, official_answer, category)')
      .eq('user_id', user.id)
      .lte('due_at', new Date().toISOString())
      .limit(20)

    if (error) {
      console.error('[/api/quiz/start] SRS query error:', error)
      return NextResponse.json({ error: 'Failed to load review cards' }, { status: 500 })
    }

    questions = (cards || [])
      .map(c => c.civics_questions)
      .filter(Boolean)

  } else if (mode === 'exam') {
    // 10 random questions, prefer lower mastery
    const { data: all, error } = await supabase
      .from('civics_questions')
      .select('id, question_text, official_answer, category')
      .eq('is_active', true)

    if (error) {
      console.error('[/api/quiz/start] Questions query error:', error)
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    // Fetch user progress to weight toward weak questions
    const { data: progress } = await supabase
      .from('user_question_progress')
      .select('question_id, mastery_score')
      .eq('user_id', user.id)

    const masteryMap = {}
    for (const p of progress || []) {
      masteryMap[p.question_id] = p.mastery_score
    }

    // Sort by mastery ascending (unseen questions have no entry = 0), then shuffle top half
    const sorted = (all || []).sort((a, b) => {
      const ma = masteryMap[a.id] ?? 0
      const mb = masteryMap[b.id] ?? 0
      return ma - mb
    })

    // Pick 10: take from the lower-mastery pool with some randomness
    const pool = sorted.slice(0, Math.min(30, sorted.length))
    questions = pool.sort(() => Math.random() - 0.5).slice(0, 10)

  } else {
    // practice mode: filtered by category if provided
    let query = supabase
      .from('civics_questions')
      .select('id, question_text, official_answer, category')
      .eq('is_active', true)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.limit(10)

    if (error) {
      console.error('[/api/quiz/start] Questions query error:', error)
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    questions = data || []
  }

  if (questions.length === 0) {
    return NextResponse.json({ error: 'No questions available' }, { status: 404 })
  }

  // Create a practice attempt record
  const { data: attempt, error: attemptError } = await supabase
    .from('practice_attempts')
    .insert({ user_id: user.id, mode })
    .select('id')
    .single()

  if (attemptError) {
    console.error('[/api/quiz/start] Attempt insert error:', attemptError)
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 })
  }

  return NextResponse.json({
    attemptId: attempt.id,
    questions,
  })
}
