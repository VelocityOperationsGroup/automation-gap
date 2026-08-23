import { checkAuth, unauthorized, deleteLead, json } from './_shared/store.mts'

export default async (req: Request): Promise<Response> => {
  if (!checkAuth(req)) return unauthorized()

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'Missing id' }, { status: 400 })

  await deleteLead(id)

  return json({ ok: true })
}
