'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'

/**
 * Reads text aloud using the browser's built-in Web Speech API (free, no API key).
 * Props:
 *   text     {string}  - Text to speak
 *   lang     {string}  - BCP-47 language tag, default 'en-US'
 *   size     {string}  - 'sm' | 'md' (default 'md')
 */
export default function SpeechButton({ text, lang = 'en-US', size = 'md' }) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function handleClick() {
    if (!supported) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  if (!supported) return null

  const sizeClasses = size === 'sm'
    ? 'p-1.5 rounded-lg'
    : 'p-2 rounded-xl'

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <button
      onClick={handleClick}
      title={speaking ? 'Stop reading' : 'Listen to question'}
      aria-label={speaking ? 'Stop reading' : 'Listen to question'}
      className={`${sizeClasses} transition-colors flex-shrink-0 ${
        speaking
          ? 'bg-primary text-white'
          : 'text-primary hover:bg-primary/10'
      }`}
    >
      {speaking
        ? <VolumeX className={iconSize} />
        : <Volume2 className={iconSize} />
      }
    </button>
  )
}
