import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { pickSafePosition } from '../../utils/randomPosition.js'

// The NO button. On mouse/touch it hops away, but it always:
//  - stays fully inside the viewport (so there is never sideways scrolling)
//  - lands away from the YES button and the question text (`avoidRefs`)
//  - can still be reached by keyboard: pressing Enter makes it hop instead of getting stuck
//  - stands still if the visitor prefers reduced motion (it just reacts with a message)
export default function RunawayButton({ children, onTry, avoidRefs = [], className = '', ...props }) {
  const reduce = useReducedMotion()
  const btnRef = useRef(null)
  const lastMove = useRef(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [fixed, setFixed] = useState(false)
  const [size, setSize] = useState(null)
  const avoidRef = useRef(avoidRefs)
  avoidRef.current = avoidRefs

  const run = useCallback(() => {
    onTry?.()
    if (reduce) return
    const now = performance.now()
    if (now - lastMove.current < 250) return
    lastMove.current = now
    const el = btnRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (!fixed) {
      setSize({ w: rect.width, h: rect.height })
      x.set(rect.left)
      y.set(rect.top)
      setFixed(true)
    }
    const avoid = avoidRef.current.map((r) => r.current?.getBoundingClientRect()).filter(Boolean)
    const next = pickSafePosition({
      width: rect.width, height: rect.height,
      vw: window.innerWidth, vh: window.innerHeight,
      avoid, from: { x: rect.left, y: rect.top },
    })
    animate(x, next.x, { type: 'spring', stiffness: 260, damping: 20 })
    animate(y, next.y, { type: 'spring', stiffness: 260, damping: 20 })
  }, [fixed, onTry, reduce, x, y])

  // Mouse users: hop away when the pointer gets close
  useEffect(() => {
    if (reduce) return undefined
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const el = btnRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
      if (d < Math.max(r.width, r.height) * 0.9) run()
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, run])

  // Keep it on screen if the window is resized or the phone is rotated
  useEffect(() => {
    if (!fixed) return undefined
    const onResize = () => {
      const el = btnRef.current
      if (!el) return
      x.set(Math.min(Math.max(12, x.get()), Math.max(12, window.innerWidth - el.offsetWidth - 12)))
      y.set(Math.min(Math.max(12, y.get()), Math.max(12, window.innerHeight - el.offsetHeight - 12)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fixed, x, y])

  return (
    <span className="inline-block" style={fixed && size ? { width: size.w, height: size.h } : undefined}>
      <motion.button
        ref={btnRef}
        type="button"
        onPointerDown={run}
        onClick={run}
        style={fixed ? { position: 'fixed', left: 0, top: 0, x, y, zIndex: 40 } : undefined}
        className={`min-h-12 min-w-12 cursor-pointer rounded-full border-2 border-sky-mid bg-cloud px-6 py-2 text-lg font-bold text-ink shadow-[0_4px_0_rgba(58,74,99,0.18)] ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    </span>
  )
}
