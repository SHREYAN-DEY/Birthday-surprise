import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import SunflowerHead from '../../components/Sunflower/SunflowerHead.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import SmartImage from '../../components/Common/SmartImage.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { defaultFlowerPool } from '../../data/defaultMessages.js'
import { usableFlowers } from '../../utils/selectors.js'
import { fillTokens } from '../../utils/text.js'

export default function FlowerMessagesScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.9)
  const pool = [...usableFlowers(data).map((f) => ({ id: f.id, message: f.message, image: f.image })), ...defaultFlowerPool.map((m, i) => ({ id: `d${i}`, message: m, image: '' }))]
  const last = useRef(-1)
  const [current, setCurrent] = useState(null)
  const [count, setCount] = useState(0)

  function pickOne() {
    let i = Math.floor(Math.random() * pool.length)
    if (pool.length > 1 && i === last.current) i = (i + 1) % pool.length
    last.current = i
    setCurrent({ ...pool[i], n: count })
    setCount((c) => c + 1)
  }

  return (
    <SceneShell className="bg-linear-to-b from-sun/30 to-paper">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="min-h-64 w-full" aria-live="polite">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div key={current.n} className="flex flex-col items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 11 }}>
                  <SunflowerHead seed={current.n + 3} className="w-24" />
                </motion.div>
                <div className="paper max-w-sm -rotate-1 rounded-sm px-5 py-4">
                  <p className="font-hand text-4xl leading-tight text-night">{fillTokens(current.message, data)}</p>
                  {current.image && <SmartImage src={current.image} alt="" className="mx-auto mt-2 max-h-40 rounded-sm object-contain" />}
                </div>
              </motion.div>
            ) : (
              <motion.p key="intro" className="pt-16 font-hand text-4xl text-night sm:text-5xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                There are always more flowers.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={pickOne}>Pick one more flower</Button>
          {count > 0 && <Button variant="soft" onClick={onDone}>Continue →</Button>}
        </div>
      </div>
    </SceneShell>
  )
}
