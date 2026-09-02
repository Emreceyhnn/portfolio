# Break Your Own Site — findings (2026-09-02)

Adversarial pass on https://emreceyhan.xyz/: empty/garbage form submissions,
double-submit, an untested-tab check of every external project link, and a
basic SEO/meta audit. Honest list below — what actually broke vs. what held
up vs. what's a known limitation outside this repo's scope.

## What I tried

- Submitted the contact form completely empty.
- Filled it with garbage: `<script>alert(1)</script>` as the name,
  `not-an-email` as the email, and a message containing SQL-injection-style
  text, an emoji, quotes, and raw HTML tags.
- Fixed the email, left the garbage name/message, and triple-clicked
  "Send message" to try to force a double submission.
- Opened all 6 "VISIT LIVE SITE" project links in a fresh tab.
- Checked `index.html` for title/description/OG/Twitter tags, a canonical
  link, and the presence of `robots.txt` / `sitemap.xml`.

## Fixed now (this repo)

| Finding | Fix |
| --- | --- |
| Submit button is silently `disabled` when the form is incomplete — clicking it fires no request, no error, no focus change, nothing a user or screen-reader user can act on. | Added a visible hint (`Fill in your name, a valid email, and a message to send.`) tied to the button via `aria-describedby`, shown only while the button is disabled. See `src/components/ContactForm.tsx`. |
| `og:image` / `twitter:image` used a relative path (`/og-image.png`) instead of an absolute URL, which some crawlers (notably X/Twitter) fail to resolve. | Changed both to `https://emreceyhan.xyz/og-image.png`. |
| No `rel="canonical"` tag. | Added `<link rel="canonical" href="https://emreceyhan.xyz/" />`. |
| No `robots.txt` or `sitemap.xml`, so crawlers have no explicit indexing signal for a single-page site. | Added both under `public/`. |

## Held up (tried to break it, didn't)

- **Empty submit**: correctly blocked — the button is disabled until name,
  email, and message are all non-empty, so no request ever reaches
  Web3Forms with blank data.
- **Garbage input (script tags, SQL-injection text, emoji, raw HTML)**:
  React escapes all rendered text by default, so `<script>` and `<b>` tags
  typed into the fields are stored and would be emailed as literal text,
  never executed or rendered as HTML. No XSS.
- **Invalid email (`not-an-email`)**: the native `type="email"` +
  `required` attributes block submission via the browser's own validation
  before any request fires.
- **Double/triple-fast-submit**: the button flips to `disabled` +
  "Sending…" synchronously on the first click, so the second and third
  clicks in the same batch were no-ops. Only one submission went through.
- **All 6 external project links** (LogiTrack, Mavi Rota, Task Pro, Money
  Guard, Admin Dashboard, Nanny Services): none are dead — all resolved to
  a live page.
- **Meta/SEO basics**: title, meta description, keywords, author, OG tags,
  Twitter card, theme-color, and favicon were all already present and
  correct before this pass.

## Known limitations (out of scope for this repo)

- **LogiTrack's "VISIT LIVE SITE" link drops visitors straight into an
  already-authenticated admin dashboard** (logged in as "Emre Ceyhan /
  Administrator") instead of a public marketing or demo page. That's a
  separate project's auth/session design, not something to change from
  the portfolio; noting it here as an honest finding rather than fixing
  it blind.
- **Money Guard's landing page renders with all text effectively
  invisible** (content is present in the DOM — confirmed via page text
  extraction — but not visually legible, likely a stuck fade-in or a
  color contrast bug in that project). Separate repo/deployment; flagged,
  not fixed here.
- **Nanny Services' hero text is low-contrast** (dark green on a dark
  green background) — legible but weak, same category of issue already
  fixed across the portfolio itself. Separate repo; flagged, not fixed
  here.

## What I'd do with more time

- Add a small unit/e2e test asserting the submit button's disabled state
  always carries a visible, associated explanation (regression-proof the
  fix above).
- Revisit the three "known limitation" projects individually and apply
  the same contrast/UX discipline used on the portfolio.
