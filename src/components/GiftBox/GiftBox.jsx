import { motion } from 'motion/react'

// state: 'idle' | 'shaking' | 'opened'
export default function GiftBox({ state = 'idle', wiggle = false, onClick, size = 'h-44 w-44 sm:h-52 sm:w-52', fadeAfterOpen = true }) {
  const shaking = state === 'shaking'
  const opened = state === 'opened'

  let animate = { rotate: 0, y: 0, opacity: 1, scale: 1 }
  let transition = { duration: 0.2 }
  if (shaking) {
    animate = { rotate: [0, -6, 6, -6, 6, -3, 0], y: [0, -4, 0, -4, 0], opacity: 1, scale: 1 }
    transition = { duration: 0.8 }
  } else if (opened && fadeAfterOpen) {
    animate = { rotate: 0, y: 24, opacity: 0, scale: 0.95 }
    transition = { delay: 1.6, duration: 1.2 }
  } else if (wiggle) {
    animate = { rotate: [0, -5, 5, -5, 5, 0], y: 0, opacity: 1, scale: 1 }
    transition = { duration: 0.7, repeat: Infinity, repeatDelay: 0.5 }
  }

  return (
    <motion.div className={`relative ${size} cursor-pointer`} animate={animate} transition={transition} onClick={onClick} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_8px_6px_rgba(59,111,160,0.2)]">
        <rect x="12" y="52" width="96" height="60" rx="5" className="fill-blush" />
        <rect x="54" y="52" width="12" height="60" className="fill-white" />
        <rect x="12" y="104" width="96" height="8" rx="4" className="fill-heart" opacity="0.15" />
      </svg>
      <motion.div
        className="absolute inset-0"
        animate={opened ? { y: -120, x: -36, rotate: -28, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
          <rect x="6" y="36" width="108" height="22" rx="5" className="fill-heart" />
          <rect x="54" y="36" width="12" height="22" className="fill-white" />
          <ellipse cx="46" cy="30" rx="14" ry="8" transform="rotate(-20 46 30)" className="fill-white" />
          <ellipse cx="74" cy="30" rx="14" ry="8" transform="rotate(20 74 30)" className="fill-white" />
          <circle cx="60" cy="33" r="6" className="fill-blush" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
