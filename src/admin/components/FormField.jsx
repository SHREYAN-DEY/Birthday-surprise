import { useId } from 'react'

export const inputClass =
  'w-full rounded-lg border-2 border-sky-mid bg-white px-3 py-2 text-ink placeholder:text-ink/50'

// One labelled input. Pass `multiline` for a textarea or `options` for a dropdown.
export default function FormField({ label, value, onChange, type = 'text', multiline = false, rows = 3, max, hint, placeholder, options }) {
  const id = useId()
  const common = { id, value: value ?? '', maxLength: max, placeholder, className: inputClass }
  let control
  if (options) {
    control = (
      <select {...common} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    )
  } else if (multiline) {
    control = <textarea {...common} rows={rows} onChange={(e) => onChange(e.target.value)} />
  } else {
    control = <input {...common} type={type} onChange={(e) => onChange(e.target.value)} />
  }
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-stone-800">{label}</label>
      {control}
      {hint && <p className="text-xs text-stone-600">{hint}</p>}
      {max && multiline && <p className="text-right text-xs text-stone-500">{(value || '').length}/{max}</p>}
    </div>
  )
}
