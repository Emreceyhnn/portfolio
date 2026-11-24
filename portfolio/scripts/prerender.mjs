// Post-build step: render the React app to static HTML and bake it into
// dist/index.html so crawlers / LLM bots / no-JS clients get real content.
// Also emits dist/llms-full.txt from the same data source.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> placeholder not found in dist/index.html')
}

const html = template
  .replace('<div id="root"></div>', () => `<div id="root">${ssr.render()}</div>`)
  .replace(
    '</head>',
    () =>
      `    <script type="application/ld+json">${ssr.jsonLd()}</script>\n` +
      // Without JS, framer-motion's initial opacity:0 would leave the page blank.
      `    <noscript><style>[style*="opacity: 0"]{opacity:1!important;transform:none!important}</style></noscript>\n  </head>`,
  )

await writeFile(path.join(dist, 'index.html'), html)
await writeFile(path.join(dist, 'llms-full.txt'), ssr.markdown())
console.log(`prerender: index.html ${(html.length / 1024).toFixed(1)} kB, llms-full.txt written`)
