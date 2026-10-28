import { motion } from 'motion/react'
import SunflowerHead from './SunflowerHead.jsx'
import { seeded } from '../../utils/randomPosition.js'
import { pickBend, idleSway } from '../../animations/flowerAnimations.js'

// A sunflower on a stem. phase: 'idle' | 'picking' | 'flying' | 'done'
// Every plant gets its own tilt, size and sway speed from `seed`.
export default function SunflowerPlant({ seed = 0, phase = 'idle', onPick, headRef, label = 'Sunflower', width = 5.2, interactive = true }) {
  const swayTime = 3.5 + seeded(seed, 3) * 3
  const tilt = (seeded(seed, 4) - 0.5) * 6
  const scale = 0.9 + seeded(seed, 5) * 0.25
  const picking = phase === 'picking'
  const gone = phase === 'flying' || phase === 'done'

  return (
    <div className="relative" style={{ width: `${width * scale}rem` }}>
      <motion.button
        type="button"
        disabled={!interactive || phase !== 'idle'}
        onClick={onPick}
        aria-label={label}
        className="relative block w-full cursor-pointer disabled:cursor-default"
        style={{ transformOrigin: '50% 100%' }}
        animate={{ rotate: picking ? pickBend(tilt) : idleSway(tilt) }}
        transition={picking ? { duration: 0.55 } : { duration: swayTime, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={phase === 'idle' && interactive ? { scale: 1.06 } : undefined}
      >
        <motion.div
          ref={headRef}
          className="relative z-10 mx-auto w-full"
          animate={{ scale: picking ? 1.3 : 1, opacity: gone ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <SunflowerHead seed={seed} className="w-full" />
        </motion.div>
        <svg viewBox="0 0 100 150" className="-mt-3 w-full overflow-visible" aria-hidden="true">
          <path d="M50 0 C46 40 56 90 50 150" className="stroke-leaf" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path className="leaf-a fill-leaf" d="M52 70 C78 52 92 62 94 74 C76 84 62 82 52 70z" style={{ animationDelay: `${-seeded(seed, 6) * 3}s` }} />
          <path className="leaf-b fill-leaf" d="M48 98 C22 80 8 90 6 102 C24 112 38 110 48 98z" style={{ animationDelay: `${-seeded(seed, 7) * 3}s` }} />
        </svg>
      </motion.button>
    </div>
  )
}
