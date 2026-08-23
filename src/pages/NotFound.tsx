import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <h1 className="font-display text-5xl font-bold text-white">404</h1>
      <p className="mt-3 text-white/55">That page doesn't exist. Even AI can't find it.</p>
      <Link to="/" className="mt-6 rounded-full bg-ag-cyan px-6 py-2.5 font-semibold text-ag-ink">
        Back home
      </Link>
    </div>
  )
}
