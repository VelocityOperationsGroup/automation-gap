import Anthropic from '@anthropic-ai/sdk'
import { json } from './_shared/http.mts'
import { buildRoleplaySystemPrompt, parseRoleplayReply } from '../../shared/prompt.ts'
import type { ChatMessage, RoleplayTurnRequest, RoleplayTurnResponse } from '../../shared/types.ts'

const client = new Anthropic()

const MAX_HISTORY = 60
const MAX_MESSAGE_LEN = 2000

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  let body: RoleplayTurnRequest
  try {
    body = (await req.json()) as RoleplayTurnRequest
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { scenario, phase, history, agentMessage } = body
  if (!scenario?.businessId || !scenario.agentName || !scenario.gatekeeperName || !scenario.decisionMakerName) {
    return json({ error: 'Missing scenario fields' }, { status: 400 })
  }
  if (!phase || typeof agentMessage !== 'string' || !agentMessage.trim()) {
    return json({ error: 'Missing phase or agentMessage' }, { status: 400 })
  }
  if (agentMessage.length > MAX_MESSAGE_LEN) {
    return json({ error: 'Message too long' }, { status: 400 })
  }

  const trimmedHistory: ChatMessage[] = Array.isArray(history) ? history.slice(-MAX_HISTORY) : []

  const messages: Anthropic.MessageParam[] = trimmedHistory.map((m) => ({
    role: m.role === 'agent' ? 'user' : 'assistant',
    content: m.text,
  }))
  messages.push({ role: 'user', content: agentMessage })

  let response: Anthropic.Message
  try {
    response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 700,
      system: buildRoleplaySystemPrompt(scenario, phase),
      output_config: { effort: 'low' },
      messages,
    })
  } catch (err) {
    console.error('roleplay-turn: Anthropic API error', err)
    return json({ error: 'The role-play AI is unavailable right now. Try again in a moment.' }, { status: 502 })
  }

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  if (!textBlock) {
    return json({ error: 'No response generated' }, { status: 502 })
  }

  const parsed = parseRoleplayReply(textBlock.text, phase)

  const result: RoleplayTurnResponse = {
    reply: parsed.reply,
    phase: parsed.phase,
    phaseAdvanced: parsed.phaseAdvanced,
    sessionComplete: parsed.sessionComplete,
  }
  return json(result)
}
