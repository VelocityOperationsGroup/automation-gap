import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Check, X as XIcon, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react'
import { CATEGORIES, toolsForCategory } from '../data/tools'
import { blankLead, type Lead } from '../lib/types'
import { submitPublicLead } from '../lib/api'

export default function GapCheck() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [phase, setPhase] = useState<'quiz' | 'capture' | 'done'>('quiz')
  const [form, setForm] = useState({ name: '', email: '', businessType: '' })
  const [saving, setSaving] = useState(false)

  const total = CATEGORIES.length
  const category = CATEGORIES[index]
  const matched = useMemo(() => CATEGORIES.filter((c) => answers[c.id]), [answers])

  function answer(value: boolean) {
    setAnswers((prev) => ({ ...prev, [category.id]: value }))
    if (index + 1 < total) {
      setIndex(index + 1)
    } else {
      setPhase('capture')
    }
  }

  function restart() {
    setAnswers({})
    setIndex(0)
    setPhase('quiz')
    setForm({ name: '', email: '', businessType: '' })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    const lead: Lead = blankLead({
      ...form,
      painPoints: matched.map((c) => c.id),
    })
    try {
      await submitPublicLead(lead)
    } catch {
      // Non-fatal for the demo flow — the visitor still sees their toolkit either way.
    } finally {
      setSaving(false)
      setPhase('done')
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-ag-line bg-ag-charcoal p-6 shadow-2xl sm:p-10">
      {phase === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-ag-cyan"
              animate={{ width: `${(index / total) * 100}%` }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">
            Question {index + 1} of {total}
          </p>
          <motion.h3
            key={category.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 min-h-20 font-display text-2xl font-semibold text-white sm:text-3xl"
          >
            {category.question}
          </motion.h3>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => answer(true)}
              className="group flex items-center justify-center gap-2 rounded-xl border border-ag-line bg-white/5 py-4 font-semibold text-white transition hover:border-ag-cyan hover:bg-ag-cyan/10"
            >
              <Check className="text-ag-cyan transition group-hover:scale-110" size={20} /> Yes
            </button>
            <button
              onClick={() => answer(false)}
              className="group flex items-center justify-center gap-2 rounded-xl border border-ag-line bg-white/5 py-4 font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              <XIcon className="text-white/50 transition group-hover:scale-110" size={20} /> No
            </button>
          </div>
        </motion.div>
      )}

      {phase === 'capture' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GapSummary matchedCount={matched.length} />
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <p className="text-sm font-semibold text-white/80">Get your matched toolkit:</p>
            <input
              required
              placeholder="Your name"
              className="w-full rounded-lg border border-ag-line bg-ag-ink px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ag-cyan/50"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-lg border border-ag-line bg-ag-ink px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ag-cyan/50"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Business type"
                className="rounded-lg border border-ag-line bg-ag-ink px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ag-cyan/50"
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ag-cyan py-3 font-semibold text-ag-ink transition hover:bg-ag-cyan-light disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Show my toolkit'}
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <GapSummary matchedCount={matched.length} />

          {matched.length === 0 ? (
            <p className="mt-6 text-center text-sm text-white/60">
              No major gaps flagged — nice. Browse the full directory any time.
            </p>
          ) : (
            <div className="mt-8 space-y-6">
              {matched.map((c) => (
                <div key={c.id}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">{c.label}</p>
                  <div className="mt-2 space-y-2">
                    {toolsForCategory(c.id)
                      .slice(0, 2)
                      .map((tool) => (
                        <a
                          key={tool.id}
                          href={tool.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-3 rounded-lg border border-ag-line bg-ag-ink px-4 py-3 transition hover:border-ag-cyan/40"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-white">{tool.name}</span>
                            <span className="block text-xs text-white/50">{tool.price}</span>
                          </span>
                          <ExternalLink size={15} className="shrink-0 text-white/40" />
                        </a>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={restart}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-ag-line px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
          >
            <RotateCcw size={16} /> Run another
          </button>
        </motion.div>
      )}
    </div>
  )
}

function GapSummary({ matchedCount }: { matchedCount: number }) {
  const label =
    matchedCount === 0
      ? 'No gap'
      : matchedCount <= 2
        ? 'Small gap'
        : matchedCount <= 4
          ? 'Real gap'
          : 'Wide gap'
  const color = matchedCount === 0 ? 'ag-mint' : matchedCount <= 2 ? 'ag-cyan' : matchedCount <= 4 ? 'ag-coral' : 'ag-red'

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 font-display text-3xl font-bold"
        style={{ borderColor: `var(--color-${color})`, color: `var(--color-${color})` }}
      >
        {matchedCount}/6
      </motion.div>
      <p className="mt-4 font-display text-xl font-bold text-white">{label}</p>
    </div>
  )
}
