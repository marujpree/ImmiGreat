'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import SpeechButton from './SpeechButton'
import SpeechInput from './SpeechInput'

const SENTENCES = [
  'What color is the American flag?',
  'Abraham Lincoln was a great President.',
  'George Washington was the Father of Our Country.',
  'The White House is in Washington, D.C.',
  'Who was the first President of the United States?',
  'Citizens have the right to vote.',
  'Congress meets in the capital city.',
  'We can vote for the President.',
  'What is the name of the President?',
  'The Bill of Rights is part of the government.',
  'Abraham Lincoln was the President during the Civil War.',
  'George Washington was the first President.',
  'Where does the President live?',
  'The United States flag has many colors.',
  'Who elects the President of the United States?',
  'The capital city is in the United States.',
  'Citizens can vote in the United States.',
  'What do we pay to the government?',
  'Senators meet in Congress.',
  'Why do we have a Bill of Rights?',
]

function normalizeStr(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function contentWords(s, minLen) {
  return normalizeStr(s).split(/\s+/).filter(w => w.length > minLen)
}

function isReadingCorrect(transcript, target) {
  const tw = contentWords(target, 2)
  if (!tw.length) return true
  const uw = new Set(contentWords(transcript, 2))
  return tw.filter(w => uw.has(w)).length / tw.length >= 0.6
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

/**
 * USCIS Reading Test simulation.
 * 3 sentences. User reads each one aloud via microphone.
 * Groq Whisper transcribes, then validates with 60% content word overlap.
 * Pass = 2 or more correct out of 3 (2 consecutive sessions to be considered "passed").
 */
export default function ReadingTestEngine({ user, onComplete }) {
  const [sentences] = useState(() => pickRandom(SENTENCES, 3))
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState('reading') // reading | transcribed | feedback | results
  const [transcript, setTranscript] = useState('')
  const [results, setResults] = useState([])
  const [showWordBank, setShowWordBank] = useState(false)
  const [wordBankUrl, setWordBankUrl] = useState(undefined) // undefined=not fetched, null=none, string=url
  const [loadingWordBank, setLoadingWordBank] = useState(false)

  async function fetchWordBankUrl() {
    if (wordBankUrl !== undefined) return wordBankUrl
    setLoadingWordBank(true)
    try {
      const res = await fetch('/api/admin/word-bank')
      const data = await res.json()
      setWordBankUrl(data.reading ?? null)
      return data.reading ?? null
    } catch {
      setWordBankUrl(null)
      return null
    } finally {
      setLoadingWordBank(false)
    }
  }

  async function handleWordBankClick() {
    if (!showWordBank) {
      const url = await fetchWordBankUrl()
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
        return
      }
    }
    setShowWordBank(v => !v)
  }

  function handleTranscript(text) {
    setTranscript(text)
    setPhase('transcribed')
  }

  function handleSubmit() {
    const correct = isReadingCorrect(transcript, sentences[round])
    const updated = [...results, { sentence: sentences[round], transcript, correct }]
    setResults(updated)

    if (round === 2) {
      const correctCount = updated.filter(r => r.correct).length
      // Save attempt if user is logged in (fire-and-forget)
      if (user) {
        fetch('/api/english-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testType: 'reading', correctCount }),
        }).then(() => {
          if (onComplete) onComplete()
        }).catch(() => {})
      }
      setPhase('results')
    } else {
      setPhase('feedback')
    }
  }

  function handleNext() {
    setRound(r => r + 1)
    setTranscript('')
    setPhase('reading')
  }

  function handleRetry() {
    setRound(0)
    setTranscript('')
    setResults([])
    setPhase('reading')
  }

  const passed = results.filter(r => r.correct).length >= 2

  // Results screen
  if (phase === 'results') {
    const correctCount = results.filter(r => r.correct).length
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`rounded-2xl p-8 text-center ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'}`}>
          {passed
            ? <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            : <XCircle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
          }
          <div className={`text-2xl font-bold mb-1 ${passed ? 'text-green-700' : 'text-orange-600'}`}>
            {passed ? 'Reading Test Passed!' : 'Keep Practicing'}
          </div>
          <div className="text-muted-foreground">
            {correctCount} of 3 sentences correct — 2 needed to pass
          </div>
          {!user && (
            <p className="text-sm text-muted-foreground mt-2">
              <a href="/login" className="text-primary hover:underline">Sign in</a> to track your progress.
            </p>
          )}
        </div>

        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className={`border rounded-xl p-4 ${r.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-2 mb-2">
                {r.correct
                  ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  : <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Sentence:</div>
                  <div className="font-medium">{r.sentence}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Transcribed: <span className={r.correct ? 'text-green-700' : 'text-red-600'}>
                  {r.transcript || '(no audio detected)'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            <RotateCcw className="h-4 w-4" />Try Again
          </button>
          <WordBankButton wordBankUrl={wordBankUrl} loading={loadingWordBank} onClick={handleWordBankClick} />
        </div>
      </div>
    )
  }

  const currentSentence = sentences[round]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-primary text-white rounded-2xl p-6">
        <h2 className="text-2xl font-medium mb-1">English Reading Test Prep</h2>
        <p className="opacity-90 text-sm">
          Read each sentence aloud. You need 2 out of 3 correct to pass.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={`flex-1 h-2 rounded-full ${i < round ? 'bg-primary' : i === round ? 'bg-primary/40' : 'bg-muted'}`} />
        ))}
        <span className="text-sm text-muted-foreground ml-2">Sentence {round + 1} of 3</span>
      </div>

      {(phase === 'reading' || phase === 'transcribed') && (
        <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
          {/* Sentence display */}
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-2">Read this sentence aloud:</div>
              <div className="text-2xl font-medium leading-snug">{currentSentence}</div>
            </div>
          </div>

          {/* Reference audio */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SpeechButton text={currentSentence} size="sm" />
            <span>Listen to pronunciation</span>
          </div>

          {/* Microphone input */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Now read it aloud:</div>
            <SpeechInput key={round} onTranscript={handleTranscript} />
          </div>

          {/* Transcript preview + submit */}
          {phase === 'transcribed' && transcript && (
            <div className="space-y-3">
              <div className="bg-muted rounded-xl px-4 py-3 text-sm">
                <span className="text-muted-foreground">You said: </span>
                <span className="font-medium">{transcript}</span>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'feedback' && (
        <div className="space-y-3">
          {results[round] && (
            <div className={`border-2 rounded-2xl p-6 ${results[round].correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                {results[round].correct
                  ? <CheckCircle className="h-6 w-6 text-green-500" />
                  : <XCircle className="h-6 w-6 text-red-500" />
                }
                <span className={`font-semibold text-lg ${results[round].correct ? 'text-green-700' : 'text-red-700'}`}>
                  {results[round].correct ? 'Great reading!' : 'Not quite'}
                </span>
              </div>
              <div className="text-sm font-medium mb-1">{currentSentence}</div>
              <div className="text-sm text-muted-foreground">
                Transcribed: <span className={results[round].correct ? 'text-green-700' : 'text-red-600'}>
                  {results[round].transcript || '(no audio detected)'}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleNext}
            className="bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            Next Sentence →
          </button>
        </div>
      )}

      {/* Word bank collapsible (shown during test when no external file) */}
      <WordBankSection
        sentences={SENTENCES}
        wordBankUrl={wordBankUrl}
        loading={loadingWordBank}
        onClick={handleWordBankClick}
      />
    </div>
  )
}

