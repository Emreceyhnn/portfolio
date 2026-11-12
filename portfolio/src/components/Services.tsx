import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Server, Layout, ShieldAlert } from "lucide-react";

/**
 * "Work With Me" — the commercial section of the site.
 *
 * The rest of the page answers "what has he built"; this section answers
 * "what can I buy, how much is it, and how do I start". Buyers were
 * previously asked to infer pricing from project screenshots, which is
 * where most of them left.
 *
 * Copy rules kept deliberately strict so nothing here can be turned
 * against him in a call: no invented metrics, no "guaranteed" outcomes,
 * every claim points at a live demo that actually resolves.
 */

interface Offer {
  id: string;
  icon: React.ReactNode;
  name: string;
  promise: string;
  bullets: string[];
  price: string;
  priceNote: string;
  timeline: string;
  proofLabel: string;
  proofUrl: string;
}

const offers: Offer[] = [
  {
    id: "deploy",
    icon: <Server size={22} />,
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
    price: "from ₺10.000",
    priceNote: "≈ $200 · + ₺2.500/mo care plan",
    timeline: "2–3 days",
    proofLabel: "See DeployBox",
    proofUrl: "https://deploybox.emreceyhan.xyz",
  },
  {
    id: "mvp",
    icon: <Layout size={22} />,
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
    price: "from ₺75.000",
    priceNote: "≈ $1,490 · 50% upfront",
    timeline: "3–4 weeks",
    proofLabel: "See LogiTrack",
    proofUrl: "https://logitrackenterprise.emreceyhan.xyz/en",
  },
  {
    id: "audit",
    icon: <ShieldAlert size={22} />,
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
    price: "from ₺40.000",
    priceNote: "≈ $795 · includes deploy + docs",
    timeline: "1–2 weeks",
    proofLabel: "See Watchlight",
    proofUrl: "https://watchlight.emreceyhan.xyz",
  },
];

const steps = [
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
];

export const Services: React.FC = () => {
  return (
    <section
      id="services"
      style={{
        maxWidth: "1400px",
        margin: "clamp(64px, 12vw, 140px) auto 0",
        padding: "0 24px",
        scrollMarginTop: "40px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <span
          style={{
            color: "#818cf8",
            fontSize: "0.75rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Open for freelance &amp; contract work
        </span>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            margin: 0,
            fontWeight: 800,
          }}
        >
          Work With Me
        </h2>
        <div style={{ width: "60px", height: "4px", background: "#6366f1" }} />
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "1rem",
            maxWidth: "680px",
            lineHeight: 1.7,
            margin: "8px 0 0",
          }}
        >
          Three fixed-scope packages, priced up front. Every one of them is
          backed by a live system you can click through below — the demos are
          the portfolio, the packages are how you get the same thing built for
          you.
        </p>
        <p
          style={{
            margin: 0,
            color: "#34d399",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          Launch pricing for the first three clients — it goes up after that.
        </p>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
            lineHeight: 1.6,
          }}
        >
          Prices are in Turkish lira and exclude VAT. USD/EUR invoicing
          available for international clients — the dollar figures use today's
          rate (₺50.28), so the lira price is the one that holds.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "24px",
          marginTop: "48px",
          alignItems: "stretch",
        }}
      >
        {offers.map((offer, idx) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: Math.min(idx, 3) * 0.06, duration: 0.4 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "32px",
              background:
                idx === 1
                  ? "rgba(99, 102, 241, 0.08)"
                  : "rgba(255,255,255,0.03)",
              border:
                idx === 1
                  ? "1px solid rgba(99, 102, 241, 0.35)"
                  : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {offer.icon}
              </span>
              <h3 style={{ fontSize: "1.25rem", margin: 0, color: "#fff" }}>
                {offer.name}
              </h3>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              {offer.promise}
            </p>

            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flexGrow: 1,
              }}
            >
              {offer.bullets.map((b) => (
                <li
                  key={b}
                  style={{
                    display: "flex",
                    gap: "10px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  <Check
                    size={16}
                    color="#34d399"
                    style={{ flexShrink: 0, marginTop: "3px" }}
                    aria-hidden="true"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}
                >
                  {offer.price}
                </span>
                <span
                  style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}
                >
                  {offer.timeline}
                </span>
              </div>
              <span
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}
              >
                {offer.priceNote}
              </span>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a
                href={`mailto:emreceyhnn@gmail.com?subject=${encodeURIComponent(
                  `Quote request — ${offer.name}`,
                )}&body=${encodeURIComponent(
                  `Hi Emre,\n\nI need: ${offer.name}\nWhat it's for: \nDeadline: \n\n`,
                )}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "0 20px",
                  borderRadius: "100px",
                  background: "#6366f1",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Request quote
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href={offer.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: "44px",
                  color: "#818cf8",
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                {offer.proofLabel}
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: "24px",
        }}
      >
        {steps.map((step) => (
          <div key={step.n}>
            <span
              style={{
                color: "#6366f1",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              {step.n}
            </span>
            <h4
              style={{
                margin: "8px 0 6px",
                fontSize: "1.05rem",
                color: "#fff",
              }}
            >
              {step.title}
            </h4>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              {step.body}
            </p>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: "40px",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.85rem",
        }}
      >
        Fiyatlar KDV hariçtir. Ödeme yarısı peşin, yarısı teslimde —{" "}
        <a
          href="mailto:emreceyhnn@gmail.com"
          style={{ color: "#818cf8", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          yaz, konuşalım
        </a>
        .
      </p>
    </section>
  );
};
