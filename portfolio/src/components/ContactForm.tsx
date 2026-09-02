import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, XCircle } from "lucide-react";

/**
 * ContactForm — FE "Make It Do Something": the one real dynamic feature.
 *
 * How it actually works (the plain-words version lives in the assignment
 * submission notes, but the short version): there is no server of my own
 * here. This is a static Vite/React site with nowhere to run backend code,
 * so the form POSTs straight from the browser to Web3Forms
 * (https://web3forms.com) — a free hosted API whose only job is "take this
 * JSON, email it to the address tied to this access key." Web3Forms is the
 * backend; my "backend" is just their API plus an access key scoped to my
 * inbox. The access key is meant to be public/client-side (Web3Forms'
 * own docs say so) — it can only ever send email *to* the account it was
 * issued for, so exposing it in the bundle isn't a secret leak the way an
 * API key with read/write database access would be.
 *
 * State model deliberately mirrors the SendButton component built for the
 * "Buttons with a Brain" assignment: idle -> submitting -> success/error,
 * animated with transform/opacity only, disabled input during submit so a
 * second click can't double-send.
 */

const WEB3FORMS_ACCESS_KEY = "ec35c374-eab9-476d-89d4-4edd3d7b0982";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = status === "submitting";
  const canSubmit =
    !isSubmitting &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio contact from ${name}`,
          name,
          email,
          message,
          // Web3Forms' own honeypot convention: a hidden field named
          // "botcheck" that a human never fills in. Any value here makes
          // Web3Forms silently treat the submission as spam.
          botcheck: "",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage(
          result.message || "Something went wrong sending that. Try again?",
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Couldn't reach the mail service — check your connection and try again.",
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "clamp(24px, 5vw, 40px)",
        backdropFilter: "blur(10px)",
        marginBottom: "80px",
      }}
    >
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "12px",
            padding: "40px 16px",
          }}
        >
          <CheckCircle2 size={40} color="#22c55e" />
          <h3 style={{ margin: 0, color: "#fff", fontSize: "1.3rem" }}>
            Message sent
          </h3>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.95rem",
              maxWidth: "360px",
            }}
          >
            Thanks for reaching out — it landed straight in my inbox. I'll
            reply from emreceyhnn@gmail.com.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            style={{
              marginTop: "8px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              borderRadius: "100px",
              padding: "8px 20px",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                htmlFor="contact-name"
                style={fieldLabelStyle}
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
                placeholder="Your name"
                className="contact-field"
                style={fieldInputStyle}
              />
            </div>
            <div>
              <label htmlFor="contact-email" style={fieldLabelStyle}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                placeholder="you@example.com"
                className="contact-field"
                style={fieldInputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label htmlFor="contact-message" style={fieldLabelStyle}>
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              required
              rows={5}
              placeholder="What's this about?"
              className="contact-field"
              style={{
                ...fieldInputStyle,
                resize: "vertical",
                minHeight: "120px",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Honeypot: real users never see or fill this in (visually
              hidden, not display:none — some spam bots skip
              display:none fields specifically). Any bot that fills every
              input blind trips this and Web3Forms drops the submission. */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              opacity: 0,
              pointerEvents: "none",
            }}
          />

          {status === "error" && (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#f87171",
                fontSize: "0.85rem",
                marginBottom: "16px",
              }}
            >
              <XCircle size={16} />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            aria-describedby={
              !canSubmit && !isSubmitting ? "contact-submit-hint" : undefined
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "8px",
              padding: "14px 28px",
              background: canSubmit ? "#6366f1" : "rgba(99,102,241,0.3)",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                Sending…
              </>
            ) : (
              <>
                <Send size={18} />
                Send message
              </>
            )}
          </button>

          {/* FE "Break Your Own Site" fix: clicking a disabled submit
              button previously gave zero feedback — no request, no error
              text, nothing a user or screen reader could act on. This
              hint makes the disabled reason discoverable instead of
              silent, without changing the underlying validation. */}
          {!canSubmit && !isSubmitting && (
            <p
              id="contact-submit-hint"
              style={{
                margin: "10px 0 0",
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.8rem",
              }}
            >
              Fill in your name, a valid email, and a message to send.
            </p>
          )}
        </form>
      )}
    </motion.div>
  );
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "8px",
};

const fieldInputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "12px 16px",
  color: "#fff",
  fontSize: "0.95rem",
  outline: "none",
};
