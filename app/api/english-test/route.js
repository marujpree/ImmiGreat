import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/english-test
 * Body: { testType: 'reading' | 'writing', correctCount: number }
 * Saves a completed test attempt. passed = correctCount >= 2.
 * Returns { ok: true, passed: boolean }
 *
 * GET /api/english-test
 * Returns the last 2 attempts per test type and consecutive pass streak.
 * {
 *   reading: { consecutivePasses: number, lastCorrect: number, lastTotal: number } | null,
 *   writing: { consecutivePasses: number, lastCorrect: number, lastTotal: number } | null
 * }
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

  const { testType, correctCount } = body

  if (!['reading', 'writing'].includes(testType)) {
    return NextResponse.json({ error: 'Invalid testType' }, { status: 400 })
  }

  if (typeof correctCount !== 'number' || correctCount < 0 || correctCount > 3) {
    return NextResponse.json({ error: 'Invalid correctCount' }, { status: 400 })
  }

  const passed = correctCount >= 2

  const { error } = await supabase
    .from('english_test_attempts')
    .insert({
      user_id: user.id,
      test_type: testType,
      correct_count: correctCount,
      total: 3,
      passed,
    })

  if (error) {
    console.error('[/api/english-test] Insert error:', error)
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, passed })
}

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch last 2 attempts for each test type
  const [readingRes, writingRes] = await Promise.all([
    supabase
      .from('english_test_attempts')
      .select('correct_count, total, passed')
      .eq('user_id', user.id)
      .eq('test_type', 'reading')
      .order('created_at', { ascending: false })
      .limit(2),
    supabase
      .from('english_test_attempts')
      .select('correct_count, total, passed')
      .eq('user_id', user.id)
      .eq('test_type', 'writing')
      .order('created_at', { ascending: false })
      .limit(2),
  ])

  function summarize(rows) {
    if (!rows || rows.length === 0) return null
    // Count consecutive passes from most recent
    let consecutivePasses = 0
    for (const row of rows) {
      if (row.passed) consecutivePasses++
      else break
    }
    return {
      consecutivePasses,
      lastCorrect: rows[0].correct_count,
      lastTotal: rows[0].total,
    }
  }

  return NextResponse.json({
    reading: summarize(readingRes.data),
    writing: summarize(writingRes.data),
  })
}
