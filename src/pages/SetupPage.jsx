import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../admin/Dashboard.jsx'
import LoginForm from '../admin/components/LoginForm.jsx'
import { useAdminAuth } from '../admin/useAdminAuth.js'
import { useBirthdayData } from '../hooks/useBirthdayData.js'

const Notice = ({ children }) => (
  <main className="grid min-h-screen place-items-center bg-stone-50 p-6 text-center text-stone-700">
    <div className="max-w-md space-y-3">{children}<p><Link to="/" className="font-bold text-sky-deep underline">Back to the experience</Link></p></div>
  </main>
)

// With a backend, the dashboard only appears after a real server-side login.
// Without one, it edits only this browser's local copy.
export default function SetupPage() {
  const { mode } = useBirthdayData()
  if (mode === 'server') return <ServerGate />
  if (import.meta.env.PROD && import.meta.env.VITE_ALLOW_SETUP_IN_PROD !== 'true') {
    return (
      <Notice>
        <h1 className="text-2xl font-bold">Setup is switched off here</h1>
        <p>This deployed copy has no backend, so edits would only change one browser. Edit locally with <code>npm run dev</code>, or turn on the backend.</p>
      </Notice>
    )
  }
  return <Dashboard />
}

function ServerGate() {
  const auth = useAdminAuth()
  const { loadFromServer, setServerSync, pushNow } = useBirthdayData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (auth.state !== 'authed') {
      setServerSync(false)
      setReady(false)
      return undefined
    }
    let alive = true
    ;(async () => {
      try {
        const r = await loadFromServer()
        setServerSync(true)
        if (r === 'empty') pushNow()
      } catch { /* shown in the save indicator */ }
      if (alive) setReady(true)
    })()
    return () => { alive = false; setServerSync(false) }
  }, [auth.state, loadFromServer, setServerSync, pushNow])

  if (auth.state === 'checking') return <Notice><p role="status">Checking your session…</p></Notice>
  if (auth.state === 'offline') return <Notice><h1 className="text-2xl font-bold">Can't reach the server</h1><p>The experience still works from cached data. Try /setup again later.</p></Notice>
  if (auth.state === 'anon') return <LoginForm onLogin={auth.login} error={auth.error} />
  if (!ready) return <Notice><p role="status">Loading your birthday data…</p></Notice>
  return <Dashboard onLogout={auth.logout} />
}
