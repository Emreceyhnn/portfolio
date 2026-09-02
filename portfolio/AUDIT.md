# FE-10 — Accessibility and Performance Audit

Site: https://emreceyhan.xyz/
Tool: PageSpeed Insights (Lighthouse, mobile preset — emulated Moto G Power,
throttled slow 4G), run via the live production deploy on 2026-09-02.

## Before

| Category | Score |
| --- | --- |
| Performance | 50 |
| Accessibility | 77 |
| Best Practices | 100 |
| SEO | 91 |

Key metrics: FCP 3.0s, LCP 3.3s, **TBT 38,360 ms**, Speed Index 7.1s, CLS 0.

## What was wrong

### Performance — TBT of 38 seconds

The decorative 3D background (`Background3D.tsx`, React Three Fiber) always
rendered at full desktop fidelity regardless of device: 8,000-point star
field, a 128×128-segment distorted sphere, five wireframe icosahedrons, and
a full post-processing chain (Bloom + Noise + Vignette). On a throttled
mobile CPU this alone accounted for nearly all 38s of blocking time. It was
also bundled into the main JS chunk (1.39 MB), so the browser had to parse
and execute the entire Three.js/postprocessing dependency graph before the
page could become interactive at all — for a background that isn't even
interactive content.

### Accessibility — 77

1. **Contrast failures**, systemic: text colors set as `rgba(255,255,255,
   0.2–0.4)` on the `#020202` background computed to contrast ratios of
   1.7–3.7:1 — well under the 4.5:1 WCAG AA minimum for normal text. This
   pattern repeated across ~10 elements: location/contact rows, experience
   dates, skill category labels, education period dates, language labels,
   the "Scroll to explore" hint, the loading state, and the footer credit
   line. The primary CTA ("Download Resume") also failed: white text on
   `#6366f1` computed to 4.47:1, just under the 4.5:1 minimum.
2. **Missing accessible names**: the footer's icon-only GitHub/LinkedIn
   links had no text content and no `aria-label`, so screen reader users
   would hear "link" with no indication of the destination.
3. **Missing form label**: the contact form's honeypot checkbox (a
   spam-prevention field real users never see) had no label and no
   `aria-hidden`, so it was exposed to assistive technology as an
   unlabeled control.
4. **Non-sequential heading order**: two sections jumped from `<h2>`
   straight to `<h4>` (skipping `<h3>`) — "Technical Competencies" →
   skill category names, and "Academic Background" → degree names. This
   breaks the document outline that screen reader users rely on to
   navigate by heading level.

## Fixes applied

| Issue | Fix |
| --- | --- |
| TBT / heavy 3D scene | Code-split `Background3D` with `React.lazy` + `Suspense` so its ~1 MB dependency chain no longer blocks the main bundle's parse/execute. Added a `use3DQuality()` hook that reads `(pointer: coarse)`, `(max-width: 768px)`, and `(prefers-reduced-motion: reduce)` and picks a cheaper tier: reduced star count (8,000 → 1,500), lower sphere geometry (128×128 → 32×32 segments), no `FloatingShapes`, no post-processing, and `dpr` capped to 1 instead of `[1,2]`. `prefers-reduced-motion` gets a static gradient instead of any WebGL canvas at all. |
| Low-contrast text (~10 elements) | Bumped `rgba(255,255,255,0.2–0.4)` to `rgba(255,255,255,0.6)` (7.4:1, comfortably over the 4.5:1 minimum) everywhere it was used as a flat text color. Left the one `rgba(255,255,255,0.2)` that's a *gradient stop* inside the hero `<h1>`'s text-fill effect untouched — that's a decorative large-display fade, not body text. |
| CTA button contrast | Changed the "Download Resume" button background from `#6366f1` (4.47:1 with white text) to `#4f46e5` (6.29:1) — already part of the site's own brand gradient, so no new color introduced. |
| Unlabeled icon links | Added `aria-label="Emre Ceyhan on GitHub"` / `"...on LinkedIn"` to the footer's icon-only links. |
| Unlabeled honeypot field | Added `aria-hidden="true"` to the honeypot checkbox so assistive technology skips it entirely, instead of exposing an unlabeled control. |
| Heading order | Changed the two offending `<h4>`s (skill category, degree name) to `<h3>`, restoring a sequential h1 → h2 → h3 outline throughout the page. |

## Manual verification

- **Keyboard-only pass**: Tab through the primary flow (hero → download
  resume → nav links → project cards → contact form → footer social
  links) — every interactive element reaches visible focus and activates
  with Enter/Space; no keyboard trap.
- **Contrast**: re-verified computationally (relative-luminance / WCAG
  contrast-ratio formula) against the site's actual background color for
  every changed value before shipping, not just visually.

## After (re-run pending production deploy of these fixes)

This audit documents the before-state and the fixes as committed. A
follow-up Lighthouse run against the live site after deploy will confirm
the after scores — see the project's git history for the commit that
applies these changes.
