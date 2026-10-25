# Developer Studio 1025

Developer Studio 1025 is a local-first release intelligence workspace for product engineers. It turns the small, scattered signs around a release—review gaps, checks, ownership, dependencies, and merge state—into one calm, prioritised morning brief.

This project intentionally ships with convincing demo data and works without accounts, an API key, or a backend. The “Studio Briefing” is a clearly labelled local demo synthesis, designed to demonstrate where an optional AI integration could sit without making the product dependent on one.

## What it does

- Surfaces the highest-leverage next move rather than another long task list.
- Scores release readiness using review coverage, passing checks, and resolved risk.
- Shows a readable release narrative, signal feed, and merge queue in one view.
- Offers a lightweight focus ritual for keeping a critical decision bounded.
- Includes dynamic local interactions: refresh the briefing, merge queue items, toggle readiness checks, navigate workspace sections, and receive non-blocking feedback.
- Includes a keyboard command palette: `⌘/Ctrl + K` opens it, `F` begins a focus session, and `Esc` closes overlays.
- Stays usable from desktop down to narrow mobile widths, with a drawer navigation pattern and accessible labels, focus styles, skip link, and live status feedback.

## Stack

- React 19 + Vite
- CSS authored from scratch (no component library)
- Native Node test runner for release-readiness logic
- Local demo data only; no network service needed at runtime

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

Other commands:

```bash
npm run test    # unit tests for release logic
npm run build   # production build to dist/
npm run preview # serve the production build locally
```

## Architecture

```text
src/
  App.jsx                    # Workspace UI, interaction state, demo data
  main.jsx                   # React mount
  styles.css                 # Responsive visual system and component styles
  lib/releaseMetrics.js      # Pure readiness, tone, and relative-time helpers
tests/
  releaseMetrics.test.js     # Node unit tests for the release model
```

The application has no backend because the portfolio experience is purposefully local-first. The release readiness model is isolated in `src/lib/releaseMetrics.js`, making it easy to replace the static inputs with GitHub, Linear, or CI data later. Optional future integration variables belong in `.env` (see `.env.example`); no credentials are required or included.

## Representation / screenshot guidance

For a representative portfolio capture:

1. Use a desktop viewport around 1440 × 980 to show the full command center, readiness ring, briefing, signals, merge queue, and momentum strip.
2. Capture the command palette after pressing `⌘/Ctrl + K` to demonstrate keyboard-first interaction.
3. Capture a 390px-wide viewport to show the responsive top bar and stacked workspace cards.
4. Keep the default “Orbit 2.6” scenario intact; the demo content is intentionally composed to tell a coherent release story immediately.

## Deployment notes

The production output is static in `dist/` after `npm run build`. It can be deployed to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.) with:

- Build command: `npm run build`
- Publish directory: `dist`

No server environment variables are necessary for the current local demo mode. If an integration is added, set its public client configuration through the host’s environment-variable settings, and never commit production tokens.

## Validation

The release metric tests validate weighted scoring, input guards, status tones, and relative-time labels. The production build verifies the complete React bundle can be generated successfully.
