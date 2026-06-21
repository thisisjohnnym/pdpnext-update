# Coach Typography

All UI copy uses **Helvetica Neue LT Pro** — no Inter, Arial, or system sans fallbacks in components.

## Weights in use

| Weight | File | Source asset | CSS | Use |
|--------|------|--------------|-----|-----|
| Light | `helvetica-neue-lt-pro-light.woff2` | `HelveticaNeueLTPro-Lt.woff2` | `300` | Optional light UI |
| Roman | `helvetica-neue-lt-pro-roman.woff2` | `HelveticaNeueLTPro-Roman.woff2` | `400` | Body, labels, nav |
| Medium | `helvetica-neue-lt-pro-bold.woff2` | `HelveticaNeueLTPro-Md.woff2` | `500` | Emphasis (no separate Bold in asset set) |
| Light Extended | `helvetica-neue-lt-pro-light-extended.woff2` | `HelveticaNeueLTPro-LtEx.woff2` | `300` | Light display |
| Extended | `helvetica-neue-lt-pro-extended.woff2` | `HelveticaNeueLTPro-Ex.woff2` | `400` | All PDP UI (`font-extended`) |
| Extended (700 slot) | `helvetica-neue-lt-pro-extended-bold.woff2` | `HelveticaNeueLTPro-Ex.woff2` | `700` | Extended bold requests (same Ex file) |

Source: `Coach/_assets/fonts/` (Coach 2026 Font Set)

## Code

Loaded via `next/font/local` in `src/app/layout.tsx` as `--font-coach`.

Tailwind: `font-sans` maps to Helvetica Neue LT Pro globally.

Extended variants: `font-extended` utility class.

## Rules

1. Do not import Google Fonts for UI text.
2. Use semantic weights (`font-normal`, `font-bold`) — not arbitrary font-family.
3. Garamond / Helvetica Now are separate Coachtopia fonts — not used on standard Coach Outlet PDP unless specified.
