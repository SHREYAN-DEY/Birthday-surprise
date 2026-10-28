import { motion } from 'motion/react'

const variants = {
  primary: 'bg-heart text-white border-heart',
  soft: 'bg-cloud text-ink border-sky-mid',
}

// React 19: `ref` is a normal prop, so parents can measure the button
export default function Button({ variant = 'primary', className = '', children, ref, ...props }) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.04, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={`min-h-12 min-w-12 cursor-pointer rounded-full border-2 px-6 py-2 text-lg font-bold shadow-[0_4px_0_rgba(58,74,99,0.18)] disabled:cursor-default disabled:opacity-70 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
