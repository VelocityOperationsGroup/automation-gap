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
call the Gemini Developer API (`gemini-3.6-flash`, free tier) via `@google/genai`.
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
billing required for `gemini-3.6-flash`, the model this app uses). No key is ever sent
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
  business personas, difficulty notes, and a research-topic pool (the guide's Rapport
  Building Game example list), all pulled from the Worksite Training Guide.
- Each scenario gets 2 random research notes (`src/lib/scenario.ts`), fed into both the
  role-play system prompt (so the Decision Maker reacts naturally when they come up) and
  the debrief prompt (so "Rapport & Research" is graded on whether the agent actually
  used them). They — plus the gatekeeper/Decision Maker names — stay visible in a
  collapsible "Scenario Notes" panel in `ChatWindow.tsx` for the whole session, not just
  in the opening hint.
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
Resend's free tier is 3,000 emails/month, and `gemini-3.6-flash` is free of charge on
the Gemini Developer API (rate-limited, not usage-billed — plenty for a handful of
agents practicing). If usage ever needs more headroom than the free tier allows, the
only code that would need to change is `netlify/functions/_shared/gemini.mts` and the
two functions that call it — `shared/prompt.ts`, `shared/guideContent.ts`, and the
entire frontend are provider-agnostic.

## Known limitation: debrief latency vs. function timeouts

`gemini-3.6-flash` is a reasoning model — even at `thinkingConfig.thinkingLevel: "LOW"`
(set on `roleplay-debrief.mts` specifically to keep this in check), grading a full
transcript took ~9.5s in local testing with a short 5-message transcript; a longer real
session will run higher. `roleplay-turn.mts` uses `"MINIMAL"` and stays under 2s, so the
live chat itself is fine. If a real deployment sees `roleplay-debrief` time out (a
generic "unavailable, try again" error on the debrief screen), it's almost certainly
this — check Netlify's current function execution limit for your plan and, if it's the
bottleneck, either use a Background Function for `roleplay-debrief` or trim
`maxOutputTokens`/the rubric further.

## Voice

The chat screen supports talking instead of typing, entirely via the browser's built-in
Web Speech API — no API key, no cost, no backend involvement:

- **Push to Talk**: a large button above the text box (`src/lib/speech.ts` +
  `ChatWindow.tsx`) starts `SpeechRecognition` in continuous mode — it keeps listening
  through pauses instead of cutting off after a few seconds of silence — and shows the
  live transcript in the text box as you speak. Hit "Stop & Send" (same button) when
  you're done to send it. Typing remains available at all times as a fallback.
- **Spoken replies**: persona replies auto-play via `SpeechSynthesis`, picking a
  consistent voice per character (gatekeeper vs. Decision Maker sound different) when
  the browser exposes more than one. A speaker icon in the header mutes/unmutes this.
  Stage directions in the AI's reply (`*taps radio*`, `[background noise]`) are stripped
  before speaking but still shown in the chat bubble.
- **Browser support**: `SpeechRecognition` (the mic button) is Chrome/Edge only as of
  writing — Firefox and most non-Chromium browsers don't support it, so the mic button
  hides itself there and the app is text-only. `SpeechSynthesis` (spoken replies) has
  much broader support. Both feature-detect independently and fail gracefully — a
  denied microphone permission or unsupported browser just falls back to typing, with
  an inline error rather than a crash.
