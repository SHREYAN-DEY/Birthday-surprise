import { useMemo } from 'react'
import Star from '../Doodles/Star.jsx'
import { seeded } from '../../utils/randomPosition.js'

// Put inside a `relative` parent. Fills it, ignores clicks.
export default function Sparkles({ count = 10, className = 'text-sun' }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: seeded(i, 1) * 100,
        top: seeded(i, 2) * 100,
        size: 10 + seeded(i, 3) * 14,
        delay: seeded(i, 4) * 3,
      })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((s) => (
        <Star
          key={s.id}
          className={`absolute animate-twinkle ${className}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  )
}
