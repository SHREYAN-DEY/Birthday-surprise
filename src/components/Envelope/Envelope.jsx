import { motion } from 'motion/react'

// A paper envelope. When `open` flips to true the flap lifts and the paper slides up.
export default function Envelope({ open = false, className = 'w-64', children }) {
  return (
    <div className={`relative aspect-[3/2] ${className}`}>
      <div className="absolute inset-0 rounded-md bg-paper-edge shadow-md" />
      <motion.div
        className="absolute inset-x-[8%] bottom-[6%] top-[8%] grid place-items-center rounded-sm bg-white text-center shadow"
        animate={{ y: open ? '-55%' : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
      <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <polygon points="0,0 150,110 0,200" fill="#f3e6c8" />
        <polygon points="300,0 150,110 300,200" fill="#f3e6c8" />
        <polygon points="0,200 150,90 300,200" fill="#ecdcb6" />
      </svg>
      <motion.svg
        viewBox="0 0 300 200"
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ transformOrigin: '50% 0%' }}
        animate={{ scaleY: open ? -1 : 1 }}
        transition={{ duration: 0.6 }}
        aria-hidden="true"
      >
        <polygon points="0,0 300,0 150,115" fill="#e5d3a8" />
        <circle cx="150" cy="105" r="10" className="fill-heart" />
      </motion.svg>
    </div>
  )
}
