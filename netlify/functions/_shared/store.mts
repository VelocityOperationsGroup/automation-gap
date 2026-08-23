import { getStore } from '@netlify/blobs'

export const LEADS_STORE = 'automation-gap-leads'
export const KEY_PREFIX = 'leads/'

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

// Strong consistency: without it, reads can be served from a cache that lags
// behind the most recent write, so a lead saved a moment ago can appear
// missing from a listing done right after.
export function leadsStore() {
  return getStore({ name: LEADS_STORE, consistency: 'strong' })
}

function keyFor(id: string) {
  return `${KEY_PREFIX}${id}`
}

// Each lead is its own blob (full JSON body, not a shared index), so an
// upsert or delete only ever touches its own key — nothing to race under
// concurrent or rapid-sequential requests.
export async function listLeads(): Promise<Lead[]> {
  const store = leadsStore()
  const { blobs } = await store.list({ prefix: KEY_PREFIX })
  const records = await Promise.all(
    blobs.map(async (b) => {
      const raw = await store.get(b.key, { type: 'json' })
      return raw as Lead | null
    }),
  )
  return records.filter((r): r is Lead => r !== null)
}

export async function saveLead(lead: Lead): Promise<void> {
  const store = leadsStore()
  await store.setJSON(keyFor(lead.id), lead)
}

export async function deleteLead(id: string): Promise<void> {
  const store = leadsStore()
  await store.delete(keyFor(id))
}

export function checkAuth(req: Request): boolean {
  const provided = req.headers.get('x-ag-password') ?? ''
  const expected = process.env.AUTOMATIONGAP_PASSWORD ?? ''
  return expected.length > 0 && provided === expected
}

export function unauthorized(): Response {
  return json({ error: 'Unauthorized' }, { status: 401 })
}

export function json(data: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers)
  headers.set('content-type', 'application/json')
  return new Response(JSON.stringify(data), { ...init, headers })
}
