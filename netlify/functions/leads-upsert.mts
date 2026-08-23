import { checkAuth, unauthorized, saveLead, json, type Lead } from './_shared/store.mts'

export default async (req: Request): Promise<Response> => {
  if (!checkAuth(req)) return unauthorized()

  const lead = (await req.json()) as Lead
  if (!lead?.id) return json({ error: 'Missing lead id' }, { status: 400 })

  lead.updatedAt = new Date().toISOString()
  await saveLead(lead)

  return json(lead)
}
