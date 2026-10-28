import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import SunflowerPlant from '../../components/Sunflower/SunflowerPlant.jsx'
import SunflowerHead from '../../components/Sunflower/SunflowerHead.jsx'
import Bouquet from '../../components/Sunflower/Bouquet.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import EmptyNote from '../../components/Common/EmptyNote.jsx'
import SmartImage from '../../components/Common/SmartImage.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { usableFlowers } from '../../utils/selectors.js'
import { fillTokens } from '../../utils/text.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export default function BouquetScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.95)

  // The garden shows up to 7 plants; any extra messages are saved for the "pick one more" scene
  const flowers = useMemo(() => usableFlowers(data).slice(0, 7), [data])
  const total = flowers.length

  const [phase, setPhase] = useState({})     // index -> 'picking' | 'flying' | 'done'
  const [flying, setFlying] = useState([])   // flower heads currently travelling
  const [landed, setLanded] = useState(0)
  const [bounce, setBounce] = useState(0)
  const [message, setMessage] = useState(null)

  const headRefs = useRef([])
  const bouquetRef = useRef(null)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  async function pick(i) {
    if (phase[i]) return
    setPhase((p) => ({ ...p, [i]: 'picking' }))   // bend, wiggle, grow
    await wait(600)
    if (!alive.current) return
    const h = headRefs.current[i]?.getBoundingClientRect()
    const b = bouquetRef.current?.getBoundingClientRect()
    if (!h || !b) {
      land(i)
      return
    }
    setPhase((p) => ({ ...p, [i]: 'flying' }))
    setFlying((f) => [...f, {
      i, x: h.left + h.width / 2, y: h.top + h.height / 2, w: h.width,
      dx: b.left + b.width / 2 - (h.left + h.width / 2),
      dy: b.top + b.height * 0.35 - (h.top + h.height / 2),
    }])
  }

  function land(i) {
    if (!alive.current) return
    setFlying((f) => f.filter((x) => x.i !== i))
    setPhase((p) => ({ ...p, [i]: 'done' }))
    setLanded((n) => n + 1)
    setBounce((b) => b + 1)
    setMessage(flowers[i])
  }

  if (!total) {
    return <SceneShell><EmptyNote onDone={onDone}>No flower messages yet. Add some in /setup.</EmptyNote></SceneShell>
  }
  const allDone = landed >= total

  return (
    <SceneShell scroll className="bg-linear-to-b from-paper to-sun/40">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center gap-3 px-4 py-8 text-center">
        <div className="min-h-24 w-full" aria-live="polite">
          <AnimatePresence mode="wait">
            {message ? (
              <motion.div key={message.id} className="paper mx-auto max-w-sm rotate-1 rounded-sm px-4 py-3"
                initial={{ opacity: 0, y: 16, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: 1 }} exit={{ opacity: 0 }}>
                <p className="font-hand text-3xl leading-tight text-night">{fillTokens(message.message, data)}</p>
                {message.image && <SmartImage src={message.image} alt="" className="mx-auto mt-2 max-h-32 rounded-sm object-contain" />}
              </motion.div>
            ) : (
              <motion.p key="intro" className="font-hand text-4xl text-night sm:text-5xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Pick them one by one.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Bouquet count={landed} bounceKey={bounce} containerRef={bouquetRef} className="w-56 sm:w-64" />

        <div className="min-h-16">
          {allDone && (
            <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
              <p className="font-hand text-4xl text-heart">Look what you made 🌻</p>
              <Button onClick={onDone}>Next →</Button>
            </motion.div>
          )}
        </div>

        <div className="mt-2 flex w-full flex-wrap items-end justify-center gap-x-1 gap-y-2">
          {flowers.map((f, i) => (
            <div key={f.id} style={{ marginBottom: (i % 3) * 10 }}>
              <SunflowerPlant
                seed={i}
                phase={phase[i] || 'idle'}
                label={`Pick flower ${i + 1} of ${total}`}
                headRef={(el) => { headRefs.current[i] = el }}
                onPick={() => pick(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* flowers flying from the garden to the bouquet */}
      {flying.map((f) => (
        <motion.div
          key={f.i}
          className="pointer-events-none fixed z-50"
          style={{ left: f.x - f.w / 2, top: f.y - f.w / 2, width: f.w }}
          initial={{ x: 0, y: 0, scale: 1.3, rotate: 0 }}
          animate={{ x: [0, f.dx * 0.35, f.dx], y: [0, f.dy * 0.35 - 110, f.dy], scale: [1.3, 1.5, 0.5], rotate: [0, 160, 330] }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          onAnimationComplete={() => land(f.i)}
          aria-hidden="true"
        >
          <SunflowerHead seed={f.i} className="w-full" />
        </motion.div>
      ))}
    </SceneShell>
  )
}
