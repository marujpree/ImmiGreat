'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import SpeechButton from './SpeechButton'
import SpeechInput from './SpeechInput'

/**
 * Renders a single civics quiz question with typing + voice input.
 *
 * Props:
 *   question       {{ id, question_text, official_answer, category }}
 *   questionNumber {number}
 *   total          {number}
 *   onSubmit       {(answer: string, inputMode: 'typed'|'spoken') => void}
 *   isLoading      {boolean}
 */
export default function QuizQuestion({ question, questionNumber, total, onSubmit, isLoading }) {
  const [answer, setAnswer] = useState('')
  const [inputMode, setInputMode] = useState('typed')

  function handleTranscript(text) {
    setAnswer(text)
    setInputMode('spoken')
  }

  function handleChange(e) {
    setAnswer(e.target.value)
    setInputMode('typed')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!answer.trim() || isLoading) return
    onSubmit(answer.trim(), inputMode)
  }

  function handleKeyDown(e) {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold flex-shrink-0">
            {questionNumber}
          </div>
          <span className="text-sm text-muted-foreground">of {total} questions</span>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {question.category}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(questionNumber / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex items-start gap-3 mb-6">
        <p className="text-xl font-medium flex-1 leading-relaxed">{question.question_text}</p>
        <SpeechButton text={question.question_text} />
      </div>

      {/* Answer form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="quiz-answer" className="block text-sm font-medium text-muted-foreground mb-2">
            Your answer
          </label>
          <textarea
            id="quiz-answer"
            value={answer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            rows={3}
            disabled={isLoading}
            className="w-full border border-border rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50"
          />
          <div className="text-xs text-muted-foreground mt-1 text-right">
            Ctrl+Enter to submit
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SpeechInput onTranscript={handleTranscript} disabled={isLoading} />

          <button
            type="submit"
            disabled={!answer.trim() || isLoading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Checking...</>
            ) : (
              'Submit Answer'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
