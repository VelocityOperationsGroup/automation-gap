import type { Content } from '@google/genai'
import { json } from './_shared/http.mts'
import { GEMINI_MODEL, getGeminiClient } from './_shared/gemini.mts'
import { buildRoleplaySystemPrompt, parseRoleplayReply } from '../../shared/prompt.ts'
import type { ChatMessage, RoleplayTurnRequest, RoleplayTurnResponse } from '../../shared/types.ts'

const MAX_HISTORY = 60
const MAX_MESSAGE_LEN = 2000

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const ai = getGeminiClient()
  if (!ai) {
    console.error('roleplay-turn: GEMINI_API_KEY is not set')
    return json({ error: 'The role-play AI is not configured on this deployment yet.' }, { status: 501 })
  }

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

  const contents: Content[] = trimmedHistory.map((m) => ({
    role: m.role === 'agent' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))
  contents.push({ role: 'user', parts: [{ text: agentMessage }] })

  let responseText: string
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: buildRoleplaySystemPrompt(scenario, phase),
        maxOutputTokens: 700,
      },
    })
    responseText = response.text ?? ''
  } catch (err) {
    console.error('roleplay-turn: Gemini API error', err)
    return json({ error: 'The role-play AI is unavailable right now. Try again in a moment.' }, { status: 502 })
  }

  if (!responseText.trim()) {
    return json({ error: 'No response generated' }, { status: 502 })
  }

  const parsed = parseRoleplayReply(responseText, phase)

  const result: RoleplayTurnResponse = {
    reply: parsed.reply,
    phase: parsed.phase,
    phaseAdvanced: parsed.phaseAdvanced,
    sessionComplete: parsed.sessionComplete,
  }
  return json(result)
}
