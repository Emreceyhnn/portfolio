import React, { useState, useEffect, useCallback } from "react";
import type {
  ExamplePageState,
  ExamplePageActions,
} from "../../lib/type/example";
import { fetchPortfolioData } from "../../services/dataService";
import { Background3D } from "../../components/Background3D";
import { ProjectGrid } from "../../components/BentoGrid";
import { CursorFollower } from "../../components/CursorFollower";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ContactForm } from "../../components/ContactForm";
import { Github, Mail, MapPin, Linkedin, ArrowRight, Download } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ExamplePage: React.FC = () => {
  // CRITICAL: Single Root State (PageState)
  const [state, setState] = useState<ExamplePageState>({
    projects: [],
    experience: [],
    skills: [],
    education: [],
    languages: [],
    isLoading: true,
    error: null,
    lastFetched: null,
  });

  // CRITICAL: PageActions (Memoized)
  const actions: ExamplePageActions = {
    fetchProjects: useCallback(async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchPortfolioData();

        setState((prev) => ({
          ...prev,
          ...data,
          isLoading: false,
          lastFetched: new Date().toISOString(),
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load projects. Please try again later.",
        }));
      }
    }, []),

    handleProjectClick: useCallback(
      (id: string) => {
        const project = state.projects.find((p) => p.id === id);
        if (project) {
          window.open(project.link, "_blank");
        }
      },
      [state.projects],
    ),

    resetState: useCallback(() => {
      setState({
        projects: [],
        experience: [],
        skills: [],
        education: [],
        languages: [],
        isLoading: true,
        error: null,
        lastFetched: null,
      });
    }, []),
  };

  useEffect(() => {
    actions.fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.fetchProjects]);

  const { scrollY } = useScroll();
  // Fade/scale the hero out over a short, fixed scroll distance (the first
  // ~400px) instead of a fraction of total page scroll. Using total-page
  // scrollYProgress meant the fade window shrank as content was added below,
  // so on a long page the hero was still fully opaque well past the point
  // where the next section heading had scrolled into view -- the two
  // pieces of text sat on screen at the same time and visually collided.
  const heroFadeEnd = 400;
  const heroOpacity = useTransform(scrollY, [0, heroFadeEnd], [1, 0]);
  const heroScale = useTransform(scrollY, [0, heroFadeEnd], [1, 0.9]);
  // Once the hero has fully faded, stop it from intercepting clicks/scroll
  // and from being reachable by keyboard/screen-reader focus or find-in-page.
  const heroPointerEvents = useTransform(scrollY, (v) =>
    v > heroFadeEnd ? "none" : "auto",
  );

  return (
    <main
      className="page-root"
      style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}
    >
      <CursorFollower />
      <ErrorBoundary
        fallback={
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              background: "#020202",
            }}
          />
        }
      >
        <Background3D />
      </ErrorBoundary>

      <motion.section
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 24px",
          textAlign: "center",
          opacity: heroOpacity,
          scale: heroScale,
          pointerEvents: heroPointerEvents,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            padding: "8px 16px",
            background: "rgba(99, 102, 241, 0.1)",
            borderRadius: "100px",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#818cf8",
            fontSize: "0.8rem",
            marginBottom: "24px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Full-Stack Engineer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontSize: "clamp(3.5rem, 12vw, 8rem)",
            fontWeight: 900,
            margin: "0 0 -0.2em 0",
            lineHeight: 1.1,
            paddingBottom: "0.2em",
            background:
              "linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-2px",
          }}
        >
          Emre <br /> Ceyhan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            fontSize: "1.1rem",
            color: "rgba(255, 255, 255, 0.6)",
            maxWidth: "800px",
            marginTop: "32px",
            fontWeight: 300,
            lineHeight: 1.8,
          }}
        >
          Results-driven Full-Stack Engineer with startup production
          experience shipping highly secure, multi-tenant SaaS architectures
          end to end. Specialized in Next.js, React 19, TypeScript, and
          PostgreSQL — focused on measurable outcomes like lower API latency
          and Lighthouse scores of 90+.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
        >
          <a
            href="/Emre_Ceyhan_Full_Stack_Engineer.pdf"
            download="Emre_Ceyhan_CV.pdf"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              background: "#6366f1",
              color: "#fff",
              borderRadius: "100px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.5)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(99, 102, 241, 0.7)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(99, 102, 241, 0.5)";
            }}
          >
            <Download size={20} />
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
              // Matches the padding on the link rows below so this
              // non-interactive row lines up with them visually.
              padding: "8px 4px",
            }}
          >
            <MapPin size={16} /> Bursa, TR (Open to Remote)
          </div>
          {/*
            Contact links: the <a> itself now owns the flex layout and
            padding (rather than a wrapping <div>), so the whole row —
            icon plus label — is one contiguous ~44px-tall tap target
            instead of just the text's line-height. 44px is the minimum
            recommended touch target size; a bare 16px icon + 0.9rem text
            with no padding was well under that on a phone.
          */}
          <a
            href="mailto:emreceyhnn@gmail.com?subject=Contact%20from%20Portfolio"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
              padding: "8px 4px",
              minHeight: "44px",
            }}
          >
            <Mail size={16} /> emreceyhnn@gmail.com
          </a>
          <a
            href="https://github.com/Emreceyhnn"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
              padding: "8px 4px",
              minHeight: "44px",
            }}
          >
            <Github size={16} /> github.com/Emreceyhnn
          </a>
          <a
            href="https://www.linkedin.com/in/emreceyhn/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
              padding: "8px 4px",
              minHeight: "44px",
            }}
          >
            <Linkedin size={16} /> linkedin.com/in/emreceyhn/
          </a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: "absolute",
            bottom: "40px",
            color: "rgba(255,255,255,0.2)",
            // This element sets its own animate (the bobbing y-loop), which
            // otherwise overrides the opacity it would have inherited from
            // the parent hero section fade-out. Without this, "Scroll to
            // explore" stayed fully visible while the rest of the hero had
            // already faded, ending up floating alone right above the next
            // section heading -- read as broken spacing, not a scroll cue.
            opacity: heroOpacity,
          }}
        >
          Scroll to explore{" "}
          <ArrowRight
            style={{
              transform: "rotate(90deg)",
              verticalAlign: "middle",
              marginLeft: "8px",
            }}
            size={16}
          />
        </motion.div>
      </motion.section>

      {/* Experience Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "clamp(64px, 12vw, 140px) auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "40px" }}
        >
          Professional Impact
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {state.experience.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                padding: "40px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.5rem", margin: 0, color: "#fff" }}>
                    {exp.role}
                  </h3>
                  <p
                    style={{
                      color: "#6366f1",
                      fontSize: "1.1rem",
                      margin: "4px 0 0",
                    }}
                  >
                    {exp.company}
                  </p>
                </div>
                <span
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}
                >
                  {exp.period}
                </span>
              </div>
              <ul
                style={{
                  paddingLeft: "20px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.8,
                  marginBottom: "24px",
                }}
              >
                {exp.description.map((desc, i) => (
                  <li key={i} style={{ marginBottom: "12px" }}>
                    {desc}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.7rem",
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "#818cf8",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "clamp(64px, 12vw, 140px) auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "40px" }}
        >
          Technical Competencies
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {state.skills.map((skill, idx) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx, 3) * 0.06, duration: 0.4 }}
              viewport={{ once: true, amount: 0.1 }}
              style={{
                padding: "32px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h4
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginBottom: "20px",
                }}
              >
                {skill.category}
              </h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {skill.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {item} •
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        // amount: 0.1 fires as soon as 10% of the section is on screen (the
        // default "some" threshold sits higher), and the shorter duration
        // means a normal scroll speed does not outrun the fade -- without
        // these the "Selected Works" heading and grid below it could read
        // as mostly-transparent for a beat after scrolling into view.
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: "1400px",
          margin: "clamp(64px, 12vw, 140px) auto 0",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          gap: "60px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              margin: 0,
              fontWeight: 800,
            }}
          >
            Selected Works
          </h2>
          <div
            style={{ width: "60px", height: "4px", background: "#6366f1" }}
          ></div>
        </div>

        {state.isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "100px",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Initializing systems...
          </div>
        ) : state.error ? (
          <div
            style={{ color: "#ef4444", textAlign: "center", padding: "100px" }}
          >
            {state.error}
          </div>
        ) : (
          <ProjectGrid state={state} actions={actions} />
        )}
      </motion.section>

      {/* Education & Info Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "clamp(64px, 12vw, 140px) auto clamp(64px, 12vw, 140px)",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "80px",
        }}
      >
        <div>
          <h2
            style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "40px" }}
          >
            Academic Background
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {state.education.map((edu) => (
              <div key={edu.id}>
                <h4 style={{ fontSize: "1.2rem", margin: 0, color: "#fff" }}>
                  {edu.degree}
                </h4>
                <p style={{ color: "#6366f1", margin: "4px 0 0" }}>
                  {edu.institution}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.8rem",
                    marginTop: "4px",
                  }}
                >
                  {edu.period}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2
            style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "40px" }}
          >
            Localization
          </h2>
          <div style={{ display: "flex", gap: "40px" }}>
            {state.languages.map((lang) => (
              <div key={lang.language}>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {lang.language}
                </p>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  {lang.proficiency}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "60px",
              padding: "32px",
              background: "rgba(99, 102, 241, 0.05)",
              borderRadius: "20px",
              border: "1px dotted rgba(99, 102, 241, 0.3)",
            }}
          >
            <p style={{ color: "#818cf8", margin: 0, fontSize: "0.9rem" }}>
              Currently based in <strong>Bursa, TR</strong>. Available for
              globally remote positions and on-site roles within the region.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section — FE "Make It Do Something": the one real
          dynamic feature. See ContactForm.tsx for how it's wired. */}
      <section
        style={{
          maxWidth: "700px",
          margin: "clamp(64px, 12vw, 140px) auto 0",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              margin: 0,
              fontWeight: 800,
            }}
          >
            Get in Touch
          </h2>
          <div
            style={{ width: "60px", height: "4px", background: "#6366f1" }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Have a role, a project, or just a question? This form actually
            sends — it'll land in my inbox, not a void.
          </p>
        </div>
        <ContactForm />
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "60px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(13,13,13,0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/*
            Bare icon-only links: padding turns each into a ~44px tap
            target (the icon itself is 24px by default), matching the
            minimum recommended touch target size instead of relying on
            just the icon's own bounding box.
          */}
          <a
            href="https://github.com/Emreceyhnn"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              display: "inline-flex",
              padding: "10px",
              minWidth: "44px",
              minHeight: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Github />
          </a>
          <a
            href="https://www.linkedin.com/in/emreceyhn/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              display: "inline-flex",
              padding: "10px",
              minWidth: "44px",
              minHeight: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Linkedin />
          </a>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          © 2026 Emre Ceyhan. Built with professional Three.js and Senior
          Architect patterns.
        </p>
      </footer>
    </main>
  );
};
