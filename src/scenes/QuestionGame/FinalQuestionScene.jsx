import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import AskCard from '../../components/Common/AskCard.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import HeartBurst from '../../components/HeartParticles/HeartBurst.jsx'
import { useTimedSteps } from '../../hooks/useTimedSteps.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'

const INTRO = [1500, 1800]
const AFTER = [1800, 2800]

export default function FinalQuestionScene({ onDone }) {
  useSceneMusic(0.6, 2000)
  const [answered, setAnswered] = useState(false)
  const intro = useTimedSteps(INTRO, !answered)   // 0 "Okay..." 1 "One last question." 2 -> card
  const after = useTimedSteps(AFTER, answered)    // 0 "Good." 1 "Because I made it just for you." 2 -> done

  useEffect(() => {
    if (answered && after >= AFTER.length) {
      const t = setTimeout(onDone, 800)
      return () => clearTimeout(t)
    }
    return undefined
  }, [answered, after, onDone])

  let line = null
  if (answered) line = after === 0 ? 'Good.' : 'Because I made it just for you.'
  else if (intro < 2) line = intro === 0 ? 'Okay...' : 'One last question.'

  return (
    <SceneShell className="bg-linear-to-b from-sky-soft to-blush/60">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
        <AnimatePresence mode="wait">
          {line ? (
            <motion.p key={line} className="font-hand text-5xl text-night" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
              {line}
            </motion.p>
          ) : (
            <motion.div key="card" className="w-full" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AskCard question="Did you enjoy your little birthday surprise?" yesText="YES ❤️" noText="NO" onYes={() => setAnswered(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {answered && <HeartBurst count={16} />}
    </SceneShell>
  )
}
