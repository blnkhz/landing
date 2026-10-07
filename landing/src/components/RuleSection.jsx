import { useEffect, useRef, useState } from 'react'
import { createRule } from '../lib/rule'
import { status } from '../lib/status'
import { onFrame } from '../lib/loop'
import { pad } from '../lib/life'

const PRESETS = [30, 45, 73, 90, 110, 150]
// the eight neighbourhoods, 111 down to 000 (Wolfram order)
const LAWS = [7, 6, 5, 4, 3, 2, 1, 0].map((k) => ({ k, bits: [(k >> 2) & 1, (k >> 1) & 1, k & 1] }))

export default function RuleSection() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [rule, setRule] = useState(30)

  useEffect(() => {
    const engine = createRule({ section: sectionRef.current, canvas: canvasRef.current })
    engineRef.current = engine
    const unregister = status.register('rule', sectionRef.current)
    const off = onFrame(() => engine.frame())
    return () => {
      off()
      unregister()
      engine.destroy()
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setRule(rule)
  }, [rule])

  return (
    <section className="rule" id="rule" ref={sectionRef} aria-labelledby="rule-title">
      <div className="pin">
        <canvas id="weave" ref={canvasRef} aria-hidden="true" />
        <div className="rule-panel">
          <p className="eyebrow">elementary automaton</p>
          <h2 id="rule-title">Rule {rule}</h2>
          <p>
            Each row is the row above, rewritten by eight laws. A cell looks at itself and its two
            neighbours, then lives or dies. Click any law to flip it.
          </p>
          <div className="binary">{pad(rule.toString(2), 8)}</div>
          <div className="table">
            {LAWS.map(({ k, bits }) => {
              const on = (rule >> k) & 1
              return (
                <button
                  key={k}
                  className="law"
                  type="button"
                  aria-label={`Neighbourhood ${bits.join('')} becomes ${on}. Click to flip.`}
                  onClick={() => setRule((r) => r ^ (1 << k))}
                >
                  <span className="in">
                    {bits.map((b, i) => (
                      <i key={i} className={b ? 'on' : undefined} />
                    ))}
                  </span>
                  <span className={on ? 'out on' : 'out'} />
                </button>
              )
            })}
          </div>
          <div className="chips">
            {PRESETS.map((p) => (
              <button key={p} className="chip" type="button" aria-pressed={p === rule} onClick={() => setRule(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
