# Automation Gap

AI tool directory + recommendation quiz for small businesses. A Velocity Operations Group company.
Sibling site to Backstop — same stack, separate brand, no shared code or data.

## Stack

React 19 + TypeScript + Vite, Tailwind v4, Framer Motion, React Router, Recharts.
Lead data persists via Netlify Blobs through Netlify Functions (`netlify/functions`).

## Local development

```bash
npm install
npm run dev
```

The `/leads` admin page and the Gap Check quiz's email capture call Netlify Functions,
so to exercise those locally you need the Netlify CLI instead of plain `vite dev`:

```bash
npm install -g netlify-cli   # once
netlify dev
```

Set an `AUTOMATIONGAP_PASSWORD` environment variable (Netlify site settings, or a local
`.env` picked up by `netlify dev`) matching the value in `src/data/security.ts` — this
gates the `/leads` functions server-side. The client-side password gate is a soft UI
deterrent only, not real security.

## Structure

- `src/pages/Landing.tsx` — hero, stats, how-it-works, Gap Check quiz, directory teaser
- `src/pages/DirectoryPage.tsx` — full browsable tool directory with category filter
- `src/pages/LeadsPage.tsx` — password-gated list of captured leads (`/leads`)
- `src/components/GapCheck.tsx` — the 6-question quiz that matches pain points to tools
  and captures the lead's email
- `src/data/tools.ts` — the directory: categories and every tool, edit here to add/remove
- `netlify/functions/` — `leads-list` / `leads-upsert` / `leads-delete` (password-gated,
  used by `/leads`) and `leads-submit` (public, used by the Gap Check quiz)

## Brand assets

`src/components/Logo.tsx` is the in-app SVG mark (a climbing line with a gap in it —
where you are vs. where AI-adopters already are). `public/favicon.svg`, `favicon-32.png`,
`apple-touch-icon.png`, `icon-512.png`, and `og-image.png` are all rasterized from the
same design in `assets-src/`. To regenerate:

```bash
npm install --no-save sharp   # not a runtime dependency, only needed for this script
node assets-src/generate.mjs
```

OG/Twitter meta tags in `index.html` currently use relative paths (`/og-image.png`) —
once deployed, switch them to the live absolute domain (most crawlers won't resolve
relative `og:image` paths).

## Keeping the directory current

Every tool listed was verified as actively operating at build time (2026-08-23) —
worth re-checking periodically, since AI tool startups shut down, get acquired, or
degrade faster than most software categories. `Bench Accounting` was deliberately left
out of the finance category for exactly this reason: it collapsed in December 2024,
got acquired, and now operates under a different brand with reported service issues.
