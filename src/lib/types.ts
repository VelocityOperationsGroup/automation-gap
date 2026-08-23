export interface Lead {
  id: string
  name: string
  email: string
  businessType: string
  painPoints: string[]
  contacted: boolean
  createdAt: string
  updatedAt: string
}

export function newLeadId() {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function blankLead(overrides: Partial<Lead> = {}): Lead {
  const now = new Date().toISOString()
  return {
    id: newLeadId(),
    name: '',
    email: '',
    businessType: '',
    painPoints: [],
    contacted: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
