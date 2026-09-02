// Extracted from the Globe Life Liberty National Division "Worksite Training Guide"
// (385000 / LND4059 0825), used by Whittingham Agency to onboard new worksite agents.
// This is the single source of truth for the scripts, objections, and rubric that
// both the frontend (phase labels/reference panel) and the Netlify functions
// (system prompts) build from.

import type { Difficulty, Phase } from './types.ts'

export const GATEKEEPER_SCRIPT = {
  opener: (agent: string, dm: string) =>
    `Would you let ${dm} know ${agent} is here?`,
  onAppointmentQuestion:
    'When asked "Do you have an appointment?" or "Are they expecting you?" — the correct agent answer is: "Actually, I need to speak to [Decision Maker] directly."',
  onWhatRegarding:
    'When asked "What is this regarding?" — the correct agent answer is: "We saw [Decision Maker] may qualify for our Worksite Advantage program. That is why I need to speak with them directly. Would you let [Decision Maker] know [Agent] is here to see them?"',
  onWhatIsProgram:
    'When asked "What is the Worksite Advantage program?" — the correct agent answer is: "It\'s regarding an essential business partnership. Will you let [Decision Maker] know [Agent] is here?"',
  onDmUnavailable:
    'If the Decision Maker is not available, the correct agent answer is to ask: "What would be a good time to contact him/her?"',
  disengageNote:
    'The script calls this move the "disengage" — the agent avoids answering the gatekeeper\'s real question and redirects back to getting in front of the Decision Maker, without being pushy or rude.',
}

export const DECISION_MAKER_INTRO_SCRIPT = (agent: string, dm: string) =>
  `${dm}, I am ${agent} with Globe Life Liberty National Division. We saw you may qualify for our Worksite Advantage program. We help businesses provide valuable benefits to their employees, while creating a tax savings for the company, at no cost to the business. I realize you may be busy, is now a good time?`

export interface Objection {
  id: string
  prompt: string
  idealResponseSummary: string
}

export const PRE_PRESENTATION_OBJECTIONS: Objection[] = [
  {
    id: 'not-interested',
    prompt: "I'm not interested.",
    idealResponseSummary:
      'Acknowledge, note other employers found value at no cost to them, ask for a few minutes — "Is now a good time?"',
  },
  {
    id: 'like-xyz',
    prompt: 'Is this like [some other benefits company]?',
    idealResponseSummary:
      'No — this is different, it only takes 15–20 minutes to go over, ask "Is now a good time?"',
  },
  {
    id: 'no-time',
    prompt: "I don't have time right now.",
    idealResponseSummary:
      'Understand, work by appointment, offer two specific day/time options and ask which works better.',
  },
  {
    id: 'send-email',
    prompt: 'Just send me an email about it.',
    idealResponseSummary:
      "Reframe: offer to swing by in person while working the area, low-pressure framing, then offer two times/days.",
  },
  {
    id: 'employees-not-interested',
    prompt: "My employees wouldn't be interested in this.",
    idealResponseSummary:
      'Ask a conditional question — if employees WOULD have interest, would they take a look? Get a "yes," then ask for time to go over it.',
  },
  {
    id: 'tried-before',
    prompt: "We've tried something like this before and it didn't go well.",
    idealResponseSummary:
      'Empathize, note other clients had similar experiences before switching, emphasize service, ask "Is now a good time?"',
  },
  {
    id: 'already-have-benefits',
    prompt: 'We already offer benefits to our employees.',
    idealResponseSummary:
      "Good to hear, frame as enhancing (not replacing) what they have, ask \"Is now a good time?\" If repeated, pivot to a unique benefit only this company offers.",
  },
]

