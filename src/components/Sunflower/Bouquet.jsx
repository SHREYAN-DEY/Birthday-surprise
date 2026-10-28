import { useEffect, useMemo } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import SunflowerHead from './SunflowerHead.jsx'
import Bow from '../Doodles/Bow.jsx'
import Sparkles from '../Sparkles/Sparkles.jsx'
import { seeded } from '../../utils/randomPosition.js'
import { bouquetBounce } from '../../animations/flowerAnimations.js'

const W = 300
const H = 330
const BASE = { x: 150, y: 300 }

// `count` flowers fanned out from one point. ribbon: 'none' | 'loose' | 'tied'
// Bump `bounceKey` to make the whole bouquet hop.
export default function Bouquet({ count, ribbon = 'none', bounceKey = 0, containerRef, className = 'w-64' }) {
  const controls = useAnimationControls()
  useEffect(() => {
    if (bounceKey) controls.start({ y: bouquetBounce, transition: { duration: 0.8 } })
  }, [bounceKey, controls])

  const heads = useMemo(
    () =>
      Array.from({ length: count }, (_, k) => {
        const t = count === 1 ? 0.5 : k / (count - 1)
        const a = (((t - 0.5) * 76 + (seeded(k, 6) - 0.5) * 10) * Math.PI) / 180
        const R = 105 + (k % 2) * 22 + seeded(k, 7) * 14
        return { k, x: BASE.x + Math.sin(a) * R, y: BASE.y - Math.cos(a) * R, size: 80 + seeded(k, 8) * 16, rot: (seeded(k, 9) - 0.5) * 20 }
      }),
    [count],
  )
  // paint the ones near the middle last, so they sit on top
  const ordered = [...heads].sort((p, q) => Math.abs(q.x - BASE.x) - Math.abs(p.x - BASE.x))

  return (
    <motion.div ref={containerRef} className={`relative aspect-[300/330] ${className}`} animate={controls}>
      <motion.div className="absolute inset-0" style={{ transformOrigin: '50% 100%' }} animate={{ rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {heads.map((h) => (
            <path key={h.k} d={`M${BASE.x} ${BASE.y} Q ${(BASE.x + h.x) / 2} ${(BASE.y + h.y) / 2 + 20} ${h.x} ${h.y}`} className="stroke-leaf" strokeWidth="5" fill="none" strokeLinecap="round" />
          ))}
          <path className="leaf-a fill-leaf" d="M150 270 C190 240 225 250 232 268 C205 286 170 284 150 270z" />
          <path className="leaf-b fill-leaf" d="M150 262 C110 232 75 242 68 260 C95 278 130 276 150 262z" />
          <path className="leaf-a fill-leaf" d="M150 300 C175 280 200 285 206 298 C186 312 164 310 150 300z" style={{ animationDelay: '-2s' }} />
          {ribbon === 'loose' && (
            <>
              <path d="M146 262 q-18 30 -8 56" className="stroke-heart" strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M154 262 q22 24 14 54" className="stroke-heart" strokeWidth="7" fill="none" strokeLinecap="round" />
            </>
          )}
          {ribbon === 'tied' && (
            <>
              <motion.path d="M104 262 Q150 282 196 262" className="stroke-heart" strokeWidth="12" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
              <path d="M146 270 q-14 28 -6 48 M154 270 q16 24 10 46" className="stroke-heart" strokeWidth="6" fill="none" strokeLinecap="round" />
            </>
          )}
        </svg>

        {ordered.map((h) => (
          <div key={h.k} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(h.x / W) * 100}%`, top: `${(h.y / H) * 100}%`, width: `${(h.size / W) * 100}%` }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [h.rot - 3, h.rot + 3, h.rot - 3] }}
              transition={{ scale: { type: 'spring', stiffness: 160, damping: 11 }, rotate: { duration: 3 + seeded(h.k, 10) * 2, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <SunflowerHead seed={h.k} className="w-full" />
            </motion.div>
          </div>
        ))}

        {ribbon === 'tied' && (
          <motion.div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '81%', width: '19%' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 10 }}>
            <Bow className="w-full text-heart" />
          </motion.div>
        )}
      </motion.div>
      {count > 0 && <Sparkles count={5} />}
    </motion.div>
  )
}
