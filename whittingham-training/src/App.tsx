import { useState } from 'react'
import type { ChatMessage, DebriefReport as DebriefReportType, Difficulty, ScenarioConfig } from '../shared/types.ts'
import { randomScenario } from './lib/scenario.ts'
import { requestDebrief, sendRoleplayTurn } from './lib/api.ts'
import { SetupScreen } from './components/SetupScreen.tsx'
import { ChatWindow } from './components/ChatWindow.tsx'
import { DebriefReport } from './components/DebriefReport.tsx'

type Screen = 'setup' | 'chat' | 'debrief-loading' | 'debrief'

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [scenario, setScenario] = useState<ScenarioConfig | null>(null)
  const [phase, setPhase] = useState<ChatMessage['phase']>('gatekeeper')
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debrief, setDebrief] = useState<DebriefReportType | null>(null)

  function handleStart(businessId: string, difficulty: Difficulty, agentName: string) {
    const s = randomScenario(businessId, difficulty, agentName)
    setScenario(s)
    setPhase('gatekeeper')
    setHistory([])
    setError(null)
    setDebrief(null)
    setScreen('chat')
  }

  async function handleSend(text: string) {
    if (!scenario) return
    const userMsg: ChatMessage = { role: 'agent', text, phase }
    const nextHistory = [...history, userMsg]
    setHistory(nextHistory)
    setSending(true)
    setError(null)
    try {
      const result = await sendRoleplayTurn(scenario, phase, history, text)
      const personaMsg: ChatMessage = { role: 'persona', text: result.reply, phase: result.phase }
      setHistory([...nextHistory, personaMsg])
      setPhase(result.phase)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong sending that message.')
    } finally {
      setSending(false)
    }
  }

  async function handleEndSession() {
    if (!scenario || history.length === 0) return
    setScreen('debrief-loading')
    setError(null)
    try {
      const report = await requestDebrief(scenario, history)
      setDebrief(report)
      setScreen('debrief')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate the debrief.')
      setScreen('chat')
    }
  }

  function handleRestart() {
    setScreen('setup')
    setScenario(null)
    setHistory([])
    setDebrief(null)
    setError(null)
  }

  if (screen === 'setup' || !scenario) {
    return <SetupScreen onStart={handleStart} />
  }

  if (screen === 'debrief-loading') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wt-gold border-t-transparent" />
        <p className="text-sm text-wt-muted">Grading your role-play against the training script…</p>
      </div>
    )
  }

  if (screen === 'debrief' && debrief) {
    return <DebriefReport report={debrief} scenario={scenario} onRestart={handleRestart} />
  }

  return (
    <ChatWindow
      scenario={scenario}
      phase={phase}
      history={history}
      sending={sending}
      error={error}
      onSend={handleSend}
      onEndSession={handleEndSession}
      onBackToSetup={handleRestart}
    />
  )
}
