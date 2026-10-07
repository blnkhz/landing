export const INK = [22, 18, 22]
export const DISPLAY = '"UnifrakturMaguntia", "Old English Text MT", serif'
// false during the build-time prerender, where there is no window
export const REDUCED =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const pad = (n, w) => String(n).padStart(w, '0')

// One generation of Conway's Life (B3/S23). `wrap` makes the board a torus.
// The returned grid carries its population as `.pop`.
export function lifeStep(a, cols, rows, wrap) {
  const b = new Uint8Array(a.length)
  let pop = 0
  for (let y = 0; y < rows; y++) {
    let y0 = y - 1
    let y2 = y + 1
    if (wrap) {
      y0 = (y0 + rows) % rows
      y2 = y2 % rows
    }
    const r0 = y0 >= 0 ? y0 * cols : -1
    const r1 = y * cols
    const r2 = y2 < rows ? y2 * cols : -1
    for (let x = 0; x < cols; x++) {
      let x0 = x - 1
      let x2 = x + 1
      if (wrap) {
        x0 = (x0 + cols) % cols
        x2 = x2 % cols
      }
      const l = x0 >= 0
      const r = x2 < cols
      let n = 0
      if (r0 >= 0) {
        if (l) n += a[r0 + x0]
        n += a[r0 + x]
        if (r) n += a[r0 + x2]
      }
      if (l) n += a[r1 + x0]
      if (r) n += a[r1 + x2]
      if (r2 >= 0) {
        if (l) n += a[r2 + x0]
        n += a[r2 + x]
        if (r) n += a[r2 + x2]
      }
      const v = n === 3 || (n === 2 && a[r1 + x]) ? 1 : 0
      b[r1 + x] = v
      pop += v
    }
  }
  b.pop = pop
  return b
}
