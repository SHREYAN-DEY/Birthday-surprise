import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NightSky from '../../components/Common/NightSky.jsx'
import Bouquet from '../../components/Sunflower/Bouquet.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import SmartImage from '../../components/Common/SmartImage.jsx'
import ProfileBadge from '../../components/Common/ProfileBadge.jsx'
import SecretBubble from '../../components/Common/SecretBubble.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useMusic } from '../../hooks/useMusic.js'
import { useTimedSteps } from '../../hooks/useTimedSteps.js'
import { secretsFor, usableFlowers } from '../../utils/selectors.js'
import { fillTokens } from '../../utils/text.js'
import Heart from '../../components/Doodles/Heart.jsx'

const DURATIONS = [3400, 3600, 2600, 3400, 3000]
const LINES = ['Happy Birthday, [HER_NAME].', 'I hope this year gives you a thousand reasons to smile.', 'And maybe...', 'a few more memories with me.', '❤️']

// Calm on purpose: no particles, just stars, a bouquet, a photo and a few words
export default function FinalReveal({ onDone }) {
  const { data } = useBirthdayData()
  const { setLevel } = useMusic()
  const step = useTimedSteps(DURATIONS)
  const [bubble, setBubble] = useState(null)
  const secretIdx = useRef(0)
  const flowerCount = Math.max(1, Math.min(7, usableFlowers(data).length))
  const couple = data.general.couplePhoto
  const finalSecrets = secretsFor(data, 'final')

  useEffect(() => {
    setLevel(0.6, 2500)
  }, [setLevel])

  useEffect(() => {
    if (step < DURATIONS.length) return undefined
    setLevel(1, 7000) // the song swells gently at the very end
    const t = setTimeout(onDone, 4500)
    return () => clearTimeout(t)
  }, [step, setLevel, onDone])

  const close = useCallback(() => setBubble(null), [])
  function peek() {
    const s = finalSecrets[secretIdx.current % finalSecrets.length]
    secretIdx.current += 1
    setBubble({ key: Math.random(), text: '', secret: { ...s, message: fillTokens(s.message, data) } })
  }

  return (
    <SceneShell scroll className="bg-night">
      <NightSky />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-5 py-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 1.5 }}>
            <Bouquet count={flowerCount} ribbon="tied" className="w-44 sm:w-52" />
          </motion.div>
          {couple && (
            <motion.div className="polaroid w-40 rotate-2 sm:w-48" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5, duration: 1.5 }}>
              <span className="tape" aria-hidden="true" />
              <SmartImage src={couple} alt="The two of us" className="aspect-square w-full object-cover" />
              {data.general.couplePhotoCaption && <p className="mt-2 font-hand text-xl leading-tight text-night">{data.general.couplePhotoCaption}</p>}
            </motion.div>
          )}
        </div>

        <ProfileBadge where="finalReveal" className="h-16 w-16" />

        <div className="min-h-32" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={Math.min(step, 4)} className="font-hand text-4xl leading-tight text-paper sm:text-5xl"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
              {fillTokens(LINES[Math.min(step, 4)], data)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {finalSecrets.length > 0 && (
        <button type="button" onClick={peek} aria-label="A tiny hidden heart" className="absolute bottom-5 right-5 z-20 cursor-pointer opacity-30 hover:opacity-100 focus-visible:opacity-100">
          <Heart className="h-4 w-4 text-heart" />
        </button>
      )}
      <SecretBubble bubble={bubble} onClose={close} />
    </SceneShell>
  )
}
