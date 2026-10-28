import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Envelope from '../../components/Envelope/Envelope.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import LetterBody from '../../components/Common/LetterBody.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useMusic } from '../../hooks/useMusic.js'

// stage: intro -> opening -> reading
export default function LetterScene({ onDone }) {
  const { data } = useBirthdayData()
  const { setLevel } = useMusic()
  const [stage, setStage] = useState('intro')
  const timer = useRef(null)

  useEffect(() => {
    setLevel(0.6, 1500)
  }, [setLevel])
  useEffect(() => () => clearTimeout(timer.current), [])

  function openLetter() {
    setStage('opening')
    setLevel(0.3, 2000) // the music steps back so the words can be heard
    timer.current = setTimeout(() => setStage('reading'), 1700)
  }

  return (
    <SceneShell className="bg-paper">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
        <AnimatePresence mode="wait">
          {stage !== 'reading' && (
            <motion.div key="env" className="flex flex-col items-center gap-8" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <p className="max-w-md font-hand text-4xl leading-tight text-night sm:text-5xl">There's one thing I wanted to say properly.</p>
              <Envelope open={stage === 'opening'} className="w-64 sm:w-72">
                <span className="text-4xl" aria-hidden="true">💌</span>
              </Envelope>
              <div className="min-h-14">
                {stage === 'intro' && <Button onClick={openLetter}>Open the letter 💌</Button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === 'opening' && (
          <motion.div className="pointer-events-none absolute inset-0 z-20 bg-night/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true" />
        )}
        {stage === 'reading' && (
          <motion.div key="letter" className="fixed inset-0 z-30 grid place-items-center bg-night/30 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <motion.div className="paper relative flex max-h-[88vh] w-full max-w-xl flex-col rounded-sm"
              initial={{ y: 60, rotate: 2 }} animate={{ y: 0, rotate: -0.5 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
              <div className="overflow-y-auto px-6 py-8 sm:px-10" tabIndex={0} aria-label="Your birthday letter">
                <LetterBody data={data} />
              </div>
              <div className="border-t border-paper-edge p-3 text-center">
                <Button onClick={onDone}>Continue →</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  )
}
