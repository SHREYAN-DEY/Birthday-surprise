import { useRef, useState } from 'react'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { exportBirthdayData } from '../../utils/exportData.js'
import { readBackupFile } from '../../utils/importData.js'
import { cleanupUnusedImages, migrateLocalImages } from '../../utils/imageService.js'
import { collectRefs } from '../../utils/birthdaySchema.js'

const btn = 'min-h-11 cursor-pointer rounded-lg border-2 border-sky-mid bg-white px-4 text-sm font-bold text-stone-800 hover:bg-sky-soft disabled:opacity-50'

export default function SettingsSection() {
  const { data, mode, replaceAll, reset, saveNow, storageWarning } = useBirthdayData()
  const fileRef = useRef(null)
  const [pending, setPending] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const localPhotos = collectRefs(data).filter((r) => r.startsWith('idb:')).length

  async function pickFile(file) {
    setErr(''); setMsg(''); setPending(null)
    try { setPending(await readBackupFile(file)) } catch (e) { setErr(e.message) }
    if (fileRef.current) fileRef.current.value = ''
  }

  async function run(fn) {
    setBusy(true); setErr(''); setMsg('')
    try { setMsg(await fn()) } catch (e) { setErr(e.message || 'Something went wrong. Please try again.') }
    setBusy(false)
  }

  return (
    <div className="space-y-8">
      {storageWarning && (
        <p role="alert" className="rounded bg-amber-100 p-3 text-sm text-amber-900">
          Saved data in this browser was unreadable, so it was ignored and defaults were loaded. A copy was kept under <code>birthdayExperience:v1:corrupt</code>.
        </p>
      )}

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-stone-800">Backup</h3>
        <p className="text-sm text-stone-600">The backup file holds your text and settings. Photos are not inside it, only references to them.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => exportBirthdayData(data)}>Export birthday data</button>
          <label className={`${btn} inline-flex items-center`}>
            Import birthday data
            <input ref={fileRef} type="file" accept=".json,application/json" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
          </label>
        </div>
        {pending && (
          <div className="space-y-2 rounded-lg border-2 border-sky-mid bg-white p-3 text-sm text-stone-800">
            <p className="font-bold">This backup contains:</p>
            <p>{pending.summary.memories} memories · {pending.summary.questions} questions · {pending.summary.reasons} reasons · {pending.summary.flowers} flower messages · {pending.summary.secrets} secrets · {pending.summary.dates} dates</p>
            {pending.browserOnlyPhotos > 0 && <p className="text-amber-900">{pending.browserOnlyPhotos} photo(s) were stored in another browser and won't show here until re-added.</p>}
            <p>Importing replaces what you have now.</p>
            <div className="flex gap-2">
              <button type="button" className="min-h-11 cursor-pointer rounded-lg bg-heart px-4 font-bold text-white" onClick={() => { replaceAll(pending.data); setPending(null); setMsg('Imported ✓') }}>Replace my data</button>
              <button type="button" className={btn} onClick={() => setPending(null)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-stone-800">Housekeeping</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} disabled={busy} onClick={() => run(async () => { const ok = await saveNow(); return ok ? 'Saved ✓' : 'Could not save.' })}>Save now</button>
          {mode === 'local' && (
            <button type="button" className={btn} disabled={busy} onClick={() => run(async () => `Removed ${await cleanupUnusedImages(data)} unused photo(s).`)}>Clean up unused photos</button>
          )}
          {mode === 'server' && localPhotos > 0 && (
            <button type="button" className={btn} disabled={busy} onClick={() => run(async () => {
              const r = await migrateLocalImages(data)
              replaceAll(r.data)
              return `Moved ${r.moved} photo(s) to the server${r.failed ? `, ${r.failed} failed` : ''}.`
            })}>Move {localPhotos} browser-only photo(s) to the server</button>
          )}
          <button type="button" className={`${btn} text-red-700`} onClick={() => { if (window.confirm('Reset everything to the defaults? This cannot be undone (export a backup first).')) { reset(); setMsg('Reset to defaults.') } }}>Reset everything</button>
        </div>
      </section>

      <p className="text-sm text-stone-600">
        Mode: <strong>{mode === 'server' ? 'server (signed in, saved to the database)' : 'local (saved in this browser only)'}</strong>
      </p>
      {msg && <p role="status" className="text-sm font-bold text-green-800">{msg}</p>}
      {err && <p role="alert" className="text-sm font-bold text-red-700">{err}</p>}
    </div>
  )
}
