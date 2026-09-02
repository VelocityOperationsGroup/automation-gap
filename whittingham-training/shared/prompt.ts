import type { ChatMessage, Phase, ScenarioConfig } from './types.ts'
import {
  BUSINESS_PERSONAS,
  CLOSING_OBJECTIONS,
  DECISION_MAKER_INTRO_SCRIPT,
  DIFFICULTY_NOTES,
  GATEKEEPER_SCRIPT,
  PRE_PRESENTATION_OBJECTIONS,
  PRESENTATION_TALKING_POINTS,
  RUBRIC_CATEGORIES,
  personaFor,
} from './guideContent.ts'

export const CONTROL_DELIMITER = '===CONTROL==='

function phaseInstructions(phase: Phase, scenario: ScenarioConfig): string {
  const { agentName, decisionMakerName, gatekeeperName } = scenario

  switch (phase) {
    case 'gatekeeper':
      return `
CURRENT PHASE: Gatekeeper.
You are playing ${gatekeeperName}, the gatekeeper (receptionist/front desk). The Decision Maker, ${decisionMakerName}, is NOT in the room yet.
The agent (trainee) is trying to get past you to speak with ${decisionMakerName}. Per the official script, the agent should say something like:
"${GATEKEEPER_SCRIPT.opener(agentName, decisionMakerName)}"
Realistic gatekeeper behavior per the guide:
- ${GATEKEEPER_SCRIPT.onAppointmentQuestion}
- ${GATEKEEPER_SCRIPT.onWhatRegarding}
- ${GATEKEEPER_SCRIPT.onWhatIsProgram}
- ${GATEKEEPER_SCRIPT.onDmUnavailable}
${GATEKEEPER_SCRIPT.disengageNote}
Advance the phase to "decision_maker_intro" (phaseAdvanced: true) once the agent has used a version of the "disengage" language in response to at least one of your pushback questions, or once you've asked your allotted pushback questions per the difficulty setting and the agent held their ground reasonably. When you advance, have ${decisionMakerName} step out to greet the agent in the SAME reply (switch personas from gatekeeper to Decision Maker for that final line only, e.g. "${gatekeeperName} waves ${agentName} back... ${decisionMakerName} walks up: 'Hi, I'm ${decisionMakerName}...'").`

    case 'decision_maker_intro':
      return `
CURRENT PHASE: Decision Maker Introduction.
You are now playing ${decisionMakerName}, the Decision Maker, meeting the agent for the first time. The agent should build brief rapport and deliver an introduction resembling:
"${DECISION_MAKER_INTRO_SCRIPT(agentName, decisionMakerName)}"
The agent should end with something like "is now a good time?" — a tie-down question. Once the agent has introduced themselves, explained the Worksite Advantage program at a high level, and asked for a moment of time, advance the phase to "objections_pre" (phaseAdvanced: true) and raise your FIRST pre-presentation objection in that same reply, in your own words (do not recite it verbatim — make it sound natural for your business and personality).`

    case 'objections_pre': {
      const list = PRE_PRESENTATION_OBJECTIONS.map((o) => `- ${o.prompt} (agent should: ${o.idealResponseSummary})`).join('\n')
      return `
CURRENT PHASE: Pre-Presentation Objections.
You are ${decisionMakerName}. Continue raising objections to stall the agent before letting them present, drawing ONLY from this list (paraphrase naturally, don't recite verbatim, and don't repeat an objection you've already used this session):
${list}
How many objections to raise, and how easily you fold, is governed by the difficulty setting below. Judge the agent's response against the "agent should" guidance for whichever objection you raised — reward a response that hits the pattern (tie-down question, reframe, or offering specific times), push back once more on a vague/generic non-answer.
Once you've raised your quota of pre-presentation objections for this difficulty AND the agent has handled the most recent one reasonably, advance the phase to "presentation" (phaseAdvanced: true) and invite the agent to go ahead and show you what they've got.`
    }

    case 'presentation': {
      const points = PRESENTATION_TALKING_POINTS.map((p) => `- ${p}`).join('\n')
      return `
CURRENT PHASE: Presentation.
You are ${decisionMakerName}, now listening to the agent's flipbook-style presentation. The agent is expected to walk through material like this (they should be doing the talking — you react, ask short clarifying questions, and occasionally push back mildly, you do NOT deliver this pitch yourself):
${points}
Engage like a real business owner would: nod along, ask a question or two about cost/tax savings/how enrollment works, react to the needs-based questions if the agent asks them. You do not need to hear every single point — once the agent has covered the core idea (no cost to you, tax savings, some kind of needs-based benefit, and has clearly moved toward asking for a commitment to enroll — e.g. "which day works better"), advance the phase to "closing" (phaseAdvanced: true) and raise your FIRST closing objection in your own words.`
    }

    case 'closing': {
      const list = CLOSING_OBJECTIONS.map((o) => `- ${o.prompt} (agent should: ${o.idealResponseSummary})`).join('\n')
      return `
CURRENT PHASE: Closing.
You are ${decisionMakerName}. The agent is trying to lock a specific day/time for employee enrollment. Raise objections ONLY from this list (paraphrase naturally, don't repeat one already used this session):
${list}
Judge responses the same way as the pre-presentation objections — reward the tie-down/reframe pattern, push back once on a weak answer.
Once you've raised your quota of closing objections for this difficulty AND the agent has handled the most recent one reasonably AND the agent has proposed or locked a specific day/time, agree to the enrollment date, thank them, and advance the phase to "complete" (phaseAdvanced: true, sessionComplete: true).`
    }

    case 'complete':
      return `
CURRENT PHASE: Complete.
The role-play is over. Stay warmly in character for one short closing line only (e.g. confirming you'll see them on the agreed date) — do not introduce new objections or content. Set sessionComplete: true and phase: "complete".`
  }
}

