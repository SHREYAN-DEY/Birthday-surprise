import { useId, useRef } from 'react'
import RichText from '../../components/Common/RichText.jsx'
import { inputClass } from './FormField.jsx'

// Bold = **text**, italic = *text*. Stored as plain text, shown safely (no HTML).
export default function RichTextEditor({ label, value, onChange, max = 10000, rows = 8, hint, preview = true }) {
  const id = useId()
  const ref = useRef(null)

  function wrap(mark) {
    const el = ref.current
    if (!el) return
    const { selectionStart: s, selectionEnd: e } = el
    const selected = value.slice(s, e) || 'text'
    onChange((value.slice(0, s) + mark + selected + mark + value.slice(e)).slice(0, max))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(s + mark.length, s + mark.length + selected.length)
    })
  }
  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); wrap('**') }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); wrap('*') }
  }
  const btn = 'min-h-9 min-w-9 cursor-pointer rounded border-2 border-sky-mid bg-white px-2 text-stone-800 hover:bg-sky-soft'

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-stone-800">{label}</label>
      <div className="flex gap-2" role="group" aria-label="Formatting">
        <button type="button" className={`${btn} font-bold`} onClick={() => wrap('**')} aria-label="Bold">B</button>
        <button type="button" className={`${btn} italic`} onClick={() => wrap('*')} aria-label="Italic">I</button>
      </div>
      <textarea ref={ref} id={id} rows={rows} maxLength={max} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown} className={inputClass} />
      <p className="text-right text-xs text-stone-500">{(value || '').length}/{max}</p>
      {hint && <p className="text-xs text-stone-600">{hint}</p>}
      {preview && value?.trim() && (
        <div className="paper rounded-sm p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-500">Preview</p>
          <RichText text={value} className="font-hand text-2xl leading-snug text-night" />
        </div>
      )}
    </div>
  )
}
