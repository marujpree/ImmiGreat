'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = useMemo(() => {
    const n = searchParams.get('next') || searchParams.get('redirectTo')
    if (n && n.startsWith('/') && !n.startsWith('//')) return n
    return '/dashboard'
  }, [searchParams])

  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  async function handlePasswordAuth(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        })

        if (signUpError) throw signUpError

        setMessage('Check your email to confirm your account, then sign in.')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        router.replace(nextPath)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e) {
    e.preventDefault()

    if (!email.trim()) {
      setError('Enter your email above, then request the magic link.')
      return
    }

    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      })

      if (otpError) throw otpError

      setMessage('We sent a sign-in link to your email.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      })

      if (oauthError) throw oauthError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.')
      setLoading(false)
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault()

    if (!email.trim()) {
      setError('Enter your email above, then click forgot password.')
      return
    }

    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      })

      if (resetError) throw resetError

      setMessage('If that email is registered, a reset link will be sent shortly.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Continue with Google, magic link, or email and password.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="mb-4 inline-flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        <span aria-hidden="true">G</span>
        Continue with Google
      </button>

      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handlePasswordAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          className="font-medium text-brand-600 transition-colors hover:text-brand-700 disabled:opacity-50"
        >
          Email me a magic link
        </button>

        {mode === 'signin' && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            className="text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50"
          >
            Forgot password?
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        {mode === 'signin' ? 'No account yet?' : 'Already have an account?'}{' '}
        <button
          type="button"
          className="font-semibold text-brand-600 hover:text-brand-700"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setMessage(null)
          }}
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
