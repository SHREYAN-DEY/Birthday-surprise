import { AnimatePresence, motion } from 'motion/react'
import Character from '../../components/Character/Character.jsx'
import Button from '../../components/Button/Button.jsx'
import Cloud from '../../components/Cloud/Cloud.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import { useTimedSteps } from '../../hooks/useTimedSteps.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'

const DURATIONS = [1500, 2200, 3000]
const LINES = ['Hi!', "I'm your tiny guide today.", 'There are a few things waiting for you.', 'But you have to find them yourself.']
const ICONS = [['❤️', 'a heart'], ['📸', 'a camera'], ['🌻', 'a sunflower']]

export default function CharacterScene({ onDone }) {
  useSceneMusic(0.6)
  const step = useTimedSteps(DURATIONS)

  return (
    <SceneShell className="bg-linear-to-b from-sky-soft to-white">
      <div className="absolute left-[8%] top-[10%]"><Cloud float className="w-20 text-sky-mid" tilt={-3} /></div>
      <div className="absolute bottom-[12%] right-[6%]"><Cloud float className="w-24 text-sky-mid" tilt={3} delay={1.5} /></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div initial={{ y: -200, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 9 }}>
          <Character className="w-44 sm:w-52" />
        </motion.div>

        <div className="min-h-28" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={step} className="font-hand text-4xl leading-tight text-night sm:text-5xl"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {LINES[Math.min(step, 3)]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex min-h-14 items-center gap-5 text-5xl">
          {step >= 2 && ICONS.map(([icon, label], i) => (
            <motion.span key={label} role="img" aria-label={label} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: (i - 1) * 8 }} transition={{ delay: i * 0.3, type: 'spring', stiffness: 220, damping: 10 }}>
              {icon}
            </motion.span>
          ))}
        </div>

        <div className="min-h-14">
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={onDone}>I'm ready.</Button>
            </motion.div>
          )}
        </div>
      </div>
    </SceneShell>
  )
}
