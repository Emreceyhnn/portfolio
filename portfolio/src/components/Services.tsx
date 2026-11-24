import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Server, Layout, ShieldAlert } from "lucide-react";
import { profile } from "../data/profile";
import {
  offers,
  processSteps,
  quoteMailto,
  servicesCopy,
  type Offer,
} from "../data/services";

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

const offerIcons: Record<Offer["id"], React.ReactNode> = {
  deploy: <Server size={22} />,
  mvp: <Layout size={22} />,
  audit: <ShieldAlert size={22} />,
};

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
          {servicesCopy.eyebrow}
        </span>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            margin: 0,
            fontWeight: 800,
          }}
        >
          {servicesCopy.title}
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
          {servicesCopy.lead}
        </p>
        <p
          style={{
            margin: 0,
            color: "#34d399",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {servicesCopy.launchNote}
        </p>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
            lineHeight: 1.6,
          }}
        >
          {servicesCopy.priceNote}
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
                {offerIcons[offer.id]}
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
                href={quoteMailto(offer.name, profile.email)}
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
        {processSteps.map((step) => (
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
        {servicesCopy.trFooterBefore}
        <a
          href={`mailto:${profile.email}`}
          style={{ color: "#818cf8", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          {servicesCopy.trFooterLink}
        </a>
        {servicesCopy.trFooterAfter}
      </p>

      <p style={{ marginTop: "16px", fontSize: "0.9rem" }}>
        <a
          href="/services"
          style={{ color: "#818cf8", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          {servicesCopy.detailsLinkLabel}
        </a>
      </p>
    </section>
  );
};
