import { AnimatePresence, motion } from 'motion/react'
import RichText from './RichText.jsx'
import SmartImage from './SmartImage.jsx'

// A small paper note that slides up from the bottom: used for Easter-egg reactions and secrets
export default function SecretBubble({ bubble, onClose }) {
  return (
    <AnimatePresence>
      {bubble && (
        <motion.div
          key={bubble.key}
          role="status"
          aria-live="polite"
          className="paper fixed inset-x-4 bottom-6 z-40 mx-auto max-w-md rounded-sm p-4 text-center"
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {bubble.text && <p className="font-hand text-3xl text-night">{bubble.text}</p>}
          {bubble.secret?.message && <RichText text={bubble.secret.message} className="mt-2 font-hand text-2xl text-heart" />}
          {bubble.secret?.image && (
            <SmartImage src={bubble.secret.image} alt="A secret picture" className="mx-auto mt-3 max-h-48 rounded-sm object-contain" />
          )}
          <button type="button" onClick={onClose} className="mt-3 cursor-pointer text-sm font-bold text-ink/70 underline">
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
