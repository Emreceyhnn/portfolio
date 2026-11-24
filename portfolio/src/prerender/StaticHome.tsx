import type { PortfolioData } from "../services/dataService";
import { contactMailto, profile } from "../data/profile";
import {
  offers,
  processSteps,
  quoteMailto,
  servicesCopy,
} from "../data/services";

/**
 * Plain, semantic HTML of the home page, rendered once at build time and
 * placed inside `<div id="root">` of index.html. Crawlers and link
 * unfurlers that do not execute JavaScript read this; in a browser React
 * replaces it as soon as the app mounts.
 *
 * Rules: every piece of text here must also be visible in the interactive
 * page (it renders from the same data modules), and the section order and
 * headings mirror ExamplePage.tsx.
 */
export function StaticHome({ data }: { data: PortfolioData }) {
  return (
    <div data-prerender="home">
      <header>
        <p className="eyebrow">{profile.role}</p>
        <h1>{profile.name}</h1>
        <p className="lead">{profile.summary}</p>
        <p>
          <a href={profile.resumeUrl}>Download Resume</a>
        </p>
        <ul className="inline">
          <li>{profile.locationLabel}</li>
          <li>
            <a href={contactMailto}>{profile.email}</a>
          </li>
          <li>
            <a href={profile.github.url}>{profile.github.label}</a>
          </li>
          <li>
            <a href={profile.linkedin.url}>{profile.linkedin.label}</a>
          </li>
        </ul>
      </header>

      <main>
        <section id="services">
          <p className="eyebrow">{servicesCopy.eyebrow}</p>
          <h2>{servicesCopy.title}</h2>
          <p>{servicesCopy.lead}</p>
          <p>
            <strong>{servicesCopy.launchNote}</strong>
          </p>
          <p className="muted">{servicesCopy.priceNote}</p>
          {offers.map((offer) => (
            <article key={offer.id}>
              <h3>{offer.name}</h3>
              <p>{offer.promise}</p>
              <ul>
                {offer.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p>
                <strong>{offer.price}</strong> · {offer.timeline}
                <br />
                <span className="muted">{offer.priceNote}</span>
              </p>
              <p>
                <a href={quoteMailto(offer.name, profile.email)}>Request quote</a>
                {" · "}
                <a href={offer.proofUrl}>{offer.proofLabel}</a>
              </p>
            </article>
          ))}
          <ol className="steps">
            {processSteps.map((step) => (
              <li key={step.n}>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="muted">
            {servicesCopy.trFooterBefore}
            <a href={`mailto:${profile.email}`}>{servicesCopy.trFooterLink}</a>
            {servicesCopy.trFooterAfter}
          </p>
          <p>
            <a href="/services">{servicesCopy.detailsLinkLabel}</a>
          </p>
        </section>

        <section id="experience">
          <h2>Professional Impact</h2>
          {data.experience.map((exp) => (
            <article key={exp.id}>
              <h3>{exp.role}</h3>
              <p>
                {exp.company} · {exp.period}
              </p>
              <ul>
                {exp.description.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="muted">{exp.tech.join(" · ")}</p>
            </article>
          ))}
        </section>

        <section id="skills">
          <h2>Technical Competencies</h2>
          {data.skills.map((group) => (
            <div key={group.category}>
              <h3>{group.category}</h3>
              <p>{group.items.join(" · ")}</p>
            </div>
          ))}
        </section>

        <section id="work">
          <h2>Selected Works</h2>
          {data.projects.map((project) => (
            <article key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="muted">{project.tech.join(" · ")}</p>
              <p>
                <a href={project.link}>{project.link.replace("https://", "")}</a>
                {project.caseStudy && (
                  <>
                    {" · "}
                    <a href={project.caseStudy}>Read the case study</a>
                  </>
                )}
              </p>
            </article>
          ))}
        </section>

        <section id="education">
          <h2>Academic Background</h2>
          {data.education.map((edu) => (
            <div key={edu.id}>
              <h3>{edu.degree}</h3>
              <p>
                {edu.institution} · {edu.period}
              </p>
            </div>
          ))}
        </section>

        <section id="languages">
          <h2>Localization</h2>
          <ul>
            {data.languages.map((l) => (
              <li key={l.language}>
                {l.language}: {l.proficiency}
              </li>
            ))}
          </ul>
          <p>{profile.availability}</p>
        </section>

        <section id="contact">
          <h2>Get in Touch</h2>
          <p>{profile.contactIntro}</p>
          <p>
            <a href={contactMailto}>{profile.email}</a>
          </p>
        </section>
      </main>
    </div>
  );
}
