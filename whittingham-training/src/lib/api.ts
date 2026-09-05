import type {
  ChatMessage,
  DebriefReport,
  Phase,
  RoleplayTurnResponse,
  ScenarioConfig,
  ScorecardEmailResponse,
} from '../../shared/types.ts'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null
  // Some functions (roleplay-debrief) use a streamed Response to avoid a hosting
  // timeout on slow model calls, which means errors also arrive with a 200
  // status — so an `error` field in the body always wins over `res.ok`.
  if (!data || data.error) {
    throw new Error(data?.error ?? `Request failed (${res.status})`)
  }
  return data
}

export function sendRoleplayTurn(
  scenario: ScenarioConfig,
  phase: Phase,
  history: ChatMessage[],
  agentMessage: string,
): Promise<RoleplayTurnResponse> {
  return post('roleplay-turn', { scenario, phase, history, agentMessage })
}

export function requestDebrief(scenario: ScenarioConfig, history: ChatMessage[]): Promise<DebriefReport> {
  return post('roleplay-debrief', { scenario, history })
}

export function emailScorecard(
  email: string,
  scenario: ScenarioConfig,
  report: DebriefReport,
): Promise<ScorecardEmailResponse> {
  return post('send-scorecard', { email, scenario, report })
}
