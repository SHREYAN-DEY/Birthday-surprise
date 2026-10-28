import { motion, useReducedMotion } from 'motion/react'
import Heart from '../Doodles/Heart.jsx'

export default function HeartBurst({ count = 14 }) {
  const reduce = useReducedMotion()
  const n = reduce ? 5 : count
  return (
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center overflow-hidden" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 + (i % 2) * 0.25
        const distance = 90 + (i % 3) * 45
        return (
          <motion.div
            key={i}
            className="col-start-1 row-start-1"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: [0, 1.2, 1],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: reduce ? 0.6 : 1.1, ease: 'easeOut' }}
          >
            <Heart className={`${i % 3 === 0 ? 'h-9 w-9' : 'h-5 w-5'} ${i % 2 ? 'text-blush' : 'text-heart'}`} />
          </motion.div>
        )
      })}
    </div>
  )
}
