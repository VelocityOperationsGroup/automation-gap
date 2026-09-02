import type { Difficulty, ScenarioConfig } from '../../shared/types.ts'

const GATEKEEPER_NAMES = ['Pam', 'Renee', 'Carla', 'Dana', 'Marcus', 'Teresa', 'Kevin', 'Ashley']
const DECISION_MAKER_NAMES = ['Rick', 'Diane', 'Sam', 'Lorraine', 'George', 'Patricia', 'Miguel', 'Wendy']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomScenario(businessId: string, difficulty: Difficulty, agentName: string): ScenarioConfig {
  return {
    businessId,
    difficulty,
    agentName: agentName.trim() || 'Agent',
    gatekeeperName: pick(GATEKEEPER_NAMES),
    decisionMakerName: pick(DECISION_MAKER_NAMES),
  }
}
