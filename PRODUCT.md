---
register: brand
---

# PRODUCT.md — Editorial PDP (Coach Tabby)

## Product purpose

A mobile-first, editorial product detail page (PDP) for a single hero product:
the Coach Tabby Shoulder Bag 26 in black quilted leather. The page reads like a
fashion magazine spread, not a commerce template. Design is the product: the goal
is to make the bag feel desirable through rhythm, scale, motion, and restraint.

This is a campaign surface, so the register is **brand**, not product. Every
section is a composed editorial moment, not a reusable dashboard widget.

## Scope in this repo

This repo ships two PDP experiences side by side:

- `/` — the immersive social-ecomm PDP (`PdpSocialView`): vertical gallery,
  frosted chrome, rich interactive modules. This is the primary build.
- `/impeccable` — the editorial riff: a faithful port of the live editorial PDP
  at [pdpnext.vercel.app](https://pdpnext.vercel.app), styled from design page 4
  (`Editorial_PDP_Phone_v1`). Editorial core only: hero pin, intro parallax,
  360, shop the look, photo grid, more like this.

The voice, tone, and strategic principles below describe the editorial register
that governs `/impeccable`.

## Users

- Fashion-aware shoppers browsing on a phone, often arriving from social (TikTok).
- They scroll fast, judge in seconds, and respond to confidence and craft.
- They expect motion that feels intentional, never gimmicky or laggy.

## Voice and tone

- Confident, quiet, editorial. Few words, large type.
- Lowercase or sentence case for running labels; display headings carry the drama.
- Copy never sells hard. It names, it captions, it gets out of the way.
- No exclamation marks, no marketing filler, no em dashes (use a spaced en dash
  in display type as a graphic device, e.g. "look —").

## Anti-references

- Generic Shopify/SaaS PDP: spec tables, star ratings. (A sticky "Add to cart"
  bar is expected and encouraged here, it is a core part of the product page.)
- Identical card grids with icon + heading + body repeated down the page.
- Hero-metric template (big number, small label, supporting stats).
- Glassmorphism, gradient text, drop-shadow soup.
- Bouncy/elastic spring animation. Motion here is slow, weighted, eased-out.

## Strategic principles

1. Magazine pacing. Generous top padding, big display type, asymmetric layout.
2. Motion with depth. Layers move at different speeds (parallax, pinned hero,
   scrub reveals). Every entrance fades in from 0 to 100 percent opacity with a
   small translate. Nothing pops in instantly.
3. Mobile first. The 430px artboard is the source of truth. Desktop comes later.
4. Restraint in color. Near-monochrome canvas (whites and warm grays), black ink,
   the bag's brass hardware is the only warmth. Color strategy: restrained.
5. Respect the reader. Honor `prefers-reduced-motion`: disable transforms and show
   everything at full opacity.
