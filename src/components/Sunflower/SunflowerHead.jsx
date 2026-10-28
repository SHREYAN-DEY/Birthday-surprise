import { seeded } from '../../utils/randomPosition.js'

// Little seeds in a spiral, like a real sunflower
const SEEDS = Array.from({ length: 34 }, (_, i) => {
  const a = i * 2.39996
  const r = 2.6 * Math.sqrt(i + 1)
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r }
})

// `seed` makes every flower a little different: petal count and rotation
export default function SunflowerHead({ seed = 0, className = 'w-24' }) {
  const n = 13 + Math.floor(seeded(seed, 1) * 5)
  const rot = seeded(seed, 2) * 360
  const step = 360 / n
  const angles = Array.from({ length: n }, (_, i) => i * step)
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
      {angles.map((a) => (
        <ellipse key={`b${a}`} cx="50" cy="19" rx="6.2" ry="15" transform={`rotate(${a + step / 2} 50 50)`} className="fill-sun-deep" />
      ))}
      {angles.map((a) => (
        <ellipse key={`f${a}`} cx="50" cy="21" rx="5.8" ry="14" transform={`rotate(${a} 50 50)`} className="fill-sun" />
      ))}
      <circle cx="50" cy="50" r="17" fill="#6b4423" />
      <circle cx="50" cy="50" r="13" fill="#4a2f17" />
      {SEEDS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r="1.1" fill="#8a5a2b" />)}
    </svg>
  )
}
