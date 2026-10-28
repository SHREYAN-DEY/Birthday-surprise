import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import { FaHeart, FaStar, FaCamera, FaMoon, FaSmile } from 'react-icons/fa'
import Cloud from '../../components/Cloud/Cloud.jsx'
import Button from '../../components/Button/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import EmptyNote from '../../components/Common/EmptyNote.jsx'
import MemoryDetail from '../../components/Common/MemoryDetail.jsx'
import ProfileBadge from '../../components/Common/ProfileBadge.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { usableMemories } from '../../utils/selectors.js'
import { seeded } from '../../utils/randomPosition.js'

const ICONS = [FaHeart, FaStar, FaCamera, FaMoon, FaSmile]

export default function MemoryClouds({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.7)
  const memories = usableMemories(data)
  const [found, setFound] = useState(() => new Set())
  const [openIndex, setOpenIndex] = useState(null)
  const close = useCallback(() => setOpenIndex(null), [])

  if (!memories.length) {
    return <SceneShell><EmptyNote onDone={onDone}>No memories yet. Add photos in /setup.</EmptyNote></SceneShell>
  }

  function open(i) {
    setOpenIndex(i)
    setFound((s) => new Set(s).add(i))
  }
  const canContinue = found.size >= Math.min(3, memories.length)

  return (
    <SceneShell scroll className="bg-linear-to-b from-sky-mid to-sky-soft">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center px-5 py-10 text-center">
        <ProfileBadge where="memories" className="mb-3 h-16 w-16" />
        <h1 className="font-hand text-4xl text-night sm:text-5xl">I hid some memories up here.</h1>
        <p className="mt-1 font-hand text-3xl text-night/80">Can you find them?</p>

        <ul className="mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {memories.map((m, i) => {
            const Icon = ICONS[i % ICONS.length]
            const done = found.has(i)
            const jx = Math.round((seeded(i, 21) - 0.5) * 24)
            const jy = Math.round((seeded(i, 22) - 0.5) * 24)
            return (
              <li key={m.id} className="grid place-items-center" style={{ transform: `translate(${jx}px, ${jy}px) rotate(${(seeded(i, 23) - 0.5) * 6}deg)` }}>
                <motion.button
                  type="button"
                  onClick={() => open(i)}
                  className="relative cursor-pointer"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + seeded(i, 24) * 3, repeat: Infinity, ease: 'easeInOut', delay: seeded(i, 25) * 2 }}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  aria-label={`Open cloud ${i + 1} of ${memories.length}${done ? ' (already found)' : ''}`}
                >
                  <Cloud className={`w-32 sm:w-36 ${done ? 'text-blush' : 'text-white'}`} />
                  <span className="absolute inset-0 grid place-items-center pt-2 text-2xl text-heart" aria-hidden="true">
                    <Icon />
                  </span>
                </motion.button>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 font-hand text-2xl text-night/80" aria-live="polite">{found.size} / {memories.length} found</p>
        <div className="mt-4 min-h-14">
          {canContinue && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={onDone}>{found.size === memories.length ? 'Show me more →' : "I've seen enough →"}</Button>
            </motion.div>
          )}
        </div>
      </div>

      <Modal open={openIndex !== null} onClose={close} label="Memory">
        {openIndex !== null && <MemoryDetail memory={memories[openIndex]} />}
      </Modal>
    </SceneShell>
  )
}
