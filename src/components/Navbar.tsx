import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { BRAND } from '../data/content'

const links = [
  { to: '/directory', label: 'Directory' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#gap-check', label: 'Gap Check' },
  { to: '/ai-risk', label: 'AI Risk' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="no-print sticky top-0 z-50 border-b border-ag-line/70 bg-ag-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-lg font-bold tracking-tight text-white">{BRAND.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-white/70 transition hover:text-white">
              {l.label}
            </Link>
          ))}
          <a
            href="/#gap-check"
            className="rounded-md bg-ag-cyan px-4 py-2 text-sm font-semibold text-ag-ink transition hover:bg-ag-cyan-light"
          >
            Find My Tools
          </a>
        </nav>

        <button className="text-white md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ag-line bg-ag-ink px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-white/80">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
