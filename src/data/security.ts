// Client-side password gate only — a UI deterrent for the internal leads view,
// not real security. Set AUTOMATIONGAP_PASSWORD in Netlify env vars to match
// this value so the backend functions accept requests from unlocked sessions.
export const SITE_PASSWORD = 'AutomationGap2026!'
export const SITE_UNLOCK_KEY = 'automation-gap-unlocked'
