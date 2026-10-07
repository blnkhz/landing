import { useEffect, useRef } from 'react'
import { REDUCED } from '../lib/life'
import { onFrame } from '../lib/loop'

// four phases of a glider heading south-east, row by row
const PHASES = ['010001111', '101011010', '001101011', '100011110']

export default function GliderCursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (REDUCED || matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    const dots = [...el.children]
    let tx = -100
    let ty = -100
    let x = -100
    let y = -100
    let dist = 0
    let phase = 0
    let rot = 0
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const dx = e.clientX - tx
      const dy = e.clientY - ty
      const d = Math.hypot(dx, dy)
      dist += d
      // a glider only travels diagonally, so snap its heading to the nearest diagonal
      if (d > 2) rot = (Math.round((Math.atan2(dy, dx) - Math.PI / 4) / (Math.PI / 2)) * 90 + 360) % 360
      tx = e.clientX
      ty = e.clientY
      el.style.opacity = 1
    }
    const onLeave = () => {
      el.style.opacity = 0
    }
    addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    const off = onFrame(() => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      if (dist > 26) {
        dist = 0
        phase = (phase + 1) % 4
        dots.forEach((dot, i) => dot.classList.toggle('on', PHASES[phase][i] === '1'))
      }
      el.style.transform = `translate3d(${(x + 14).toFixed(1)}px,${(y + 14).toFixed(1)}px,0) rotate(${rot}deg)`
    })
    return () => {
      off()
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="glider" ref={ref} aria-hidden="true">
      {[...PHASES[0]].map((v, i) => (
        <i key={i} className={v === '1' ? 'on' : undefined} />
      ))}
    </div>
  )
}
