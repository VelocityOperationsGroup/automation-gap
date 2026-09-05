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
      // headroom for longer/harder sessions, not the expected size.
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
      // MINIMAL, not LOW — a 504 in production showed this call brushing
      // against Netlify's execution limit. Speed now matters more than the
      // marginal grading nuance a bit more thinking would add.
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
    },
  })
  return response.text ?? ''
}

async function gradeWithRetry(ai: GoogleGenAI, scenario: ScenarioConfig, transcript: string): Promise<DebriefReport> {
  let lastRawText = ''
  for (let attempt = 1; attempt <= 2; attempt++) {
    let responseText: string
    try {
      responseText = await requestDebriefJson(ai, scenario, transcript)
    } catch (err) {
      console.error(`roleplay-debrief: Gemini API error (attempt ${attempt})`, err)
      if (attempt === 2) throw new Error('The debrief AI is unavailable right now. Try again in a moment.')
      continue
    }

    lastRawText = responseText
    try {
      return JSON.parse(responseText.trim()) as DebriefReport
    } catch (err) {
      console.error(`roleplay-debrief: failed to parse debrief JSON (attempt ${attempt})`, err, responseText)
    }
  }

  console.error('roleplay-debrief: both attempts failed to produce valid JSON. Last raw text:', lastRawText)
  throw new Error('Could not parse the debrief. Try again.')
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

  // Everything up to here is instant (no model call) and can safely use a normal
  // buffered Response. From here on, a streamed Response is required: Netlify's
  // standard function timeout is short enough that a slow Gemini call (or the
  // retry above) can exceed it, and a *streamed* response is not bound by that
  // same limit the way a buffered one is. The client still just does a plain
  // `await res.json()` — nothing about that call site needs to change, since a
  // single JSON chunk arrives once grading is done either way.
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const report = await gradeWithRetry(ai, scenario, transcript)
        controller.enqueue(encoder.encode(JSON.stringify(report)))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong grading this session.'
        controller.enqueue(encoder.encode(JSON.stringify({ error: message })))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: { 'content-type': 'application/json' } })
}
