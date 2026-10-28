import { Link, useSearchParams } from 'react-router-dom'
import BirthdayExperience from './BirthdayExperience.jsx'
import { SCENES } from '../scenes/index.js'

// Plays the real experience using your saved draft. Used on its own and inside the /setup preview pane.
export default function PreviewPage() {
  const [params, setParams] = useSearchParams()
  const scene = SCENES.some((s) => s.id === params.get('scene')) ? params.get('scene') : 'loading'
  const embed = params.get('embed') === '1'

  return (
    <>
      <BirthdayExperience key={scene} startScene={scene} />
      {!embed && (
        <div className="fixed bottom-3 left-3 z-[60] flex items-center gap-2 rounded-full border-2 border-sky-mid bg-white/95 p-1 pl-3 text-sm shadow">
          <label htmlFor="scene-select" className="font-bold">Scene</label>
          <select id="scene-select" value={scene} onChange={(e) => setParams({ scene: e.target.value })} className="rounded-full border border-sky-mid bg-white px-2 py-1">
            {SCENES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <Link to="/setup" className="rounded-full px-3 py-1 font-bold text-sky-deep underline">Setup</Link>
        </div>
      )}
    </>
  )
}
