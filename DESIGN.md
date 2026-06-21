# DESIGN.md — Editorial PDP (`/impeccable`)

Source of truth: design file [TAPESTRY - KS - Remodel](https://app.paper.design/file/01KSQPB0ZB3MAWKYB6EG7TD1V0/4-0),
**Page 4**, artboard `Editorial_PDP_Phone_v1` (node `33D-0`), 430px wide. Motion
and component patterns are ported from the live build at
[pdpnext.vercel.app](https://pdpnext.vercel.app)
([github.com/thisisjohnnym/pdpnext](https://github.com/thisisjohnnym/pdpnext)).

Values below are sampled directly from the design file. Hex is what the design
ships; OKLCH is the working token space (tinted neutrals, never pure #000/#fff at
extremes).

## Scope

This document describes the `/impeccable` editorial route only. The default `/`
route is the immersive social-ecomm PDP and is governed by `docs/design-system/`
(grid, typography, icons). The editorial route is intentionally a separate slice:
its own tokens (`editorial.css`), its own data (`src/data/editorial/`), and its
own component stack (`src/components/editorial/`). It does not modify `/`.

## Color

Strategy: **restrained**. A near-monochrome canvas of white and warm gray, black
ink for type, brass tones live only inside the product photography.

| Token | Hex (design) | OKLCH (token) | Use |
|---|---|---|---|
| `--color-surface` | `#FFFFFF` | `oklch(0.995 0.001 95)` | Base page, hero, shop-the-look card |
| `--color-surface-gray` | `#D8D8D8` | `oklch(0.882 0.0015 95)` | Product intro, more photos, more like this |
| `--color-surface-violet` | `#D9D7DA` | `oklch(0.879 0.004 300)` | Shop the look section |
| `--color-ink` | `#000000` | `oklch(0.17 0 0)` | Display type, primary text |
| `--color-ink-soft` | `#202020` | `oklch(0.27 0 0)` | Product list names and prices |
| `--color-ink-invert` | `#FFFFFF` | `oklch(0.995 0.001 95)` | Text over hero video |
| `--scrim` | `rgba(0,0,0,0.10)` | — | 10% overlay on hero + 360 media |

Display headings use pure `#000000` for magazine-cover punch.

## Typography

Family: **Helvetica Neue LT Pro** (licensed, self-hosted woff2, already loaded by
the root layout as `--font-coach` and `--font-coach-extended`). The editorial
route maps these to three roles:

| Role | Token | Maps to | Notes |
|---|---|---|---|
| Display | `--font-display` | `--font-coach-extended`, weight 300 | Light Extended, editorial headings |
| Label | `--font-label` | `--font-coach-extended`, weight 400 | Extended, micro labels / captions |
| Body | `--font-body` | `--font-coach`, weight 300/400 | Light / Roman, product list rows |

Type scale (from design computed styles, node `33D-0`):

| Role | Size | Tracking | Line height |
|---|---|---|---|
| Hero / `Tabby` / `— 26` | 90px | -6.3px | 100% |
| Section title (Shop / More) | 60px | -3px | 100% |
| Micro label / caption | 10px | +0.2px | 125% |
| Product row name + price | 12px | +0.2px | 100% |

Display type is set tight (negative tracking, 100% leading) so multi-line titles
stack like a cover. The spaced en dash ("look —", "— photos", "— 26") is a
graphic device, kept on its own baseline and often right-aligned.

## Layout and spacing

- Page column max-width `480px` (`--page-max`), centered on a warm-gray field.
- Outer gutter ~8px; content frames hang inside the column.
- Section top padding is large and varied for rhythm: 60px (intro, shop),
  110px (more photos, more like this). Bottom padding 10–60px.
- Asymmetry is intentional: titles hang left, the en-dash word drops and
  right-aligns.
- Cards are used only where they are the true affordance (product list rows). No
  nested cards, no wrapping everything in a container.

## Motion

Engine: GSAP + ScrollTrigger, scoped with `@gsap/react` `useGSAP`
(`src/lib/editorial-gsap.ts`). All scroll scenes are wrapped in
`gsap.matchMedia` with a `(prefers-reduced-motion: reduce)` branch that disables
transforms and forces full opacity.

Rules:

- No instant animation. Every section/element enters with an in-view fade:
  opacity 0 → 1 plus a small Y translate (16–28px), eased `power3.out`, ~0.8s.
- Ease out only, exponential curves (`power3`/`power4`/`expo.out`). No bounce,
  no elastic, no back.
- Never animate layout properties. Transform and opacity only.
- Signature scenes:
  - **Hero pin**: hero video is pinned so it stays fixed while the next section
    scrolls up beneath it (magazine cover reveal).
  - **Scrub parallax**: the `Tabby` / `— 26` title scrubs slower than scroll; the
    gallery image below moves at a different speed for depth.
  - **More photos**: two columns, column 2 parallaxes ~10% slower than column 1.
  - **More like this**: section pinned at 100vh, vertical scroll hijacked into
    horizontal card movement, with a progress bar.

## Components (`src/components/editorial/`)

- `editorial-top-bar` — COACH wordmark (vector) + menu glyph.
- `sections/editorial-hero` — pinned video, right-rail social actions, scroll indicator.
- `sections/editorial-product-intro` — TikTok callout, parallax display title, depth gallery image.
- `sections/editorial-three-sixty` — looping 360 spin video, visual CTA.
- `sections/editorial-shop-the-look` — model shot + real product list rows + close CTA.
- `sections/editorial-more-photos` — offset two-column photo grid with differential parallax.
- `sections/editorial-more-like-this` — horizontal scroll-hijack carousel + progress bar.
- `editorial-product-actions` — floating sticky CTA group + colorway / add-to-bag sheets.
- `editorial-overlay-placeholder` — opened by hero social icons (content TBD).
