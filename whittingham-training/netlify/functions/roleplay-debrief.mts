import { ThinkingLevel } from '@google/genai'
import { json } from './_shared/http.mts'
import { GEMINI_MODEL, getGeminiClient } from './_shared/gemini.mts'
import { buildDebriefSystemPrompt, historyToTranscript } from '../../shared/prompt.ts'
import type { DebriefReport, DebriefRequest } from '../../shared/types.ts'

const MAX_HISTORY = 80

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const ai = getGeminiClient()
  if (!ai) {
    console.error('roleplay-debrief: GEMINI_API_KEY is not set')
    return json({ error: 'The debrief AI is not configured on this deployment yet.' }, { status: 501 })
  }

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

  let responseText: string
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: `TRANSCRIPT:\n\n${transcript}` }] }],
      config: {
        systemInstruction: buildDebriefSystemPrompt(scenario),
        maxOutputTokens: 1200,
        responseMimeType: 'application/json',
        // LOW keeps some reasoning for rubric judgment while trimming latency —
        // this call is the one most likely to brush against a hosting timeout.
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    })
    responseText = response.text ?? ''
  } catch (err) {
    console.error('roleplay-debrief: Gemini API error', err)
    return json({ error: 'The debrief AI is unavailable right now. Try again in a moment.' }, { status: 502 })
  }

  let report: DebriefReport
  try {
    report = JSON.parse(responseText.trim()) as DebriefReport
  } catch (err) {
    console.error('roleplay-debrief: failed to parse debrief JSON', err, responseText)
    return json({ error: 'Could not parse the debrief. Try again.' }, { status: 502 })
  }

  return json(report)
}
