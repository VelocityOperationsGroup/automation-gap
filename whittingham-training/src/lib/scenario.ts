import type { Difficulty, ScenarioConfig } from '../../shared/types.ts'
import { RESEARCH_TOPIC_POOL } from '../../shared/guideContent.ts'

const GATEKEEPER_NAMES = ['Pam', 'Renee', 'Carla', 'Dana', 'Marcus', 'Teresa', 'Kevin', 'Ashley']
const DECISION_MAKER_NAMES = ['Rick', 'Diane', 'Sam', 'Lorraine', 'George', 'Patricia', 'Miguel', 'Wendy']
const RESEARCH_NOTE_COUNT = 2

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickDistinct<T>(arr: T[], count: number): T[] {
  const pool = [...arr]
  const result: T[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(index, 1)[0])
  }
  return result
}

export function randomScenario(businessId: string, difficulty: Difficulty, agentName: string): ScenarioConfig {
  return {
    businessId,
    difficulty,
    agentName: agentName.trim() || 'Agent',
    gatekeeperName: pick(GATEKEEPER_NAMES),
    decisionMakerName: pick(DECISION_MAKER_NAMES),
    researchNotes: pickDistinct(RESEARCH_TOPIC_POOL, RESEARCH_NOTE_COUNT),
  }
}
