import { useState } from 'react'
import { inputClass } from './FormField.jsx'

export default function LoginForm({ onLogin, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    await onLogin(email, password)
    setBusy(false)
  }

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border-2 border-sky-mid bg-white p-6">
        <h1 className="text-2xl font-bold text-stone-800">Sign in to setup</h1>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-bold text-stone-800">Email</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-bold text-stone-800">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
        {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="min-h-12 w-full cursor-pointer rounded-lg bg-heart font-bold text-white disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
