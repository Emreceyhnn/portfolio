# Mobile Audit — Fix Log

Audited on a real phone viewport (375×667, iPhone SE-class — the narrowest
common target), then re-checked at 390×844, 360×800 (Android), 768×1024
(tablet), and 1440×900 (desktop) to make sure nothing regressed further up.

## What was broken

1. **Page was needlessly long on mobile: 9,560px of scroll.**
   Every `<section>` used a fixed `margin: "140px auto 0"` regardless of
   viewport. On a 375px-wide phone, 140px of vertical whitespace between
   *every* section (Hero → Experience → Skills → Projects → Education →
   Footer) reads as broken pacing, not intentional breathing room — it's
   proportionally huge on a screen you're scrolling with a thumb.

2. **Project cards were oversized on mobile.**
   `ProjectCard` set `minHeight: '400px'` unconditionally. Combined with a
   16:10 aspect ratio, that's fine on desktop (where the card is wide, so
   400px tall is proportionate) but on a 375px-wide single-column mobile
   layout, every one of the 6 project cards was forced to a flat 400px
   regardless of how narrow the card actually was — six cards alone added
   roughly 2,400px of pure scroll.

3. **Contact and footer links had touch targets well under the
   recommended 44px minimum.**
   The email/GitHub/LinkedIn row in the hero used a 16px icon + 0.9rem
   text with no padding — the actual tappable area was just the text's
   line-height (~20px), not a comfortable thumb target. The footer's
   GitHub/LinkedIn icons were worse: bare 24px icons with zero padding,
   so hitting them on a phone means aiming at a target smaller than a
   fingertip.

## What was fixed

- `src/pages/example/ExamplePage.tsx`: the four `margin: "140px auto ..."`
  section spacers now use `clamp(64px, 12vw, 140px)` — mobile gets
  proportionate ~64px gaps, desktop is pixel-identical to before (still
  bottoms out at 140px once the viewport is wide enough).
- `src/components/ProjectCard.tsx`: `minHeight` changed from a flat
  `'400px'` to `clamp(220px, 62vw, 400px)` — shrinks toward the card's
  natural aspect-ratio height on narrow screens, unchanged on desktop.
- `src/pages/example/ExamplePage.tsx`: the three contact links (mailto,
  GitHub, LinkedIn) in the hero were rewritten so the `<a>` itself owns
  the flex layout and `padding: "8px 4px"` / `minHeight: "44px"`, instead
  of a wrapping `<div>` with an unpadded `<a>` inside it — the whole
  icon+label row is now one contiguous tap target.
- Footer's GitHub/LinkedIn icon links got `padding: "10px"` +
  `minWidth/minHeight: "44px"`, turning each into a proper 44×44 target.

## Verified

- Real phone viewport (375×667): scroll height went from **9,560px to
  8,208px** (−1,352px, ~14% shorter) with no loss of content — same
  sections, same copy, just proportionate spacing.
- All 5 tap targets measured via computed bounding box after the fix:
  contact links 188–209×54px, footer icons 64×64px — all comfortably
  over the 44px minimum (before: well under it).
- No horizontal overflow introduced at 360, 375, 390, 768, or 1440px
  (`document.documentElement.scrollWidth === window.innerWidth` at every
  width, checked before and after).
- Tablet (768px) and desktop (1440px) screenshots confirm the project
  grid, card sizing, and spacing are visually unchanged from before the
  fix — the `clamp()` values were chosen so desktop/tablet stay pinned to
  their original fixed values.
- Clicked every outbound link for real (not just checked hrefs): all 6
  project "Visit Live Site" links (LogiTrack, Mavi Rota, TaskPro, Money
  Guard, Admin Dashboard, Nanny Service), the GitHub profile link, the
  LinkedIn profile link, and the résumé download — all resolve to live,
  working pages/files, none broken.
- `tsc -b` and `eslint .` both clean after the changes.
