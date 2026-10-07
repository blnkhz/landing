import { useEffect, useRef } from 'react'
import { createMesh } from '../lib/mesh'
import { onFrame } from '../lib/loop'

export default function MeshGradient() {
  const ref = useRef(null)

  useEffect(() => {
    const mesh = createMesh(ref.current)
    // without WebGL the body's CSS gradient fallback shows through
    if (!mesh) {
      ref.current.hidden = true
      return
    }
    const off = onFrame((now, _dt, progress) => mesh.frame(now, progress))
    return () => {
      off()
      mesh.destroy()
    }
  }, [])

  return <canvas id="mesh" ref={ref} aria-hidden="true" />
}
