import type { PortfolioData } from "../services/dataService";
import { profile } from "../data/profile";
import { offers } from "../data/services";

/**
 * /llms.txt: a plain-text, Markdown summary for language-model crawlers
 * (see llmstxt.org). Generated from the same data as the page so it can
 * never disagree with it.
 */
export function buildLlmsTxt(data: PortfolioData): string {
  const site = profile.siteUrl;
  const lines: string[] = [];

  lines.push(`# ${profile.name} — ${profile.role}`, "");
  lines.push(`> ${profile.summary}`, "");
  lines.push(
    `Based in ${profile.location}, open to remote work. This site lists selected projects, work experience, skills and fixed-scope freelance packages.`,
    "",
  );

  lines.push("## Pages", "");
  lines.push(
    `- [Home](${site}/): profile, experience, skills, education, selected works and contact`,
  );
  lines.push(
    `- [Services](${site}/services): fixed-scope freelance packages with prices and timelines`,
  );
  for (const p of data.projects.filter((x) => x.caseStudy)) {
    lines.push(`- [Case study: ${p.title}](${site}${p.caseStudy}): how ${p.title} was built`);
  }
  lines.push(`- [Resume (PDF)](${site}${profile.resumeUrl}): downloadable CV`, "");

  lines.push("## Selected projects", "");
  for (const p of data.projects) {
    lines.push(`- [${p.title}](${p.link}): ${p.description}`);
  }
  lines.push("");

  lines.push("## Freelance packages", "");
  for (const o of offers) {
    lines.push(`- ${o.name} (${o.price}, ${o.timeline}): ${o.promise}`);
  }
  lines.push("");

  lines.push("## Experience", "");
  for (const e of data.experience) {
    lines.push(`- ${e.role}, ${e.company} (${e.period})`);
  }
  lines.push("");

  lines.push("## Skills", "");
  for (const g of data.skills.filter((x) => x.category !== "Soft Skills")) {
    lines.push(`- ${g.category}: ${g.items.join(", ")}`);
  }
  lines.push("");

  lines.push("## Education", "");
  for (const e of data.education) {
    lines.push(`- ${e.degree}, ${e.institution} (${e.period})`);
  }
  lines.push("");

  lines.push("## Links", "");
  lines.push(`- [GitHub](${profile.github.url})`);
  lines.push(`- [LinkedIn](${profile.linkedin.url})`);
  lines.push("");

  return lines.join("\n");
}
