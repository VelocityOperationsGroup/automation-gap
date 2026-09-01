# Whittingham Agency — Worksite Trainer

An AI role-play trainer for Whittingham Agency's new worksite agents. The trainee plays
the agent; Claude plays every other character — the gatekeeper, then the Decision
Maker — straight through the Globe Life Liberty National Division Worksite Training
Guide flow: gatekeeper disengage → Decision Maker intro → pre-presentation objections
→ presentation → closing objections → enrollment ask. A separate "debrief" call scores
the completed transcript against the guide's script and technique.

Standalone app — its own `package.json`, build, and Netlify Functions, independent of
the sibling `automation-gap` site this lives alongside in the same repo.

## Stack

React 19 + TypeScript + Vite, Tailwind v4. Two Netlify Functions (`netlify/functions`)
call the Claude API (`claude-opus-5`) via `@anthropic-ai/sdk`. `shared/` holds the
extracted training-guide content (scripts, objections, rubric) and prompt-building
code, imported by both the frontend and the functions so there's one source of truth.

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

Set `ANTHROPIC_API_KEY` in your environment (or a local `.env` picked up by
`netlify dev`) — the functions call the Claude API directly and need it. No key is
ever sent to the browser.

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
- `src/pages` via `src/App.tsx` — a 3-screen flow: `SetupScreen` (business + difficulty
  + agent name) → `ChatWindow` (role-play, with a live `PhaseTracker`) → `DebriefReport`.

## Deploying

Point a Netlify site at this repo with **Base directory: `whittingham-training`** (its
`netlify.toml` handles build/publish/functions from there), and set `ANTHROPIC_API_KEY`
in that site's environment variables.
