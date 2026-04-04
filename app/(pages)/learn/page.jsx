'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Volume2, ChevronRight, Flag, CheckCircle, BarChart3, Play, Mic } from 'lucide-react'
import PageBanner from '@/components/PageBanner'
import QuizEngine from '@/components/learn/QuizEngine'
import { createClient } from '@/lib/supabase'

const citizenshipTopics = [
  { id: 'Principles of American Democracy', title: 'Principles of American Democracy', questions: 12 },
  { id: 'System of Government', title: 'System of Government', questions: 20 },
  { id: 'Rights and Responsibilities', title: 'Rights and Responsibilities', questions: 10 },
  { id: 'Colonial Period and Independence', title: 'Colonial Period and Independence', questions: 13 },
  { id: '1800s', title: 'American History: 1800s', questions: 7 },
  { id: 'Recent American History', title: 'Recent American History', questions: 10 },
  { id: 'Geography', title: 'Geography', questions: 8 },
  { id: 'Symbols and Holidays', title: 'Symbols and Holidays', questions: 5 },
]

const englishLessons = [
  { id: 'basics', title: 'Basic Greetings', level: 'Beginner', lessons: 8 },
  { id: 'numbers', title: 'Numbers & Counting', level: 'Beginner', lessons: 6 },
  { id: 'shopping', title: 'Shopping & Money', level: 'Intermediate', lessons: 10 },
  { id: 'medical', title: 'Medical Appointments', level: 'Intermediate', lessons: 12 },
  { id: 'work', title: 'Work & Employment', level: 'Advanced', lessons: 15 },
  { id: 'government', title: 'Government Services', level: 'Advanced', lessons: 10 },
]

