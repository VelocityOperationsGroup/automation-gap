export type Phase =
  | 'gatekeeper'
  | 'decision_maker_intro'
  | 'objections_pre'
  | 'presentation'
  | 'closing'
  | 'complete'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ScenarioConfig {
  businessId: string
  gatekeeperName: string
  decisionMakerName: string
  difficulty: Difficulty
  agentName: string
}

export type ChatRole = 'agent' | 'persona'

export interface ChatMessage {
  role: ChatRole
  text: string
  phase: Phase
}

export interface RoleplayTurnRequest {
  scenario: ScenarioConfig
  phase: Phase
  history: ChatMessage[]
  agentMessage: string
}

export interface RoleplayTurnResponse {
  reply: string
  phase: Phase
  phaseAdvanced: boolean
  sessionComplete: boolean
}

export interface DebriefRequest {
  scenario: ScenarioConfig
  history: ChatMessage[]
}

export interface RubricScore {
  category: string
  score: number
  maxScore: number
  feedback: string
}

export interface DebriefReport {
  overallScore: number
  overallMaxScore: number
  headline: string
  rubric: RubricScore[]
  strengths: string[]
  improvements: string[]
  scriptDeviations: string[]
  nextDrill: string
}
