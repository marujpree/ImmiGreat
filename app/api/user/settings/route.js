import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/user/settings
 * Returns { questionBank: 'legacy' | '2025' | null }
 *
 * PATCH /api/user/settings
 * Body: { questionBank: 'legacy' | '2025' }
 * Upserts the user's question bank preference.
 * Returns { ok: true }
 */

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await supabase
    .from('user_settings')
    .select('question_bank')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ questionBank: data?.question_bank ?? null })
}

export async function PATCH(request) {
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

  const { questionBank } = body

  if (!['legacy', '2025'].includes(questionBank)) {
    return NextResponse.json({ error: 'Invalid questionBank value' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, question_bank: questionBank, updated_at: new Date().toISOString() })

  if (error) {
    console.error('[/api/user/settings] Upsert error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