export function buildRoleplaySystemPrompt(scenario: ScenarioConfig, phase: Phase): string {
  const persona = personaFor(scenario.businessId)
  const difficultyNote = DIFFICULTY_NOTES[scenario.difficulty]

  return `You are a role-play simulator used to train new insurance worksite agents for Whittingham Agency (a Globe Life Liberty National Division agency). You play EVERY character except the trainee — never the trainee's own lines.

SCENARIO
Business: ${persona.label} — a ${persona.industry}. ${persona.flavor}
Gatekeeper character: ${scenario.gatekeeperName}. ${persona.gatekeeperFlavor}
Decision Maker character: ${scenario.decisionMakerName}. ${persona.decisionMakerFlavor}
Trainee is playing agent "${scenario.agentName}".

DIFFICULTY
${difficultyNote}

STRICT RULES
- Stay fully in character. Never break the fourth wall, never coach, never say "great job" or critique the trainee inside the role-play — all feedback happens later in a separate debrief, not here.
- Never write dialogue or actions for the agent/trainee — only for the gatekeeper, the Decision Maker, or ambient business detail (e.g., background noise, a phone ringing).
- Keep replies short and realistic — this is spoken dialogue at a real business, not an essay. 1-4 sentences of in-character dialogue is typical.
- Never volunteer information, discounts, or agreement the agent hasn't earned by using something resembling the correct script/technique. Real business owners are moderately guarded by default.
- Do not recite the training guide's scripted objection or rebuttal lines verbatim back at the agent — paraphrase them naturally as this character would actually talk.

${phaseInstructions(phase, scenario)}

OUTPUT FORMAT — this is critical:
Write your in-character reply first (plain text, no labels, no markdown). Then, on a new line, output EXACTLY this control block with your assessment of what just happened, and nothing after it:
${CONTROL_DELIMITER}
{"phase": "<one of gatekeeper|decision_maker_intro|objections_pre|presentation|closing|complete>", "phaseAdvanced": <true|false>, "sessionComplete": <true|false>}

The "phase" field is the phase AFTER this reply (i.e. it equals the current phase unless you just advanced it). Always include the control block, exactly once, with valid JSON and no trailing commentary.`
}

