import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NightSky from '../../components/Common/NightSky.jsx'
import GiftBox from '../../components/GiftBox/GiftBox.jsx'
import StarBurst from '../../components/Sparkles/StarBurst.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import RichText from '../../components/Common/RichText.jsx'
import SmartImage from '../../components/Common/SmartImage.jsx'
import ProfileBadge from '../../components/Common/ProfileBadge.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { fillTokens } from '../../utils/text.js'

// stage: wait -> psst -> ask -> shaking -> opened
export default function SecretScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(1, 3000)
  const [stage, setStage] = useState('wait')
  const timers = useRef([])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => {
    later(() => setStage('psst'), 4000)
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  const fs = data.finalSurprise
  const t = (s) => fillTokens(s, data)

  function openGift() {
    if (stage !== 'ask') return
    setStage('shaking')
    later(() => setStage('opened'), 800)
  }

  return (
    <SceneShell scroll className="bg-night">
      <NightSky instant />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-5 py-10 text-center">
        <div aria-live="polite" className="flex min-h-24 items-center">
          <AnimatePresence mode="wait">
            {stage === 'psst' && (
              <motion.button key="psst" type="button" onClick={() => { setStage('ask') }} className="cursor-pointer font-hand text-2xl text-paper/80 underline-offset-4 hover:underline"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Psst...
              </motion.button>
            )}
            {(stage === 'ask' || stage === 'shaking') && (
              <motion.p key="ask" className="font-hand text-4xl text-paper sm:text-5xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Did you think that was everything?
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {(stage === 'ask' || stage === 'shaking' || stage === 'opened') && (
          <motion.div className="relative" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: stage === 'ask' ? 1.2 : 0 }}>
            <GiftBox state={stage === 'shaking' ? 'shaking' : stage === 'opened' ? 'opened' : 'idle'} onClick={openGift} size="h-36 w-36 sm:h-44 sm:w-44" />
            {stage === 'opened' && <StarBurst count={14} />}
          </motion.div>
        )}
        {stage === 'ask' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
            <Button onClick={openGift}>Open it 🎁</Button>
          </motion.div>
        )}

        {stage === 'opened' && (
          <motion.div className="paper w-full -rotate-1 rounded-sm px-5 py-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }}>
            <ProfileBadge where="finalSurprise" className="mx-auto mb-3 h-16 w-16" />
            {fs.title && <h2 className="font-hand text-4xl text-heart">{t(fs.title)}</h2>}
            {fs.message && <RichText text={t(fs.message)} className="mt-2 font-hand text-3xl leading-snug text-night" />}
            {fs.image && <SmartImage src={fs.image} alt="Your final surprise" className="mx-auto mt-4 max-h-72 rounded-sm object-contain" />}
            <div className="mt-5"><Button onClick={onDone}>Continue →</Button></div>
          </motion.div>
        )}
      </div>
    </SceneShell>
  )
}