export const PRESENTATION_TALKING_POINTS: string[] = [
  'Who We Are: Globe Life Liberty National Division, serving working Americans since 1900, top financial strength ratings, BBB member.',
  'What We Do: at no cost to the employer, help attract/retain employees with needed benefits, help employees protect their families, help both sides save tax dollars.',
  'How We Are Different: unique life benefits, a needs-based approach (not one-size-fits-all), introductory offers for every employee at no cost.',
  'No-Cost Discount Card + Accidental Death intro offer: $3,000 employee / $3,000 spouse / $1,000 per child accidental death coverage, plus a no-cost discount health services card — both free the first year.',
  'Needs-Based Approach: walks the Decision Maker through a Yes/No needs planner — final expenses, income replacement, mortgage protection, cancer, heart attack/stroke, accident.',
  'Unique Life Benefits — Group Term: coverage to age 100 with paid-up option at 65, portable, premiums never increase, first $50,000 pre-tax — worked example: $30k whole life costs ~$19.24/wk vs. $30k Group Term at ~$9.99/wk (~$7.99/wk net after tax savings).',
  'Income Replacement / Mortgage Protection: monthly income or lump sum up to $200,000 for the family.',
  'Cancer Policy: 2 in 5 people get cancer; pays first-occurrence, chemo/radiation, hospital confinement, transportation — no lifetime maximum.',
  'Critical Illness Policy: $10,000–$50,000 lump sum cash for stroke, heart attack, kidney failure, organ transplant.',
  'Accident Protector Max: 24/7 on-and-off-the-job accident coverage, pays cash directly to the insured, Quick Claims direct deposit.',
  'How It Works / The Ask: agent meets briefly with each employee, offers the no-cost intro benefits, completes a needs analysis, offers coverage where there is a need — then asks the Decision Maker to commit to a day/time for enrollment.',
]

export const CLOSING_OBJECTIONS: Objection[] = [
  {
    id: 'cant-take-people-out-of-production',
    prompt: "I can't take my people out of production for the time this takes.",
    idealResponseSummary:
      'Two tie-down questions: (1) would they want to help an employee facing illness/accident/death — get a "yes"; (2) a few minutes per employee once a year wouldn\'t hurt the business — get a "yes." Then ask for a day/time.',
  },
  {
    id: 'employees-cant-afford',
    prompt: "My employees can't afford it, they live paycheck to paycheck.",
    idealResponseSummary:
      'Tie-down: if something happened to them, they\'d come to the employer for help, right? — get a "yes." Reframe: a few dollars a week today beats a major problem tomorrow. Then ask for a day/time.',
  },
  {
    id: 'want-to-poll-employees',
    prompt: 'I want to poll my employees first to see if anyone is even interested.',
    idealResponseSummary:
      'Agree enthusiastically — offer to bring breakfast or lunch, give a brief overview plus needs analysis to gauge real interest, then lock a day/time.',
  },
  {
    id: 'already-have-worksite-benefits',
    prompt: 'We already have worksite benefits through another company.',
    idealResponseSummary:
      "Compliment their existing coverage, reframe as enhancing (not replacing) — especially the portable Group Term no one else offers — get agreement it fills a gap, then ask for a day/time.",
  },
  {
    id: 'let-me-think-about-it',
    prompt: 'Let me think about it and get back to you.',
    idealResponseSummary:
      "Empathize, note other clients felt the same, but something could happen while they wait leaving them financially exposed — get agreement, then ask for a day/time.",
  },
]

export interface BusinessPersona {
  id: string
  label: string
  industry: string
  flavor: string
  gatekeeperFlavor: string
  decisionMakerFlavor: string
}

