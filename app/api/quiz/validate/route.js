import { NextResponse } from 'next/server'
import { askClaude } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/quiz/validate
 * Body: { questionText: string, officialAnswer: string, userAnswer: string }
 *
 * Uses Claude to semantically grade the user's answer against the official USCIS answer.
 * Returns: { correct: boolean, feedback: string }
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

  const { questionText, officialAnswer, userAnswer } = body

  if (!questionText || !officialAnswer || !userAnswer?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const systemPrompt = `You are a USCIS civics test grader. Your job is to determine if a student's answer is semantically equivalent to the official answer.

Key rules:
- The USCIS accepts many different phrasings for the same answer. Be lenient with wording.
- Partial answers are acceptable if they match one of the listed acceptable answers (answers separated by " / ").
- Minor spelling mistakes are fine as long as the meaning is clear.
- For questions with multiple acceptable answers (shown with " / "), the student only needs to give ONE correct answer.
- State-specific questions (Governor, Senator, Representative, state capital) should be marked correct if the student gives a plausible answer — you cannot verify state-specific facts.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{"correct": true, "feedback": "Great answer!"}
or
{"correct": false, "feedback": "Not quite. The correct answer is [hint]."}

Keep feedback to one short, encouraging sentence. If wrong, give a helpful hint without just repeating the full official answer.`

  const prompt = `Question: ${questionText}
Official answer(s): ${officialAnswer}
Student's answer: ${userAnswer.trim()}

Is the student's answer correct?`

  try {
    const raw = await askClaude(prompt, systemPrompt)

    // Parse Claude's JSON response
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response')
    }

    const result = JSON.parse(jsonMatch[0])

    if (typeof result.correct !== 'boolean' || typeof result.feedback !== 'string') {
      throw new Error('Invalid response shape')
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[/api/quiz/validate] Error:', error)
    // Fallback: do a simple case-insensitive substring check
    const normalized = userAnswer.trim().toLowerCase()
    const accepted = officialAnswer.split('/').map(a => a.trim().toLowerCase())
    const correct = accepted.some(a => normalized.includes(a) || a.includes(normalized))

    return NextResponse.json({
      correct,
      feedback: correct
        ? 'Good answer!'
        : `Not quite. Try reviewing the official answer.`,
    })
  }
}
