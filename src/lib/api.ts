import { SITE_UNLOCK_KEY } from '../data/security'
import type { Lead } from './types'

function authHeaders(): HeadersInit {
  const password = localStorage.getItem(SITE_UNLOCK_KEY) ?? ''
  return password ? { 'x-ag-password': password } : {}
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json()
    return body.error ?? fallback
  } catch {
    return fallback
  }
}

export async function listLeads(): Promise<Lead[]> {
  const res = await fetch('/.netlify/functions/leads-list', { headers: authHeaders() })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to load leads'))
  return res.json()
}

export async function upsertLead(lead: Lead): Promise<Lead> {
  const res = await fetch('/.netlify/functions/leads-upsert', {
    method: 'POST',
    headers: { ...authHeaders(), 'content-type': 'application/json' },
    body: JSON.stringify(lead),
  })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to save lead'))
  return res.json()
}

export async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`/.netlify/functions/leads-delete?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(await parseError(res, 'Failed to delete lead'))
}

// Public submission from the landing-page gap-check quiz — no auth required.
export async function submitPublicLead(lead: Lead): Promise<void> {
  await fetch('/.netlify/functions/leads-submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(lead),
  })
}
