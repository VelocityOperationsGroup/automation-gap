import { Link } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import { SITE_UNLOCK_KEY } from '../data/security'

export default function InternalToolbar({ backTo, backLabel }: { backTo: string; backLabel: string }) {
  function lock() {
    localStorage.removeItem(SITE_UNLOCK_KEY)
    window.location.href = backTo
  }

  return (
    <div className="no-print mb-8 flex items-center justify-between">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition hover:text-white"
      >
        <ArrowLeft size={16} /> {backLabel}
      </Link>
      <button
        onClick={lock}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-white/35 transition hover:text-white/70"
      >
        <Lock size={13} /> Lock
      </button>
    </div>
  )
}
