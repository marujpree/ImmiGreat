'use client'

import { CheckCircle, XCircle, RotateCcw, BookOpen } from 'lucide-react'

/**
 * End-of-quiz summary screen.
 *
 * Props:
 *   correct     {number}
 *   total       {number}
 *   answers     {Array<{ question, userAnswer, isCorrect, feedback }>}
 *   onRetry     {() => void}   - restart same quiz
 *   onExit      {() => void}   - go back to topic list
 *   mode        {'practice'|'exam'|'review'}
 */
export default function QuizResults({ correct, total, answers, onRetry, onExit, mode }) {
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = mode === 'exam' ? (correct / total) >= 0.6 : scorePercent >= 70

  const missedQuestions = answers.filter(a => !a.isCorrect)

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className={`rounded-2xl p-8 text-center ${
        passed ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
      }`}>
        <div className={`text-6xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-orange-500'}`}>
          {scorePercent}%
        </div>
        <div className="text-lg font-medium mb-1">
          {correct} of {total} correct
        </div>
        {mode === 'exam' && (
          <div className={`text-base font-semibold mt-3 px-4 py-2 rounded-xl inline-block ${
            passed
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            {passed ? 'Practice Exam Passed! (6/10 required)' : 'Keep practicing — 6/10 needed to pass'}
          </div>
        )}
        {mode !== 'exam' && (
          <div className="text-muted-foreground text-sm mt-2">
            {passed ? 'Great work! Keep it up.' : 'Review the missed questions below and try again.'}
          </div>
        )}
      </div>

      {/* Missed questions */}
      {missedQuestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Questions to Review ({missedQuestions.length})
          </h3>
          <div className="space-y-3">
            {missedQuestions.map((a, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-4">
                <div className="font-medium text-sm mb-2">{a.question.question_text}</div>
                <div className="text-xs text-muted-foreground mb-1">Your answer: <span className="text-red-500">{a.userAnswer}</span></div>
                <div className="text-xs text-muted-foreground">Correct: <span className="text-green-600 font-medium">{a.question.official_answer}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Correct summary */}
      {answers.filter(a => a.isCorrect).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Answered correctly ({answers.filter(a => a.isCorrect).length})
          </h3>
          <div className="space-y-2">
            {answers.filter(a => a.isCorrect).map((a, i) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-sm">
                {a.question.question_text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <button
          onClick={onExit}
          className="flex items-center gap-2 bg-muted hover:bg-accent px-5 py-2.5 rounded-xl transition-colors font-medium"
        >
          <BookOpen className="h-4 w-4" />
          Back to Topics
        </button>
      </div>
    </div>
  )
}
