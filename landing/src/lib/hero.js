import { DISPLAY, INK, clamp, lifeStep, pad } from './life'
import { status } from './status'

const WORD = 'BLNKHZ'
const MAX_GEN = 200
// Generations computed per animation frame while scrolling; a fast fling catches up
// over a few frames instead of computing up to 200 generations in one long task.
const GENS_PER_FRAME = 6
const BALLS = 3
const R_PENTOMINO = [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]]
// how strongly the last few generations linger, newest first
const LEVELS = [1, 0.42, 0.2, 0.08]

/**
 * The hero: the name, rasterised into a cell grid, is generation zero of Life.
 * Scroll position picks the generation. A breakout mode turns live cells into bricks.
 * Game state is reported through `onGame({ mode, message, again })` so React can
 * render the controls; mode is 'idle' | 'playing' | 'over'.
 */
export function createHero({ section, stage, canvas, fill, onGame }) {
  const ctx = canvas.getContext('2d')
  const measure = document.createElement('canvas').getContext('2d')
  let cols = 0
  let rows = 0
  let cell = 6
  let gens = []
  let drawn = -1
  let current = 0
  let lastW = 0
  let cw = 0
  let ch = 0
  let dpr = 1
  let G = null
  let destroyed = false

  /* ---------- the name as generation zero ---------- */

  function drawWord(c, W, H, word) {
    measure.font = `100px ${DISPLAY}`
    const mt = measure.measureText(word)
    const fs = Math.min((100 * (W * 0.9)) / mt.width, H * 0.5)
    const asc = ((mt.actualBoundingBoxAscent || 70) * fs) / 100
    const desc = ((mt.actualBoundingBoxDescent || 5) * fs) / 100
    c.font = `${fs}px ${DISPLAY}`
    c.textAlign = 'center'
    c.textBaseline = 'alphabetic'
    c.fillText(word, W / 2, H * 0.47 + (asc - desc) / 2)
  }

  // Edge pixels get a jittered threshold, so outlines fray like ink bleeding into paper.
  function rasterise(word) {
    const off = document.createElement('canvas')
    off.width = cols
    off.height = rows
    const o = off.getContext('2d')
    o.scale(1 / cell, 1 / cell)
    o.fillStyle = '#000'
    drawWord(o, cw, ch, word)
    const px = o.getImageData(0, 0, cols, rows).data
    const g = new Uint8Array(cols * rows)
    let pop = 0
    for (let i = 0; i < g.length; i++) {
      const a = px[i * 4 + 3]
      const v = a > 20 && a > 70 + Math.random() * 140 ? 1 : 0
      g[i] = v
      pop += v
    }
    g.pop = pop
    return g
  }

  function build() {
    const W = stage.clientWidth
    const H = stage.clientHeight
    lastW = W
    cell = W < 600 ? 4 : W < 1100 ? 5 : 6
    cols = Math.ceil(W / cell)
    rows = Math.ceil(H / cell)
    cw = cols * cell
    ch = rows * cell
    dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = Math.round(cw * dpr)
    canvas.height = Math.round(ch * dpr)
    canvas.style.width = cw + 'px'
    canvas.style.height = ch + 'px'
    stage.style.setProperty('--cell', cell + 'px')
    gens = [rasterise(WORD)]
    drawn = -1
    schedulePrecompute()
  }

  function ensure(g, budget = Infinity) {
    while (gens.length <= g && budget-- > 0) gens.push(lifeStep(gens[gens.length - 1], cols, rows, false))
    return Math.min(g, gens.length - 1)
  }

  // Fill the generation cache ahead of the visitor while the main thread is idle.
  let idleHandle = 0
  const idle = window.requestIdleCallback || ((cb) => setTimeout(() => cb({ timeRemaining: () => 8 }), 50))
  const cancelIdle = window.cancelIdleCallback || clearTimeout
  function precompute(deadline) {
    idleHandle = 0
    while (gens.length <= MAX_GEN && deadline.timeRemaining() > 4) {
      gens.push(lifeStep(gens[gens.length - 1], cols, rows, false))
    }
    schedulePrecompute()
  }
  function schedulePrecompute() {
    if (!idleHandle && cols && gens.length <= MAX_GEN) idleHandle = idle(precompute)
  }

  // Each cell is a square with a hairline gap, so the grid reads as a pixel mesh.
  function render(g) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cw, ch)
    const s = cell - (cell >= 5 ? 1 : 0.75)
    const layers = [gens[g], gens[g - 1], gens[g - 2], gens[g - 3]]
    for (let L = 3; L >= 0; L--) {
      const cur = layers[L]
      if (!cur) continue
      ctx.fillStyle = `rgba(${INK},${LEVELS[L]})`
      ctx.beginPath()
      for (let y = 0, i = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++, i++) {
          if (!cur[i]) continue
          let newer = false
          for (let k = 0; k < L; k++) {
            if (layers[k] && layers[k][i]) {
              newer = true
              break
            }
          }
          if (!newer) ctx.rect(x * cell, y * cell, s, s)
        }
      }
      ctx.fill()
    }
    drawn = g
  }

  function frame() {
    if (!cols) return
    if (G) {
      tick()
      return
    }
    const r = section.getBoundingClientRect()
    if (r.bottom <= 0 || r.top >= innerHeight) return
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1)
    const g = ensure(Math.round(p * MAX_GEN), GENS_PER_FRAME)
    current = g
    if (g !== drawn) render(g)
    fill.style.width = (p * 100).toFixed(2) + '%'
    status.set('hero', `gen ${pad(g, 4)} · pop ${pad(gens[g].pop, 5)} · B3/S23`)
  }

  // Drop an R-pentomino (a long-lived methuselah) where the visitor clicks.
  function onCanvasDown(ev) {
    if (G || !cols) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((ev.clientX - rect.left) / cell)
    const y = Math.floor((ev.clientY - rect.top) / cell)
    const g = current
    ensure(g)
    const grid = Uint8Array.from(gens[g])
    for (const [dx, dy] of R_PENTOMINO) {
      const xx = x + dx - 1
      const yy = y + dy - 1
      if (xx >= 0 && yy >= 0 && xx < cols && yy < rows) grid[yy * cols + xx] = 1
    }
    grid.pop = grid.reduce((a, v) => a + v, 0)
    gens.length = g
    gens.push(grid)
    render(g)
    schedulePrecompute()
  }

  /* ---------- breakout: the cells on screen become the bricks ---------- */

  function lockScroll(on) {
    document.documentElement.classList.toggle('breakout', on)
    document.documentElement.style.overflow = on ? 'hidden' : ''
  }

  function startGame(board) {
    ensure(current)
    const grid = Uint8Array.from(board || gens[current])
    const start = grid.reduce((a, v) => a + v, 0)
    G = {
      grid,
      start,
      left: start,
      cleared: 0,
      balls: BALLS,
      served: false,
      over: false,
      lost: false,
      px: cw / 2,
      pw: clamp(cw * 0.13, cell * 18, 190),
      py: ch - clamp(ch * 0.1, 60, 96),
      ph: cell * 2,
      bx: 0,
      by: 0,
      vx: 0,
      vy: 0,
      bs: cell * 2,
      speed: clamp(cw * 0.45, 340, 620),
      bits: [],
      last: performance.now(),
      keys: { l: false, r: false },
    }
    lockScroll(true)
    onGame({ mode: 'playing', message: 'move to aim · click, tap or space to serve' })
  }

  function serve() {
    if (!G || G.served || G.over) return
    const a = (Math.random() - 0.5) * 0.9
    G.vx = G.speed * Math.sin(a)
    G.vy = -G.speed * Math.cos(a)
    G.served = true
    onGame({ mode: 'playing', message: 'every cell you break is gone from the automaton too' })
  }

  function endGame(win) {
    G.over = true
    G.served = false
    G.lost = !win
    if (win) {
      onGame({ mode: 'over', message: `Cleared every one of ${G.start} cells.`, again: 'play again' })
      return
    }
    // the surviving bricks rearrange themselves into the verdict, cell by cell
    G.target = rasterise('game over')
    G.order = new Float32Array(G.grid.length).map(() => Math.random())
    G.reveal = 0
    onGame({
      mode: 'over',
      message: `Out of balls. You broke ${G.cleared} of ${G.start} cells.`,
      again: 'retry',
    })
  }

  // a fresh BLNKHZ board (new frayed edges), straight back to the serve
  function retry() {
    G = null
    build()
    startGame(gens[0])
  }

  function quitGame() {
    if (!G) return
    if (G.lost) {
      build()
    } else {
      // what's left of the board becomes this generation; later ones recompute from it
      G.grid.pop = G.left
      gens.length = current
      gens.push(G.grid)
    }
    schedulePrecompute()
    G = null
    lockScroll(false)
    ensure(current)
    render(current)
    onGame({ mode: 'idle' })
  }

  function smash(cx, cy) {
    const g = G.grid
    let n = 0
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx * dx + dy * dy > 5) continue
        const x = cx + dx
        const y = cy + dy
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue
        const i = y * cols + x
        if (!g[i]) continue
        g[i] = 0
        n++
        G.bits.push({
          x: x * cell,
          y: y * cell,
          vx: (Math.random() - 0.5) * 220 + G.vx * 0.15,
          vy: -Math.random() * 180,
          life: 1,
        })
      }
    }
    G.cleared += n
    G.left -= n
    if (G.left <= 0) endGame(true)
  }

  function hit() {
    const x0 = Math.floor(G.bx / cell)
    const x1 = Math.floor((G.bx + G.bs - 0.01) / cell)
    const y0 = Math.floor(G.by / cell)
    const y1 = Math.floor((G.by + G.bs - 0.01) / cell)
    for (let y = Math.max(0, y0); y <= Math.min(rows - 1, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(cols - 1, x1); x++) {
        if (G.grid[y * cols + x]) {
          smash(x, y)
          return true
        }
      }
    }
    return false
  }

  function moveBall(dt) {
    const sp = Math.hypot(G.vx, G.vy)
    const steps = Math.max(1, Math.ceil((sp * dt) / (cell * 0.5)))
    const h = dt / steps
    for (let s = 0; s < steps && G.served; s++) {
      G.bx += G.vx * h
      if (G.bx < 0) {
        G.bx = 0
        G.vx = Math.abs(G.vx)
      }
      if (G.bx + G.bs > cw) {
        G.bx = cw - G.bs
        G.vx = -Math.abs(G.vx)
      }
      if (hit()) {
        G.bx -= G.vx * h
        G.vx = -G.vx
      }
      G.by += G.vy * h
      if (G.by < 0) {
        G.by = 0
        G.vy = Math.abs(G.vy)
      }
      if (hit()) {
        G.by -= G.vy * h
        G.vy = -G.vy
      }
      // where the ball lands on the paddle sets the angle; each return is a touch faster
      if (
        G.vy > 0 &&
        G.by + G.bs >= G.py &&
        G.by + G.bs <= G.py + G.ph + 4 &&
        G.bx + G.bs >= G.px - G.pw / 2 &&
        G.bx <= G.px + G.pw / 2
      ) {
        const off = clamp((G.bx + G.bs / 2 - G.px) / (G.pw / 2), -1, 1)
        const ns = Math.min(Math.hypot(G.vx, G.vy) * 1.025, G.speed * 1.9)
        G.vx = ns * Math.sin(off * 1.05)
        G.vy = -ns * Math.cos(off * 1.05)
        G.by = G.py - G.bs
      }
      if (G.by > ch) {
        G.balls--
        G.served = false
        G.vx = G.vy = 0
        if (G.balls <= 0) endGame(false)
        else onGame({ mode: 'playing', message: 'ball lost · serve again' })
      }
    }
  }

  function morphToGameOver(dt) {
    G.reveal = Math.min(1, G.reveal + dt * 0.9)
    const g = G.grid
    const t = G.target
    const o = G.order
    for (let i = 0; i < g.length; i++) {
      if (o[i] > G.reveal || g[i] === t[i]) continue
      if (g[i] && Math.random() < 0.25 && G.bits.length < 1500) {
        G.bits.push({
          x: (i % cols) * cell,
          y: Math.floor(i / cols) * cell,
          vx: (Math.random() - 0.5) * 160,
          vy: -Math.random() * 120,
          life: 1,
        })
      }
      g[i] = t[i]
    }
  }

  function tick() {
    const now = performance.now()
    const dt = Math.min(0.033, (now - G.last) / 1000)
    G.last = now
    if (G.keys.l) G.px -= 900 * dt
    if (G.keys.r) G.px += 900 * dt
    G.px = clamp(G.px, G.pw / 2, cw - G.pw / 2)
    if (G.served) {
      moveBall(dt)
    } else {
      G.bx = G.px - G.bs / 2
      G.by = G.py - G.bs - 2
    }
    if (G.lost && G.reveal < 1) morphToGameOver(dt)
    for (const b of G.bits) {
      b.vy += 900 * dt
      b.x += b.vx * dt
      b.y += b.vy * dt
      b.life -= dt * 1.4
    }
    G.bits = G.bits.filter((b) => b.life > 0 && b.y < ch)
    drawGame()
    const balls = '●'.repeat(Math.max(0, G.balls)) + '○'.repeat(BALLS - Math.max(0, G.balls))
    status.set(
      'hero',
      G.lost
        ? `breakout · game over · broke ${pad(G.cleared, 4)}`
        : `breakout · broke ${pad(G.cleared, 4)} · left ${pad(G.left, 4)} · ${balls}`,
    )
  }

  function drawGame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cw, ch)
    const s = cell - (cell >= 5 ? 1 : 0.75)
    const g = G.grid
    ctx.fillStyle = `rgb(${INK})`
    ctx.beginPath()
    for (let y = 0, i = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++, i++) if (g[i]) ctx.rect(x * cell, y * cell, s, s)
    }
    if (!G.over) {
      // the paddle is built from cells like everything else
      const p0 = Math.round((G.px - G.pw / 2) / cell)
      const p1 = Math.round((G.px + G.pw / 2) / cell)
      for (let x = p0; x < p1; x++) {
        for (let r = 0; r < 2; r++) ctx.rect(x * cell, G.py + r * cell, s, s)
      }
    }
    ctx.fill()
    for (const b of G.bits) {
      ctx.fillStyle = `rgba(${INK},${b.life * 0.8})`
      ctx.fillRect(b.x, b.y, s, s)
    }
    if (G.over) return
    ctx.fillStyle = '#ff48b0'
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) ctx.fillRect(G.bx + c * cell, G.by + r * cell, s, s)
    }
  }

  /* ---------- input ---------- */

  const preventScroll = (e) => {
    if (G) e.preventDefault()
  }
  const paddleTo = (e) => {
    if (G) G.px = e.clientX - canvas.getBoundingClientRect().left
  }
  const onStageDown = (e) => {
    if (!G || e.target.closest('button')) return
    paddleTo(e)
    serve()
  }
  const onKeyDown = (e) => {
    if (!G) return
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      G.keys.l = true
      e.preventDefault()
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      G.keys.r = true
      e.preventDefault()
    } else if (e.key === ' ' && !e.target.closest('button')) {
      serve()
      e.preventDefault()
    } else if (e.key === 'Escape') {
      quitGame()
    } else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
    }
  }
  const onKeyUp = (e) => {
    if (!G) return
    if (e.key === 'ArrowLeft' || e.key === 'a') G.keys.l = false
    if (e.key === 'ArrowRight' || e.key === 'd') G.keys.r = false
  }
  let resizeTimer
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (cols && stage.clientWidth === lastW) return
      quitGame()
      build()
    }, 150)
  }

  canvas.addEventListener('pointerdown', onCanvasDown)
  stage.addEventListener('pointermove', paddleTo)
  stage.addEventListener('pointerdown', onStageDown)
  addEventListener('wheel', preventScroll, { passive: false })
  addEventListener('touchmove', preventScroll, { passive: false })
  addEventListener('keydown', onKeyDown)
  addEventListener('keyup', onKeyUp)
  addEventListener('resize', onResize)

  // The grid is rasterised from the display face, so wait for it (but not forever).
  const fontReady = document.fonts?.load
    ? Promise.race([document.fonts.load(`100px ${DISPLAY}`), new Promise((r) => setTimeout(r, 2500))])
    : Promise.resolve()
  fontReady.catch(() => {}).then(() => {
    if (!destroyed) build()
  })

  return {
    frame,
    start: () => startGame(),
    retry,
    quit: quitGame,
    destroy() {
      destroyed = true
      clearTimeout(resizeTimer)
      if (idleHandle) cancelIdle(idleHandle)
      if (G) lockScroll(false)
      G = null
      canvas.removeEventListener('pointerdown', onCanvasDown)
      stage.removeEventListener('pointermove', paddleTo)
      stage.removeEventListener('pointerdown', onStageDown)
      removeEventListener('wheel', preventScroll)
      removeEventListener('touchmove', preventScroll)
      removeEventListener('keydown', onKeyDown)
      removeEventListener('keyup', onKeyUp)
      removeEventListener('resize', onResize)
    },
  }
}
