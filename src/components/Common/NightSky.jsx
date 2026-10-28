import { motion } from 'motion/react'
import Star from '../Doodles/Star.jsx'
import { seeded } from '../../utils/randomPosition.js'

// Stars that appear one by one (or all at once with `instant`)
export default function NightSky({ count = 34, stagger = 0.14, instant = false }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${seeded(i, 11) * 100}%`, top: `${seeded(i, 12) * 100}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: instant ? 0 : i * stagger, duration: 0.8 }}
        >
          <Star
            className="animate-twinkle text-white"
            style={{ width: 6 + seeded(i, 13) * 10, height: 6 + seeded(i, 13) * 10, animationDelay: `${seeded(i, 14) * 3}s` }}
          />
        </motion.span>
      ))}
    </div>
  )
}
