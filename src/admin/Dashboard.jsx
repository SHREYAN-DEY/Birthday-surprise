import { useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import AdminSidebar from './AdminSidebar.jsx'
import { SECTIONS } from './sections/index.js'
import { useBirthdayData } from '../hooks/useBirthdayData.js'
import { SCENES } from '../scenes/index.js'

// The preview is the REAL experience in an iframe. It reads the same saved draft, so it updates as you type.
function PreviewPane({ scene, onScene }) {
  const [open, setOpen] = useState(true)
  return (
    <aside aria-label="Live preview" className="lg:sticky lg:top-4 lg:self-start">
      <div className="rounded-xl border-2 border-sky-mid bg-white/80 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="font-bold">Live preview</h2>
          <button type="button" className="min-h-9 cursor-pointer rounded border-2 border-sky-mid bg-white px-3 text-sm lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className={open ? 'block' : 'hidden lg:block'}>
          <label className="mb-2 block text-xs font-bold" htmlFor="pv-scene">Scene</label>
          <select id="pv-scene" value={scene} onChange={(e) => onScene(e.target.value)} className="mb-3 w-full rounded border-2 border-sky-mid bg-white px-2 py-2">
            {SCENES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <iframe
            key={scene}
            title="Birthday experience preview"
            src={`/preview?embed=1&scene=${scene}`}
            className="h-[560px] w-full rounded-lg border-2 border-sky-mid bg-white lg:h-[640px]"
          />
        </div>
      </div>
    </aside>
  )
}

export default function Dashboard({ onLogout }) {
  const { saveStatus, serverError, saveNow } = useBirthdayData()
  const [activeId, setActiveId] = useState('general')
  const [sceneOverride, setSceneOverride] = useState(null)
  const section = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0]
  const scene = sceneOverride || section.previewScene || 'welcome'
  const Active = section.Component

  return (
    <AdminLayout
      saveStatus={saveStatus} serverError={serverError} onSave={saveNow} onLogout={onLogout}
      sidebar={<AdminSidebar sections={SECTIONS} active={activeId} onSelect={(id) => { setActiveId(id); setSceneOverride(null) }} />}
      preview={<PreviewPane scene={scene} onScene={setSceneOverride} />}
    >
      <h2 className="mb-4 text-2xl font-bold">{section.icon} {section.label}</h2>
      <Active />
    </AdminLayout>
  )
}
