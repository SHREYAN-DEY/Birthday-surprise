import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NightSky from '../../components/Common/NightSky.jsx'
import Button from '../../components/Button/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import RichText from '../../components/Common/RichText.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useTimedSteps } from '../../hooks/useTimedSteps.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { fillTokens } from '../../utils/text.js'

const DURATIONS = [2600, 2800]
const LINES = ["That's all.", 'For now.']

export default function EndingScene({ onReplay }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.55, 4000)
  const step = useTimedSteps(DURATIONS)
  const [kept, setKept] = useLocalStorage('birthdayExperience:kept:v1', false)
  const [copied, setCopied] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const closeMessage = useCallback(() => setShowMessage(false), [])

  async function keep() {
    setKept(true)
    try {
      await navigator.clipboard.writeText(window.location.origin + '/')
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <SceneShell className="bg-night">
      <NightSky instant count={26} />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="min-h-28" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={Math.min(step, 2)} className="font-hand text-5xl text-paper sm:text-6xl"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
              {step < 2 ? LINES[step] : 'Happy Birthday ❤️'}
            </motion.p>
          </AnimatePresence>
        </div>

        {step >= 2 && (
          <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={onReplay}>Replay our little story ↻</Button>
              <Button variant="soft" onClick={keep} aria-pressed={kept}>{kept ? 'Kept ♡' : 'Keep this memory ♡'}</Button>
            </div>
            {copied && <p className="font-hand text-2xl text-paper/80" role="status">The link is copied. Keep it somewhere safe ♡</p>}
            {data.mainMessage.trim() && (
              <button type="button" onClick={() => setShowMessage(true)} className="cursor-pointer font-hand text-2xl text-paper/80 underline underline-offset-4">
                Read my birthday message
              </button>
            )}
          </motion.div>
        )}
      </div>

      <Modal open={showMessage} onClose={closeMessage} label="Birthday message">
        <RichText text={fillTokens(data.mainMessage, data)} className="font-hand text-3xl leading-snug text-night" />
      </Modal>
    </SceneShell>
  )
}
