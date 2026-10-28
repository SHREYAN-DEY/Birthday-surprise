import { useCallback, useEffect, useState } from 'react'
import { api } from '../utils/api.js'

// Asks the SERVER whether you are signed in. The browser never decides that by itself.
export function useAdminAuth() {
  const [state, setState] = useState('checking') // checking | anon | authed | offline
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    api.me()
      .then(() => alive && setState('authed'))
      .catch((e) => alive && setState(e.status === 401 ? 'anon' : 'offline'))
    return () => { alive = false }
  }, [])

  const login = useCallback(async (email, password) => {
    setError('')
    try {
      await api.login(email, password)
      setState('authed')
    } catch (e) {
      setError(
        e.status === 429 ? 'Too many attempts. Please wait a few minutes and try again.'
          : e.status === 401 ? 'Invalid email or password.'
            : 'Something went wrong. Please try again.',
      )
    }
  }, [])

  const logout = useCallback(async () => {
    try { await api.logout() } catch { /* already signed out */ }
    setState('anon')
  }, [])

  return { state, error, login, logout }
}
