'use client'

import { useState } from 'react'
import { BookOpen, Volume2, ChevronRight, Flag, CheckCircle, BarChart3, Play } from 'lucide-react'
import PageBanner from '@/components/PageBanner'

const englishLessons = [
  { id: 'basics', title: 'Basic Greetings', level: 'Beginner', progress: 75, lessons: 8 },
  { id: 'numbers', title: 'Numbers & Counting', level: 'Beginner', progress: 60, lessons: 6 },
  { id: 'shopping', title: 'Shopping & Money', level: 'Intermediate', progress: 40, lessons: 10 },
  { id: 'medical', title: 'Medical Appointments', level: 'Intermediate', progress: 20, lessons: 12 },
  { id: 'work', title: 'Work & Employment', level: 'Advanced', progress: 0, lessons: 15 },
  { id: 'government', title: 'Government Services', level: 'Advanced', progress: 0, lessons: 10 },
]

const vocabularyCategories = [
  { title: 'Daily Life', words: 150, icon: '🏠' },
  { title: 'Food & Dining', words: 120, icon: '🍽️' },
  { title: 'Transportation', words: 80, icon: '🚗' },
  { title: 'Healthcare', words: 95, icon: '🏥' },
  { title: 'Banking', words: 70, icon: '🏦' },
  { title: 'Education', words: 110, icon: '📚' },
]

const citizenshipTopics = [
  { id: 'principles', title: 'Principles of American Democracy', questions: 12, completed: 8 },
  { id: 'system', title: 'System of Government', questions: 15, completed: 10 },
  { id: 'rights', title: 'Rights and Responsibilities', questions: 10, completed: 6 },
  { id: 'history', title: 'American History', questions: 23, completed: 15 },
  { id: 'geography', title: 'Geography', questions: 12, completed: 8 },
  { id: 'symbols', title: 'Symbols and Holidays', questions: 10, completed: 5 },
]

const practiceCivicsQuestions = [
  { question: 'What is the supreme law of the land?', answer: 'The Constitution', options: ['The Declaration of Independence', 'The Constitution', 'The Bill of Rights', 'Federal Law'] },
  { question: 'What does the Constitution do?', answer: 'Sets up the government, defines the government, and protects basic rights of Americans', options: ['Declares independence from England', 'Sets up the government, defines the government, and protects basic rights of Americans', 'Creates state governments', 'Establishes the Supreme Court'] },
  { question: 'The idea of self-government is in the first three words of the Constitution. What are these words?', answer: 'We the People', options: ['We the People', 'In Congress Assembled', 'We hold these truths', 'Four score and seven'] },
]

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('english')

  return (
    <div>
      <PageBanner
        imageUrl="https://images.unsplash.com/photo-1641189684174-16e53d9cc829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHVsdCUyMGVkdWNhdGlvbiUyMGxhbmd1YWdlJTIwbGVzc29uJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzc1MjQxNDc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Learn & Prepare"
        description="Master English and prepare for your citizenship test with interactive lessons, practice questions, and progress tracking"
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-xl p-1 inline-flex">
              <button
                onClick={() => setActiveTab('english')}
                className={`px-8 py-3 rounded-lg transition-colors ${activeTab === 'english' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2"><BookOpen className="h-5 w-5" />English Learning</div>
              </button>
              <button
                onClick={() => setActiveTab('citizenship')}
                className={`px-8 py-3 rounded-lg transition-colors ${activeTab === 'citizenship' ? 'bg-white shadow-md' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-2"><Flag className="h-5 w-5" />Citizenship Prep</div>
              </button>
            </div>
          </div>

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
                          <div className="text-sm text-muted-foreground">{lesson.level} • {lesson.lessons} lessons</div>
                        </div>
                        <button className="bg-primary text-white rounded-full p-2 hover:opacity-90" aria-label="Play lesson">
                          <Play className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{lesson.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${lesson.progress}%` }} />
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-muted hover:bg-accent text-foreground px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                        {lesson.progress > 0 ? 'Continue' : 'Start'} Lesson <ChevronRight className="h-4 w-4" />
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

          {activeTab === 'citizenship' && (
            <div className="space-y-8">
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
                    <div className="bg-blue-50 rounded-xl p-4 text-center"><div className="text-2xl font-semibold text-blue-600">100</div><div className="text-sm text-muted-foreground">Official Questions</div></div>
                    <div className="bg-green-50 rounded-xl p-4 text-center"><div className="text-2xl font-semibold text-green-600">52</div><div className="text-sm text-muted-foreground">Questions Mastered</div></div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center"><div className="text-2xl font-semibold text-orange-600">48</div><div className="text-sm text-muted-foreground">To Review</div></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-6 font-medium">Study Topics</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {citizenshipTopics.map((topic) => (
                    <div key={topic.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl mb-2 font-medium">{topic.title}</h4>
                          <div className="text-sm text-muted-foreground">{topic.completed} of {topic.questions} questions completed</div>
                        </div>
                        <BarChart3 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="mb-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(topic.completed / topic.questions) * 100}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                          <BookOpen className="h-4 w-4" />Study
                        </button>
                        <button className="flex-1 bg-muted hover:bg-accent px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Volume2 className="h-4 w-4" />Listen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-6 font-medium">Practice Quiz</h3>
                <div className="bg-white border border-border rounded-2xl p-8">
                  <div className="space-y-6">
                    {practiceCivicsQuestions.map((q, idx) => (
                      <div key={idx} className="pb-6 border-b border-border last:border-0">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">{idx + 1}</div>
                          <div className="flex-1">
                            <h4 className="text-lg mb-4">{q.question}</h4>
                            <div className="space-y-2">
                              {q.options.map((option, oidx) => (
                                <button key={oidx} className={`w-full text-left p-3 rounded-xl border transition-colors ${option === q.answer ? 'border-secondary bg-secondary/10' : 'border-border hover:bg-muted'}`}>
                                  {option}
                                  {option === q.answer && <CheckCircle className="inline-block h-4 w-4 text-secondary ml-2" />}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button className="text-primary hover:bg-primary/10 rounded-lg p-2" aria-label="Listen to question">
                            <Volume2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">Start Full Practice Test</button>
                    <button className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors">Flashcards</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