const vocabularyCategories = [
  { title: 'Daily Life', words: 150, icon: '🏠' },
  { title: 'Food & Dining', words: 120, icon: '🍽️' },
  { title: 'Transportation', words: 80, icon: '🚗' },
  { title: 'Healthcare', words: 95, icon: '🏥' },
  { title: 'Banking', words: 70, icon: '🏦' },
  { title: 'Education', words: 110, icon: '📚' },
]

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('citizenship')
  const [activeQuiz, setActiveQuiz] = useState(null) // { mode, category } | null
  const [user, setUser] = useState(undefined)        // undefined=loading, null=anon, object=authed
  const [progress, setProgress] = useState({})       // { [category]: { seen, correct } }

  // Load auth state
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load user progress per category when logged in
  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    async function loadProgress() {
      const { data } = await supabase
        .from('user_question_progress')
        .select('question_id, mastery_score, civics_questions(category)')
        .eq('user_id', user.id)

      if (!data) return

      const byCategory = {}
      for (const row of data) {
        const cat = row.civics_questions?.category
        if (!cat) continue
        if (!byCategory[cat]) byCategory[cat] = { seen: 0, mastered: 0 }
        byCategory[cat].seen++
        if (row.mastery_score >= 0.7) byCategory[cat].mastered++
      }
      setProgress(byCategory)
    }

    loadProgress()
  }, [user])

  function launchQuiz(mode, category = null) {
    if (!user) return  // button is disabled for anon users
    setActiveQuiz({ mode, category })
  }

  function exitQuiz() {
    setActiveQuiz(null)
    // Refresh progress
    if (user) {
      const supabase = createClient()
      supabase
        .from('user_question_progress')
        .select('question_id, mastery_score, civics_questions(category)')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (!data) return
          const byCategory = {}
          for (const row of data) {
            const cat = row.civics_questions?.category
            if (!cat) continue
            if (!byCategory[cat]) byCategory[cat] = { seen: 0, mastered: 0 }
            byCategory[cat].seen++
            if (row.mastery_score >= 0.7) byCategory[cat].mastered++
          }
          setProgress(byCategory)
        })
    }
  }

  // Auth gate: show a sign-in prompt instead of launching quiz
  const AuthGate = ({ children }) => {
    if (user === undefined) return null  // still loading
    if (user) return children
    return (
      <a
        href="/login"
        className="text-sm text-primary hover:underline font-medium"
      >
        Sign in to start
      </a>
    )
  }

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1641189684174-16e53d9cc829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHVsdCUyMGVkdWNhdGlvbiUyMGxhbmd1YWdlJTIwbGVzc29uJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzc1MjQxNDc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Learn & Prepare"
        description="Master English and prepare for your citizenship test with interactive lessons, practice questions, and progress tracking"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tab switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-xl p-1 inline-flex">
              <button
                onClick={() => { setActiveTab('english'); setActiveQuiz(null) }}
                className={`px-8 py-3 rounded-lg transition-colors ${activeTab === 'english' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2"><BookOpen className="h-5 w-5" />English Learning</div>
              </button>
              <button
                onClick={() => { setActiveTab('citizenship'); setActiveQuiz(null) }}
                className={`px-8 py-3 rounded-lg transition-colors ${activeTab === 'citizenship' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2"><Flag className="h-5 w-5" />Citizenship Prep</div>
              </button>
            </div>
          </div>

          {/* ---- ENGLISH TAB ---- */}
          {activeTab === 'english' && (
            <div className="space-y-8">
              <div className="bg-primary text-white rounded-3xl p-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl mb-4 font-medium">English Learning Path</h2>
                  <p className="text-lg opacity-90 mb-6">Build confidence with practical English lessons focused on everyday situations you&apos;ll encounter in the U.S.</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[{ n: '150+', l: 'Lessons' }, { n: '725', l: 'Vocabulary Words' }, { n: '100%', l: 'Audio Support' }].map((s) => (
                      <div key={s.l} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-semibold">{s.n}</div>
                        <div className="text-sm opacity-90">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-6 font-medium">Interactive Lessons</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {englishLessons.map((lesson) => (
                    <div key={lesson.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl mb-1 font-medium">{lesson.title}</h4>
                          <div className="text-sm text-muted-foreground">{lesson.level} · {lesson.lessons} lessons</div>
                        </div>
                        <button className="bg-primary text-white rounded-full p-2 hover:opacity-90" aria-label="Play lesson">
                          <Play className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-primary" style={{ width: '0%' }} />
                      </div>
                      <button className="w-full bg-muted hover:bg-accent text-foreground px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                        Start Lesson <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-6 font-medium">Vocabulary Builder</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {vocabularyCategories.map((cat, idx) => (
                    <div key={idx} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="text-4xl mb-3">{cat.icon}</div>
                      <h4 className="text-lg mb-1 font-medium">{cat.title}</h4>
                      <div className="text-sm text-muted-foreground">{cat.words} words</div>
                      <button className="mt-4 flex items-center gap-2 text-primary hover:underline">
                        <Volume2 className="h-4 w-4" />Practice now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- CITIZENSHIP TAB ---- */}
          {activeTab === 'citizenship' && (
            <div className="space-y-8">

              {/* If a quiz is active, show the engine */}
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
                          <p className="text-lg text-muted-foreground">Master all 100 civics questions</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-semibold text-blue-600">100</div>
                          <div className="text-sm text-muted-foreground">Official Questions</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-semibold text-green-600">
                            {user ? Object.values(progress).reduce((sum, p) => sum + (p.mastered || 0), 0) : '—'}
                          </div>
                          <div className="text-sm text-muted-foreground">Questions Mastered</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-semibold text-orange-600">
                            {user ? 100 - Object.values(progress).reduce((sum, p) => sum + (p.mastered || 0), 0) : '—'}
                          </div>
                          <div className="text-sm text-muted-foreground">To Review</div>
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

                  {/* Quick actions */}
                  <div className="flex flex-wrap gap-3">
                    <AuthGate>
                      <button
                        onClick={() => launchQuiz('exam')}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Flag className="h-4 w-4" />Start Practice Exam (10 questions)
                      </button>
                    </AuthGate>
                    <AuthGate>
                      <button
                        onClick={() => launchQuiz('review')}
                        className="bg-muted hover:bg-accent px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />Review Due Cards
                      </button>
                    </AuthGate>
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