function WordBankButton({ wordBankUrl, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 bg-muted hover:bg-accent px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
    >
      {loading ? 'Loading...' : wordBankUrl ? (
        <><ExternalLink className="h-4 w-4" />View Word Bank</>
      ) : (
        <><BookOpen className="h-4 w-4" />View All Sentences</>
      )}
    </button>
  )
}

function WordBankSection({ sentences, wordBankUrl, loading, onClick }) {
  const [open, setOpen] = useState(false)

  async function handleToggle() {
    if (wordBankUrl) {
      window.open(wordBankUrl, '_blank', 'noopener,noreferrer')
      return
    }
    if (wordBankUrl === null) {
      setOpen(v => !v)
      return
    }
    // Not yet fetched — fetch then decide
    await onClick()
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={handleToggle}
        disabled={loading}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          {loading ? 'Loading word bank...' : wordBankUrl ? 'Download Full Word Bank' : 'View All Reading Sentences'}
        </span>
        {!wordBankUrl && (open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
        {wordBankUrl && <ExternalLink className="h-4 w-4" />}
      </button>
      {open && !wordBankUrl && (
        <div className="border-t border-border px-4 py-4 bg-muted/30">
          <ol className="space-y-1.5 list-decimal list-inside">
            {sentences.map((s, i) => (
              <li key={i} className="text-sm text-foreground">{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
