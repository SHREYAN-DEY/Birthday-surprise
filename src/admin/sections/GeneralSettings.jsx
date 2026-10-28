import FormField from '../components/FormField.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'

export default function GeneralSettings() {
  const { data, setSection } = useBirthdayData()
  const g = data.general
  const set = (patch) => setSection('general', (prev) => ({ ...prev, ...patch }))
  return (
    <div className="space-y-4">
      <FormField label="Browser tab title" max={100} value={g.pageTitle} onChange={(v) => set({ pageTitle: v })} />
      <ImageUploader label="Favorite couple photo (final reveal)" value={g.couplePhoto} onChange={(v) => set({ couplePhoto: v })} alt="The two of us" />
      <FormField label="Couple photo caption (optional)" max={200} value={g.couplePhotoCaption} onChange={(v) => set({ couplePhotoCaption: v })} />
    </div>
  )
}
