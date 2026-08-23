// A climbing line with a gap in it — where you are, where AI-adopters already
// are, and the jump between them. The whole brand concept in one mark.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M14 40 L26 26 L36 34 L50 18"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ag-cyan"
      />
      <path d="M50 18 L50 28" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeDasharray="1 6" className="text-ag-coral" />
      <circle cx="14" cy="40" r="3.2" fill="currentColor" className="text-ag-cyan" />
      <circle cx="50" cy="18" r="3.2" fill="currentColor" className="text-ag-coral" />
    </svg>
  )
}
