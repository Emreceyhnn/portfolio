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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockProjects: ProjectModel[] = [
    {
      id: "1",
      title: "Money Guard",
      description:
        "A personal finance tracking application to manage income, expenses, categories, and account balances.",
      link: "https://moneyguard.emreceyhan.xyz/",
      tech: ["Next.js", "React", "Node.js", "Express", "Material UI"],
    },
    {
      id: "2",
      title: "Travel Trucks",
      description:
        "Logistics and fleet management solution for modern tracking and routing.",
      link: "https://travel-trucks.emreceyhan.xyz/",
      tech: ["React", "Node.js", "PostgreSQL"],
    },
    {
      id: "3",
      title: "Task Pro",
      description:
        "A Kanban-style task management platform for personal and team workflows.",
      link: "https://taskpro.emreceyhan.xyz/",
      tech: ["React", "Node.js", "MongoDB", "Material UI", "Express"],
    },
    {
      id: "4",
      title: "Logitrack",
      description:
        "Enterprise resource planning for logistics and tracking operations.",
      link: "https://logitrack.emreceyhan.xyz/",
      tech: ["Next.js", "Material UI", "Prisma"],
    },
  ];

  const mockExperience: ExperienceModel[] = [
    {
      id: "exp1",
      company: "Wanderlens",
      role: "Frontend / Full-Stack Developer",
      period: "Feb 2025 — Aug 2025",
      description: [
        "Owned and delivered Admin Dashboard modules in a large-scale Next.js (CSR/SSR) + React product, improving development throughput by 30% through reusable, well-structured UI architecture.",
        "Implemented a consistent Material UI design system (theming, responsive layouts, accessibility, component patterns), reducing UI rework and style inconsistencies by 25%.",
        "Built high-performance data tables for large datasets (server-side pagination/sorting/filtering, debouncing, caching), improving perceived load/interaction performance by 40% on heavy views.",
        "Contributed to PostgreSQL schema design and database performance tuning (indexes, query optimization, data integrity controls), reducing latency on key queries/endpoints by 35%.",
        "Led backend integration and production release readiness (API contracts, error handling, role-based access, environment configuration, AWS deployment workflows), lowering production incidents by 20%.",
      ],
      tech: ["Next.js", "React", "MUI", "PostgreSQL", "AWS", "Node.js"],
    },
  ];

  const mockSkills: SkillModel[] = [
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "Vue.js",
        "JavaScript (ES6+)",
        "TypeScript",
        "Material UI",
      ],
    },
    { category: "Backend", items: ["Node.js", "Express.js", "Prisma"] },
    { category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
    {
      category: "APIs & Real-time",
      items: ["REST APIs", "WebSockets", "Web Scraping"],
    },
    {
      category: "DevOps & Tools",
      items: ["Git", "GitHub", "Docker", "CI/CD"],
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
