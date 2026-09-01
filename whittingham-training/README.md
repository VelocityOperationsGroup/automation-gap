# Whittingham Agency — Worksite Trainer

An AI role-play trainer for Whittingham Agency's new worksite agents. The trainee plays
the agent; Gemini plays every other character — the gatekeeper, then the Decision
Maker — straight through the Globe Life Liberty National Division Worksite Training
Guide flow: gatekeeper disengage → Decision Maker intro → pre-presentation objections
→ presentation → closing objections → enrollment ask. A separate "debrief" call scores
the completed transcript against the guide's script and technique.

Standalone app — its own `package.json`, build, and Netlify Functions, independent of
the sibling `automation-gap` site this lives alongside in the same repo.

## Stack

React 19 + TypeScript + Vite, Tailwind v4. Two Netlify Functions (`netlify/functions`)
call the Gemini Developer API (`gemini-2.5-flash`, free tier) via `@google/genai`.
`shared/` holds the extracted training-guide content (scripts, objections, rubric) and
prompt-building code, imported by both the frontend and the functions so there's one
source of truth. Chosen over Claude specifically to keep this running at $0 — see
"Cost" below.

## Local development

```bash
npm install
```

The chat and debrief calls go through Netlify Functions, so use the Netlify CLI
instead of plain `vite dev`:

```bash
npm install -g netlify-cli   # once
netlify dev
```

Set `GEMINI_API_KEY` in your environment (or a local `.env` picked up by
`netlify dev`) — the functions call the Gemini Developer API directly and need it. Grab
a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (no
billing required for `gemini-2.5-flash`, the model this app uses). No key is ever sent
to the browser.

To test the "Email My Scorecard" button locally, also set `RESEND_API_KEY` (a free
[Resend](https://resend.com) account works — grab the key from their dashboard). Without
a verified sending domain, emails send from `onboarding@resend.dev`; set
`RESEND_FROM_EMAIL` to override once a domain is verified. If `RESEND_API_KEY` is unset,
`send-scorecard` returns a clear "not configured" error instead of failing silently —
the rest of the app (role-play + grading) works fine without it.

## Structure

- `shared/guideContent.ts` — the gatekeeper script, Decision Maker intro, the 7
  pre-presentation objections, presentation talking points, the 5 closing objections,
  business personas, and difficulty notes, all pulled from the Worksite Training Guide.
- `shared/prompt.ts` — builds the per-phase system prompt for the role-play persona
  and the grading system prompt for the debrief, plus the reply/control-block parser.
- `shared/types.ts` — types shared between the frontend and the functions.
- `netlify/functions/roleplay-turn.mts` — one persona reply per trainee message; the
  model appends a small hidden control block (phase + advance signal) that the
  function strips before returning `{ reply, phase, phaseAdvanced, sessionComplete }`.
- `netlify/functions/roleplay-debrief.mts` — grades the full transcript against a
  6-category rubric (rapport, gatekeeper navigation, DM intro, objection handling,
  presentation, closing) and returns strengths/improvements/script deviations/next drill.
- `shared/grading.ts` — deterministic percentage → A-F letter grade mapping, applied to
  the overall score and each rubric category (kept out of the LLM call for consistency).
- `shared/emailTemplate.ts` — builds the scorecard email's subject/HTML/plaintext.
- `netlify/functions/send-scorecard.mts` — emails the finished scorecard via the Resend
  API (`RESEND_API_KEY`) to an address the trainee enters on the debrief screen.
- `src/pages` via `src/App.tsx` — a 3-screen flow: `SetupScreen` (business + difficulty
  + agent name) → `ChatWindow` (role-play, with a live `PhaseTracker`) → `DebriefReport`
  (letter grades per section + "Email My Scorecard").

## Deploying

Point a Netlify site at this repo with **Base directory: `whittingham-training`** (its
`netlify.toml` handles build/publish/functions from there), and set `GEMINI_API_KEY`
and `RESEND_API_KEY` in that site's environment variables (plus `RESEND_FROM_EMAIL` once
a sending domain is verified in Resend).

## Cost

Built to run at **$0**. Netlify's free tier easily covers a training tool's traffic,
Resend's free tier is 3,000 emails/month, and `gemini-2.5-flash` is free of charge on
the Gemini Developer API (rate-limited, not usage-billed — plenty for a handful of
agents practicing). If usage ever needs more headroom than the free tier allows, the
only code that would need to change is `netlify/functions/_shared/gemini.mts` and the
two functions that call it — `shared/prompt.ts`, `shared/guideContent.ts`, and the
entire frontend are provider-agnostic.
