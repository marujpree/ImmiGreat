'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields'); return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); return
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy'); return
    }

    setLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: { first_name: formData.firstName, last_name: formData.lastName },
        },
      })
      if (signUpError) throw signUpError
      setMessage('Check your email to confirm your account, then sign in.')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      })
      if (oauthError) throw oauthError
    } catch (err) {
      setError(err.message || 'Google sign-in failed.')
      setLoading(false)
    }
  }

  function passwordStrength(pw) {
    if (pw.length < 6) return { label: 'weak', color: 'text-red-600' }
    if (pw.length < 10) return { label: 'medium', color: 'text-yellow-600' }
    return { label: 'strong', color: 'text-green-600' }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <div className="text-3xl text-primary font-medium">ImmiGreat</div>
            </Link>
            <h1 className="text-2xl mb-2 font-medium">Create Your Account</h1>
            <p className="text-muted-foreground">Start your personalized immigration journey today</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-6 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-6 text-sm">
              {message}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="mb-6 w-full flex items-center justify-center gap-3 border border-border rounded-lg px-4 py-3 text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text" id="firstName" name="firstName"
                    value={formData.firstName} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="First name" required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm mb-2">Last Name</label>
                <input
                  type="text" id="lastName" name="lastName"
                  value={formData.lastName} onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Last name" required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your.email@example.com" required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'} id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Create a strong password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-1 text-xs">
                  Password strength:{' '}
                  <span className={passwordStrength(formData.password).color}>
                    {passwordStrength(formData.password).label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm your password" required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Passwords match
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-border" />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
