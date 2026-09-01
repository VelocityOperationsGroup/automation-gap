import type { DebriefReport as DebriefReportType } from '../../shared/types.ts'

function scoreColor(score: number, max: number): string {
  const pct = score / max
  if (pct >= 0.8) return 'text-wt-green'
  if (pct >= 0.5) return 'text-wt-gold-light'
  return 'text-wt-red'
}

export function DebriefReport({
  report,
  onRestart,
}: {
  report: DebriefReportType
  onRestart: () => void
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold tracking-wide text-wt-gold-light uppercase">Debrief</p>
      <h1 className="font-display text-2xl font-bold text-wt-text sm:text-3xl">{report.headline}</h1>

      <div className="my-6 flex items-center gap-4 rounded-2xl border border-wt-border bg-wt-panel px-5 py-4">
        <div className={'font-display text-4xl font-bold ' + scoreColor(report.overallScore, report.overallMaxScore)}>
          {report.overallScore}
          <span className="text-lg text-wt-muted">/{report.overallMaxScore}</span>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-wt-panel-light">
          <div
            className="h-full rounded-full bg-wt-gold"
            style={{ width: `${Math.min(100, (report.overallScore / report.overallMaxScore) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mb-6 space-y-3">
        {report.rubric.map((r) => (
          <div key={r.category} className="rounded-xl border border-wt-border bg-wt-panel px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-wt-text">{r.category}</span>
              <span className={'text-sm font-bold ' + scoreColor(r.score, r.maxScore)}>
                {r.score}/{r.maxScore}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-wt-muted">{r.feedback}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-wt-green/30 bg-wt-green/5 px-4 py-3">
          <h2 className="mb-2 text-sm font-semibold text-wt-green">Strengths</h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-wt-text">
            {report.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-wt-gold/30 bg-wt-gold/5 px-4 py-3">
          <h2 className="mb-2 text-sm font-semibold text-wt-gold-light">To Improve</h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-wt-text">
            {report.improvements.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>

      {report.scriptDeviations.length > 0 && (
        <div className="mb-6 rounded-xl border border-wt-border bg-wt-panel px-4 py-3">
          <h2 className="mb-2 text-sm font-semibold text-wt-text">Script Deviations</h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-wt-muted">
            {report.scriptDeviations.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-wt-blue/30 bg-wt-blue/5 px-4 py-3">
        <h2 className="mb-1 text-sm font-semibold text-wt-blue">Next Drill</h2>
        <p className="text-xs leading-relaxed text-wt-text">{report.nextDrill}</p>
      </div>

      <button
        onClick={onRestart}
        className="rounded-xl bg-wt-gold px-6 py-3 text-sm font-bold text-wt-bg transition-opacity hover:opacity-90"
      >
        Run Another Scenario
      </button>
    </div>
  )
}
