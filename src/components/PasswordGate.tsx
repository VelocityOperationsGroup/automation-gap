import { useState, type ReactNode, type FormEvent } from 'react'
import { Lock } from 'lucide-react'
import { SITE_PASSWORD, SITE_UNLOCK_KEY } from '../data/security'

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(SITE_UNLOCK_KEY) === SITE_PASSWORD)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (input === SITE_PASSWORD) {
      localStorage.setItem(SITE_UNLOCK_KEY, input)
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rounded-2xl border border-ag-line bg-ag-charcoal p-8 shadow-xl text-center">
        <Lock className="mx-auto text-ag-cyan" size={32} />
        <h1 className="mt-3 font-display text-xl font-bold text-white">Internal Access Only</h1>
        <p className="mt-2 text-sm text-white/50">Enter the team password to view this section.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            className={`rounded-lg border bg-ag-ink px-4 py-2.5 text-center text-white focus:outline-none focus:ring-2 focus:ring-ag-cyan/50 ${
              error ? 'border-ag-red' : 'border-ag-line'
            }`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(false)
            }}
            placeholder="Password"
          />
          {error && <p className="text-xs text-ag-red">Incorrect password — try again.</p>}
          <button
            type="submit"
            className="rounded-lg bg-ag-cyan px-4 py-2.5 font-semibold text-ag-ink transition hover:bg-ag-cyan-light"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
