import { motion } from 'motion/react'
import SmartImage from '../Common/SmartImage.jsx'
import { seeded } from '../../utils/randomPosition.js'
import { formatDate } from '../../utils/text.js'

const WIDTHS = ['w-40', 'w-44', 'w-52', 'w-36']
const TAPES = ['', 'pink', 'blue']

// A polaroid. Rotation, size and tape are different for every photo, so nothing looks stamped out.
export default function PhotoCard({ memory, index, onOpen }) {
  const rot = (seeded(index, 1) - 0.5) * 10
  const width = WIDTHS[Math.floor(seeded(index, 2) * WIDTHS.length)]
  const lift = Math.round((seeded(index, 3) - 0.4) * 36)
  const tape = TAPES[index % TAPES.length]
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(memory)}
      className={`polaroid ${width} cursor-pointer text-left`}
      style={{ rotate: rot, marginTop: lift }}
      whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Open memory: ${memory.title || memory.caption || 'photo'}`}
    >
      <span className={`tape ${tape}`} aria-hidden="true" />
      <SmartImage src={memory.image} alt="" className="aspect-square w-full object-cover" />
      <span className="mt-2 block font-hand text-xl leading-tight text-night">{memory.title || memory.caption}</span>
      {memory.date && <span className="block text-xs text-ink/70">{formatDate(memory.date)}</span>}
    </motion.button>
  )
}
