import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

/**
 * GET /api/admin/word-bank
 * Public — returns word bank file URLs from site_resources.
 * { reading: url | null, writing: url | null }
 *
 * POST /api/admin/word-bank
 * Admin only (user email must match ADMIN_EMAIL env var).
 * Multipart form: testType ('reading' | 'writing'), file (PDF or text).
 * Uploads to Supabase Storage bucket 'word-banks', upserts URL in site_resources.
 * Returns { ok: true, url: string }
 */

export async function GET() {
  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .from('site_resources')
    .select('key, value')
    .in('key', ['word_bank_reading_url', 'word_bank_writing_url'])

  if (error) {
    console.error('[/api/admin/word-bank] GET error:', error)
    return NextResponse.json({ reading: null, writing: null })
  }

  const reading = data?.find(r => r.key === 'word_bank_reading_url')?.value ?? null
  const writing = data?.find(r => r.key === 'word_bank_writing_url')?.value ?? null

  return NextResponse.json({ reading, writing })
}

export async function POST(request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const testType = formData.get('testType')
  const file = formData.get('file')

  if (!['reading', 'writing'].includes(testType)) {
    return NextResponse.json({ error: 'Invalid testType' }, { status: 400 })
  }

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Upload file to Supabase Storage
  const ext = file.name.split('.').pop() || 'pdf'
  const fileName = `${testType}-word-bank.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await adminClient.storage
    .from('word-banks')
    .upload(fileName, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    })

  if (uploadError) {
    console.error('[/api/admin/word-bank] Upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // Get public URL
  const { data: { publicUrl } } = adminClient.storage
    .from('word-banks')
    .getPublicUrl(fileName)

  // Upsert URL in site_resources
  const resourceKey = `word_bank_${testType}_url`
  const { error: upsertError } = await adminClient
    .from('site_resources')
    .upsert({ key: resourceKey, value: publicUrl, updated_at: new Date().toISOString() })

  if (upsertError) {
    console.error('[/api/admin/word-bank] Upsert error:', upsertError)
    return NextResponse.json({ error: 'Failed to save resource URL' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, url: publicUrl })
}
