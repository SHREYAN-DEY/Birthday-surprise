import { motion } from 'motion/react'
import { scenePage } from '../../animations/pageAnimations.js'

// Every scene sits in one of these: fade in/out, full height, no sideways scroll
export default function SceneShell({ children, className = 'bg-linear-to-b from-sky-mid to-sky-soft', scroll = false, ...props }) {
  return (
    <motion.main
      {...scenePage}
      className={`relative min-h-screen ${scroll ? 'overflow-x-hidden' : 'overflow-hidden'} ${className}`}
      {...props}
    >
      {children}
    </motion.main>
  )
}
