import FormField from '../components/FormField.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'

const USAGE = [
  ['opening', 'Opening'],
  ['memories', 'Memories'],
  ['finalReveal', 'Final reveal'],
  ['finalSurprise', 'Final surprise'],
]

export default function HerDetails() {
  const { data, setSection } = useBirthdayData()
  const h = data.her
  const set = (patch) => setSection('her', (prev) => ({ ...prev, ...patch }))
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">Tip: type <code>[HER_NAME]</code> in any message and it turns into her name.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" max={100} value={h.name} onChange={(v) => set({ name: v })} />
        <FormField label="Nickname" max={100} value={h.nickname} onChange={(v) => set({ nickname: v })} hint="Used if the name is empty." />
        <FormField label="Birthday" type="date" value={h.birthday} onChange={(v) => set({ birthday: v })} />
        <FormField label="Age (optional)" max={3} value={h.age} onChange={(v) => set({ age: v.replace(/\D/g, '') })} />
        <FormField label="Favorite color" max={60} value={h.favoriteColor} onChange={(v) => set({ favoriteColor: v })} />
        <FormField label="Favorite character" max={100} value={h.favoriteCharacter} onChange={(v) => set({ favoriteCharacter: v })} />
        <FormField label="Favorite flower" max={100} value={h.favoriteFlower} onChange={(v) => set({ favoriteFlower: v })} />
        <FormField label="Favorite food" max={100} value={h.favoriteFood} onChange={(v) => set({ favoriteFood: v })} />
        <FormField label="Favorite song" max={150} value={h.favoriteSong} onChange={(v) => set({ favoriteSong: v })} />
      </div>
      <FormField label="Short description" multiline max={500} value={h.description} onChange={(v) => set({ description: v })} />
      <ImageUploader label="Profile picture" value={h.profileImage} onChange={(v) => set({ profileImage: v })} alt="Her profile picture" />
      <fieldset className="space-y-2">
        <legend className="text-sm font-bold text-stone-800">Show the profile picture in:</legend>
        {USAGE.map(([key, label]) => (
          <label key={key} className="flex min-h-9 items-center gap-2 text-stone-800">
            <input type="checkbox" className="h-5 w-5 accent-heart" checked={!!h.profileUsage[key]} onChange={(e) => set({ profileUsage: { ...h.profileUsage, [key]: e.target.checked } })} />
            {label}
          </label>
        ))}
      </fieldset>
    </div>
  )
}
