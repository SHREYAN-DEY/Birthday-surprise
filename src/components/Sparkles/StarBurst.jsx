import { motion, useReducedMotion } from 'motion/react'
import Star from '../Doodles/Star.jsx'

// One-time burst of stars from the center of a `relative` parent
export default function StarBurst({ count = 18 }) {
  const reduce = useReducedMotion()
  const n = reduce ? 6 : count
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 + (i % 3) * 0.2
        const distance = 80 + (i % 4) * 28
        const size = 10 + (i % 3) * 7
        return (
          <motion.div
            key={i}
            className="col-start-1 row-start-1"
            initial={{ x: 0, y: -10, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 20,
              scale: [0, 1.2, 0.8],
              opacity: [1, 1, 0],
              rotate: 90,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <Star className={i % 2 ? 'text-sun' : 'text-white'} style={{ width: size, height: size }} />
          </motion.div>
        )
      })}
    </div>
  )
}
