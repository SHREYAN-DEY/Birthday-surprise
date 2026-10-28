import SmartImage from './SmartImage.jsx'
import { formatDate } from '../../utils/text.js'

export default function MemoryDetail({ memory }) {
  const date = formatDate(memory.date)
  return (
    <article className="space-y-3">
      <div className="polaroid -rotate-1">
        <SmartImage src={memory.image} alt={memory.title || memory.caption || 'A memory'} className="max-h-[50vh] w-full object-contain bg-paper-edge/40" />
      </div>
      {memory.title && <h2 className="font-hand text-4xl leading-tight text-night">{memory.title}</h2>}
      {(date || memory.location) && (
        <p className="text-sm font-bold text-ink/70">
          {date}{date && memory.location ? ' · ' : ''}{memory.location && `📍 ${memory.location}`}
        </p>
      )}
      {memory.caption && <p className="text-ink">{memory.caption}</p>}
      {memory.personalNote && (
        <p className="note rotate-1 rounded-sm p-3 font-hand text-2xl leading-snug text-night">{memory.personalNote}</p>
      )}
    </article>
  )
}
