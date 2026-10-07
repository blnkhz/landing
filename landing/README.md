# blnkhz

Personal site of Blanka Hooz. Vite + React, no UI libraries.

- `npm run dev` – local dev server
- `npm run build` – production build to `dist/`, then prerenders the page to static HTML (`scripts/prerender.js`, via `src/entry-server.jsx`); the client hydrates it
- `npm run deploy` – build and publish `dist/` to GitHub Pages

The display face is self-hosted in `public/fonts/` (SIL OFL) and preloaded from `index.html`.

## Where things live

- `src/content.jsx` – all copy, links, jobs, toolkit and hobbies
- `src/components/` – one component per section
- `src/lib/` – the canvas engines, framework-free:
  - `hero.js` – the name rasterised as generation zero of Conway's Life, scrubbed by scroll, plus pong
  - `rule.js` – the elementary automaton woven row by row
  - `lifeField.js` – the live Life field behind the contact card
  - `mesh.js` – the WebGL iridescent mesh gradient
  - `loop.js` – the single shared animation loop
  - `status.js` – the live readout in the top bar
