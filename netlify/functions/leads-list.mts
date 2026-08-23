import { checkAuth, unauthorized, listLeads, json } from './_shared/store.mts'

export default async (req: Request): Promise<Response> => {
  if (!checkAuth(req)) return unauthorized()

  const leads = await listLeads()
  leads.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return json(leads)
}
