import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Cloud from '../../components/Cloud/Cloud.jsx'
import Sparkles from '../../components/Sparkles/Sparkles.jsx'
import StarBurst from '../../components/Sparkles/StarBurst.jsx'
import Button from '../../components/Button/Button.jsx'
import GiftBox from '../../components/GiftBox/GiftBox.jsx'
import Character from '../../components/Character/Character.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import ProfileBadge from '../../components/Common/ProfileBadge.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { displayName } from '../../utils/text.js'

const coverClouds = [
  { pos: 'top-[-3%] left-[-15%] w-[80vw] max-w-lg', from: '-110vw', delay: 0 },
  { pos: 'top-[10%] right-[-18%] w-[85vw] max-w-xl', from: '110vw', delay: 0.15 },
  { pos: 'top-[32%] left-[-20%] w-[90vw] max-w-xl', from: '-110vw', delay: 0.3 },
  { pos: 'top-[48%] right-[-15%] w-[80vw] max-w-lg', from: '110vw', delay: 0.2 },
  { pos: 'bottom-[12%] left-[-12%] w-[85vw] max-w-xl', from: '-110vw', delay: 0.4 },
  { pos: 'bottom-[-4%] right-[-20%] w-[90vw] max-w-xl', from: '110vw', delay: 0.1 },
]
const NEXT = { shaking: ['opened', 800], opened: ['clouds', 3600], clouds: ['guide', 1700] }

export default function WelcomeScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.55, 1500)
  const name = displayName(data)

  const [stage, setStage] = useState('gift')
  const [wiggle, setWiggle] = useState(false)
  const [guideStep, setGuideStep] = useState(0)

  useEffect(() => {
    const next = NEXT[stage]
    if (!next) return undefined
    const t = setTimeout(() => setStage(next[0]), next[1])
    return () => clearTimeout(t)
  }, [stage])

  useEffect(() => {
    if (stage !== 'guide') return undefined
    const t1 = setTimeout(() => setGuideStep(1), 2600)
    const t2 = setTimeout(() => setGuideStep(2), 4400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [stage])

  function handleOpen() {
    if (stage !== 'gift') return
    setWiggle(false)
    setStage('shaking')
  }

  const showGift = stage === 'gift' || stage === 'shaking' || stage === 'opened'
  const showCloudCover = stage === 'clouds' || stage === 'guide'

  return (
    <SceneShell>
      <Sparkles count={9} className="text-white" />
      <div className="absolute left-[6%] top-[8%]"><Cloud float className="w-24 text-cloud" tilt={-3} /></div>
      <div className="absolute right-[4%] top-[18%]"><Cloud float className="w-16 text-cloud" tilt={4} delay={2} /></div>
      <div className="absolute bottom-[10%] left-[14%]"><Cloud float className="w-20 text-cloud" tilt={2} delay={1} /></div>

      <AnimatePresence>
        {showGift && (
          <motion.div
            key="gift-section"
            className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
            exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          >
            <div className="flex min-h-28 items-end" aria-live="polite">
              <AnimatePresence mode="wait">
                {stage !== 'opened' ? (
                  <motion.p key="prompt" className="font-hand text-4xl leading-tight text-night sm:text-5xl"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    Someone left you a little something...
                  </motion.p>
                ) : (
                  <motion.div key="hb" className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 160, damping: 12 }}>
                    <ProfileBadge where="opening" />
                    <p className="font-hand text-5xl leading-tight text-heart sm:text-6xl">Happy Birthday, {name} ♡</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <GiftBox state={stage === 'shaking' ? 'shaking' : stage === 'opened' ? 'opened' : 'idle'} wiggle={wiggle} onClick={handleOpen} />
              {stage === 'opened' && <StarBurst />}
            </div>

            <div className="min-h-14">
              {stage === 'gift' && (
                <Button
                  onClick={handleOpen}
                  onPointerEnter={() => setWiggle(true)} onPointerLeave={() => setWiggle(false)}
                  onFocus={() => setWiggle(true)} onBlur={() => setWiggle(false)}
                >
                  Open it 🎁
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCloudCover && (
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          <motion.div className="absolute inset-0 bg-cloud" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 1.2, delay: 0.5 }} />
          {coverClouds.map((c, i) => (
            <motion.div key={i} className={`absolute ${c.pos}`} initial={{ x: c.from }} animate={{ x: 0 }} transition={{ duration: 1.1, delay: c.delay, ease: 'easeOut' }}>
              <Cloud className="w-full text-white" />
            </motion.div>
          ))}
        </div>
      )}

      {stage === 'guide' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <motion.div
            initial={{ x: '-60vw', y: '-40vh', rotate: -25, scale: 0.5, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 11 }}
          >
            <Character className="w-44 sm:w-52" />
          </motion.div>
          <div className="min-h-24" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p key={Math.min(guideStep, 1)} className="font-hand text-4xl text-night sm:text-5xl"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: guideStep === 0 ? 1 : 0 }}>
                {guideStep === 0 ? 'Come on...' : 'I have something to show you.'}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="min-h-14">
            {guideStep >= 2 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Button onClick={onDone}>Let's go →</Button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </SceneShell>
  )
}
