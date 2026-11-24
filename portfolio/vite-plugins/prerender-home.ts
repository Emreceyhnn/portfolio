import { createServer, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

interface Rendered {
  body: string;
  head: string;
  llmsTxt: string;
}

/**
 * Build-time prerender of the home page.
 *
 * The site is a client-rendered React app, so the HTML a crawler fetches
 * used to contain only `<div id="root"></div>`. This plugin loads
 * `src/prerender` through a throwaway Vite server (so TypeScript and JSX
 * work as in the app), renders the page's content to static HTML and
 * injects it into `index.html` together with JSON-LD. It also emits
 * `llms.txt`, built from the same data. React still mounts normally with
 * `createRoot` and replaces the static markup.
 *
 * The throwaway server runs with HMR/watch off and is closed right after
 * rendering so the build process can exit cleanly. The result is shared by
 * both hooks, so only one server is ever started per build.
 */
export function prerenderHome(): Plugin {
  let rendered: Promise<Rendered> | undefined;

  const render = (): Promise<Rendered> => {
    rendered ??= (async () => {
      const server = await createServer({
        configFile: false,
        appType: "custom",
        logLevel: "error",
        server: { middlewareMode: true, hmr: false, watch: null },
        optimizeDeps: { noDiscovery: true, include: [] },
        plugins: [react()],
      });
      try {
        const mod = await server.ssrLoadModule("/src/prerender/index.tsx");
        const result = (await mod.renderHome()) as Rendered;
        if (!result.body.includes("<h1>")) {
          throw new Error("prerender-home: rendered markup has no <h1>");
        }
        return result;
      } finally {
        await server.close();
      }
    })();
    return rendered;
  };

  return {
    name: "prerender-home",
    apply: "build",

    async transformIndexHtml(html) {
      const marker = '<div id="root"></div>';
      if (!html.includes(marker)) {
        throw new Error(
          'prerender-home: could not find `<div id="root"></div>` in index.html',
        );
      }
      const { body, head } = await render();
      return html
        .replace(marker, `<div id="root">${body}</div>`)
        .replace("</head>", `    ${head}\n  </head>`);
    },

    async generateBundle() {
      const { llmsTxt } = await render();
      this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt });
    },
  };
}
