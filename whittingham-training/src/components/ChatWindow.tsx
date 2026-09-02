import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, Phase, ScenarioConfig } from '../../shared/types.ts'
import { personaFor } from '../../shared/guideContent.ts'
import { PhaseTracker } from './PhaseTracker.tsx'
import { MessageBubble } from './MessageBubble.tsx'
import {
  cancelSpeech,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speak,
  startRecognition,
  stripStageDirections,
  type RecognizerHandle,
} from '../lib/speech.ts'

function personaLabelForPhase(phase: Phase, scenario: ScenarioConfig): string {
  return phase === 'gatekeeper' ? scenario.gatekeeperName : scenario.decisionMakerName
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}

function SpeakerIcon({ muted, className }: { muted: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path
          d="M16.5 8.5a5 5 0 0 1 0 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

interface ChatWindowProps {
  scenario: ScenarioConfig
  phase: Phase
  history: ChatMessage[]
  sending: boolean
  error: string | null
  onSend: (text: string) => void
  onEndSession: () => void
  onBackToSetup: () => void
}

export function ChatWindow({
  scenario,
  phase,
  history,
  sending,
  error,
  onSend,
  onEndSession,
  onBackToSetup,
}: ChatWindowProps) {
  const [draft, setDraft] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [voiceRepliesOn, setVoiceRepliesOn] = useState(true)
  const [notesOpen, setNotesOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const recognizerRef = useRef<RecognizerHandle | null>(null)
  const lastSpokenCount = useRef(0)
  const persona = personaFor(scenario.businessId)

  const micSupported = isSpeechRecognitionSupported()
  const speechSupported = isSpeechSynthesisSupported()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, sending])

  // Auto-play only newly arrived persona messages, not the whole history on mount/re-render.
  // Deliberately keyed on `history` alone — speechSupported/scenario are static per
  // session and voiceRepliesOn is read fresh on each new message via closure.
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!voiceRepliesOn || !speechSupported) {
      lastSpokenCount.current = history.length
      return
    }
    for (let i = lastSpokenCount.current; i < history.length; i++) {
      const msg = history[i]
      if (msg.role === 'persona') {
        speak(stripStageDirections(msg.text), personaLabelForPhase(msg.phase, scenario))
      }
    }
    lastSpokenCount.current = history.length
  }, [history])

  useEffect(() => {
    return () => cancelSpeech()
  }, [])

  function submit() {
    const text = draft.trim()
    if (!text || sending) return
    onSend(text)
    setDraft('')
  }

  function toggleListening() {
    if (listening) {
      recognizerRef.current?.stop()
      return
    }
    cancelSpeech()
    setVoiceError(null)
    setDraft('')
    const handle = startRecognition({
      onInterim: (text) => setDraft(text),
      onFinal: (text) => {
        setDraft('')
        onSend(text)
      },
      onEnd: () => {
        setListening(false)
        recognizerRef.current = null
      },
      onError: (message) => {
        setVoiceError(message)
        setListening(false)
        recognizerRef.current = null
      },
    })
    if (handle) {
      recognizerRef.current = handle
      setListening(true)
    }
  }

  function toggleVoiceReplies() {
    setVoiceRepliesOn((on) => {
      if (on) cancelSpeech()
      return !on
    })
  }

  const isComplete = phase === 'complete'

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col">
      <header className="flex flex-col gap-3 border-b border-wt-border px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <button onClick={onBackToSetup} className="text-xs text-wt-muted hover:text-wt-gold-light transition-colors">
              ← New scenario
            </button>
            <h1 className="font-display text-lg font-semibold text-wt-text">{persona.label}</h1>
            <p className="text-xs text-wt-muted">
              Playing as <span className="text-wt-gold-light">{scenario.agentName}</span> · {scenario.difficulty} difficulty
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {speechSupported && (
              <button
                onClick={toggleVoiceReplies}
                title={voiceRepliesOn ? 'Mute voice replies' : 'Unmute voice replies'}
                className="rounded-lg border border-wt-border p-2 text-wt-muted transition-colors hover:text-wt-gold-light"
              >
                <SpeakerIcon muted={!voiceRepliesOn} className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onEndSession}
              className="rounded-lg border border-wt-gold/40 bg-wt-gold/10 px-3 py-2 text-xs font-semibold text-wt-gold-light transition-colors hover:bg-wt-gold/20"
            >
              {isComplete ? 'Get Debrief →' : 'End & Get Debrief'}
            </button>
          </div>
        </div>
        <PhaseTracker phase={phase} />

        <div className="rounded-xl border border-wt-border bg-wt-panel">
          <button
            onClick={() => setNotesOpen((o) => !o)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-wt-muted transition-colors hover:text-wt-gold-light"
          >
            <span>Scenario Notes</span>
            <span>{notesOpen ? '▾ Hide' : '▸ Show'}</span>
          </button>
          {notesOpen && (
            <div className="grid grid-cols-2 gap-2 px-3 pb-3 text-xs">
              <div className="rounded-lg border border-wt-border bg-wt-panel-light px-2.5 py-2">
                <div className="text-wt-muted">Gatekeeper</div>
                <div className="font-semibold text-wt-text">{scenario.gatekeeperName}</div>
              </div>
              <div className="rounded-lg border border-wt-border bg-wt-panel-light px-2.5 py-2">
                <div className="text-wt-muted">Decision Maker</div>
                <div className="font-semibold text-wt-text">{scenario.decisionMakerName}</div>
              </div>
              <div className="col-span-2 rounded-lg border border-wt-border bg-wt-panel-light px-2.5 py-2">
                <div className="mb-1 text-wt-muted">Research — use these to build rapport</div>
                <ul className="space-y-0.5 text-wt-text">
                  {scenario.researchNotes.map((note, i) => (
                    <li key={i}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {history.length === 0 && (
          <div className="rounded-xl border border-wt-border bg-wt-panel px-4 py-4 text-sm text-wt-muted">
            You just walked in the door. Start the scene — greet the gatekeeper and ask for{' '}
            <span className="text-wt-gold-light">{scenario.decisionMakerName}</span>, per the Gatekeeper Script.
            {micSupported && ' Push to talk, or type below.'}
          </div>
        )}
        {history.map((m, i) => (
          <MessageBubble key={i} message={m} personaLabel={personaLabelForPhase(m.phase, scenario)} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-wt-border bg-wt-panel-light px-4 py-2.5 text-sm text-wt-muted">
              <span className="inline-flex gap-1">
                <span className="animate-bounce [animation-delay:-0.3s]">●</span>
                <span className="animate-bounce [animation-delay:-0.15s]">●</span>
                <span className="animate-bounce">●</span>
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-wt-red/40 bg-wt-red/10 px-4 py-3 text-sm text-wt-red">{error}</div>
        )}
      </div>

      <div className="space-y-3 border-t border-wt-border px-4 py-4 sm:px-6">
        {voiceError && <p className="text-xs text-wt-red">{voiceError}</p>}

        {micSupported && (
          <button
            onClick={toggleListening}
            disabled={sending || isComplete}
            className={
              'flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 text-base font-bold transition-colors disabled:opacity-40 ' +
              (listening
                ? 'border-wt-red bg-wt-red/20 text-wt-red animate-pulse'
                : 'border-wt-gold bg-wt-gold/10 text-wt-gold-light hover:bg-wt-gold/20')
            }
          >
            {listening ? (
              <>
                <StopIcon className="h-6 w-6" /> Stop &amp; Send
              </>
            ) : (
              <>
                <MicIcon className="h-6 w-6" /> Push to Talk
              </>
            )}
          </button>
        )}

        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={
              isComplete
                ? 'Session complete — get your debrief above.'
                : listening
                  ? 'Listening… hit Stop & Send when done.'
                  : 'Or type your line as the agent…'
            }
            disabled={sending || isComplete}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-wt-border bg-wt-panel px-3 py-2.5 text-sm text-wt-text placeholder:text-wt-muted focus:border-wt-gold/60 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={submit}
            disabled={sending || isComplete || !draft.trim()}
            className="h-[42px] shrink-0 rounded-xl bg-wt-gold px-4 text-sm font-semibold text-wt-bg transition-opacity disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
