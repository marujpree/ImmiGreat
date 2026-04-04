'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

/**
 * Records audio via MediaRecorder, sends to Groq Whisper via /api/quiz/transcribe,
 * and returns the transcript to the parent via onTranscript().
 *
 * Props:
 *   onTranscript  {(text: string) => void}  - called with transcript when ready
 *   disabled      {boolean}                 - disable the button
 */
export default function SpeechInput({ onTranscript, disabled = false }) {
  const [state, setState] = useState('idle') // 'idle' | 'recording' | 'transcribing'
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const isRecording = state === 'recording'
  const isTranscribing = state === 'transcribing'

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Prefer webm/opus; fall back to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : ''

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        // Stop all mic tracks
        stream.getTracks().forEach((t) => t.stop())

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        await transcribe(blob)
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setState('recording')
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone in your browser settings.')
      } else {
        setError('Could not access microphone.')
      }
      setState('idle')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setState('transcribing')
      mediaRecorderRef.current.stop()
    }
  }

  async function transcribe(blob) {
    try {
      const form = new FormData()
      form.append('audio', blob, 'audio.webm')

      const res = await fetch('/api/quiz/transcribe', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Transcription failed.')
        setState('idle')
        return
      }

      if (data.text) {
        onTranscript(data.text)
      }
    } catch {
      setError('Transcription service unavailable.')
    } finally {
      setState('idle')
    }
  }

  function handleClick() {
    if (isRecording) {
      stopRecording()
    } else if (state === 'idle') {
      startRecording()
    }
  }

  // Check browser support
  if (typeof window !== 'undefined' && !navigator.mediaDevices?.getUserMedia) {
    return (
      <span className="text-xs text-muted-foreground">
        Voice input not supported in this browser.
      </span>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={disabled || isTranscribing}
        title={isRecording ? 'Tap to stop recording' : 'Tap to speak your answer'}
        aria-label={isRecording ? 'Stop recording' : 'Speak your answer'}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse'
            : isTranscribing
            ? 'bg-muted text-muted-foreground'
            : 'bg-muted hover:bg-accent text-foreground'
        }`}
      >
        {isTranscribing ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Transcribing...</>
        ) : isRecording ? (
          <><MicOff className="h-4 w-4" />Stop Recording</>
        ) : (
          <><Mic className="h-4 w-4" />Speak Answer</>
        )}
      </button>

      {isRecording && (
        <span className="text-xs text-red-500">Recording... tap Stop when done.</span>
      )}

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
