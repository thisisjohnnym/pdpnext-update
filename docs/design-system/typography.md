# Coach Typography

All UI copy uses **Helvetica Neue LT Pro** — no Inter, Arial, or system sans fallbacks in components.

## Weights in use

| Weight | File | CSS | Use |
|--------|------|-----|-----|
| Roman | `helvetica-neue-lt-pro-roman.woff2` | `400` | Body, labels, nav |
| Bold | `helvetica-neue-lt-pro-bold.woff2` | `700` | Emphasis, buttons |
| Extended | `helvetica-neue-lt-pro-extended.woff2` | `400` | Display / wordmarks |
| Extended Bold | `helvetica-neue-lt-pro-extended-bold.woff2` | `700` | Display headlines |

Source: Coach 2026 Font Set → `Helvetica LT Pro (Coach & CO)/WOFF/`

## Code

Loaded via `next/font/local` in `src/app/layout.tsx` as `--font-coach`.

Tailwind: `font-sans` maps to Helvetica Neue LT Pro globally.

Extended variants: `font-extended` utility class.

## Rules

1. Do not import Google Fonts for UI text.
2. Use semantic weights (`font-normal`, `font-bold`) — not arbitrary font-family.
3. Garamond / Helvetica Now are separate Coachtopia fonts — not used on standard Coach Outlet PDP unless specified.
