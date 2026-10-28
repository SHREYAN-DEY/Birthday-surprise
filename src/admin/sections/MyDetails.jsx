import FormField from '../components/FormField.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'

export default function MyDetails() {
  const { data, setSection } = useBirthdayData()
  const m = data.me
  const set = (patch) => setSection('me', (prev) => ({ ...prev, ...patch }))
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">Tip: <code>[MY_NAME]</code> in any message turns into your name.</p>
      <FormField label="My name" max={100} value={m.name} onChange={(v) => set({ name: v })} />
      <FormField label="My nickname" max={100} value={m.nickname} onChange={(v) => set({ nickname: v })} />
      <FormField label="Relationship title (optional)" max={100} value={m.relationshipTitle} onChange={(v) => set({ relationshipTitle: v })} />
      <FormField label="Short description (optional)" multiline max={500} value={m.description} onChange={(v) => set({ description: v })} />
    </div>
  )
}
