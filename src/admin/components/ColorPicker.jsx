import { useId } from 'react'

export default function ColorPicker({ label, value, onChange }) {
  const id = useId()
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-stone-800">{label}</label>
      <div className="flex items-center gap-2">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded border-2 border-sky-mid bg-white p-1" />
        <code className="rounded bg-white px-2 py-1 text-sm text-stone-700">{value}</code>
      </div>
    </div>
  )
}
