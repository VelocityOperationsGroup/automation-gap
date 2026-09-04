import { ThinkingLevel, type GoogleGenAI } from '@google/genai'
import { json } from './_shared/http.mts'
import { GEMINI_MODEL, getGeminiClient } from './_shared/gemini.mts'
import { buildDebriefSystemPrompt, historyToTranscript } from '../../shared/prompt.ts'
import type { DebriefReport, DebriefRequest, ScenarioConfig } from '../../shared/types.ts'

const MAX_HISTORY = 80

async function requestDebriefJson(ai: GoogleGenAI, scenario: ScenarioConfig, transcript: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: `TRANSCRIPT:\n\n${transcript}` }] }],
    config: {
      systemInstruction: buildDebriefSystemPrompt(scenario),
      // Real debriefs run ~600 output tokens in testing — this ceiling is
      // headroom for longer/harder sessions, not the expected size, so raising
      // it doesn't slow the common case, only avoids truncating the tail case.
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  })
  return response.text ?? ''
}

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

  // One transparent retry: if the model's JSON mode ever produces malformed or
  // truncated output, a second attempt usually succeeds without the trainee
  // needing to notice or manually retry themselves.
  let lastRawText = ''
  for (let attempt = 1; attempt <= 2; attempt++) {
    let responseText: string
    try {
      responseText = await requestDebriefJson(ai, scenario, transcript)
    } catch (err) {
      console.error(`roleplay-debrief: Gemini API error (attempt ${attempt})`, err)
      if (attempt === 2) {
        return json({ error: 'The debrief AI is unavailable right now. Try again in a moment.' }, { status: 502 })
      }
      continue
    }

    lastRawText = responseText
    try {
      const report = JSON.parse(responseText.trim()) as DebriefReport
      return json(report)
    } catch (err) {
      console.error(`roleplay-debrief: failed to parse debrief JSON (attempt ${attempt})`, err, responseText)
    }
  }

  console.error('roleplay-debrief: both attempts failed to produce valid JSON. Last raw text:', lastRawText)
  return json({ error: 'Could not parse the debrief. Try again.' }, { status: 502 })
}
