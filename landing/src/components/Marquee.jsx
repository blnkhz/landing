import { useEffect, useRef } from 'react'
import { REDUCED, clamp } from '../lib/life'
import { onFrame } from '../lib/loop'
import { createBlockLife } from '../lib/blockLife'

const LINES = 4
const CHARS = 48
const TICK_MS = 140

export default function Marquee() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const lifeRef = useRef(null)
  // seeded, so this first render matches the prerendered HTML exactly
  if (!lifeRef.current) lifeRef.current = createBlockLife({ lines: LINES, chars: CHARS, seed: 30 })
  const initial = lifeRef.current.text()

  useEffect(() => {
    const track = trackRef.current
    const lineEls = [...track.children]
    const life = lifeRef.current
    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(sectionRef.current)

    let skew = 0
    let last = scrollY
    let acc = 0
    const off = onFrame((_now, dt) => {
      // driven by scroll position, sheared by scroll velocity
      const y = scrollY
      const v = y - last
      last = y
      const half = track.scrollWidth / 2 || 1
      const x = -((y * 0.5) % half)
      skew += ((REDUCED ? 0 : clamp(-v * 0.35, -14, 14)) - skew) * 0.12
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`

      if (!visible || REDUCED) return
      acc += dt
      if (acc < TICK_MS) return
      acc = 0
      life.step()
      life.text().forEach((s, i) => {
        lineEls[i].textContent = s
      })
    })
    return () => {
      off()
      io.disconnect()
    }
  }, [])

  return (
    <div className="marquee" ref={sectionRef} aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {initial.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  )
}
