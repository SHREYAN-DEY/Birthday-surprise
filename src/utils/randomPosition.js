// Stable "random" numbers: same input, same output (no jumping on re-render)
export function seeded(i, salt = 1) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function rectsOverlap(a, b, pad = 0) {
  return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom)
}

// Picks a top-left position that keeps a box fully inside the viewport,
// away from the rectangles in `avoid`, and a minimum distance from where it was.
export function pickSafePosition({ width, height, vw, vh, avoid = [], from = null, margin = 12, minTravel = 140, tries = 40 }) {
  const maxX = Math.max(margin, vw - width - margin)
  const maxY = Math.max(margin, vh - height - margin)
  const box = (x, y) => ({ left: x, top: y, right: x + width, bottom: y + height })
  const clear = (x, y) => !avoid.some((a) => rectsOverlap(box(x, y), a, 16))

  for (let i = 0; i < tries; i++) {
    const x = margin + Math.random() * (maxX - margin)
    const y = margin + Math.random() * (maxY - margin)
    if (!clear(x, y)) continue
    if (from && Math.hypot(x - from.x, y - from.y) < minTravel) continue
    return { x, y }
  }
  // Fallback: the corner farthest from where we were that doesn't cover anything important
  const corners = [
    { x: margin, y: margin }, { x: maxX, y: margin }, { x: margin, y: maxY }, { x: maxX, y: maxY },
  ]
  const free = corners.filter((c) => clear(c.x, c.y))
  const pool = free.length ? free : corners
  if (!from) return pool[0]
  return pool.sort((a, b) => Math.hypot(b.x - from.x, b.y - from.y) - Math.hypot(a.x - from.x, a.y - from.y))[0]
}
