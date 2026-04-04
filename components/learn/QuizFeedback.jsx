'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import SpeechButton from './SpeechButton'

/**
 * Per-question feedback overlay shown after each answer.
 *
 * Props:
 *   isCorrect      {boolean}
 *   feedback       {string}    - Claude's one-sentence feedback
 *   officialAnswer {string}
 *   userAnswer     {string}
 *   spellingNote   {string|null} - optional spelling/pronunciation tip from Claude
 *   onNext         {() => void}
 *   isLastQuestion {boolean}
 */
export default function QuizFeedback({
  isCorrect,
  feedback,
  officialAnswer,
  userAnswer,
  spellingNote,
  onNext,
  isLastQuestion,
}) {
  return (
    <div className={`rounded-2xl border-2 p-6 md:p-8 ${
      isCorrect
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      {/* Result banner */}
      <div className="flex items-center gap-3 mb-5">
        {isCorrect
          ? <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
          : <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
        }
        <span className={`text-xl font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
          {isCorrect ? 'Correct!' : 'Not quite.'}
        </span>
      </div>

      {/* Claude's feedback */}
      <p className="text-base text-foreground mb-4">{feedback}</p>

      {/* Spelling / pronunciation note */}
      {spellingNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
          <span className="text-amber-500 text-sm mt-0.5">✏️</span>
          <p className="text-sm text-amber-800">{spellingNote}</p>
        </div>
      )}

      {/* Your answer vs official */}
      <div className="space-y-3 mb-6">
        <div className="bg-white/70 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-muted-foreground">Your answer</div>
            <SpeechButton text={userAnswer} size="sm" />
          </div>
          <div className="text-sm">{userAnswer}</div>
        </div>

        {!isCorrect && (
          <div className="bg-white/70 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-muted-foreground">Official answer(s)</div>
              <SpeechButton text={officialAnswer} size="sm" />
            </div>
            <div className="text-sm text-green-700 font-medium">{officialAnswer}</div>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-full bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        {isLastQuestion ? 'See Results' : 'Next Question →'}
      </button>
    </div>
  )
}
