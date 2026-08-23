export interface CategoryRisk {
  categoryId: string
  risk: string
}

// One real exposure per directory category — written to match the specific
// tools we recommend, not generic "AI is risky" hand-waving.
export const CATEGORY_RISKS: CategoryRisk[] = [
  {
    categoryId: 'support',
    risk: 'A chatbot can promise a refund, a discount, or a policy you never agreed to — and some of those promises turn out to be legally binding on your business.',
  },
  {
    categoryId: 'marketing',
    risk: 'AI-generated copy can misquote a stat, make a claim you can\'t back up, or lift phrasing too close to someone else\'s — published under your name, at your liability.',
  },
  {
    categoryId: 'scheduling',
    risk: 'A scheduling AI that double-books a client meeting or misses a compliance deadline is still your mistake to your customer, even though you never touched the calendar.',
  },
  {
    categoryId: 'sales',
    risk: 'Automated outreach sequences can brush up against spam and consent laws (CAN-SPAM, TCPA) without a human ever writing or reviewing the message.',
  },
  {
    categoryId: 'meetings',
    risk: 'Auto-transcribing every call can raise call-recording consent issues depending on your state and your client\'s — the tool won\'t know or care.',
  },
  {
    categoryId: 'finance',
    risk: 'A miscategorized transaction or a cash-flow forecast you acted on is still your business decision in the eyes of a lender or the IRS, even if the AI suggested it.',
  },
]

export function riskForCategory(categoryId: string): string | undefined {
  return CATEGORY_RISKS.find((r) => r.categoryId === categoryId)?.risk
}
