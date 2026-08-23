import { useEffect, useState } from 'react'
import { Trash2, Mail } from 'lucide-react'
import InternalToolbar from '../components/InternalToolbar'
import { listLeads, upsertLead, deleteLead } from '../lib/api'
import type { Lead } from '../lib/types'
import { CATEGORIES } from '../data/tools'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listLeads()
      .then(setLeads)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function toggleContacted(lead: Lead) {
    const updated = { ...lead, contacted: !lead.contacted }
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)))
    await upsertLead(updated)
  }

  async function remove(id: string) {
    await deleteLead(id)
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  function categoryLabels(ids: string[]) {
    return ids.map((id) => CATEGORIES.find((c) => c.id === id)?.label ?? id).join(', ')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <InternalToolbar backTo="/" backLabel="Back to site" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Leads</h1>
          <p className="mt-1 text-sm text-white/50">{leads.length} captured from the gap check</p>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-ag-red/30 bg-ag-red/10 px-4 py-3 text-sm text-ag-red">
          Couldn't load leads ({error}). If this is local dev, run this project with `netlify dev` so the
          functions and Blobs store are available.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-ag-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-ag-charcoal text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Gaps flagged</th>
              <th className="px-4 py-3 font-medium">Contacted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                  No leads yet.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-ag-line">
                <td className="px-4 py-3 text-white">{lead.name}</td>
                <td className="px-4 py-3 text-white/70">
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:text-ag-cyan">
                    <Mail size={13} /> {lead.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-white/70">{lead.businessType || '—'}</td>
                <td className="px-4 py-3 text-white/60">{categoryLabels(lead.painPoints) || '—'}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={lead.contacted}
                    onChange={() => toggleContacted(lead)}
                    className="accent-ag-cyan"
                  />
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(lead.id)} className="text-white/30 hover:text-ag-red">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
