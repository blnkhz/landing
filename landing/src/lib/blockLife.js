import { lifeStep } from './life'

// Quadrant block characters: one glyph shows a 2×2 group of cells.
// Index bits are top-left, top-right, bottom-left, bottom-right.
const GLYPHS = ' ▗▖▄▝▐▞▟▘▚▌▙▀▜▛█'
const GLIDER = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]

// Small seeded PRNG, so the prerendered HTML and the first client frame agree.
function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Game of Life on a torus of `lines` × `chars` quadrant glyphs (2 cells per glyph
 * each way). Because the board wraps, each line can be printed twice side by side
 * and the marquee's horizontal loop joins seamlessly.
 */
export function createBlockLife({ lines = 4, chars = 48, seed = 1 } = {}) {
  const cols = chars * 2
  const rows = lines * 2
  const rand = mulberry32(seed)
  let grid = new Uint8Array(cols * rows)
  let quiet = 0
  let prevPop = -1

  function glider(ox, oy) {
    for (const [x, y] of GLIDER) grid[((oy + y) % rows) * cols + ((ox + x) % cols)] = 1
  }
  for (let i = 0; i < grid.length; i++) grid[i] = rand() < 0.22 ? 1 : 0
  for (let k = 0; k < 4; k++) glider(Math.floor(rand() * cols), Math.floor(rand() * rows))

  function step() {
    const next = lifeStep(grid, cols, rows, true)
    // A thin torus settles quickly; when the population stops changing, drop in a glider.
    quiet = next.pop === prevPop ? quiet + 1 : 0
    prevPop = next.pop
    grid = next
    if (quiet > 6 || next.pop < cols / 3) {
      glider(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows))
      quiet = 0
    }
  }

  // one string per text line, already doubled for the seamless loop
  function text() {
    const out = []
    for (let l = 0; l < lines; l++) {
      const top = l * 2 * cols
      const bottom = top + cols
      let s = ''
      for (let c = 0; c < chars; c++) {
        const x = c * 2
        s += GLYPHS[(grid[top + x] << 3) | (grid[top + x + 1] << 2) | (grid[bottom + x] << 1) | grid[bottom + x + 1]]
      }
      out.push(s + s)
    }
    return out
  }

  return { step, text }
}
