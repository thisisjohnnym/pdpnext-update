# pdp-next

PDP-driven PDP for **Tabby 26** — artboards `4RW-0` (on-land) + `3YT-0` (full scroll).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Layout is responsive with **max-width 440px** (design mobile target); narrower viewports scale via `--pdp-scale`.

## Architecture

| Path | Role |
|------|------|
| `src/pdp/` | PDP layout, sections, chrome, overlays, motion |
| `public/` | Hero video, tabby25 stills, spin video |

Route: **`/`** — PDP hero + scroll sections (ends at 360). `/redesign` and `/impeccable` redirect to `/`.

Full spec: [`docs/pdp.md`](docs/pdp.md)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm deploy:check` | Deploy preflight (`lint` + `build`) |
| `pnpm test:e2e` | Playwright at 430×932 |

## Verification

```bash
pnpm test:e2e          # browser smoke + layout checks
pnpm test:e2e:update   # refresh screenshot baseline after intentional visual changes
```

Automated checks cover: route `/`, 14 gallery pills, floating CTA inset, overlay sheets, section order, no legacy commerce tail after 360, and on-land screenshot gate.

## Deployment

Run the deploy preflight locally:

```bash
pnpm deploy:check
```

If this passes, the app is ready for a standard Next.js deployment (for example, Vercel using the default `next build` / `next start` flow).
