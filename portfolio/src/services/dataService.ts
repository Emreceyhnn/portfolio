import type {
  ProjectModel,
  ExperienceModel,
  SkillModel,
  EducationModel,
} from "../lib/type/example";

export interface PortfolioData {
  projects: ProjectModel[];
  experience: ExperienceModel[];
  skills: SkillModel[];
  education: EducationModel[];
  languages: { language: string; proficiency: string }[];
}

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  // FE-10 perf fix: this used to `await` an artificial 800ms delay to
  // "simulate an API call" -- but the data below is fully static/local,
  // not a real network request, so the delay bought nothing except a
  // guaranteed 800ms added straight onto the page's LCP (the hero
  // paragraph doesn't render until this promise resolves). Kept as an
  // async function so the call site's loading/error states are exercised
  // unchanged; just no longer paying for a fake wait.
  const mockProjects: ProjectModel[] = [
    {
      id: "1",
      title: "Watchlight",
      description:
        "A real-time Mini-SIEM / SOC dashboard with 7 sliding-window detection rules (brute force, credential stuffing, impossible travel, port scans, data exfiltration, unauthorized exec, API abuse), each mapped to a MITRE ATT&CK technique ID, streaming alerts live to analysts over Server-Sent Events.",
      link: "https://watchlight.emreceyhan.xyz/",
      tech: ["Next.js", "TypeScript", "Redis Pub/Sub", "PostgreSQL", "Prisma", "Docker"],
    },
    {
      id: "2",
      title: "LogiTrack",
      description:
        "Multi-tenant fleet management SaaS with real-time vehicle tracking (Firebase RTDB + a WebSocket telemetry client + Leaflet + Valhalla routing), JWT auth with Redis-backed session revocation, and a Docker-based CI/CD pipeline deploying to a self-hosted Linux VPS.",
      link: "https://logitrackenterprise.emreceyhan.xyz/",
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Firebase RTDB", "Upstash Redis"],
    },
    {
      id: "3",
      title: "DocuMind",
      description:
        "A 4-service Retrieval-Augmented Generation platform (Auth, Document, RAG, Next.js client) on ASP.NET Core with gRPC inter-service communication, JWT-based auth, document chunking/embedding, and vector similarity search via PostgreSQL/pgvector and MinIO.",
      link: "https://documind.emreceyhan.xyz/",
      tech: ["ASP.NET Core", ".NET 10", "gRPC", "pgvector", "MinIO", "Next.js"],
    },
    {
      id: "4",
      title: "DeployBox",
      description:
        "A self-hosted mini-PaaS: GitHub repo connect & OAuth, webhook-triggered Docker builds, live build-log streaming to a subdomain deploy, built with Next.js + tRPC and a .NET Worker Service driving the Docker Engine API.",
      link: "https://deploybox.emreceyhan.xyz/",
      tech: ["Next.js", "tRPC", "Drizzle ORM", ".NET", "Docker"],
    },
    {
      id: "5",
      title: "Mavi Rota",
      description:
        "A tourism booking site for luxury gulet cruises around Koy Koy, Fethiye — showcasing tour packages and routes with a bilingual (TR/EN) experience.",
      link: "https://tour.emreceyhan.xyz/en",
      tech: ["Next.js", "TypeScript"],
    },
  ];

  const mockExperience: ExperienceModel[] = [
    {
      id: "exp1",
      company: "LogiTrack (SaaS)",
      role: "Solo Founder & Full-Stack Engineer",
      period: "Nov 2025 — Present",
      description: [
        "Architected and shipped an end-to-end, multi-tenant fleet management SaaS platform under a strict company-scoped tenant isolation architecture.",
        "Built real-time vehicle tracking on Firebase Realtime Database with a WebSocket client for live telemetry, replacing 10-second polling and cutting location update latency to ~1.5s.",
        "Saved 350 kB in browser bundle size and cut First Contentful Paint to 0.7s with a dual validation stack (Formik + Yup client-side, Zod server-side).",
        "Built and operate the production deployment target (logitrackenterprise.emreceyhan.xyz): a Docker-based GitHub Actions CI/CD pipeline (build & push, SSH-triggered VPS deploy with health checks) for zero-downtime rollouts, self-hosted on a Linux VPS behind Nginx with a Prometheus/Grafana/Loki observability stack.",
        "Hardened platform security with jose JWT access/refresh tokens, instant session revocation via an Upstash Redis denylist, permission-based RBAC, and nonce-based CSP headers in edge middleware.",
        "Developed a super-admin diagnostic console with live service health probes (Postgres, Redis, Resend, Firebase, Valhalla) and soft deletes to prevent data loss.",
      ],
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Firebase RTDB", "Upstash Redis", "Docker", "Nginx"],
    },
    {
      id: "exp2",
      company: "Wanderlens",
      role: "Full-Stack Engineer",
      period: "Feb 2025 — Sep 2026",
      description: [
        "Collaborated on PostgreSQL schema design and reduced API response time from 800ms to 210ms on 3 critical endpoints through query optimization and indexing.",
        "Developed and delivered admin dashboard modules for tour-operator performance and financial tracking with Next.js (SSR/CSR), cutting component duplication by ~40% across 3 modules.",
        "Engineered data tables for large datasets using server-side pagination, caching, and debouncing to keep data-heavy views responsive.",
        "Raised and held Lighthouse performance scores at 90+ on key dashboard views by monitoring Web Vitals and resolving LCP/CLS bottlenecks.",
      ],
      tech: ["Next.js", "React", "MUI", "PostgreSQL", "AWS"],
    },
    {
      id: "exp3",
      company: "FlyRank AI",
      role: "Front-End AI Engineering Intern",
      period: "Jun 2026 — Sep 2026",
      description: [
        "Completed an 8-week AI engineering internship across two concurrent tracks — Frontend AI Engineering (14/14 assignments) and General AI Fluency (26/26 assignments) — with all 3 capstones approved.",
        "Shipped a full production AI product end to end: architecture, a streaming AI chat interface with real-time tool results, and structured output rendering, deployed to a live domain.",
        "Applied prompt engineering, studied agent/MCP architecture, and built a custom personal AI agent from scratch.",
      ],
      tech: ["Next.js", "React", "Web Vitals"],
    },
  ];

  const mockSkills: SkillModel[] = [
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js (App Router, SSR)",
        "TypeScript",
        "Material UI (MUI 7)",
        "Redux Toolkit",
        "TanStack Query/Table",
        "Vue.js",
        "Emotion",
        "Framer Motion",
      ],
    },
    {
      category: "Backend & APIs",
      items: [
        "Node.js",
        "Express",
        "Prisma",
        "REST APIs",
        "GraphQL",
        "gRPC",
        "WebSockets",
        "Server-Sent Events",
        "Zod",
        "Yup",
        "Formik",
        "JWT",
        "bcryptjs",
      ],
    },
    {
      category: "Databases",
      items: ["PostgreSQL (pgvector)", "MongoDB", "Firebase Realtime Database", "Upstash Redis", "MinIO", "Supabase Storage"],
    },
    {
      category: "Security",
      items: ["MITRE ATT&CK", "JWT session revocation", "Rate limiting", "CSP/HSTS", "RBAC"],
    },
    {
      category: "DevOps & Infrastructure",
      items: [
        "Docker",
        "Docker Compose",
        "Linux VPS Administration",
        "Nginx (Reverse Proxy / TLS)",
        "GitHub Actions CI/CD",
        "Git",
        "AWS",
      ],
    },
    {
      category: "Monitoring",
      items: ["Prometheus", "Grafana", "Loki", "Promtail", "cAdvisor", "Node Exporter"],
    },
    {
      category: "Testing",
      items: ["Node Test Runner", "React Testing Library", "jsdom", "Jest", "Playwright", "ESLint 9", "Prettier"],
    },
    {
      category: "Soft Skills",
      items: [
        "Team Collaboration",
        "Problem Solving",
        "Stakeholder Management",
        "Time Management",
      ],
    },
  ];

  const mockEducation: EducationModel[] = [
    {
      id: "edu1",
      institution: "Izmir Demokrasi University",
      degree: "B.A. in International Relations",
      period: "2021 - 2025",
    },
    {
      id: "edu2",
      institution: "IT School GoIT",
      degree: "Full Stack Developer",
      period: "2025 - 2026",
    },
  ];

  const mockLanguages = [
    { language: "Turkish", proficiency: "Native" },
    { language: "English", proficiency: "Advanced" },
  ];

  return {
    projects: mockProjects,
    experience: mockExperience,
    skills: mockSkills,
    education: mockEducation,
    languages: mockLanguages,
  };
};
