import { NextResponse } from 'next/server'
import { askClaude } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/ai
 * Body: { message: string, systemPrompt?: string }
 *
 * Requires an authenticated Supabase session.
 * Returns: { reply: string }
 */
export async function POST(request) {
  // Auth guard
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { message, systemPrompt } = body

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json(
      { error: 'message is required and must be a non-empty string' },
      { status: 400 }
    )
  }

  try {
    const reply = await askClaude(message.trim(), systemPrompt)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('[/api/ai] Anthropic error:', error)
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again.' },
      { status: 502 }
    )
  }
}
