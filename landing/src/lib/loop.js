import { clamp } from './life'

// A single requestAnimationFrame loop shared by every animated piece of the page.
// Subscribers get (now, dt in ms, page scroll progress 0..1).
const subscribers = new Set()
let raf = 0
let prev = 0

function tick(now) {
  const dt = Math.min(100, now - prev)
  prev = now
  const max = document.documentElement.scrollHeight - innerHeight
  const progress = max > 0 ? clamp(scrollY / max, 0, 1) : 0
  for (const fn of subscribers) fn(now, dt, progress)
  raf = requestAnimationFrame(tick)
}

export function onFrame(fn) {
  subscribers.add(fn)
  if (!raf) {
    prev = performance.now()
    raf = requestAnimationFrame(tick)
  }
  return () => {
    subscribers.delete(fn)
    if (!subscribers.size) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}
