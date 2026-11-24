import type { PortfolioData } from "../services/dataService";
import { profile } from "../data/profile";
import { offers } from "../data/services";

/**
 * schema.org structured data for the home page, built from the same data
 * the page renders (so it cannot drift from what visitors see).
 * The e-mail address is intentionally left out of the structured data.
 */
export function buildJsonLd(data: PortfolioData) {
  const url = `${profile.siteUrl}/`;
  const personId = `${url}#person`;

  const knowsAbout = Array.from(
    new Set(
      data.skills
        .filter((g) => g.category !== "Soft Skills")
        .flatMap((g) => g.items),
    ),
  );

  const price = (label: string) => Number(label.replace(/[^0-9.]/g, ""));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: `${profile.name} — ${profile.role}`,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: `${profile.name} | ${profile.role}`,
        isPartOf: { "@id": `${url}#website` },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        jobTitle: profile.role,
        description: profile.summary,
        url,
        image: `${profile.siteUrl}/og-image.png`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bursa",
          addressCountry: "TR",
        },
        sameAs: [profile.github.url, profile.linkedin.url],
        knowsAbout,
        alumniOf: data.education.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.institution,
        })),
        makesOffer: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          description: o.promise,
          url: `${profile.siteUrl}/services`,
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: price(o.price),
            priceCurrency: "USD",
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${url}#projects`,
        name: "Selected works",
        itemListElement: data.projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.description,
            url: p.link,
            keywords: p.tech.join(", "),
          },
        })),
      },
    ],
  };
}
