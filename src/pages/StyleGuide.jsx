import Button from '../components/Button/Button.jsx'
import Cloud from '../components/Cloud/Cloud.jsx'
import Sparkles from '../components/Sparkles/Sparkles.jsx'
import Heart from '../components/Doodles/Heart.jsx'
import Star from '../components/Doodles/Star.jsx'
import Character from '../components/Character/Character.jsx'
import SunflowerHead from '../components/Sunflower/SunflowerHead.jsx'

const swatches = [
  ['sky-soft', 'bg-sky-soft'], ['sky-mid', 'bg-sky-mid'], ['sky-deep', 'bg-sky-deep'],
  ['night', 'bg-night'], ['blush', 'bg-blush'], ['heart', 'bg-heart'],
  ['sun', 'bg-sun'], ['leaf', 'bg-leaf'], ['paper', 'bg-paper'],
]

// Development-only page (the route is not registered in production builds)
export default function StyleGuide() {
  return (
    <main className="relative min-h-screen overflow-hidden p-6">
      <Sparkles count={14} />
      <div className="relative mx-auto max-w-xl space-y-8">
        <h1 className="font-hand text-5xl">Style guide</h1>
        <div className="grid grid-cols-3 gap-2">
          {swatches.map(([name, cls]) => (
            <div key={name} className={`${cls} rounded-lg border border-ink/20 p-3 text-sm ${['night', 'sky-deep', 'heart'].includes(name) ? 'text-white' : 'text-ink'}`}>{name}</div>
          ))}
        </div>
        <section className="paper -rotate-1 rounded-sm p-5">
          <p className="font-hand text-3xl">a handwritten note, slightly crooked ♡</p>
        </section>
        <div className="flex flex-wrap gap-3"><Button>YES ❤️</Button><Button variant="soft">NO 🙈</Button></div>
        <div className="relative flex h-40 items-center gap-4 rounded-xl bg-sky-mid/50 px-4">
          <Cloud float className="w-28 text-cloud" /><Heart className="h-8 w-8 text-heart" /><Star className="h-8 w-8 text-sun" />
          <Character className="w-24" /><SunflowerHead seed={2} className="w-16" />
        </div>
      </div>
    </main>
  )
}
