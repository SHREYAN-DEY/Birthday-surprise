import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Character from '../../components/Character/Character.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import { useTimedSteps } from '../../hooks/useTimedSteps.js'

const DURATIONS = [1800, 2000, 2600]
const LINES = ['Okay...', 'You passed.', 'But that was only the beginning.']

export default function PassedScene({ onDone }) {
  const step = useTimedSteps(DURATIONS)
  useEffect(() => {
    if (step >= DURATIONS.length) {
      const t = setTimeout(onDone, 300)
      return () => clearTimeout(t)
    }
    return undefined
  }, [step, onDone])

  return (
    <SceneShell className="bg-sky-soft">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
        <Character className="w-28" />
        <div className="min-h-24" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={Math.min(step, 2)} className="font-hand text-5xl text-night"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              {LINES[Math.min(step, 2)]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  )
}
