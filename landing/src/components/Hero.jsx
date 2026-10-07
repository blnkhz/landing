import { useEffect, useRef, useState } from 'react'
import { createHero } from '../lib/hero'
import { status } from '../lib/status'
import { onFrame } from '../lib/loop'

export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const fillRef = useRef(null)
  const engineRef = useRef(null)
  const playRef = useRef(null)
  const againRef = useRef(null)
  const [game, setGame] = useState({ mode: 'idle' })

  useEffect(() => {
    const engine = createHero({
      section: sectionRef.current,
      stage: stageRef.current,
      canvas: canvasRef.current,
      fill: fillRef.current,
      onGame: setGame,
    })
    engineRef.current = engine
    const unregister = status.register('hero', sectionRef.current)
    const off = onFrame(() => engine.frame())
    return () => {
      off()
      unregister()
      engine.destroy()
    }
  }, [])

  // keep keyboard focus where the next action is
  const wasPlaying = useRef(false)
  useEffect(() => {
    if (game.mode === 'over') againRef.current?.focus({ preventScroll: true })
    if (game.mode === 'idle' && wasPlaying.current)
      playRef.current?.focus({ preventScroll: true })
    wasPlaying.current = game.mode !== 'idle'
  }, [game.mode])

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-labelledby="name">
      <div className="stage" ref={stageRef}>
        <canvas id="cells" ref={canvasRef} aria-hidden="true" />
        <h1 className="sr" id="name">
          BLNKHZ, Blanka Hooz
        </h1>
        <div className="hero-foot">
          <p>
            blanka hooz · software engineer
            <br />
            budapest, hungary ✈ los angeles, ca
          </p>
          <button
            className="pong-btn"
            ref={playRef}
            type="button"
            onClick={() => engineRef.current.start()}
          >
            ▸ play pong
          </button>
          <p className="hint">
            scroll advances the generations
            <br />
            click to drop an r-pentomino
          </p>
        </div>
        <div className="pong-ui" hidden={game.mode === 'idle'}>
          <p aria-live="polite">{game.message}</p>
          <div className="pong-actions">
            {game.mode === 'over' && (
              <button
                className="pong-btn"
                ref={againRef}
                type="button"
                onClick={() => engineRef.current.retry()}
              >
                {game.again}
              </button>
            )}
            <button
              className="pong-btn ghost"
              type="button"
              onClick={() => engineRef.current.quit()}
            >
              quit · esc
            </button>
          </div>
        </div>
        <div className="genbar" aria-hidden="true">
          <i ref={fillRef} />
        </div>
      </div>
    </section>
  )
}
