import { INK, clamp, pad } from './life'
import { status } from './status'

/**
 * An elementary (1D) automaton woven row by row into an ink panel as the section
 * scrolls past. Live cells are cut out of the ink so the gradient shows through,
 * and the row being written glows like a pen head.
 */
export function createRule({ section, canvas }) {
  const ctx = canvas.getContext('2d')
  let rule = 30
  let cols = 0
  let rows = 0
  let cell = 6
  let data = null
  let shown = -1
  let W = 0
  let H = 0
  let dirty = true

  function compute() {
    data = new Uint8Array(cols * rows)
    data[Math.floor(cols / 2)] = 1
    for (let y = 1; y < rows; y++) {
      const p = (y - 1) * cols
      const o = y * cols
      for (let x = 0; x < cols; x++) {
        const l = data[p + ((x - 1 + cols) % cols)]
        const c = data[p + x]
        const r = data[p + ((x + 1) % cols)]
        data[o + x] = (rule >> ((l << 2) | (c << 1) | r)) & 1
      }
    }
    dirty = true
  }

  function size() {
    const r = canvas.getBoundingClientRect()
    W = r.width
    H = r.height
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cell = W < 600 ? 4 : 6
    cols = Math.ceil(W / cell)
    rows = Math.ceil(H / cell)
    compute()
  }

  function draw(s) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = `rgb(${INK})`
    ctx.fillRect(0, 0, W, H)
    ctx.globalCompositeOperation = 'destination-out'
    for (let y = 0; y < s; y++) {
      const o = y * cols
      for (let x = 0; x < cols; x++) if (data[o + x]) ctx.fillRect(x * cell, y * cell, cell, cell)
    }
    ctx.globalCompositeOperation = 'source-over'
    if (s < rows) {
      ctx.fillStyle = '#ffe14d'
      const o = s * cols
      for (let x = 0; x < cols; x++) if (data[o + x]) ctx.fillRect(x * cell, s * cell, cell, cell)
      ctx.fillRect(0, s * cell + cell, W, 1)
    }
  }

  function frame() {
    const r = section.getBoundingClientRect()
    if (r.bottom < 0 || r.top > innerHeight) return
    if (!cols || Math.abs(canvas.getBoundingClientRect().width - W) > 1) size()
    const p = clamp((innerHeight - r.top) / r.height, 0, 1)
    const s = Math.round(clamp(p * 1.25, 0, 1) * rows)
    if (s !== shown || dirty) {
      draw(s)
      shown = s
      dirty = false
    }
    const bin = pad(rule.toString(2), 8)
    status.set('rule', `rule ${pad(rule, 3)} · ${bin} · row ${pad(Math.min(s, rows), 3)}/${rows}`)
  }

  const onResize = () => {
    cols = 0
  }
  addEventListener('resize', onResize)

  return {
    frame,
    setRule(n) {
      rule = n & 255
      if (cols) compute()
    },
    destroy() {
      removeEventListener('resize', onResize)
    },
  }
}
