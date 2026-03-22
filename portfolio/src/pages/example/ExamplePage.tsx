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
import { Github, Mail, MapPin, Linkedin, ArrowRight } from "lucide-react";
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
    selectedProjectForPreview: null,
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

    setPreviewProject: useCallback(
      (id: string | null) => {
        const project = id
          ? state.projects.find((p) => p.id === id) || null
          : null;
        setState((prev) => ({ ...prev, selectedProjectForPreview: project }));
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
        selectedProjectForPreview: null,
      });
    }, []),
  };

  useEffect(() => {
    actions.fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.fetchProjects]);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

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
          Junior Full-Stack Engineer
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
          I am a Full-Stack Developer driven by curiosity and a strong passion
          for building scalable solutions from the ground up. Expertise in
          React, Next.js, and Node.js, with a focus on clean architecture and
          long-term scalability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
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
            }}
          >
            <MapPin size={16} /> Bursa, TR (Open to Remote)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
            }}
          >
            <a href="mailto:emreceyhnn@gmail.com" target="_blank">
              <Mail size={16} /> emreceyhnn@gmail.com
            </a>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
            }}
          >
            <a href="https://github.com/Emreceyhnn" target="_blank">
              <Github size={16} /> github.com/Emreceyhnn
            </a>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.9rem",
            }}
          >
            <a href="https://www.linkedin.com/in/emreceyhn/" target="_blank">
              <Linkedin size={16} /> linkedin.com/in/emreceyhn/
            </a>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: "absolute",
            bottom: "40px",
            color: "rgba(255,255,255,0.2)",
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
          margin: "140px auto 0",
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
              viewport={{ once: true }}
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
          margin: "140px auto 0",
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
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
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
        transition={{ duration: 1 }}
        style={{
          maxWidth: "1400px",
          margin: "140px auto 0",
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
          margin: "140px auto 140px",
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
          <a
            href="https://github.com/Emreceyhnn"
            target="_blank"
            style={{ color: "#fff" }}
          >
            <Github />
          </a>
          <a
            href="https://www.linkedin.com/in/emreceyhn/"
            target="_blank"
            style={{ color: "#fff" }}
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
