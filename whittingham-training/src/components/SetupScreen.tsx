import { useState } from 'react'
import type { Difficulty } from '../../shared/types.ts'
import { BUSINESS_PERSONAS, DIFFICULTY_NOTES } from '../../shared/guideContent.ts'

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

interface SetupScreenProps {
  onStart: (businessId: string, difficulty: Difficulty, agentName: string) => void
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [businessId, setBusinessId] = useState(BUSINESS_PERSONAS[0].id)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [agentName, setAgentName] = useState('')

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-wide text-wt-gold-light uppercase">Whittingham Agency</p>
        <h1 className="font-display text-2xl font-bold text-wt-text sm:text-3xl">Worksite Trainer</h1>
        <p className="mt-2 text-sm text-wt-muted">
          Practice the Worksite Training Guide script end-to-end — the AI plays the gatekeeper and decision maker.
          You play the agent. Handle the objections, run the presentation, and lock the close.
        </p>
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-semibold text-wt-text">Your name (as the agent)</label>
        <input
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="e.g. Jordan"
          className="w-full rounded-xl border border-wt-border bg-wt-panel px-3 py-2.5 text-sm text-wt-text placeholder:text-wt-muted focus:border-wt-gold/60 focus:outline-none"
        />
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-semibold text-wt-text">Business</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BUSINESS_PERSONAS.map((b) => (
            <button
              key={b.id}
              onClick={() => setBusinessId(b.id)}
              className={
                'rounded-xl border px-4 py-3 text-left text-sm transition-colors ' +
                (businessId === b.id
                  ? 'border-wt-gold bg-wt-gold/10 text-wt-text'
                  : 'border-wt-border bg-wt-panel text-wt-muted hover:border-wt-border/80 hover:text-wt-text')
              }
            >
              <div className="font-semibold text-wt-text">{b.label}</div>
              <div className="mt-0.5 text-xs text-wt-muted">{b.flavor}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <label className="mb-2 block text-sm font-semibold text-wt-text">Difficulty</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={
                'flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ' +
                (difficulty === d.id
                  ? 'border-wt-gold bg-wt-gold text-wt-bg'
                  : 'border-wt-border bg-wt-panel text-wt-muted hover:text-wt-text')
              }
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-wt-muted">{DIFFICULTY_NOTES[difficulty]}</p>
      </div>

      <button
        onClick={() => onStart(businessId, difficulty, agentName)}
        className="rounded-xl bg-wt-gold px-6 py-3 text-sm font-bold text-wt-bg transition-opacity hover:opacity-90"
      >
        Start Role-Play
      </button>
    </div>
  )
}
