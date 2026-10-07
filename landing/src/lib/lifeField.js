import { INK, lifeStep, pad } from './life'
import { status } from './status'

const DENSITY = 0.08
const TICK_MS = 150

/**
 * A quiet, live Game of Life behind the contact card. Same gapped pixel mesh as
 * the hero, in a softer ink. Drag to draw cells.
 */
export function createLifeField({ section, canvas }) {
  const ctx = canvas.getContext('2d')
  let cols = 0
  let rows = 0
  let cell = 10
  let grid
  let trail
  let gen = 0
  let running = true
  let visible = false
  let acc = 0
  let lastW = 0
  let W = 0
  let H = 0
  let dpr = 1
  let painting = false

  function soup() {
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < DENSITY ? 1 : 0
    trail.fill(0)
    gen = 0
  }

  function size() {
    const r = canvas.getBoundingClientRect()
    lastW = W = r.width
    H = r.height
    dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    cell = W < 600 ? 7 : 10
    cols = Math.ceil(W / cell)
    rows = Math.ceil(H / cell)
    grid = new Uint8Array(cols * rows)
    trail = new Float32Array(cols * rows)
    soup()
    draw()
  }

  function step() {
    const next = lifeStep(grid, cols, rows, true)
    for (let i = 0; i < grid.length; i++) trail[i] = grid[i] && !next[i] ? 1 : trail[i] * 0.7
    grid = next
    gen++
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const s = cell - 1
    let pop = 0
    ctx.fillStyle = `rgba(${INK},.1)`
    ctx.beginPath()
    for (let i = 0; i < grid.length; i++) {
      if (!grid[i] && trail[i] > 0.1) ctx.rect((i % cols) * cell, ((i / cols) | 0) * cell, s, s)
    }
    ctx.fill()
    ctx.fillStyle = `rgba(${INK},.38)`
    ctx.beginPath()
    for (let i = 0; i < grid.length; i++) {
      if (!grid[i]) continue
      pop++
      ctx.rect((i % cols) * cell, ((i / cols) | 0) * cell, s, s)
    }
    ctx.fill()
    status.set('life', `gen ${pad(gen, 5)} · pop ${pad(pop, 5)} · B3/S23`)
  }

  function frame(dt) {
    if (!visible) return
    if (!cols || Math.abs(canvas.getBoundingClientRect().width - lastW) > 1) size()
    if (!running) return
    acc += dt
    if (acc > TICK_MS) {
      acc = 0
      step()
      draw()
    }
  }

  function paint(ev) {
    if (!cols) return
    const r = canvas.getBoundingClientRect()
    const x = Math.floor((ev.clientX - r.left) / cell)
    const y = Math.floor((ev.clientY - r.top) / cell)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (Math.random() < 0.55 || (dx === 0 && dy === 0)) {
          grid[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)] = 1
        }
      }
    }
    draw()
  }
  const onDown = (e) => {
    painting = true
    canvas.setPointerCapture?.(e.pointerId)
    paint(e)
  }
  const onMove = (e) => {
    if (painting) paint(e)
  }
  const onUp = () => {
    painting = false
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointercancel', onUp)
  addEventListener('pointerup', onUp)

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting
      if (visible && !cols) size()
    },
    { rootMargin: '100px' },
  )
  io.observe(section)

  return {
    frame,
    setRunning(v) {
      running = v
    },
    reseed() {
      if (!cols) return
      soup()
      draw()
    },
    destroy() {
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointercancel', onUp)
      removeEventListener('pointerup', onUp)
    },
  }
}
