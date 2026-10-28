import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Envelope from '../../components/Envelope/Envelope.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import EmptyNote from '../../components/Common/EmptyNote.jsx'
import SmartImage from '../../components/Common/SmartImage.jsx'
import RichText from '../../components/Common/RichText.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { usableReasons } from '../../utils/selectors.js'
import { fillTokens } from '../../utils/text.js'

export default function ReasonsScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.65)
  const reasons = usableReasons(data)
  const [n, setN] = useState(0)

  if (!reasons.length) {
    return <SceneShell><EmptyNote onDone={onDone}>No reasons yet. Add some in /setup.</EmptyNote></SceneShell>
  }

  const current = n > 0 ? reasons[n - 1] : null
  const previous = reasons.slice(Math.max(0, n - 4), Math.max(0, n - 1))
  const finished = n >= reasons.length

  return (
    <SceneShell scroll className="bg-linear-to-b from-blush/70 to-paper">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center gap-6 px-5 py-10 text-center">
        <h1 className="font-hand text-4xl leading-tight text-night sm:text-5xl">There are a few things I never say enough.</h1>

        <Envelope open={n > 0} className="w-52">
          <span className="text-4xl" aria-hidden="true">💌</span>
        </Envelope>

        <div className="min-h-44 w-full" aria-live="polite">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div key={current.id} className="paper mx-auto max-w-sm -rotate-1 rounded-sm px-5 py-6"
                initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: -1 }} exit={{ opacity: 0, y: -20 }}>
                {current.text && <RichText text={fillTokens(current.text, data)} className="font-hand text-4xl leading-tight text-night" />}
                {current.image && <SmartImage src={current.image} alt="" className="mx-auto mt-3 max-h-48 rounded-sm object-contain" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {previous.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Earlier reasons">
            {previous.map((r, i) => (
              <li key={r.id} className="note max-w-[10rem] rounded-sm px-2 py-1 font-hand text-lg text-ink/80" style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
                {fillTokens(r.text, data) || '🌻'}
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm font-bold text-ink/70">{n} / {reasons.length}</p>
        <Button onClick={() => (finished ? onDone() : setN(n + 1))}>
          {finished ? 'Continue →' : n === 0 ? 'Open one' : 'Another one'}
        </Button>
      </div>
    </SceneShell>
  )
}
