// Post-build step for dist/index.html:
// 1. renders the app to static HTML, so the text paints before any JavaScript runs
//    (React hydrates it in the browser);
// 2. inlines the stylesheet, so first paint doesn't wait on a second request.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render } = await import(`${root}dist-ssr/entry-server.js`)

const file = `${root}dist/index.html`
let html = await readFile(file, 'utf8')
if (!html.includes('<!--app-html-->')) throw new Error('dist/index.html is missing <!--app-html-->')
html = html.replace('<!--app-html-->', render())

const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)]
for (const [tag, href] of links) {
  // href is root-relative (e.g. /assets/index-abc.css); vite's base is '/'
  const css = await readFile(`${root}dist${href}`, 'utf8')
  html = html.replace(tag, () => `<style>${css}</style>`)
}

await writeFile(file, html)
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`prerendered dist/index.html, inlined ${links.length} stylesheet(s)`)
