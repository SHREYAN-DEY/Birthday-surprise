import { useRef, useState } from 'react'
import SmartImage from '../../components/Common/SmartImage.jsx'
import { storeImage, removeStored } from '../../utils/imageService.js'
import { REF_PATTERN } from '../../utils/birthdaySchema.js'
import { inputClass } from './FormField.jsx'

const btn = 'min-h-11 cursor-pointer rounded-lg border-2 border-sky-mid bg-white px-3 text-sm font-bold text-stone-800 hover:bg-sky-soft'

// Upload (click or drag & drop), preview, replace, remove. Photos are validated, resized and stored safely.
export default function ImageUploader({ label, value, onChange, hint, alt = '' }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)
  const [manual, setManual] = useState('')

  async function handleFiles(files) {
    const file = files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const ref = await storeImage(file)
      const old = value
      onChange(ref)
      if (old) removeStored(old)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function applyManual() {
    const v = manual.trim()
    if (!v) return
    if (!REF_PATTERN.test(v) || v.startsWith('idb:')) {
      setError('Use a path that starts with / (like /images/memories/photo.jpg) or an https:// link.')
      return
    }
    setError('')
    onChange(v)
    setManual('')
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-stone-800">{label}</p>
      <div
        className={`flex flex-wrap items-center gap-3 rounded-lg border-2 border-dashed p-3 ${drag ? 'border-heart bg-blush/40' : 'border-sky-mid bg-white/60'}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
      >
        {value ? (
          <SmartImage src={value} alt={alt || label} className="h-24 w-24 rounded object-cover" />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded bg-stone-100 text-center text-xs text-stone-500">No photo yet</div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <label className={`${btn} inline-flex items-center`}>
              {busy ? 'Working…' : value ? 'Replace' : 'Choose photo'}
              <input ref={inputRef} type="file" className="sr-only" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => handleFiles(e.target.files)} />
            </label>
            {value && <button type="button" className={btn} onClick={() => { removeStored(value); onChange('') }}>Remove</button>}
          </div>
          <p className="text-xs text-stone-600">or drag a photo here · JPEG, PNG or WebP · up to 8 MB</p>
        </div>
      </div>
      <details className="text-sm text-stone-700">
        <summary className="cursor-pointer">Use a file path or link instead</summary>
        <div className="mt-2 flex gap-2">
          <input className={inputClass} value={manual} onChange={(e) => setManual(e.target.value)} placeholder="/images/memories/us.jpg" aria-label={`${label} path or link`} />
          <button type="button" className={btn} onClick={applyManual}>Use</button>
        </div>
      </details>
      {hint && <p className="text-xs text-stone-600">{hint}</p>}
      {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
    </div>
  )
}
