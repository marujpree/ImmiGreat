'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import QuizQuestion from './QuizQuestion'
import QuizFeedback from './QuizFeedback'
import QuizResults from './QuizResults'

const COMBO_PASS_THRESHOLD = 12  // 2025 standard: 12/20 correct to pass

const MODE_LABELS = {
  practice: 'Practice',
  exam: 'Practice Exam',
  review: 'Review',
  mastered: 'Passed Questions',
  combo: 'Full Mock Test',
}

export default function QuizEngine({ mode, category, onExit }) {
  const [phase, setPhase] = useState('loading')
  const [error, setError] = useState(null)

  const [attemptId, setAttemptId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [currentAnswer, setCurrentAnswer] = useState('')
  const [currentInputMode, setCurrentInputMode] = useState('typed')
  const [feedback, setFeedback] = useState(null)
  const [answerStartTime, setAnswerStartTime] = useState(null)

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

      // Calculate if this is the final answer
      const updatedCorrect = answers.filter(a => a.isCorrect).length + (result.correct ? 1 : 0)
      const isComboComplete = mode === 'combo' && updatedCorrect >= COMBO_PASS_THRESHOLD
      const isFinal = currentIndex === questions.length - 1 || isComboComplete

      // Save to DB in background (always — saves mid-quiz progress)
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

      setAnswers(prev => [...prev, {
        question,
        userAnswer: answer,
        isCorrect: result.correct,
        feedback: result.feedback,
      }])

      setFeedback({
        isCorrect: result.correct,
        feedback: result.feedback,
        spellingNote: result.spellingNote || null,
        officialAnswer: question.official_answer,
        userAnswer: answer,
        isComboComplete,
      })

      setPhase('feedback')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  function handleNext() {
    // Combo mode: end quiz once threshold is reached
    const correctSoFar = answers.filter(a => a.isCorrect).length
    if (mode === 'combo' && correctSoFar >= COMBO_PASS_THRESHOLD) {
      setPhase('complete')
      return
    }

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
  const correctCount = answers.filter(a => a.isCorrect).length
  const isLastQuestion = currentIndex === questions.length - 1
    || (mode === 'combo' && correctCount + (feedback?.isCorrect ? 1 : 0) >= COMBO_PASS_THRESHOLD)

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
    const isMasteredEmpty = mode === 'mastered' && error?.includes('No mastered questions')
    return (
      <div className={`${isMasteredEmpty ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-2xl p-8 text-center`}>
        {isMasteredEmpty ? (
          <>
            <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <p className="font-medium text-blue-700 mb-2">No Passed Questions Yet</p>
            <p className="text-sm text-blue-600 mb-5">
              Answer at least 3 questions correctly to master them. Keep practicing!
            </p>
          </>
        ) : (
          <>
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <p className="font-medium text-red-700 mb-2">Something went wrong</p>
            <p className="text-sm text-red-600 mb-5">{error}</p>
            <button onClick={startQuiz} className="bg-primary text-white px-5 py-2 rounded-xl hover:opacity-90 mr-3">
              Try Again
            </button>
          </>
        )}
        <button onClick={onExit} className="bg-muted hover:bg-accent px-5 py-2 rounded-xl">
          Back to Topics
        </button>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <QuizResults
        correct={correctCount}
        total={answers.length}
        answers={answers}
        mode={mode}
        onRetry={startQuiz}
        onExit={onExit}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header: back link + mode badge + combo progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Topics
          </button>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">
            {MODE_LABELS[mode] ?? mode}
          </span>
        </div>

        {/* Combo progress tracker */}
        {mode === 'combo' && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-green-600">{correctCount}</span>
            <span className="text-muted-foreground">/ {COMBO_PASS_THRESHOLD} correct needed</span>
          </div>
        )}
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
          <div className="bg-white border border-border rounded-2xl p-6 opacity-60">
            <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
          </div>

          <QuizFeedback
            isCorrect={feedback.isCorrect}
            feedback={feedback.feedback}
            spellingNote={feedback.spellingNote}
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
