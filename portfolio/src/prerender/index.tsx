import { renderToStaticMarkup } from "react-dom/server";
import { fetchPortfolioData } from "../services/dataService";
import { StaticHome } from "./StaticHome";
import { buildJsonLd } from "./jsonld";
import { buildLlmsTxt } from "./llms";

/**
 * Minimal styling so the pre-hydration page is readable and matches the
 * site's dark theme during the short moment before React takes over.
 */
const CSS = `
[data-prerender]{max-width:880px;margin:0 auto;padding:56px 24px 96px;color:rgba(255,255,255,.78);font:400 16px/1.7 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
[data-prerender] h1{font-size:clamp(2.6rem,9vw,5rem);line-height:1.05;margin:.15em 0 .3em;color:#fff;font-weight:900;letter-spacing:-.03em}
[data-prerender] h2{font-size:clamp(1.7rem,4.5vw,2.4rem);margin:3.2rem 0 1rem;color:#fff;font-weight:800}
[data-prerender] h3{font-size:1.15rem;margin:1.6rem 0 .3rem;color:#fff}
[data-prerender] h4{font-size:1rem;margin:.8rem 0 .2rem;color:#fff}
[data-prerender] p{margin:.5rem 0}
[data-prerender] ul,[data-prerender] ol{padding-left:1.2rem;margin:.5rem 0}
[data-prerender] ul.inline,[data-prerender] ol.steps{list-style:none;padding:0}
[data-prerender] ul.inline{display:flex;flex-wrap:wrap;gap:.4rem 1.5rem}
[data-prerender] a{color:#818cf8;text-decoration:underline;text-underline-offset:3px}
[data-prerender] .eyebrow{color:#818cf8;font-size:.78rem;letter-spacing:2px;text-transform:uppercase}
[data-prerender] .lead{font-size:1.1rem;color:rgba(255,255,255,.65);max-width:760px}
[data-prerender] .muted{color:rgba(255,255,255,.45);font-size:.88rem}
[data-prerender] article{margin:1.4rem 0;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.06)}
`;

export async function renderHome(): Promise<{
  body: string;
  head: string;
  llmsTxt: string;
}> {
  const data = await fetchPortfolioData();
  const body = renderToStaticMarkup(<StaticHome data={data} />);
  // "<" is escaped so the JSON can never close the surrounding script tag.
  const jsonLd = JSON.stringify(buildJsonLd(data)).replace(/</g, "\\u003c");
  const head =
    `<style data-prerender>${CSS.trim()}</style>\n` +
    `    <script type="application/ld+json">${jsonLd}</script>`;
  return { body, head, llmsTxt: buildLlmsTxt(data) };
}
