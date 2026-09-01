import { useState } from 'react'
import type { DebriefReport as DebriefReportType, ScenarioConfig } from '../../shared/types.ts'
import { letterGrade, type LetterGrade } from '../../shared/grading.ts'
import { emailScorecard } from '../lib/api.ts'

function gradeColor(grade: LetterGrade): string {
  if (grade === 'A' || grade === 'B') return 'text-wt-green'
  if (grade === 'C') return 'text-wt-gold-light'
  return 'text-wt-red'
}

function GradeBadge({ grade, size = 'sm' }: { grade: LetterGrade; size?: 'sm' | 'lg' }) {
  return (
    <span
      className={
        'inline-flex items-center justify-center rounded-lg border font-display font-bold ' +
        gradeColor(grade) +
        ' ' +
        (size === 'lg'
          ? 'h-14 w-14 border-current/30 bg-current/10 text-3xl'
          : 'h-7 w-7 border-current/30 bg-current/10 text-sm')
      }
    >
      {grade}
    </span>
  )
}

type SendState = 'idle' | 'sending' | 'sent' | 'error'

export function DebriefReport({
  report,
  scenario,
  onRestart,
}: {
  report: DebriefReportType
  scenario: ScenarioConfig
  onRestart: () => void
}) {
  const [email, setEmail] = useState('')
  const [sendState, setSendState] = useState<SendState>('idle')
  const [sendError, setSendError] = useState<string | null>(null)

  const overallGrade = letterGrade(report.overallScore, report.overallMaxScore)

  async function handleEmail() {
    if (!email.trim() || sendState === 'sending') return
    setSendState('sending')
    setSendError(null)
    try {
      await emailScorecard(email.trim(), scenario, report)
      setSendState('sent')
    } catch (err) {
      setSendState('error')
      setSendError(err instanceof Error ? err.message : 'Could not send the scorecard.')
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold tracking-wide text-wt-gold-light uppercase">Debrief</p>
      <h1 className="font-display text-2xl font-bold text-wt-text sm:text-3xl">{report.headline}</h1>

      <div className="my-6 flex items-center gap-4 rounded-2xl border border-wt-border bg-wt-panel px-5 py-4">
        <GradeBadge grade={overallGrade} size="lg" />
        <div className="flex-1">
          <div className="font-display text-lg font-bold text-wt-text">
            {report.overallScore}
            <span className="text-sm font-normal text-wt-muted">/{report.overallMaxScore} overall</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-wt-panel-light">
            <div
              className="h-full rounded-full bg-wt-gold"
              style={{ width: `${Math.min(100, (report.overallScore / report.overallMaxScore) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        {report.rubric.map((r) => {
          const grade = letterGrade(r.score, r.maxScore)
          return (
            <div key={r.category} className="flex gap-3 rounded-xl border border-wt-border bg-wt-panel px-4 py-3">
              <GradeBadge grade={grade} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-wt-text">{r.category}</span>
                  <span className="text-xs text-wt-muted">
                    {r.score}/{r.maxScore}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-wt-muted">{r.feedback}</p>
              </div>
            </div>
          )
        })}
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

      <div className="mb-8 rounded-xl border border-wt-border bg-wt-panel px-4 py-4">
        <h2 className="mb-2 text-sm font-semibold text-wt-text">Email This Scorecard</h2>
        {sendState === 'sent' ? (
          <p className="text-sm text-wt-green">Sent to {email.trim()}.</p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (sendState === 'error') setSendState('idle')
              }}
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-wt-border bg-wt-panel-light px-3 py-2.5 text-sm text-wt-text placeholder:text-wt-muted focus:border-wt-gold/60 focus:outline-none"
            />
            <button
              onClick={handleEmail}
              disabled={!email.trim() || sendState === 'sending'}
              className="shrink-0 rounded-xl bg-wt-blue px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            >
              {sendState === 'sending' ? 'Sending…' : 'Email My Scorecard'}
            </button>
          </div>
        )}
        {sendState === 'error' && sendError && <p className="mt-2 text-xs text-wt-red">{sendError}</p>}
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
