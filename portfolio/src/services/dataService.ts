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
      title: "LogiTrack",
      description:
        "Multi-tenant fleet management SaaS with real-time vehicle tracking for 200+ concurrent streams (Firebase RTDB + Leaflet + Valhalla routing), JWT auth with Redis-backed session revocation, and a super-admin diagnostics console.",
      link: "https://logitrack.emreceyhan.xyz/",
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Firebase RTDB", "Upstash Redis"],
    },
    {
      id: "2",
      title: "Mavi Rota",
      description:
        "A tourism booking site for luxury gulet cruises around Koy Koy, Fethiye — showcasing tour packages and routes with a bilingual (TR/EN) experience.",
      link: "https://tour.emreceyhan.xyz/en",
      tech: ["Next.js", "TypeScript"],
    },
    {
      id: "3",
      title: "TaskPro",
      description:
        "A full-stack Kanban task manager (React, TypeScript, Node.js/Express, MongoDB) with drag-and-drop workflow and JWT access/refresh authentication, documented via Swagger. Lighthouse 99 (desktop), FCP 0.7s, LCP 0.9s via route-based code splitting, lazy loading, and skeleton states.",
      link: "https://taskpro.emreceyhan.xyz/",
      tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    },
    {
      id: "4",
      title: "Money Guard",
      description:
        "A personal finance tracker with real-time currency conversion behind a CORS-safe serverless proxy, Redux Toolkit state management, and cached external API responses. Lighthouse 98 (desktop) / 85 (mobile), 100/100 Best Practices and SEO.",
      link: "https://money-guard-theta.vercel.app/",
      tech: ["React", "Redux Toolkit", "Node.js"],
    },
    {
      id: "5",
      title: "Admin Dashboard",
      description:
        "A full-stack MERN admin dashboard for managing orders, products, suppliers, and customers, with JWT-secured auth and Lighthouse 100 performance.",
      link: "https://admin-dashboard.emreceyhan.xyz/",
      tech: ["React", "Node.js", "Express", "MongoDB", "Material UI"],
    },
    {
      id: "6",
      title: "Nanny Service",
      description:
        "A platform connecting families with experienced babysitters, featuring Firebase auth, dynamic profile filtering, favorites, and appointment scheduling.",
      link: "https://nanny-service.emreceyhan.xyz/",
      tech: ["React", "TypeScript", "Firebase", "Material UI"],
    },
  ];

  const mockExperience: ExperienceModel[] = [
    {
      id: "exp1",
      company: "LogiTrack (SaaS MVP)",
      role: "Founder & Lead Full-Stack Engineer",
      period: "Nov 2025 — Present",
      description: [
        "Architected and shipped an end-to-end, multi-tenant fleet management SaaS platform under a strict company-scoped tenant isolation architecture.",
        "Eliminated 10-second polling delays by designing a real-time vehicle tracking system handling 200+ concurrent streams via Firebase Realtime Database, WebSocket channels, and Leaflet maps, integrated with Valhalla turn-by-turn routing.",
        "Saved 350 kB in browser bundle size and cut First Contentful Paint to 0.7s with a dual validation stack (Formik + Yup client-side, Zod server-side).",
        "Designed a 3-stage GitHub Actions CI/CD pipeline (lint/type-check/build on every PR, automated Docker image build & push, SSH-triggered VPS deploy with immutable SHA-tagged images and post-deploy health checks) enabling safe, zero-downtime rollouts.",
        "Self-hosted the platform on a Linux VPS via Docker Compose behind an Nginx reverse proxy with TLS and a RabbitMQ event queue, backed by a Prometheus/Grafana/Loki observability stack.",
        "Hardened platform security with jose JWT access/refresh tokens, instant session revocation via an Upstash Redis denylist, permission-based RBAC, and nonce-based CSP headers in edge middleware.",
        "Developed a super-admin diagnostic console with live service health probes (Postgres, Redis, Resend, Firebase, Valhalla) and soft deletes to prevent data loss.",
      ],
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Firebase RTDB", "Upstash Redis", "RabbitMQ", "Docker", "Nginx"],
    },
    {
      id: "exp2",
      company: "Wanderlens",
      role: "Frontend / Full-Stack Developer",
      period: "Feb 2025 — Present",
      description: [
        "Collaborated on PostgreSQL schema design and reduced API response time from 800ms to 210ms on 3 critical endpoints through query optimization and indexing.",
        "Developed and delivered admin dashboard modules for tour-operator performance and financial tracking with Next.js (SSR/CSR), cutting component duplication by ~40% across 3 modules.",
        "Engineered data tables for large datasets using server-side pagination, caching, and debouncing to keep data-heavy views responsive.",
        "Raised and held Lighthouse performance scores at 90+ on key dashboard views by monitoring Web Vitals and resolving LCP/CLS bottlenecks.",
      ],
      tech: ["Next.js", "React", "MUI", "PostgreSQL", "AWS"],
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
        "RabbitMQ",
        "Zod",
        "Yup",
        "Formik",
        "JWT",
        "bcryptjs",
      ],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "MongoDB", "Firebase Realtime Database", "Upstash Redis", "Supabase Storage"],
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
      institution: "IT School GoIT",
      degree: "Full Stack Developer",
      period: "2025 - 2026",
    },
    {
      id: "edu2",
      institution: "Izmir Demokrasi University",
      degree: "B.A. in International Relations",
      period: "2021 - 2025",
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
