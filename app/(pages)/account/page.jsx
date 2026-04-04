'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Flag, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import PageBanner from '@/components/PageBanner'
import { createClient } from '@/lib/supabase'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(undefined) // undefined=loading, null=anon
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [questionBank, setQuestionBank] = useState(null)
  const [wordBankUrls, setWordBankUrls] = useState({ reading: null, writing: null })
  const [messages, setMessages] = useState({}) // { name, email, password, bank, wordBank }
  const [saving, setSaving] = useState({})     // { name, email, password, bank, readingUpload, writingUpload }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Load auth + settings
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user ?? null
      if (!u) { router.push('/login'); return }
      setUser(u)
      setFirstName(u.user_metadata?.first_name ?? '')
      setLastName(u.user_metadata?.last_name ?? '')
      setEmail(u.email ?? '')

      const [settingsRes, wordBankRes] = await Promise.all([
        fetch('/api/user/settings'),
        fetch('/api/admin/word-bank'),
      ])
      const settings = await settingsRes.json()
      const wb = await wordBankRes.json()
      if (settings.questionBank) setQuestionBank(settings.questionBank)
      setWordBankUrls(wb)
    })
  }, [router])

  function setMsg(key, text, type = 'success') {
    setMessages(prev => ({ ...prev, [key]: { text, type } }))
    setTimeout(() => setMessages(prev => { const next = { ...prev }; delete next[key]; return next }), 5000)
  }

  async function saveName(e) {
    e.preventDefault()
    setSaving(prev => ({ ...prev, name: true }))
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName.trim(), last_name: lastName.trim() },
    })
    setSaving(prev => ({ ...prev, name: false }))
    if (error) setMsg('name', error.message, 'error')
    else setMsg('name', 'Name updated successfully.')
  }

  async function saveEmail(e) {
    e.preventDefault()
    if (!email.trim() || email === user?.email) return
    setSaving(prev => ({ ...prev, email: true }))
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ email: email.trim() })
    setSaving(prev => ({ ...prev, email: false }))
    if (error) setMsg('email', error.message, 'error')
    else setMsg('email', 'Confirmation links sent to both your old and new email addresses.')
  }

  async function sendPasswordReset() {
    setSaving(prev => ({ ...prev, password: true }))
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setSaving(prev => ({ ...prev, password: false }))
    if (error) setMsg('password', error.message, 'error')
    else setMsg('password', 'Password reset email sent — check your inbox.')
  }

  async function saveBank(bank) {
    setSaving(prev => ({ ...prev, bank: true }))
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionBank: bank }),
    })
    setQuestionBank(bank)
    setSaving(prev => ({ ...prev, bank: false }))
    setMsg('bank', 'Test version saved.')
  }

  async function uploadWordBank(testType, file) {
    const key = `${testType}Upload`
    setSaving(prev => ({ ...prev, [key]: true }))
    const fd = new FormData()
    fd.append('testType', testType)
    fd.append('file', file)
    const res = await fetch('/api/admin/word-bank', { method: 'POST', body: fd })
    const data = await res.json()
    setSaving(prev => ({ ...prev, [key]: false }))
    if (data.ok) {
      setWordBankUrls(prev => ({ ...prev, [testType]: data.url }))
      setMsg('wordBank', `${testType === 'reading' ? 'Reading' : 'Writing'} word bank uploaded.`)
    } else {
      setMsg('wordBank', data.error || 'Upload failed.', 'error')
    }
  }

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        title="Profile Settings"
        description="Manage your account information and test preferences"
      />

      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">

          {/* Display Name */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Display Name</h2>
            </div>
            <form onSubmit={saveName} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving.name}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving.name ? 'Saving...' : 'Save Name'}
                </button>
                {messages.name && <Inline msg={messages.name} />}
              </div>
            </form>
          </section>

          {/* Email */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Email Address</h2>
            </div>
            <form onSubmit={saveEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving.email || !email.trim() || email === user?.email}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving.email ? 'Sending...' : 'Update Email'}
                </button>
                {messages.email && <Inline msg={messages.email} />}
              </div>
              <p className="text-xs text-muted-foreground">
                A confirmation link will be sent to both your old and new email addresses.
              </p>
            </form>
          </section>

          {/* Password */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Password</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We'll send a password reset link to <strong>{user?.email}</strong>.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={sendPasswordReset}
                disabled={saving.password}
                className="bg-muted hover:bg-accent px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving.password ? 'Sending...' : 'Send Password Reset Email'}
              </button>
              {messages.password && <Inline msg={messages.password} />}
            </div>
          </section>

          {/* Citizenship Test Version */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Citizenship Test Version</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              USCIS updated the civics test on October 20, 2025. Select the version that matches your application date. This controls which civics question set you practice on the{' '}
              <Link href="/learn" className="text-primary hover:underline">Learn page</Link>.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => saveBank('legacy')}
                disabled={saving.bank}
                className={`w-full border-2 rounded-xl p-4 text-left transition-colors ${
                  questionBank === 'legacy'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">I applied before October 20, 2025</div>
                <div className="text-sm text-muted-foreground">100-question civics test</div>
              </button>
              <button
                onClick={() => saveBank('2025')}
                disabled={saving.bank}
                className={`w-full border-2 rounded-xl p-4 text-left transition-colors ${
                  questionBank === '2025'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">I applied on or after October 20, 2025</div>
                <div className="text-sm text-muted-foreground">128-question civics test (2025 version)</div>
              </button>
            </div>
            {messages.bank && (
              <div className="mt-3"><Inline msg={messages.bank} /></div>
            )}
          </section>

          {/* Admin: Word Bank Files — only visible to admin */}
          {adminEmail && user?.email === adminEmail && (
            <section className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Upload className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Word Bank Files (Admin)</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Upload PDF or text files that users can download as reference materials for the reading and writing tests.
              </p>

              <div className="space-y-4">
                <WordBankUpload
                  label="Reading Test Word Bank"
                  currentUrl={wordBankUrls.reading}
                  uploading={saving.readingUpload}
                  onUpload={file => uploadWordBank('reading', file)}
                />
                <WordBankUpload
                  label="Writing Test Word Bank"
                  currentUrl={wordBankUrls.writing}
                  uploading={saving.writingUpload}
                  onUpload={file => uploadWordBank('writing', file)}
                />
              </div>
              {messages.wordBank && (
                <div className="mt-3"><Inline msg={messages.wordBank} /></div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  )
}

function Inline({ msg }) {
  const isError = msg.type === 'error'
  return (
    <span className={`flex items-center gap-1.5 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
      {isError
        ? <AlertCircle className="h-4 w-4 flex-shrink-0" />
        : <CheckCircle className="h-4 w-4 flex-shrink-0" />
      }
      {msg.text}
    </span>
  )
}

function WordBankUpload({ label, currentUrl, uploading, onUpload }) {
  function handleChange(e) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="border border-border rounded-xl p-4">
      <div className="text-sm font-medium mb-2">{label}</div>
      {currentUrl ? (
        <div className="flex items-center gap-3 mb-3">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline truncate"
          >
            {currentUrl.split('/').pop()}
          </a>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mb-3">No file uploaded yet.</p>
      )}
      <label className={`inline-flex items-center gap-2 cursor-pointer bg-muted hover:bg-accent px-4 py-2 rounded-xl text-sm font-medium transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        <Upload className="h-4 w-4" />
        {uploading ? 'Uploading...' : currentUrl ? 'Replace File' : 'Upload File'}
        <input type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={handleChange} />
      </label>
    </div>
  )
}
