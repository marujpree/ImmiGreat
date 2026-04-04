import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/quiz/transcribe
 * Body: multipart/form-data with field 'audio' (audio Blob)
 *
 * Sends audio to Groq Whisper for transcription.
 * Requires GROQ_API_KEY environment variable.
 * Returns: { text: string }
 */
export async function POST(request) {
  // Auth guard
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    return NextResponse.json({ error: 'Speech service not configured' }, { status: 503 })
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const audioFile = formData.get('audio')
  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
  }

  // Build the multipart request to Groq Whisper
  const groqForm = new FormData()
  groqForm.append('file', audioFile, 'audio.webm')
  groqForm.append('model', 'whisper-large-v3-turbo')
  groqForm.append('language', 'en')
  groqForm.append('response_format', 'json')

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: groqForm,
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[/api/quiz/transcribe] Groq error:', err)
      return NextResponse.json({ error: 'Transcription failed. Please try again.' }, { status: 502 })
    }

    const result = await response.json()
    return NextResponse.json({ text: result.text?.trim() ?? '' })
  } catch (error) {
    console.error('[/api/quiz/transcribe] Fetch error:', error)
    return NextResponse.json({ error: 'Transcription service unavailable.' }, { status: 502 })
  }
}