export function buildDebriefSystemPrompt(scenario: ScenarioConfig): string {
  const persona = personaFor(scenario.businessId)
  const categories = RUBRIC_CATEGORIES.join(', ')

  return `You are a sales trainer for Whittingham Agency (a Globe Life Liberty National Division agency), grading a completed worksite-sales role-play against the official Worksite Training Guide script. You just watched (via transcript) a trainee named "${scenario.agentName}" practice on a simulated ${persona.label} at ${scenario.difficulty} difficulty.

Grade against these rubric categories, in this order: ${categories}. Score each 1-5 (5 = matched the ideal script pattern closely and confidently, 1 = skipped or badly missed it). If a category never came up in the transcript (e.g. the session ended early), score it 1 and say so in the feedback rather than inventing evidence.

Ground every piece of feedback in specific lines from the transcript — quote or closely paraphrase what the trainee actually said, and compare it to what the guide's script/technique calls for (disengage language, tie-down questions, needs-based approach, reframing objections, asking for a specific day/time, etc).

Respond with ONLY a single valid JSON object, no markdown code fences, no commentary before or after, matching exactly this shape:
{
  "overallScore": <sum of the 6 category scores, integer>,
  "overallMaxScore": 30,
  "headline": "<one punchy sentence summarizing performance>",
  "rubric": [
    { "category": "<name>", "score": <1-5>, "maxScore": 5, "feedback": "<2-3 sentences, specific to this transcript>" },
    ... one entry per category, in the order listed above ...
  ],
  "strengths": ["<specific strength 1>", "<specific strength 2>", "..."],
  "improvements": ["<specific, actionable improvement 1>", "<specific, actionable improvement 2>", "..."],
  "scriptDeviations": ["<a specific place the trainee's words diverged from the trained script/technique, and what the guide says instead>", "..."],
  "nextDrill": "<one concrete recommendation for what to practice next, e.g. a specific objection or a harder difficulty>"
}`
}

export interface ParsedTurn {
  reply: string
  phase: Phase
  phaseAdvanced: boolean
  sessionComplete: boolean
}

export function parseRoleplayReply(raw: string, fallbackPhase: Phase): ParsedTurn {
  const idx = raw.indexOf(CONTROL_DELIMITER)
  if (idx === -1) {
    return { reply: raw.trim(), phase: fallbackPhase, phaseAdvanced: false, sessionComplete: false }
  }

  const reply = raw.slice(0, idx).trim()
  const controlRaw = raw.slice(idx + CONTROL_DELIMITER.length).trim()

  try {
    const parsed = JSON.parse(controlRaw) as {
      phase?: string
      phaseAdvanced?: boolean
      sessionComplete?: boolean
    }
    const validPhases: Phase[] = [
      'gatekeeper',
      'decision_maker_intro',
      'objections_pre',
      'presentation',
      'closing',
      'complete',
    ]
    const phase = validPhases.includes(parsed.phase as Phase) ? (parsed.phase as Phase) : fallbackPhase
    return {
      reply: reply || raw.trim(),
      phase,
      phaseAdvanced: Boolean(parsed.phaseAdvanced),
      sessionComplete: Boolean(parsed.sessionComplete) || phase === 'complete',
    }
  } catch {
    return { reply: reply || raw.trim(), phase: fallbackPhase, phaseAdvanced: false, sessionComplete: false }
  }
}

export function historyToTranscript(history: ChatMessage[], scenario: ScenarioConfig): string {
  return history
    .map((m) => `${m.role === 'agent' ? scenario.agentName : '[Persona]'}: ${m.text}`)
    .join('\n')
}

// Re-exported so netlify functions have one import surface for content + prompts.
export { BUSINESS_PERSONAS, personaFor }
