import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// Accessible dialog: Esc closes, Tab stays inside, focus returns to where it was
export default function Modal({ open, onClose, label, children, className = '' }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => dialogRef.current?.focus(), 30)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = dialogRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
      if (!items.length) { e.preventDefault(); return }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-night/60 p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className={`paper relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md p-5 ${className}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
          >
            <button
              type="button" onClick={onClose} aria-label="Close"
              className="absolute right-2 top-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-xl text-ink hover:bg-sky-soft"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
