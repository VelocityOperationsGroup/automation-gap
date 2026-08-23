import { useState } from 'react'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { CATEGORIES, TOOLS } from '../data/tools'
import { VETTING_NOTE } from '../data/content'

export default function DirectoryPage() {
  const [active, setActive] = useState<string | 'all'>('all')

  const tools = active === 'all' ? TOOLS : TOOLS.filter((t) => t.categoryId === active)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Tool Directory</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
        <ShieldCheck size={16} className="text-ag-mint shrink-0" /> {VETTING_NOTE}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive('all')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === 'all' ? 'bg-ag-cyan text-ag-ink' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === c.id ? 'bg-ag-cyan text-ag-ink' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const category = CATEGORIES.find((c) => c.id === tool.categoryId)
          return (
            <a
              key={tool.id}
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-2xl border border-ag-line bg-ag-charcoal p-6 transition hover:border-ag-cyan/40 hover:bg-ag-cyan/5"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">{category?.label}</span>
              <span className="mt-2 flex items-center gap-1.5 font-display text-lg font-bold text-white">
                {tool.name}
                <ExternalLink size={14} className="text-white/30 transition group-hover:text-ag-cyan" />
              </span>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{tool.blurb}</p>
              <p className="mt-4 text-xs text-white/40">Best for: {tool.bestFor}</p>
              <p className="mt-1 text-xs font-semibold text-ag-cyan/80">{tool.price}</p>
            </a>
          )
        })}
      </div>
    </div>
  )
}
