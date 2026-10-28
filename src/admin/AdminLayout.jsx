import { Link } from 'react-router-dom'
import SaveIndicator from './components/SaveIndicator.jsx'

export default function AdminLayout({ saveStatus, serverError, onSave, onLogout, sidebar, children, preview }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b-2 border-sky-mid bg-white/95 px-4 py-2">
        <h1 className="text-xl font-bold">🎂 Birthday setup</h1>
        <SaveIndicator status={saveStatus} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" onClick={onSave} className="min-h-11 cursor-pointer rounded-lg bg-heart px-5 font-bold text-white">Save</button>
          <Link to="/preview" target="_blank" className="grid min-h-11 place-items-center rounded-lg border-2 border-sky-mid bg-white px-4 font-bold">Preview</Link>
          {onLogout && <button type="button" onClick={onLogout} className="min-h-11 cursor-pointer rounded-lg border-2 border-sky-mid bg-white px-4 font-bold">Sign out</button>}
        </div>
        {serverError && <p role="alert" className="w-full text-sm font-bold text-red-700">{serverError}</p>}
      </header>

      {/* phone: settings first, preview below. desktop: nav | settings | preview */}
      <div className="mx-auto grid max-w-[1400px] gap-5 p-4 lg:grid-cols-[210px_minmax(0,1fr)_minmax(320px,400px)]">
        {sidebar}
        <main className="min-w-0 rounded-xl border-2 border-sky-mid bg-white/70 p-4 sm:p-6">{children}</main>
        {preview}
      </div>
    </div>
  )
}
