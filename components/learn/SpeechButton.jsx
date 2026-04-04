'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/**
 * Reads text aloud using the browser's built-in Web Speech API.
 * Includes Chrome voice-loading fix (voices load async and speak() silently
 * fails if called before they are ready).
 *
 * Props:
 *   text   {string}  - Text to speak
 *   lang   {string}  - BCP-47 language tag, default 'en-US'
 *   size   {string}  - 'sm' | 'md' (default 'md')
 */
export default function SpeechButton({ text, lang = 'en-US', size = 'md' }) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const voicesRef = useRef([])

  // Load voices — Chrome loads them asynchronously via the voiceschanged event
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSupported(true)

    function loadVoices() {
      voicesRef.current = window.speechSynthesis.getVoices()
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [])

  function handleClick() {
    if (!supported) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    // Chrome fix: cancel anything pending, then wait one tick before speaking
    window.speechSynthesis.cancel()

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.9

      // Explicitly pick an English voice — avoids Chrome's default silent failure
      const voices = voicesRef.current.length
        ? voicesRef.current
        : window.speechSynthesis.getVoices()

      const preferred =
        voices.find(v => v.lang === 'en-US' && v.localService) ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0]

      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }, 50)
  }

  if (!supported) return null

  const sizeClasses = size === 'sm' ? 'p-1.5 rounded-lg' : 'p-2 rounded-xl'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <button
      onClick={handleClick}
      title={speaking ? 'Stop reading' : 'Read question aloud'}
      aria-label={speaking ? 'Stop reading aloud' : 'Read question aloud'}
      aria-pressed={speaking}
      className={`${sizeClasses} transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        speaking
          ? 'bg-primary text-white'
          : 'text-primary hover:bg-primary/10'
      }`}
    >
      {speaking ? <VolumeX className={iconSize} /> : <Volume2 className={iconSize} />}
    </button>
  )
}
