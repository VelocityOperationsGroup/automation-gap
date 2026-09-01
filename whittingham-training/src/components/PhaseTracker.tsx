import type { Phase } from '../../shared/types.ts'
import { PHASE_LABELS, PHASE_ORDER } from '../../shared/guideContent.ts'

const VISIBLE_PHASES = PHASE_ORDER.filter((p) => p !== 'complete')

export function PhaseTracker({ phase }: { phase: Phase }) {
  const currentIndex = phase === 'complete' ? VISIBLE_PHASES.length : VISIBLE_PHASES.indexOf(phase)

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
      {VISIBLE_PHASES.map((p, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'upcoming'
        return (
          <div key={p} className="flex items-center gap-1.5 shrink-0">
            <div
              className={
                'rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ' +
                (state === 'done'
                  ? 'bg-wt-gold/20 text-wt-gold-light'
                  : state === 'active'
                    ? 'bg-wt-gold text-wt-bg'
                    : 'bg-wt-panel-light text-wt-muted')
              }
            >
              {PHASE_LABELS[p]}
            </div>
            {i < VISIBLE_PHASES.length - 1 && (
              <div className={'h-px w-4 ' + (state === 'done' ? 'bg-wt-gold/50' : 'bg-wt-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
