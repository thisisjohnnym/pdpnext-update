# PDP

Clean-plate product detail page built from design file `01KTWRPQ4P2WK162P5FXECNTVH`, page **`new`**.

## Artboard authority

| Artboard | ID | Role |
|----------|-----|------|
| Hero — isolated | `3YV-0` | Hero layout + gallery behavior |
| hero on land w/ page ui | `4RW-0` | Hero + floating CTA + assets peek |
| Page - full scroll | `3YT-0` | Full scroll stack ending at 360 |

Ignore `reference` (`55Y-0`) and other design pages.

## Responsive layout

Design source uses **430px** as the iOS 16 Plus reference frame. In code:

- **Max width:** `var(--pdp-max-width)` (430px) on `.pdp-page` and `.pdp-hero-root`
- **Scale:** `var(--pdp-scale)` = `min(100vw, max-width) / max-width` — spacing and heights use `calc(N * var(--pdp-scale) * 1px)` instead of hard-coded px in components
- **Ratios:** `aspect-ratio` (e.g. hero `430/829`) for proportional height
- **Percent widths:** hero product card 90%, description 70%

Viewport narrower than 430px scales down; wider viewports center content at 430px.

## Route

`/` → `PdpView` in `src/pdp/`

## Section order

1. Hero (`#pdp-hero`) — 90% gallery, nav inside gallery, product overlap card
2. Assets parallax (`#pdp-assets`)
3. Ways to wear
4. Capacity
5. UGC
6. Hotspots
7. 360 (`#pdp-360`)

No legacy commerce tail (reviews, compare, FAQs, footer).

## Fixed chrome

- **CTA bar:** always floating with `var(--pdp-cta-inset)` and `var(--pdp-cta-height)`
- **Blur:** progressive stack behind CTA; lifts with iOS browser chrome via `--pdp-fixed-bottom-offset`
- **Overlays:** nav menu, color sheet, add-to-bag sheet

## Hero gallery

- Vertical scroll-snap; slide 0 = video
- 14 slides in production
- Eased swipe; snap on release
- Pills = slide index only
- Nav fades menu + bag on scroll down; Coach logo stays; restores on scroll up

## Motion appendix

- Easing: `cubic-bezier(0.77, 0, 0.18, 1)` (`--pdp-ease`)
- Duration: 600ms (`--pdp-duration`)
- Reduced motion: transitions collapsed to ~0ms
- Global smooth scroll: GSAP `ScrollSmoother` + `normalizeScroll` for Safari/iOS stability
- Section effects: `useCoalescedScroll` + CSS transitions
- No dock→flush CTA morph; no document scroll compensation on viewport shift

## E2E

`e2e/pdp.spec.ts` — Playwright viewport 430×932, screenshot gate at 430px.
