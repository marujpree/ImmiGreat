'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import QuizQuestion from './QuizQuestion'
import QuizFeedback from './QuizFeedback'
import QuizResults from './QuizResults'

/**
 * Orchestrates a full quiz session.
 * State machine: idle → loading → question → validating → feedback → (next question | complete)
 *
 * Props:
 *   mode       {'practice'|'exam'|'review'}
 *   category   {string|null}   - topic filter (practice mode only)
 *   onExit     {() => void}    - called when user exits back to topic list
 */
export default function QuizEngine({ mode, category, onExit }) {
  const [phase, setPhase] = useState('loading')  // 'loading' | 'question' | 'validating' | 'feedback' | 'complete' | 'error'
  const [error, setError] = useState(null)

  const [attemptId, setAttemptId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Per-question state
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [currentInputMode, setCurrentInputMode] = useState('typed')
  const [feedback, setFeedback] = useState(null)  // { isCorrect, feedback, officialAnswer }
  const [answerStartTime, setAnswerStartTime] = useState(null)

  // Accumulated results for the results screen
  const [answers, setAnswers] = useState([])

  const startQuiz = useCallback(async () => {
    setPhase('loading')
    setError(null)
    setCurrentIndex(0)
    setAnswers([])
    setFeedback(null)

    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, category }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start quiz')

      setAttemptId(data.attemptId)
      setQuestions(data.questions)
      setAnswerStartTime(Date.now())
      setPhase('question')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }, [mode, category])

  useEffect(() => {
    startQuiz()
  }, [startQuiz])

  async function handleSubmit(answer, inputMode) {
    setCurrentAnswer(answer)
    setCurrentInputMode(inputMode)
    setPhase('validating')

    const question = questions[currentIndex]
    const responseTimeMs = answerStartTime ? Date.now() - answerStartTime : null

    try {
      const res = await fetch('/api/quiz/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.question_text,
          officialAnswer: question.official_answer,
          userAnswer: answer,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Validation failed')

      const isFinal = currentIndex === questions.length - 1

      // Save to DB in background
      fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: question.id,
          isCorrect: result.correct,
          typedAnswer: answer,
          inputMode,
          responseTimeMs,
          isFinal,
        }),
      })

      // Accumulate answer for results screen
      setAnswers(prev => [...prev, {
        question,
        userAnswer: answer,
        isCorrect: result.correct,
        feedback: result.feedback,
      }])

      setFeedback({
        isCorrect: result.correct,
        feedback: result.feedback,
        officialAnswer: question.official_answer,
        userAnswer: answer,
      })

      setPhase('feedback')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  function handleNext() {
    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      setPhase('complete')
    } else {
      setCurrentIndex(nextIndex)
      setFeedback(null)
      setAnswerStartTime(Date.now())
      setPhase('question')
    }
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const correctCount = answers.filter(a => a.isCorrect).length

  // --- Render phases ---

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
        <p className="font-medium text-red-700 mb-2">Something went wrong</p>
        <p className="text-sm text-red-600 mb-5">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={startQuiz} className="bg-primary text-white px-5 py-2 rounded-xl hover:opacity-90">
            Try Again
          </button>
          <button onClick={onExit} className="bg-muted hover:bg-accent px-5 py-2 rounded-xl">
            Back to Topics
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <QuizResults
        correct={correctCount}
        total={questions.length}
        answers={answers}
        mode={mode}
        onRetry={startQuiz}
        onExit={onExit}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Mode badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExit}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Topics
        </button>
        <span className="text-muted-foreground">·</span>
        <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize font-medium">
          {mode} mode
        </span>
      </div>

      {phase === 'question' && currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          total={questions.length}
          onSubmit={handleSubmit}
          isLoading={false}
        />
      )}

      {phase === 'validating' && currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          total={questions.length}
          onSubmit={handleSubmit}
          isLoading={true}
        />
      )}

      {phase === 'feedback' && feedback && (
        <div className="space-y-4">
          {/* Keep question visible above feedback */}
          <div className="bg-white border border-border rounded-2xl p-6 opacity-60">
            <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
          </div>

          <QuizFeedback
            isCorrect={feedback.isCorrect}
            feedback={feedback.feedback}
            officialAnswer={feedback.officialAnswer}
            userAnswer={feedback.userAnswer}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
          />
        </div>
      )}
    </div>
  )
}
