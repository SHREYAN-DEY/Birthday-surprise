import { AnimatePresence, motion } from 'motion/react'
import SunflowerPlant from '../../components/Sunflower/SunflowerPlant.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import { useTimedSteps } from '../../hooks/useTimedSteps.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'

const DURATIONS = [2400, 1500, 2800, 2200]
const LINES = ['I wanted to give you flowers.', 'But...', "A website can't exactly hand you flowers.", 'So I made you some.']

export default function GardenIntroScene({ onDone }) {
  useSceneMusic(0.95, 2500)
  const step = useTimedSteps(DURATIONS)

  return (
    <SceneShell className="bg-linear-to-b from-paper via-[#fff1c2] to-sun/50">
      {/* the sky warms up */}
      <motion.div className="absolute inset-0 bg-linear-to-b from-sky-soft to-transparent" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 3 }} aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-around px-2" aria-hidden="true">
        {[1, 4, 2, 7, 3, 5].map((seed, i) => (
          <motion.div key={seed} initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 + i * 0.4, duration: 0.9, ease: 'easeOut' }}>
            <SunflowerPlant seed={seed} width={4} interactive={false} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start gap-6 px-6 pt-[18vh] text-center">
        <div className="min-h-32" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={Math.min(step, 3)} className="font-hand text-4xl leading-tight text-night sm:text-5xl"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              {LINES[Math.min(step, 3)]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="min-h-24">
          {step >= 4 && (
            <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <span className="text-6xl" role="img" aria-label="sunflower">🌻</span>
              <Button onClick={onDone}>Let me see →</Button>
            </motion.div>
          )}
        </div>
      </div>
    </SceneShell>
  )
}
