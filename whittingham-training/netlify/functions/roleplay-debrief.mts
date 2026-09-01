import Anthropic from '@anthropic-ai/sdk'
import { json } from './_shared/http.mts'
import { buildDebriefSystemPrompt, historyToTranscript } from '../../shared/prompt.ts'
import type { DebriefReport, DebriefRequest } from '../../shared/types.ts'

const client = new Anthropic()

const MAX_HISTORY = 80

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  let body: DebriefRequest
  try {
    body = (await req.json()) as DebriefRequest
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { scenario, history } = body
  if (!scenario?.businessId || !scenario.agentName) {
    return json({ error: 'Missing scenario fields' }, { status: 400 })
  }
  if (!Array.isArray(history) || history.length === 0) {
    return json({ error: 'No transcript to grade yet' }, { status: 400 })
  }

  const transcript = historyToTranscript(history.slice(-MAX_HISTORY), scenario)

  let response: Anthropic.Message
  try {
    response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1800,
      system: buildDebriefSystemPrompt(scenario),
      output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: `TRANSCRIPT:\n\n${transcript}` }],
    })
  } catch (err) {
    console.error('roleplay-debrief: Anthropic API error', err)
    return json({ error: 'The debrief AI is unavailable right now. Try again in a moment.' }, { status: 502 })
  }

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  if (!textBlock) {
    return json({ error: 'No debrief generated' }, { status: 502 })
  }

  let report: DebriefReport
  try {
    const cleaned = textBlock.text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
    report = JSON.parse(cleaned) as DebriefReport
  } catch (err) {
    console.error('roleplay-debrief: failed to parse debrief JSON', err, textBlock.text)
    return json({ error: 'Could not parse the debrief. Try again.' }, { status: 502 })
  }

  return json(report)
}
