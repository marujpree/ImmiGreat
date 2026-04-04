'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, RotateCcw, Volume2, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import SpeechButton from './SpeechButton'

const SENTENCES = [
  'Lincoln was the President during the Civil War.',
  'Citizens can vote in the United States.',
  'Congress meets in Washington, D.C.',
  'The flag is red, white, and blue.',
  'We pay taxes to Congress.',
  'Washington was the Father of Our Country.',
  'Citizens have the right to vote.',
  'The President lives in the White House.',
  'We elect the President in November.',
  'American Indians lived in the United States first.',
  'Alaska is the largest state.',
  'Delaware was the first state.',
  'Senators meet in Congress.',
  'We have freedom of speech in the United States.',
  'The capital of the United States is Washington, D.C.',
  'Memorial Day is in May.',
  'Independence Day is in July.',
  'Labor Day is in September.',
  'Thanksgiving is in November.',
  'The White House is in Washington, D.C.',
]

function normalizeStr(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function contentWords(s, minLen) {
  return normalizeStr(s).split(/\s+/).filter(w => w.length > minLen)
}

function isWritingCorrect(userInput, target) {
  const tw = contentWords(target, 3)
  if (!tw.length) return true
  const uw = new Set(contentWords(userInput, 3))
  return tw.filter(w => uw.has(w)).length / tw.length >= 0.7
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

/**
 * USCIS Writing Test simulation.
 * 3 sentences. User hears each one (TTS auto-plays) and types what they heard.
 * Pass = 2 or more correct out of 3 (2 consecutive sessions to be considered "passed").
 */
export default function WritingTestEngine({ user, onComplete }) {
  const [sentences, setSentences] = useState(() => pickRandom(SENTENCES, 3))
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState('listen') // listen | feedback | results
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [wordBankUrl, setWordBankUrl] = useState(undefined) // undefined=not fetched, null=none, string=url
  const [loadingWordBank, setLoadingWordBank] = useState(false)
  const inputRef = useRef(null)
  const voicesRef = useRef([])

  // Load TTS voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    function load() { voicesRef.current = window.speechSynthesis.getVoices() }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  // Auto-play sentence when round changes (or on first load)
  useEffect(() => {
    if (phase !== 'listen') return
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const timer = setTimeout(() => {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(sentences[round])
      utterance.lang = 'en-US'
      utterance.rate = 0.85

      const voices = voicesRef.current.length
        ? voicesRef.current
        : window.speechSynthesis.getVoices()
      const voice =
        voices.find(v => v.lang === 'en-US' && v.localService) ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0]
      if (voice) utterance.voice = voice

      window.speechSynthesis.speak(utterance)
    }, 300)

    return () => {
      clearTimeout(timer)
      window.speechSynthesis.cancel()
    }
  }, [round, phase, sentences])

  // Focus input after auto-play starts
  useEffect(() => {
    if (phase === 'listen') {
      const timer = setTimeout(() => inputRef.current?.focus(), 500)
      return () => clearTimeout(timer)
    }
  }, [round, phase])

  async function fetchWordBankUrl() {
    if (wordBankUrl !== undefined) return wordBankUrl
    setLoadingWordBank(true)
    try {
      const res = await fetch('/api/admin/word-bank')
      const data = await res.json()
      setWordBankUrl(data.writing ?? null)
      return data.writing ?? null
    } catch {
      setWordBankUrl(null)
      return null
    } finally {
      setLoadingWordBank(false)
    }
  }

  async function handleWordBankClick() {
    const url = await fetchWordBankUrl()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const correct = isWritingCorrect(input, sentences[round])
    const updated = [...results, { sentence: sentences[round], userInput: input, correct }]
    setResults(updated)

    if (round === 2) {
      const correctCount = updated.filter(r => r.correct).length
      // Save attempt if user is logged in (fire-and-forget)
      if (user) {
        fetch('/api/english-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testType: 'writing', correctCount }),
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
    setInput('')
    setPhase('listen')
  }

  function handleRetry() {
    setSentences(pickRandom(SENTENCES, 3))
    setRound(0)
    setInput('')
    setResults([])
    setPhase('listen')
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
            {passed ? 'Writing Test Passed!' : 'Keep Practicing'}
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
                  <div className="text-sm font-medium text-muted-foreground mb-1">Correct sentence:</div>
                  <div className="font-medium">{r.sentence}</div>
                </div>
              </div>
              {!r.correct && (
                <div className="text-sm text-muted-foreground ml-6">
                  You wrote: <span className="text-red-600">{r.userInput || '(blank)'}</span>
                </div>
              )}
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
          <button
            onClick={handleWordBankClick}
            disabled={loadingWordBank}
            className="flex items-center gap-2 bg-muted hover:bg-accent px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
          >
            {loadingWordBank ? 'Loading...' : <><ExternalLink className="h-4 w-4" />View Word Bank</>}
          </button>
        </div>
      </div>
    )
  }

  const currentSentence = sentences[round]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-primary text-white rounded-2xl p-6">
        <h2 className="text-2xl font-medium mb-1">Writing Test Prep</h2>
        <p className="opacity-90 text-sm">
          Listen to each sentence and type what you hear. You need 2 out of 3 correct to pass.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={`flex-1 h-2 rounded-full ${i < round ? 'bg-primary' : i === round ? 'bg-primary/40' : 'bg-muted'}`} />
        ))}
        <span className="text-sm text-muted-foreground ml-2">Sentence {round + 1} of 3</span>
      </div>

      {phase === 'listen' && (
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Volume2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Listen, then type what you hear</span>
            <SpeechButton text={currentSentence} size="sm" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim()) handleSubmit(e) } }}
              placeholder="Type the sentence here..."
              rows={3}
              className="w-full border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium disabled:opacity-40"
            >
              Submit
            </button>
          </form>
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
                  {results[round].correct ? 'Correct!' : 'Not quite'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-1">The sentence was:</div>
              <div className="font-medium text-base mb-2">{currentSentence}</div>
              {!results[round].correct && (
                <div className="text-sm text-muted-foreground">
                  You wrote: <span className="text-red-600">{results[round].userInput || '(blank)'}</span>
                </div>
              )}
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

      {/* Word bank reference */}
      <WritingWordBankSection
        sentences={SENTENCES}
        wordBankUrl={wordBankUrl}
        loading={loadingWordBank}
        onFetch={fetchWordBankUrl}
      />
    </div>
  )
}

function WritingWordBankSection({ sentences, wordBankUrl, loading, onFetch }) {
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
    // Not yet fetched
    const url = await onFetch()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      setOpen(v => !v)
    }
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
          {loading ? 'Loading word bank...' : wordBankUrl ? 'Download Full Word Bank' : 'View All Writing Sentences'}
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
