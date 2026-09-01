import type {
  ChatMessage,
  DebriefReport,
  Phase,
  RoleplayTurnResponse,
  ScenarioConfig,
} from '../../shared/types.ts'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(err?.error ?? `Request failed (${res.status})`)
  }
  return (await res.json()) as T
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
