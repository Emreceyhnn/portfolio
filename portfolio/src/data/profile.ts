/**
 * Static profile facts shared by the interactive page and the build-time
 * prerender (which gives crawlers the same content without running JS).
 * Edit the copy here once; both render from it.
 */
export const profile = {
  name: "Emre Ceyhan",
  role: "Full-Stack Engineer",
  siteUrl: "https://emreceyhan.xyz",
  summary:
    "Results-driven Full-Stack Engineer with startup production experience shipping highly secure, multi-tenant SaaS architectures end to end. Specialized in Next.js, React 19, TypeScript, and PostgreSQL — focused on measurable outcomes like lower API latency and Lighthouse scores of 90+.",
  resumeUrl: "/Emre_Ceyhan_Full_Stack_Engineer.pdf",
  location: "Bursa, TR",
  locationLabel: "Bursa, TR (Open to Remote)",
  email: "emreceyhnn@gmail.com",
  github: { url: "https://github.com/Emreceyhnn", label: "github.com/Emreceyhnn" },
  linkedin: {
    url: "https://www.linkedin.com/in/emreceyhn/",
    label: "linkedin.com/in/emreceyhn/",
  },
  availability:
    "Currently based in Bursa, TR. Available for globally remote positions and on-site roles within the region.",
  contactIntro:
    "Have a role, a project, or just a question? This form actually sends — it'll land in my inbox, not a void.",
} as const;

export const contactMailto = `mailto:${profile.email}?subject=Contact%20from%20Portfolio`;
