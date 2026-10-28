import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Bouquet from '../../components/Sunflower/Bouquet.jsx'
import StarBurst from '../../components/Sparkles/StarBurst.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { usableFlowers } from '../../utils/selectors.js'

export default function RibbonScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.9)
  const count = Math.max(1, Math.min(7, usableFlowers(data).length))
  const [tied, setTied] = useState(false)
  const [bounce, setBounce] = useState(0)

  function tie() {
    if (tied) return
    setTied(true)
    setTimeout(() => setBounce(1), 900)
  }

  return (
    <SceneShell className="bg-linear-to-b from-paper to-sun/40">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="min-h-20" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={tied ? 'tied' : 'loose'} className="font-hand text-4xl text-night sm:text-5xl"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {tied ? "This one's yours. 🌻" : 'One last thing...'}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="relative">
          <Bouquet count={count} ribbon={tied ? 'tied' : 'loose'} bounceKey={bounce} className="w-64 sm:w-72" />
          {!tied && (
            <button type="button" onClick={tie} aria-label="Tie the ribbon" className="absolute inset-x-[25%] bottom-0 h-[30%] cursor-pointer rounded-full" />
          )}
          {bounce > 0 && <StarBurst count={14} />}
        </div>

        <div className="min-h-14">
          {!tied ? <Button onClick={tie}>Tie the ribbon 🎀</Button> : bounce > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Button onClick={onDone}>Continue →</Button></motion.div>
          )}
        </div>
      </div>
    </SceneShell>
  )
}
