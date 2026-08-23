import { saveLead, json, type Lead } from './_shared/store.mts'

// Public, unauthenticated endpoint — this is the gap-check quiz lead-capture
// path. Only ever creates/overwrites the submitted lead's own id, never
// reads or lists other leads, so it's safe without the admin password.
export default async (req: Request): Promise<Response> => {
  const lead = (await req.json()) as Lead
  if (!lead?.id || !lead.email) return json({ error: 'Missing required fields' }, { status: 400 })

  const now = new Date().toISOString()
  lead.createdAt = lead.createdAt || now
  lead.updatedAt = now
  await saveLead(lead)

  return json({ ok: true })
}
