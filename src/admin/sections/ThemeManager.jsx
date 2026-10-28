import { useMemo } from 'react'
import ColorPicker from '../components/ColorPicker.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { PRESETS, buildTheme } from '../../context/ThemeContext.jsx'

const LABELS = { cinnamoroll: 'Cinnamoroll', sunflower: 'Sunflower', softpink: 'Soft Pink', custom: 'Custom' }

export default function ThemeManager() {
  const { data, setSection } = useBirthdayData()
  const t = data.theme
  const result = useMemo(() => buildTheme(t), [t])
  const set = (patch) => setSection('theme', (prev) => ({ ...prev, ...patch }))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Theme preset">
        {Object.keys(LABELS).map((p) => (
          <button key={p} type="button" role="radio" aria-checked={t.preset === p}
            onClick={() => set(p === 'custom' ? { preset: 'custom' } : { preset: p, ...PRESETS[p] })}
            className={`min-h-11 cursor-pointer rounded-full border-2 px-4 font-bold ${t.preset === p ? 'border-heart bg-heart text-white' : 'border-sky-mid bg-white text-stone-800'}`}>
            {LABELS[p]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorPicker label="Primary (buttons, hearts)" value={t.primary} onChange={(v) => set({ primary: v, preset: 'custom' })} />
        <ColorPicker label="Secondary (sky, borders)" value={t.secondary} onChange={(v) => set({ secondary: v, preset: 'custom' })} />
        <ColorPicker label="Accent (sunflowers, stars)" value={t.accent} onChange={(v) => set({ accent: v, preset: 'custom' })} />
        <ColorPicker label="Background (must be light)" value={t.background} onChange={(v) => set({ background: v, preset: 'custom' })} />
      </div>

      <div className="rounded-lg border-2 border-sky-mid p-4" style={{ background: result.resolved.background }}>
        <p className="font-hand text-3xl" style={{ color: '#1d2b4a' }}>This is how text looks on your background</p>
        <span className="mt-2 inline-block rounded-full px-5 py-2 font-bold text-white" style={{ background: result.resolved.primary }}>Button</span>
      </div>

      <p className="text-sm text-stone-700">Text contrast on this background: <strong>{result.textContrast.toFixed(1)}:1</strong> (4.5:1 or more is readable).</p>
      {result.warnings.map((w) => <p key={w} role="status" className="rounded bg-amber-100 p-2 text-sm text-amber-900">{w}</p>)}
    </div>
  )
}
