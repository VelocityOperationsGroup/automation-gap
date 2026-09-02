// Thin wrapper over the browser's built-in Web Speech API — no external
// service, no API key. Speech recognition (webkitSpeechRecognition) is
// Chrome/Edge-only as of writing; speechSynthesis has broader support.
// Everything here feature-detects and no-ops when unsupported, so the app
// falls back to the existing text-only flow automatically.

interface SpeechRecognitionResultLike {
  isFinal: boolean
  [index: number]: { transcript: string }
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string
  interimResults: boolean
  continuous: boolean
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && getSpeechRecognitionCtor() !== null
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export interface RecognizerHandle {
  stop: () => void
}

export interface RecognitionCallbacks {
  onInterim: (text: string) => void
  onFinal: (text: string) => void
  onEnd: () => void
  onError: (message: string) => void
}

export function startRecognition(callbacks: RecognitionCallbacks): RecognizerHandle | null {
  const Ctor = getSpeechRecognitionCtor()
  if (!Ctor) {
    callbacks.onError('Voice input is not supported in this browser — try Chrome or Edge.')
    return null
  }

  const recognizer = new Ctor()
  recognizer.lang = 'en-US'
  recognizer.interimResults = true
  recognizer.continuous = false

  let finalTranscript = ''
  let latestText = ''

  recognizer.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      const transcript = result[0]?.transcript ?? ''
      if (result.isFinal) {
        finalTranscript += transcript
      } else {
        interim += transcript
      }
    }
    latestText = (finalTranscript + interim).trim()
    callbacks.onInterim(latestText)
  }

  recognizer.onerror = (event) => {
    if (event.error === 'no-speech') {
      callbacks.onError("Didn't catch that — try again.")
    } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      callbacks.onError('Microphone access was denied. You can still type your response.')
    } else if (event.error === 'aborted') {
      // User-initiated stop — not a real error, ignore.
    } else {
      callbacks.onError('Voice input failed. You can still type your response.')
    }
  }

  recognizer.onend = () => {
    const finalText = (finalTranscript || latestText).trim()
    if (finalText) callbacks.onFinal(finalText)
    callbacks.onEnd()
  }

  recognizer.start()
  return { stop: () => recognizer.stop() }
}

// Strip visual-only stage directions (asterisk actions, bracketed scene
// notes) before speaking — reading "*taps radio*" aloud sounds wrong, but
// it's nice flavor to keep in the on-screen chat bubble.
export function stripStageDirections(text: string): string {
  return text
    .replace(/\*[^*]*\*/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

let cachedVoices: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length) cachedVoices = voices
  return cachedVoices
}

if (isSpeechSynthesisSupported()) {
  window.speechSynthesis.onvoiceschanged = () => loadVoices()
  loadVoices()
}

function pickVoice(hint: string): SpeechSynthesisVoice | null {
  const voices = loadVoices().filter((v) => v.lang.startsWith('en'))
  const pool = voices.length ? voices : loadVoices()
  if (pool.length === 0) return null
  let hash = 0
  for (let i = 0; i < hint.length; i++) hash = (hash * 31 + hint.charCodeAt(i)) >>> 0
  return pool[hash % pool.length]
}

export function speak(text: string, voiceHint: string): void {
  if (!isSpeechSynthesisSupported() || !text.trim()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(voiceHint)
  if (voice) utterance.voice = voice
  utterance.rate = 1.0
  window.speechSynthesis.speak(utterance)
}

export function cancelSpeech(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
