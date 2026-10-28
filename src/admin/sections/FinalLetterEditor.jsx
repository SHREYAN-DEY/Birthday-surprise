import FormField from '../components/FormField.jsx'
import RichTextEditor from '../components/RichTextEditor.jsx'
import LetterBody from '../../components/Common/LetterBody.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'

export default function FinalLetterEditor() {
  const { data, setSection } = useBirthdayData()
  const l = data.letter
  const set = (patch) => setSection('letter', (prev) => ({ ...prev, ...patch }))
  return (
    <div className="space-y-4">
      <FormField label="Opening" max={500} placeholder="Dear [HER_NAME]," value={l.opening} onChange={(v) => set({ opening: v })} />
      <RichTextEditor label="Main message" value={l.main} onChange={(v) => set({ main: v })} rows={8} preview={false} />
      <RichTextEditor label="Favorite memory" value={l.favoriteMemory} onChange={(v) => set({ favoriteMemory: v })} rows={5} preview={false} />
      <RichTextEditor label="Birthday wish" value={l.wish} onChange={(v) => set({ wish: v })} rows={4} preview={false} />
      <FormField label="Ending" multiline rows={2} max={1000} placeholder="Always yours," value={l.ending} onChange={(v) => set({ ending: v })} />
      <FormField label="My name (signature)" max={100} hint="Leave empty to use “My name” from My Details." value={l.signoff} onChange={(v) => set({ signoff: v })} />
      <div className="rounded-lg border-2 border-sky-mid bg-white/70 p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">Live preview</p>
        <div className="paper rounded-sm p-4"><LetterBody data={data} /></div>
      </div>
    </div>
  )
}
