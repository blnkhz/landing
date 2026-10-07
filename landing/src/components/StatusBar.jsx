import { useEffect, useRef } from 'react'
import { status } from '../lib/status'
import { onFrame } from '../lib/loop'

export default function StatusBar() {
  const ref = useRef(null)

  useEffect(() => {
    status.attach(ref.current)
    return onFrame(() => status.pick())
  }, [])

  return (
    <header className="bar">
      <span id="status" ref={ref}>
        gen 0000 · pop 00000 · B3/S23
      </span>
      <nav aria-label="Sections">
        <a href="#hi">say hi</a>
      </nav>
    </header>
  )
}
