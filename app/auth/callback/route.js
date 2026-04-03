import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(safeNext, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin))
}
