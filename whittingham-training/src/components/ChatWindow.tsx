import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, Phase, ScenarioConfig } from '../../shared/types.ts'
import { personaFor } from '../../shared/guideContent.ts'
import { PhaseTracker } from './PhaseTracker.tsx'
import { MessageBubble } from './MessageBubble.tsx'

function personaLabelForPhase(phase: Phase, scenario: ScenarioConfig): string {
  return phase === 'gatekeeper' ? scenario.gatekeeperName : scenario.decisionMakerName
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const persona = personaFor(scenario.businessId)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, sending])

  function submit() {
    const text = draft.trim()
    if (!text || sending) return
    onSend(text)
    setDraft('')
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
          <button
            onClick={onEndSession}
            className="shrink-0 rounded-lg border border-wt-gold/40 bg-wt-gold/10 px-3 py-2 text-xs font-semibold text-wt-gold-light transition-colors hover:bg-wt-gold/20"
          >
            {isComplete ? 'Get Debrief →' : 'End & Get Debrief'}
          </button>
        </div>
        <PhaseTracker phase={phase} />
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {history.length === 0 && (
          <div className="rounded-xl border border-wt-border bg-wt-panel px-4 py-4 text-sm text-wt-muted">
            You just walked in the door. Start the scene — greet the gatekeeper and ask for{' '}
            <span className="text-wt-gold-light">{scenario.decisionMakerName}</span>, per the Gatekeeper Script.
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

      <div className="border-t border-wt-border px-4 py-4 sm:px-6">
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
            placeholder={isComplete ? 'Session complete — get your debrief above.' : 'Say your line as the agent…'}
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