export const BUSINESS_PERSONAS: BusinessPersona[] = [
  {
    id: 'hvac',
    label: 'HVAC / Heating & Air',
    industry: 'HVAC contractor',
    flavor:
      'A "dirty hands" trade business — busy, blue-collar, most staff are in trucks all day. Fast-moving, no-nonsense.',
    gatekeeperFlavor:
      'A front-office dispatcher juggling phones and radio calls to techs in the field. Distracted but not hostile.',
    decisionMakerFlavor:
      'The owner-operator, practical and skeptical of anything that smells like a sales pitch, respects people who get to the point.',
  },
  {
    id: 'auto-body',
    label: 'Auto Body Shop',
    industry: 'auto body and collision repair shop',
    flavor: 'Loud shop floor, grease and noise, owner splits time between the counter and the bays.',
    gatekeeperFlavor: 'A front-counter service writer, friendly but guarded about interrupting the owner.',
    decisionMakerFlavor: 'Owner who has been burned by pushy vendors before — wants proof there is no cost to them.',
  },
  {
    id: 'construction',
    label: 'Construction / General Contractor',
    industry: 'construction company',
    flavor: 'Small office trailer or storefront next to a job site, crew mostly out working.',
    gatekeeperFlavor: 'An office manager who handles payroll and is protective of the owner\'s time.',
    decisionMakerFlavor: 'Owner who cares a lot about crew retention and is money-conscious about payroll admin.',
  },
  {
    id: 'medical-office',
    label: 'Medical / Dental Office',
    industry: 'medical office',
    flavor: 'Professional front desk, HIPAA-conscious, generally requires multiple visits before trust is built.',
    gatekeeperFlavor: 'A front-desk receptionist managing patients — polite but firm about protocol.',
    decisionMakerFlavor: 'Office manager or practice owner, cautious, wants everything explained precisely and in writing.',
  },
  {
    id: 'manufacturing',
    label: 'Small Manufacturing / Machine Shop',
    industry: 'machine shop',
    flavor: 'Factory floor noise, HR/office function is thin, decisions move slowly through one or two people.',
    gatekeeperFlavor: 'A plant office admin, unsure whether they are even allowed to talk to a visitor.',
    decisionMakerFlavor: 'HR/ops manager, analytical, wants numbers and comparisons before committing to anything.',
  },
  {
    id: 'retail',
    label: 'Family-Owned Retail Store',
    industry: 'family-owned retail store',
    flavor: 'Multi-generational small business, warm but easily distracted by customers walking in.',
    gatekeeperFlavor: 'A family member working the counter, friendly and chatty.',
    decisionMakerFlavor: 'Owner who is proud of the business history and receptive to rapport, but time-pressed.',
  },
]

export const DIFFICULTY_NOTES: Record<Difficulty, string> = {
  easy:
    'EASY: Be cooperative. The gatekeeper lets the agent through after at most one pushback question. The Decision Maker raises exactly ONE pre-presentation objection and ONE closing objection, and folds fairly quickly once the agent responds reasonably (even an imperfect but on-topic response should work). Stay warm and encouraging in tone.',
  medium:
    'MEDIUM: Realistic resistance. The gatekeeper asks 1–2 of the standard pushback questions before relenting if the agent uses the disengage properly. The Decision Maker raises TWO pre-presentation objections (from different scenarios) and ONE-TWO closing objections. The Decision Maker only moves on when the agent\'s response actually resembles the ideal response pattern (tie-down question, reframe, or offering specific times) — a vague or generic answer should get pushed back on once before you relent.',
  hard:
    'HARD: Skeptical and busy. The gatekeeper resists with 2+ pushback questions and only relents if the agent nails the disengage language. The Decision Maker stacks TWO to THREE pre-presentation objections, references a competitor or a bad past experience, seems rushed/distracted, and raises TWO closing objections before agreeing. If the agent\'s response is weak, generic, or breaks the tie-down pattern, push back again in a believably skeptical way — you can be won over, but only by a genuinely solid response close to the training script\'s ideal pattern.',
}

export const RUBRIC_CATEGORIES = [
  'Rapport & Research',
  'Gatekeeper Navigation',
  'Decision Maker Introduction',
  'Objection Handling',
  'Presentation Delivery',
  'Closing & Enrollment Ask',
] as const

export function personaFor(businessId: string): BusinessPersona {
  return BUSINESS_PERSONAS.find((b) => b.id === businessId) ?? BUSINESS_PERSONAS[0]
}

export const PHASE_LABELS: Record<Phase, string> = {
  gatekeeper: 'Past the Gatekeeper',
  decision_maker_intro: 'Decision Maker Intro',
  objections_pre: 'Pre-Presentation Objections',
  presentation: 'Presentation',
  closing: 'Closing',
  complete: 'Session Complete',
}

export const PHASE_ORDER: Phase[] = [
  'gatekeeper',
  'decision_maker_intro',
  'objections_pre',
  'presentation',
  'closing',
  'complete',
]
