import { GoogleGenAI } from '@google/genai'

// gemini-2.5-flash is still listed on the pricing page but the API itself
// rejects it for new accounts (404 "no longer available to new users") —
// verified live against a real key. gemini-3.6-flash is the free-tier
// replacement Google's own error message points to.
export const GEMINI_MODEL = 'gemini-3.6-flash'

let client: GoogleGenAI | null = null

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  if (!client) client = new GoogleGenAI({ apiKey })
  return client
}
