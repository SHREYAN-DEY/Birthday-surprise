import FormField from '../components/FormField.jsx'
import RichTextEditor from '../components/RichTextEditor.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import ListEditor from '../components/ListEditor.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { newId } from '../../utils/id.js'

const TRIGGERS = [
  { value: 'heart', label: '❤️ Hidden heart' },
  { value: 'gift', label: '🎁 "Do not open" box' },
  { value: 'cloud', label: '☁️ Cloud' },
  { value: 'star', label: '⭐ Star (3 clicks)' },
  { value: 'sunflower', label: '🌻 Sunflower (many pokes)' },
  { value: 'mascot', label: '🐾 Mascot (3 clicks)' },
  { value: 'final', label: '🌙 Tiny heart on the final screen' },
]
const fields = [
  { key: 'trigger', label: 'Where is it hidden?', type: 'select', options: TRIGGERS },
  { key: 'message', label: 'Secret message', type: 'rich', max: 2000, rows: 3 },
  { key: 'image', label: 'Picture (optional)', type: 'image' },
]

export default function SecretsManager() {
  const { data, setSection } = useBirthdayData()
  const fs = data.finalSurprise
  const setFs = (patch) => setSection('finalSurprise', (prev) => ({ ...prev, ...patch }))
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-stone-800">🎁 The secret final surprise</h3>
        <p className="text-sm text-stone-600">The very last gift. Something only you could give: a note, a promise, an inside joke, a favorite photo. The scene is skipped if all of this is empty.</p>
        <FormField label="Title" max={150} value={fs.title} onChange={(v) => setFs({ title: v })} />
        <RichTextEditor label="Message" value={fs.message} onChange={(v) => setFs({ message: v })} rows={6} preview={false} />
        <ImageUploader label="Picture (optional)" value={fs.image} onChange={(v) => setFs({ image: v })} alt="Final surprise" />
      </section>
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-stone-800">Easter-egg secrets</h3>
        <p className="text-sm text-stone-600">Hidden messages she can find by poking around. Several secrets can share one hiding place; they show one by one.</p>
        <ListEditor items={data.secrets} onChange={(v) => setSection('secrets', v)} fields={fields}
          makeItem={() => ({ id: newId(), trigger: 'heart', message: '', image: '' })}
          titleOf={(s) => `${TRIGGERS.find((t) => t.value === s.trigger)?.label || ''} ${s.message}`} addLabel="Add a secret" max={50} />
      </section>
    </div>
  )
}
