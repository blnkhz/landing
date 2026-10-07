import { useEffect, useRef, useState } from 'react'
import { createLifeField } from '../lib/lifeField'
import { status } from '../lib/status'
import { onFrame } from '../lib/loop'
import { REDUCED } from '../lib/life'
import { links } from '../content'

export default function SayHi() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  // the prerendered HTML can't know the visitor's motion preference, so start
  // running everywhere and pause after hydration if they asked for less motion
  const [running, setRunning] = useState(true)
  useEffect(() => {
    if (REDUCED) setRunning(false)
  }, [])

  useEffect(() => {
    const engine = createLifeField({
      section: sectionRef.current,
      canvas: canvasRef.current,
    })
    engineRef.current = engine
    const unregister = status.register('life', sectionRef.current)
    const off = onFrame((_now, dt) => engine.frame(dt))
    return () => {
      off()
      unregister()
      engine.destroy()
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setRunning(running)
  }, [running])

  return (
    <section className="hi" id="hi" ref={sectionRef} aria-labelledby="hi-title">
      <canvas
        id="life"
        ref={canvasRef}
        aria-label="Game of Life field. Drag to draw living cells."
      />
      <div className="hi-card">
        <p className="eyebrow">contact</p>
        <h2 className="hi-title" id="hi-title">
          say hi
        </h2>
        <div className="hi-links">
          <a href={links.linkedin} target="_blank" rel="noopener">
            linkedin
          </a>
          <a href="mailto:hooz.blanka@gmail.com" target="_blank" rel="noopener">
            email
          </a>
        </div>
      </div>
      <div className="hi-controls" role="group" aria-label="Life controls">
        <button
          className="chip"
          type="button"
          aria-pressed={!running}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? 'pause' : 'play'}
        </button>
        <button
          className="chip"
          type="button"
          onClick={() => engineRef.current?.reseed()}
        >
          reseed
        </button>
      </div>
    </section>
  )
}
