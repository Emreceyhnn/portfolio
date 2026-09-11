# Emre Ceyhan — Portfolio (emreceyhan.xyz)

React + TypeScript + Vite portfolio site, deployed on Vercel.

## FE-AA3 — Signature Hero: a fragment shader (2026-09-11)

The site's hero background is now a hand-written GLSL fragment shader
(`src/components/ShaderHero.tsx`), rendered fullscreen via raw WebGL --
deliberately *not* three.js/react-three-fiber, so the actual shader math
is visible with nothing in between. It replaces `Background3D.tsx` (kept
in the repo/history as the FE-AA2 deliverable) as what actually renders
behind the page.

**What it draws.** A slow-drifting aurora-style flow field: three octaves
of value noise (`hash` -> `noise` -> `fbm`), domain-warped by a second,
offset `fbm` sample -- that warp step is what turns flat noise into
something that reads as *flowing* rather than static clouds -- colored
along a custom indigo/violet ramp (`#020202` -> `#4338ca` -> `#818cf8`)
that matches the rest of the site's palette, with a vignette to keep
attention centered and a film-grain dither pass to kill banding on the
dark gradient.

**Uniforms.** `u_time` drives the noise's drift axis, `u_resolution`
corrects the aspect ratio and lets frequency scale independent of window
size, and `u_mouse` gently leans the flow field's warp offset toward the
cursor -- a visible lean, not a snap-to-cursor blob.

**Shipping responsibly.**
- `prefers-reduced-motion: reduce` never creates a WebGL context at all --
  same static radial-gradient fallback `Background3D.tsx` already used,
  reused here so both hero treatments degrade identically.
- `devicePixelRatio` capped at 1.5 (shading every physical pixel of a
  3x-DPR phone screen for a decorative background is wasted GPU work,
  visually indistinguishable at this blur level).
- The render loop is driven by `requestAnimationFrame` and explicitly
  stopped on `visibilitychange` -- a backgrounded tab does zero GPU work,
  and resuming picks the elapsed-time uniform back up instead of jumping.
- A failed shader compile/link falls back to the same static gradient
  rather than a blank screen or a thrown error (see `compileShader`'s
  `console.error` + early return, and the `unsupported` status branch).

**How AI built this.** The noise/fbm/domain-warp shader math (`hash`,
`noise`, `fbm`, `warp` in `ShaderHero.tsx`) is a personalized remix of a
common flow-field technique -- Inigo Quilez's `fbm`/domain-warp pattern is
the standard reference for this -- written with an AI coding assistant,
then walked through line-by-line by hand: every function above has a
comment in the author's own words explaining what it does and why it's
there (the smoothstep in `noise()` for zero-slope cell edges, the doubling
frequency/halving amplitude in `fbm()`, the mouse-lean magnitude in
`warp()`'s call site), not left as unexplained boilerplate. The color
ramp, vignette strength, grain amount, and the mouse-lean magnitude were
hand-tuned against the live page, not accepted from a first draft.

## FE-AA2 — Your First 3D Experience on the Web (2026-09-02)

The site's hero background (`src/components/Background3D.tsx`) is the
deliverable for this assignment: a full-viewport React Three Fiber scene
(distorted sphere, floating wireframe icosahedrons, an 8,000-point star
field) that sits behind the whole page.

**What it does beyond orbiting.** The central sphere is cursor-reactive —
its position lerps toward `mouse.x`/`mouse.y` every frame (see `Scene()`),
so it visibly follows the pointer instead of just idly rotating.

**Loading responsibly.**
- Code-split with `React.lazy` + `Suspense`: the Three.js/drei/
  postprocessing dependency chain (~1.04 MB, 319 KB gzipped) never touches
  the main bundle. The main app chunk is 351 KB (112 KB gzipped) and can
  parse/execute independently of the 3D scene, which streams in afterward.
- `prefers-reduced-motion: reduce` gets a plain static gradient `<div>` —
  no WebGL canvas is created at all for users who asked their OS for less
  motion.
- A `use3DQuality()` hook checks `(pointer: coarse)` and
  `(max-width: 768px)` and drops to a cheaper tier on phones/tablets:
  1,500 points instead of 8,000, 32×32 sphere segments instead of 128×128,
  no floating icosahedrons, no post-processing (Bloom/Noise/Vignette), and
  `dpr` capped to 1 instead of `[1, 2]`.

**Impact on load and frame rate (measured via the FE-10 audit, see
`AUDIT.md`).** Before code-splitting and the mobile quality tier, this
scene alone drove Total Blocking Time to ~38 seconds on Lighthouse's
throttled mobile emulation — the site's Performance score was 50. After:
see `AUDIT.md` for the re-measured score once the fix is live.

**What I'd add with more time:** an actual FPS counter surfaced in a dev
overlay (currently frame rate is only inferred from Lighthouse's TBT, not
measured directly at runtime), and a fourth quality tier keyed off
`navigator.deviceMemory`/`hardwareConcurrency` for genuinely low-end
Android devices rather than just screen width/pointer type as a proxy.

## Break Your Own Site — fixes (2026-09-02)

Two real production issues found and fixed:

1. **Broken Open Graph image.** `index.html` referenced `/og-image.png`
   for `og:image` / `twitter:image`, but the file never existed in
   `public/`. Because `vercel.json` had a catch-all SPA rewrite
   (`"/(.*)" → "/index.html"`), the missing request didn't even 404 —
   it silently served the SPA shell as if it were an image, so link
   previews on X/LinkedIn/Slack rendered nothing useful. Fixed by:
   - Generating a real 1200×630 `og-image.png` (matches the site's
     dark/indigo brand) and adding it to `public/`.
   - Narrowing the `vercel.json` rewrite with a negative-lookahead so
     static assets (`favicon.svg`, `icons.svg`, `og-image.png`, the
     resume PDF) are served directly instead of falling through to
     `index.html`.
2. **No analytics.** Added [Plausible](https://plausible.io) — cookieless,
   no personal data collected, no cookie-consent banner required under
   GDPR. Loads via a single `<script defer>` tag in `index.html`.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
