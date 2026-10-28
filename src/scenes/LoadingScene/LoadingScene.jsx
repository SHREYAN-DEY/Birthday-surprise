import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Cloud from '../../components/Cloud/Cloud.jsx'
import Star from '../../components/Doodles/Star.jsx'
import Button from '../../components/Button/Button.jsx'
import HeartBurst from '../../components/HeartParticles/HeartBurst.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import { useMusic } from '../../hooks/useMusic.js'

const stars = [
  { l: 12, t: 14, s: 14 }, { l: 80, t: 10, s: 18 }, { l: 30, t: 30, s: 10 },
  { l: 66, t: 26, s: 12 }, { l: 90, t: 44, s: 10 }, { l: 8, t: 50, s: 12 },
  { l: 48, t: 8, s: 10 }, { l: 22, t: 70, s: 14 }, { l: 76, t: 74, s: 12 },
  { l: 55, t: 86, s: 10 },
]
const lines = [
  'Preparing something...',
  'Almost ready...',
  'Okay... this is for you.',
  'But you have to promise me something.',
  'You have to stay until the end.',
]
const AUTO_MS = [1800, 1800, 2200]

export default function LoadingScene({ onDone }) {
  const { play } = useMusic()
  const [step, setStep] = useState(0)
  const [bursting, setBursting] = useState(false)
  const doneTimer = useRef(null)

  useEffect(() => {
    if (step > 2) return undefined
    const t = setTimeout(() => setStep((s) => s + 1), AUTO_MS[step])
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => () => clearTimeout(doneTimer.current), [])

  function handlePromise() {
    play() // this tap is the "user gesture" browsers require before audio
    setBursting(true)
    doneTimer.current = setTimeout(onDone, 1300)
  }

  return (
    <SceneShell className="flex flex-col items-center justify-center bg-linear-to-b from-sky-mid to-sky-soft px-6 text-center">
      {stars.map((st, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${st.l}%`, top: `${st.t}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.35, duration: 0.6 }}
          aria-hidden="true"
        >
          <Star className="animate-twinkle text-white" style={{ width: st.s, height: st.s, animationDelay: `${i * 0.4}s` }} />
        </motion.span>
      ))}

      <motion.div
        className="absolute left-[10%] top-[22%]"
        animate={{ x: [-20, 40, -20] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <Cloud float className="w-20 text-cloud" />
      </motion.div>

      <div className="relative flex min-h-56 flex-col items-center justify-start gap-6">
        <div aria-live="polite" className="min-h-28">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className="font-hand text-4xl leading-tight text-night sm:text-5xl"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
            >
              {lines[step]}
            </motion.p>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {step === 3 && (
            <motion.div key="what" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Button variant="soft" onClick={() => setStep(4)}>What?</Button>
            </motion.div>
          )}
          {step === 4 && !bursting && (
            <motion.div key="promise" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Button onClick={handlePromise}>I promise ♡</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {bursting && <HeartBurst />}
    </SceneShell>
  )
}
