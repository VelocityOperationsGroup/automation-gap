export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export function letterGrade(score: number, maxScore: number): LetterGrade {
  const pct = maxScore > 0 ? score / maxScore : 0
  if (pct >= 0.9) return 'A'
  if (pct >= 0.8) return 'B'
  if (pct >= 0.7) return 'C'
  if (pct >= 0.6) return 'D'
  return 'F'
}

export const GRADE_DESCRIPTION: Record<LetterGrade, string> = {
  A: 'Excellent — matched the script pattern with confidence',
  B: 'Good — solid grasp with minor gaps',
  C: 'Passing — hit the basics, needs sharpening',
  D: 'Weak — missed key parts of the technique',
  F: 'Missed — this needs focused practice before the field',
}
