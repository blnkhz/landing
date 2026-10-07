// The top bar shows a live readout from whichever automaton is under the middle
// of the viewport. Sections register themselves; their engines write text every
// frame, so this bypasses React state and touches the DOM node directly.
const FALLBACK = 'B3/S23 · birth on 3 · survive on 2 or 3'
const sections = new Map()
let node = null
let owner = 'none'

export const status = {
  attach(el) {
    node = el
  },
  register(name, el) {
    sections.set(name, el)
    return () => sections.delete(name)
  },
  set(name, text) {
    if (name === owner && node && node.textContent !== text) node.textContent = text
  },
  pick() {
    const mid = innerHeight / 2
    for (const [name, el] of sections) {
      const r = el.getBoundingClientRect()
      if (r.top <= mid && r.bottom >= mid) {
        owner = name
        if (node) delete node.dataset.idle
        return
      }
    }
    owner = 'none'
    if (!node) return
    // marked idle so CSS can drop the generic rule text on small screens
    node.dataset.idle = ''
    if (node.textContent !== FALLBACK) node.textContent = FALLBACK
  },
}
