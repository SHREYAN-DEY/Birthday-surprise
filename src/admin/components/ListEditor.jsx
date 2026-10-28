import FormField from './FormField.jsx'
import RichTextEditor from './RichTextEditor.jsx'
import ImageUploader from './ImageUploader.jsx'
import { removeStored } from '../../utils/imageService.js'

const smallBtn = 'min-h-9 min-w-9 cursor-pointer rounded border-2 border-sky-mid bg-white px-2 text-sm text-stone-800 hover:bg-sky-soft disabled:opacity-40'

function renderField(f, item, update) {
  const v = item[f.key]
  switch (f.type) {
    case 'image':
      return <ImageUploader key={f.key} label={f.label} value={v} onChange={(x) => update({ [f.key]: x })} />
    case 'rich':
      return <RichTextEditor key={f.key} label={f.label} value={v} max={f.max} rows={f.rows || 4} onChange={(x) => update({ [f.key]: x })} preview={false} />
    case 'lines':
      return (
        <FormField key={f.key} label={f.label} multiline rows={4} hint={f.hint} value={(v || []).join('\n')}
          onChange={(x) => update({ [f.key]: x.split('\n').slice(0, 20) })} />
      )
    case 'select':
      return <FormField key={f.key} label={f.label} options={f.options} value={v} onChange={(x) => update({ [f.key]: x })} />
    default:
      return (
        <FormField key={f.key} label={f.label} type={f.type || 'text'} multiline={f.type === 'textarea'} rows={f.rows || 3}
          max={f.max} placeholder={f.placeholder} hint={f.hint} value={v} onChange={(x) => update({ [f.key]: x })} />
      )
  }
}

// One editor for every list: add, edit, delete, reorder. Keeps each manager tiny.
export default function ListEditor({ items, onChange, fields, makeItem, titleOf, addLabel = 'Add', emptyText = 'Nothing here yet.', max = 100 }) {
  const update = (i, patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const copy = [...items]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }
  const remove = (i) => {
    if (!window.confirm('Delete this item?')) return
    fields.filter((f) => f.type === 'image').forEach((f) => removeStored(items[i][f.key]))
    onChange(items.filter((_, k) => k !== i))
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-lg bg-white/70 p-3 text-sm text-stone-600">{emptyText}</p>}
      <ol className="space-y-3">
        {items.map((it, i) => (
          <li key={it.id} className="rounded-lg border-2 border-sky-mid bg-white/80">
            <details open={items.length <= 3}>
              <summary className="flex cursor-pointer flex-wrap items-center gap-2 p-3">
                <span className="min-w-0 flex-1 truncate font-bold text-stone-800">{i + 1}. {titleOf(it, i) || 'Untitled'}</span>
              </summary>
              <div className="space-y-3 border-t border-sky-mid/60 p-3">
                {fields.map((f) => renderField(f, it, (patch) => update(i, patch)))}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="button" className={smallBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑ Up</button>
                  <button type="button" className={smallBtn} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓ Down</button>
                  <button type="button" className={`${smallBtn} text-red-700`} onClick={() => remove(i)}>Delete</button>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <button type="button" disabled={items.length >= max} onClick={() => onChange([...items, makeItem()])}
        className="min-h-11 cursor-pointer rounded-lg border-2 border-heart bg-heart px-4 font-bold text-white disabled:opacity-50">
        + {addLabel}
      </button>
    </div>
  )
}
