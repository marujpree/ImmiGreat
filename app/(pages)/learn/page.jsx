'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Flag, CheckCircle, BarChart3, Mic, ClipboardList, ChevronDown, ChevronUp, XCircle } from 'lucide-react'
import PageBanner from '@/components/PageBanner'
import QuizEngine from '@/components/learn/QuizEngine'
import WritingTestEngine from '@/components/learn/WritingTestEngine'
import ReadingTestEngine from '@/components/learn/ReadingTestEngine'
import { createClient } from '@/lib/supabase'

const citizenshipTopics = [
  { id: 'Principles of American Democracy', title: 'Principles of American Democracy', questions: 16 },
  { id: 'System of Government', title: 'System of Government', questions: 32 },
  { id: 'Rights and Responsibilities', title: 'Rights and Responsibilities', questions: 15 },
  { id: 'Colonial Period and Independence', title: 'Colonial Period and Independence', questions: 17 },
  { id: '1800s', title: 'American History: 1800s', questions: 10 },
  { id: 'Recent American History', title: 'Recent American History', questions: 13 },
  { id: 'Geography', title: 'Geography', questions: 8 },
  { id: 'Symbols and Holidays', title: 'Symbols and Holidays', questions: 8 },
]


export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('citizenship')
  const [citizenshipTab, setCitizenshipTab] = useState('practice') // 'practice' | 'past-exams'
  const [activeQuiz, setActiveQuiz] = useState(null)  // { mode, category } | null
  const [user, setUser] = useState(undefined)          // undefined=loading, null=anon, object=authed
  const [progress, setProgress] = useState({})
  const [examHistory, setExamHistory] = useState(null)
  const [expandedAttempt, setExpandedAttempt] = useState(null)
  const [questionBank, setQuestionBank] = useState(null)
  const [showBankPrompt, setShowBankPrompt] = useState(false)
  const [englishStatus, setEnglishStatus] = useState(null) // { reading, writing }

  // Load auth state and user settings
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user ?? null
      setUser(u)
      if (u) {
        const [settingsRes, englishRes] = await Promise.all([
          fetch('/api/user/settings'),
          fetch('/api/english-test'),
        ])
        const s = await settingsRes.json()
        const e = await englishRes.json()
        if (s.questionBank) setQuestionBank(s.questionBank)
        else setShowBankPrompt(true)
        if (!e.error) setEnglishStatus(e)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load user progress per category when logged in
  useEffect(() => {
    if (!user) return
    loadProgress()
  }, [user])

  function loadProgress() {
    const supabase = createClient()
    supabase
      .from('user_question_progress')
      .select('question_id, mastery_score, times_correct, civics_questions(category)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return
        const byCategory = {}
        for (const row of data) {
          const cat = row.civics_questions?.category
          if (!cat) continue
          if (!byCategory[cat]) byCategory[cat] = { seen: 0, mastered: 0 }
          byCategory[cat].seen++
          if (row.mastery_score >= 0.75 && row.times_correct >= 3) byCategory[cat].mastered++
        }
        setProgress(byCategory)
      })
  }

  async function refreshEnglishStatus() {
    const res = await fetch('/api/english-test')
    const data = await res.json()
    if (!data.error) setEnglishStatus(data)
  }

  function launchQuiz(mode, category = null) {
    if (!user) return
    setActiveQuiz({ mode, category })
  }

  function exitQuiz() {
    setActiveQuiz(null)
    if (user) loadProgress()
  }

  async function loadExamHistory() {
    const res = await fetch('/api/quiz/history?limit=10')
    const data = await res.json()
    setExamHistory(data.attempts || [])
  }

  // Auth gate: show a sign-in prompt instead of launching quiz
  const AuthGate = ({ children }) => {
    if (user === undefined) return null
    if (user) return children
    return (
      <a href="/login" className="text-sm text-primary hover:underline font-medium">
        Sign in to start
      </a>
    )
  }

  const readingPassed = (englishStatus?.reading?.consecutivePasses ?? 0) >= 2
  const writingPassed = (englishStatus?.writing?.consecutivePasses ?? 0) >= 2

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1641189684174-16e53d9cc829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHVsdCUyMGVkdWNhdGlvbiUyMGxhbmd1YWdlJTIwbGVzc29uJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzc1MjQxNDc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Learn & Prepare"
        description="Master English and prepare for your citizenship test with interactive lessons, practice questions, and progress tracking"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Outer tab switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-xl p-1 inline-flex flex-wrap gap-1">
              <button
                onClick={() => { setActiveTab('english'); setActiveQuiz(null) }}
                className={`px-6 py-3 rounded-lg transition-colors ${activeTab === 'english' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  English
                  {user && readingPassed && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </button>
              <button
                onClick={() => { setActiveTab('writing'); setActiveQuiz(null) }}
                className={`px-6 py-3 rounded-lg transition-colors ${activeTab === 'writing' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Writing Test Prep
                  {user && writingPassed && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </button>
              <button
                onClick={() => { setActiveTab('citizenship'); setActiveQuiz(null) }}
                className={`px-6 py-3 rounded-lg transition-colors ${activeTab === 'citizenship' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2"><Flag className="h-5 w-5" />Citizenship Prep</div>
              </button>
            </div>
          </div>

          {/* ---- ENGLISH (READING) TAB ---- */}
          {activeTab === 'english' && (
            <>
              {user && englishStatus?.reading && (
                <div className={`max-w-2xl mx-auto mb-4 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 ${readingPassed ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {readingPassed
                    ? <><CheckCircle className="h-4 w-4 flex-shrink-0" /> Reading Test Passed ✓ — last attempt: {englishStatus.reading.lastCorrect}/{englishStatus.reading.lastTotal}</>
                    : <>Last attempt: {englishStatus.reading.lastCorrect}/{englishStatus.reading.lastTotal} — keep practicing to pass 2 in a row</>
                  }
                </div>
              )}
              <ReadingTestEngine user={user} onComplete={refreshEnglishStatus} />
            </>
          )}

          {/* ---- WRITING TEST PREP TAB ---- */}
          {activeTab === 'writing' && (
            <>
              {user && englishStatus?.writing && (
                <div className={`max-w-2xl mx-auto mb-4 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 ${writingPassed ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {writingPassed
                    ? <><CheckCircle className="h-4 w-4 flex-shrink-0" /> Writing Test Passed ✓ — last attempt: {englishStatus.writing.lastCorrect}/{englishStatus.writing.lastTotal}</>
                    : <>Last attempt: {englishStatus.writing.lastCorrect}/{englishStatus.writing.lastTotal} — keep practicing to pass 2 in a row</>
                  }
                </div>
              )}
              <WritingTestEngine user={user} onComplete={refreshEnglishStatus} />
            </>
          )}

          {/* ---- CITIZENSHIP TAB ---- */}
          {activeTab === 'citizenship' && (
            <div className="space-y-8">

              {activeQuiz ? (
                <QuizEngine
                  mode={activeQuiz.mode}
                  category={activeQuiz.category}
                  onExit={exitQuiz}
                />
              ) : (
                <>
                  {/* Hero stats */}
                  <div className="bg-muted border border-border rounded-3xl p-8">
                    <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto">
                      <div className="flex items-center gap-4 mb-4">
                        <Flag className="h-12 w-12 text-blue-600" />
                        <div>
                          <h2 className="text-3xl font-medium">U.S. Citizenship Test Preparation</h2>
                          <p className="text-lg text-muted-foreground">Master all {questionBank === 'legacy' ? 100 : 128} civics questions</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-semibold text-blue-600">
                            {questionBank === 'legacy' ? 100 : 128}
                          </div>
                          <div className="text-sm text-muted-foreground">Official Questions</div>
                          {user && (
                            <Link
                              href="/account"
                              className="text-xs text-primary hover:underline mt-1 block"
                            >
                              Change test version
                            </Link>
                          )}
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-semibold text-green-600">
                            {user ? Object.values(progress).reduce((sum, p) => sum + (p.mastered || 0), 0) : '—'}
                          </div>
                          <div className="text-sm text-muted-foreground">Questions Mastered</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-semibold text-orange-600">
                            {user ? (questionBank === 'legacy' ? 100 : 128) - Object.values(progress).reduce((sum, p) => sum + (p.mastered || 0), 0) : '—'}
                          </div>
                          <div className="text-sm text-muted-foreground">Still Learning</div>
                        </div>
                      </div>

                      {/* Voice info banner */}
                      <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-start gap-3">
                        <Mic className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary">
                          The real USCIS civics test is an oral exam — practice speaking your answers aloud using the voice button on each question.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank prompt banner (non-blocking, replaces modal) */}
                  {showBankPrompt && user && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
                      <p className="text-sm text-amber-800">
                        You haven't set your citizenship test version yet. Select it in Profile Settings to customize your question bank.
                      </p>
                      <Link
                        href="/account"
                        className="text-sm font-medium text-amber-900 hover:underline whitespace-nowrap"
                      >
                        Go to Settings →
                      </Link>
                    </div>
                  )}

                  {/* Inner navigation tabs */}
                  <div className="bg-muted rounded-xl p-1 inline-flex gap-1">
                    <button
                      onClick={() => setCitizenshipTab('practice')}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${citizenshipTab === 'practice' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                    >
                      Practice
                    </button>
                    <button
                      onClick={async () => {
                        setCitizenshipTab('past-exams')
                        if (examHistory === null) await loadExamHistory()
                      }}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${citizenshipTab === 'past-exams' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                    >
                      Past Exams
                    </button>
                    <AuthGate>
                      <button
                        onClick={() => launchQuiz('mastered')}
                        className="px-5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/50"
                      >
                        Passed Questions
                      </button>
                    </AuthGate>
                  </div>

                  {/* ── Practice tab ── */}
                  {citizenshipTab === 'practice' && (
                    <div className="space-y-8">
                      {/* Exam cards */}
                      <div>
                        <h3 className="text-xl font-medium mb-4">Exams</h3>
                        <div className="grid grid-cols-2 gap-4 max-w-lg">
                          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col justify-between aspect-square">
                            <div>
                              <Flag className="h-8 w-8 text-primary mb-3" />
                              <div className="font-semibold text-base mb-1">Full Mock Test</div>
                              <div className="text-xs text-muted-foreground">20 questions · Pass 12/20</div>
                            </div>
                            <div className="mt-4">
                              <AuthGate>
                                <button
                                  onClick={() => launchQuiz('combo')}
                                  className="w-full bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                  Start
                                </button>
                              </AuthGate>
                            </div>
                          </div>
                          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col justify-between aspect-square">
                            <div>
                              <BarChart3 className="h-8 w-8 text-primary mb-3" />
                              <div className="font-semibold text-base mb-1">Quick Exam</div>
                              <div className="text-xs text-muted-foreground">10 questions · Pass 6/10</div>
                            </div>
                            <div className="mt-4">
                              <AuthGate>
                                <button
                                  onClick={() => launchQuiz('exam')}
                                  className="w-full bg-muted hover:bg-accent px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                >
                                  Start
                                </button>
                              </AuthGate>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Topic cards */}
                      <div>
                        <h3 className="text-2xl mb-6 font-medium">Study by Topic</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {citizenshipTopics.map((topic) => {
                            const tp = progress[topic.id] || { seen: 0, mastered: 0 }
                            const pct = topic.questions > 0
                              ? Math.round((tp.mastered / topic.questions) * 100)
                              : 0

                            return (
                              <div key={topic.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="text-xl mb-2 font-medium">{topic.title}</h4>
                                    <div className="text-sm text-muted-foreground">
                                      {user ? `${tp.mastered} of ${topic.questions} mastered` : `${topic.questions} questions`}
                                    </div>
                                  </div>
                                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="mb-4">
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <AuthGate>
                                    <button
                                      onClick={() => launchQuiz('practice', topic.id)}
                                      className="flex-1 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                                    >
                                      <BookOpen className="h-4 w-4" />Practice Quiz
                                    </button>
                                  </AuthGate>
                                  {!user && (
                                    <a
                                      href="/login"
                                      className="flex-1 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                                    >
                                      <BookOpen className="h-4 w-4" />Sign in to Practice
                                    </a>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Past Exams tab ── */}
                  {citizenshipTab === 'past-exams' && (
                    <div className="bg-white border border-border rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />Past Exam Results
                      </h3>
                      {!user ? (
                        <p className="text-muted-foreground text-sm">
                          <a href="/login" className="text-primary hover:underline">Sign in</a> to see your exam history.
                        </p>
                      ) : examHistory === null ? (
                        <p className="text-muted-foreground text-sm">Loading...</p>
                      ) : examHistory.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No completed exams yet. Take a Full Mock Test or Quick Exam to see results here.</p>
                      ) : (
                        <div className="space-y-3">
                          {examHistory.map((attempt) => {
                            const correct = attempt.answers.filter(a => a.isCorrect).length
                            const total = attempt.answers.length
                            const passed = attempt.mode === 'combo' ? correct >= 12 : (correct / total) >= 0.6
                            const isExpanded = expandedAttempt === attempt.id
                            const date = new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                            return (
                              <div key={attempt.id} className="border border-border rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setExpandedAttempt(isExpanded ? null : attempt.id)}
                                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    {passed
                                      ? <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                      : <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                    }
                                    <div>
                                      <span className="font-medium text-sm">
                                        {attempt.mode === 'combo' ? 'Full Mock Test' : 'Quick Exam'}
                                      </span>
                                      <span className="text-muted-foreground text-sm ml-2">— {date}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm font-semibold ${passed ? 'text-green-600' : 'text-red-500'}`}>
                                      {correct}/{total} {passed ? '✓ Passed' : '✗ Failed'}
                                    </span>
                                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div className="border-t border-border divide-y divide-border">
                                    {attempt.answers.map((ans, i) => (
                                      <div key={i} className="px-4 py-3 flex items-start gap-3">
                                        {ans.isCorrect
                                          ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                          : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        }
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium">{ans.questionText}</p>
                                          <p className="text-xs text-muted-foreground mt-0.5">Your answer: <span className={ans.isCorrect ? 'text-green-600' : 'text-red-500'}>{ans.userAnswer || '(no answer)'}</span></p>
                                          {!ans.isCorrect && (
                                            <p className="text-xs text-muted-foreground mt-0.5">Correct: <span className="text-green-600 font-medium">{ans.officialAnswer}</span></p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
