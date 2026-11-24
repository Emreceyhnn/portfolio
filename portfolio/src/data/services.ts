/**
 * "Work With Me" copy and pricing, shared by the interactive Services
 * section and the build-time prerender. Copy rules (kept from the original
 * component): no invented metrics, no "guaranteed" outcomes, every claim
 * points at a live demo that actually resolves.
 */

export interface Offer {
  id: "deploy" | "mvp" | "audit";
  name: string;
  promise: string;
  bullets: string[];
  price: string;
  priceNote: string;
  timeline: string;
  proofLabel: string;
  proofUrl: string;
}

export const servicesCopy = {
  eyebrow: "Open for freelance & contract work",
  title: "Work With Me",
  lead: "Three fixed-scope packages, priced up front. Every one of them is backed by a live system you can click through below — the demos are the portfolio, the packages are how you get the same thing built for you.",
  launchNote: "Launch pricing for the first three clients — it goes up after that.",
  priceNote:
    "Prices are in USD and exclude VAT. Turkish clients are quoted in lira at today's rate (1$ = ₺50.28) and that lira figure holds for 30 days — so a client in Türkiye sees roughly ₺6.300 / ₺75.400 / ₺40.200.",
  detailsLinkLabel: "Full scope and pricing details",
  trFooterBefore: "Fiyatlar KDV hariçtir. Ödeme yarısı peşin, yarısı teslimde — ",
  trFooterLink: "yaz, konuşalım",
  trFooterAfter: ".",
} as const;

export const offers: Offer[] = [
  {
    id: "deploy",
    name: "Deploy & Host",
    promise:
      "Get an open-source tool off your laptop and onto a server you control.",
    bullets: [
      "Docker + Nginx + Let's Encrypt SSL, non-root containers",
      "n8n, Plane, Cal.com, Documenso, Immich — or your own app",
      "Nightly backups you can actually restore from",
      "Firewall + fail2ban hardening, uptime checks",
      "Optional monthly care plan: patching, monitoring, restore drills",
    ],
    price: "from $125",
    priceNote: "≈ ₺6.300 · first month of care included, then $45/mo",
    timeline: "2–3 days",
    proofLabel: "See DeployBox",
    proofUrl: "https://deploybox.emreceyhan.xyz",
  },
  {
    id: "mvp",
    name: "Multi-tenant SaaS MVP",
    promise:
      "A working product with real auth, real data isolation and a real deploy — not a prototype.",
    bullets: [
      "Next.js + PostgreSQL + Prisma, typed end to end",
      "Auth, roles and company-scoped data isolation from day one",
      "Audit logging, rate limiting, security headers",
      "EN/TR i18n, CI/CD and a production deploy included",
      "Weekly demo, fixed scope, fixed price",
    ],
    price: "from $1,500",
    priceNote: "≈ ₺75.400 · 50% upfront",
    timeline: "3–4 weeks",
    proofLabel: "See LogiTrack",
    proofUrl: "https://logitrackenterprise.emreceyhan.xyz/en",
  },
  {
    id: "audit",
    name: "Audit & Log Dashboard",
    promise:
      "Know what happened, when, and who did it — without buying a SIEM license.",
    bullets: [
      "Event ingestion with a sliding-window rule engine",
      "Brute force, impossible travel, exfiltration, API abuse rules",
      "Every alert mapped to a MITRE ATT&CK technique",
      "Real-time alerting over SSE, no polling",
      "Incident triage workflow with full history",
    ],
    price: "from $800",
    priceNote: "≈ ₺40.200 · includes deploy + docs",
    timeline: "1–2 weeks",
    proofLabel: "See Watchlight",
    proofUrl: "https://watchlight.emreceyhan.xyz",
  },
];

export const processSteps = [
  {
    n: "01",
    title: "Call",
    body: "20 minutes. You describe the problem, I tell you what it actually takes — including when the answer is \"don't build this\".",
  },
  {
    n: "02",
    title: "Fixed quote",
    body: "Written scope, written price, written date. No hourly surprises. 50% to start.",
  },
  {
    n: "03",
    title: "Build",
    body: "Weekly demo on a live URL you can open yourself. You see progress, not promises.",
  },
  {
    n: "04",
    title: "Handover",
    body: "Repo, deploy, docs and a 14-day bug warranty. The code is yours, not rented.",
  },
] as const;

export const quoteMailto = (offerName: string, email: string) =>
  `mailto:${email}?subject=${encodeURIComponent(
    `Quote request — ${offerName}`,
  )}&body=${encodeURIComponent(
    `Hi Emre,\n\nI need: ${offerName}\nWhat it's for: \nDeadline: \n\n`,
  )}`;
