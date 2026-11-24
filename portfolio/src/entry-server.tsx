import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { getPortfolioData } from './services/dataService'

const SITE = 'https://emreceyhan.xyz'
const GITHUB = 'https://github.com/Emreceyhnn'
const LINKEDIN = 'https://www.linkedin.com/in/emreceyhn/'

/** Server-rendered HTML for <div id="root">. */
export function render(): string {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

/** schema.org graph (Person + WebSite + project list) for rich results / LLMs. */
export function jsonLd(): string {
  const d = getPortfolioData()
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Emre Ceyhan — Full-Stack Engineer',
        inLanguage: 'en',
        publisher: { '@id': `${SITE}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE}/#person`,
        name: 'Emre Ceyhan',
        url: `${SITE}/`,
        image: `${SITE}/og-image.png`,
        jobTitle: 'Full-Stack Engineer',
        description:
          'Full-Stack Engineer specializing in Next.js, React, TypeScript and PostgreSQL, shipping secure multi-tenant SaaS platforms.',
        email: 'mailto:emreceyhnn@gmail.com',
        address: { '@type': 'PostalAddress', addressLocality: 'Bursa', addressCountry: 'TR' },
        sameAs: [GITHUB, LINKEDIN],
        knowsAbout: d.skills.flatMap((s) => s.items),
        alumniOf: d.education.map((e) => ({
          '@type': 'EducationalOrganization',
          name: e.institution,
        })),
        knowsLanguage: d.languages.map((l) => l.language),
      },
      {
        '@type': 'ItemList',
        name: 'Selected Works',
        itemListElement: d.projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: p.title,
            description: p.description,
            url: p.link,
            applicationCategory: 'WebApplication',
            keywords: p.tech.join(', '),
            author: { '@id': `${SITE}/#person` },
          },
        })),
      },
    ],
  }
  // Escape "<" so the JSON can never close the <script> tag early.
  return JSON.stringify(graph).replace(/</g, '\\u003c')
}

/** Plain-markdown dump of the whole portfolio for LLM crawlers (llms-full.txt). */
export function markdown(): string {
  const d = getPortfolioData()
  const out: string[] = [
    '# Emre Ceyhan — Full-Stack Engineer',
    '',
    '> Full-Stack Engineer (Next.js, React 19, TypeScript, PostgreSQL) based in Bursa, Turkey; open to remote work. Ships secure, multi-tenant SaaS end to end.',
    '',
    `- Site: ${SITE}/`,
    `- GitHub: ${GITHUB}`,
    `- LinkedIn: ${LINKEDIN}`,
    '- Email: emreceyhnn@gmail.com',
    `- Résumé (PDF): ${SITE}/Emre_Ceyhan_Full_Stack_Engineer.pdf`,
    `- Services & pricing: ${SITE}/services`,
    '',
    '## Selected works',
    '',
  ]
  for (const p of d.projects) {
    out.push(`### [${p.title}](${p.link})`, '', p.description, '', `Tech: ${p.tech.join(', ')}`, '')
  }
  out.push('## Experience', '')
  for (const e of d.experience) {
    out.push(`### ${e.role} — ${e.company} (${e.period})`, '')
    for (const line of e.description) out.push(`- ${line}`)
    out.push('', `Tech: ${e.tech.join(', ')}`, '')
  }
  out.push('## Skills', '')
  for (const s of d.skills) out.push(`- **${s.category}:** ${s.items.join(', ')}`)
  out.push('', '## Education', '')
  for (const e of d.education) out.push(`- ${e.degree} — ${e.institution} (${e.period})`)
  out.push('', '## Languages', '')
  for (const l of d.languages) out.push(`- ${l.language}: ${l.proficiency}`)
  out.push('')
  return out.join('\n')
}
