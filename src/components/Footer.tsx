import { Link } from 'react-router-dom'
import Logo from './Logo'
import { BRAND, STATS_DISCLAIMER } from '../data/content'

export default function Footer() {
  return (
    <footer className="no-print border-t border-ag-line bg-ag-void">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo size={26} />
              <span className="font-display text-lg font-bold text-white">{BRAND.name}</span>
            </div>
            <p className="mt-3 text-sm text-white/50">{BRAND.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Site</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link to="/directory" className="hover:text-white">Directory</Link></li>
                <li><a href="/#how-it-works" className="hover:text-white">How it works</a></li>
                <li><a href="/#gap-check" className="hover:text-white">Gap Check</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Team</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link to="/leads" className="hover:text-white">Leads</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-white/35">{STATS_DISCLAIMER}</p>
        <p className="mt-4 text-xs text-white/25">© {new Date().getFullYear()} {BRAND.name}. A Velocity Operations Group company.</p>
      </div>
    </footer>
  )
}
