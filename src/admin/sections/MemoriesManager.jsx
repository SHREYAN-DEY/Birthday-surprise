import { useState } from 'react'
import ListEditor from '../components/ListEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { storeImage } from '../../utils/imageService.js'
import { newId } from '../../utils/id.js'

const fields = [
  { key: 'image', label: 'Photo', type: 'image' },
  { key: 'title', label: 'Title', max: 150 },
  { key: 'caption', label: 'Caption', type: 'textarea', max: 500 },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'location', label: 'Location (optional)', max: 150 },
  { key: 'personalNote', label: 'Personal note', type: 'textarea', rows: 3, max: 2000 },
]
const makeItem = () => ({ id: newId(), image: '', title: '', caption: '', date: '', location: '', personalNote: '' })

export default function MemoriesManager() {
  const { data, setSection } = useBirthdayData()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Drop many photos at once: each becomes a new memory you can then fill in
  async function addMany(files) {
    setBusy(true)
    setError('')
    const added = []
    for (const file of [...files].slice(0, 20)) {
      try {
        added.push({ ...makeItem(), image: await storeImage(file) })
      } catch (e) {
        setError(`${file.name}: ${e.message}`)
      }
    }
    if (added.length) setSection('memories', (prev) => [...prev, ...added].slice(0, 100))
    setBusy(false)
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg border-2 border-dashed border-sky-mid bg-white/60 p-4 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addMany(e.dataTransfer.files) }}
      >
        <p className="text-sm text-stone-700">{busy ? 'Adding photos…' : 'Drop several photos here to add them all at once,'}</p>
        <label className="mt-2 inline-flex min-h-11 cursor-pointer items-center rounded-lg border-2 border-sky-mid bg-white px-4 text-sm font-bold text-stone-800 hover:bg-sky-soft">
          or choose photos
          <input type="file" multiple className="sr-only" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => { addMany(e.target.files); e.target.value = '' }} />
        </label>
        {error && <p role="alert" className="mt-2 text-sm font-bold text-red-700">{error}</p>}
      </div>
      <ListEditor
        items={data.memories} onChange={(v) => setSection('memories', v)} fields={fields} makeItem={makeItem}
        titleOf={(m) => m.title || m.caption} addLabel="Add a memory" max={100}
        emptyText="No memories yet. Only real memories go here. The story skips the memory scenes until you add some."
      />
    </div>
  )
}
