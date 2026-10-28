import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { defaultBirthdayData } from '../data/defaultBirthdayData.js'
import { sanitizeBirthdayData } from '../utils/birthdaySchema.js'
import { loadLocal, saveLocal, STORAGE_KEY } from '../utils/birthdayStorage.js'
import { api, USE_BACKEND } from '../utils/api.js'

export const BirthdayContext = createContext(null)

const onAdminPath = () => /^\/(setup|preview)/.test(window.location.pathname)

export function BirthdayProvider({ children }) {
  const initial = useRef(null)
  if (!initial.current) initial.current = loadLocal()

  const [data, setData] = useState(initial.current.data ?? defaultBirthdayData)
  const [saveStatus, setSaveStatus] = useState('saved') // saving | saved | error
  const [serverError, setServerError] = useState('')
  const storageWarning = initial.current.status === 'corrupt'

  const dataRef = useRef(data)
  const serverSync = useRef(false)
  const localTimer = useRef(null)
  const pushTimer = useRef(null)

  const apply = useCallback((next) => {
    dataRef.current = next
    setData(next)
  }, [])

  // ---- pushing to the server (only when signed in on /setup) ----
  const pushNow = useCallback(async () => {
    if (!serverSync.current) return true
    setSaveStatus('saving')
    try {
      await api.saveBirthday(dataRef.current)
      setServerError('')
      setSaveStatus('saved')
      return true
    } catch (e) {
      setServerError(
        e.status === 400
          ? "The server rejected something. If you have photos saved only in this browser, use Settings → Move photos to the server."
          : e.status === 401 || e.status === 403
            ? 'Your session ended. Please sign in again.'
            : "Couldn't reach the server. Your changes are still saved in this browser.",
      )
      setSaveStatus('error')
      return false
    }
  }, [])

  const schedulePush = useCallback(() => {
    if (!serverSync.current) return
    setSaveStatus('saving')
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(pushNow, 1200)
  }, [pushNow])

  // ---- every edit goes through here ----
  const commit = useCallback((next) => {
    apply(next)
    setSaveStatus('saving')
    clearTimeout(localTimer.current)
    localTimer.current = setTimeout(() => {
      const ok = saveLocal(dataRef.current)
      if (!serverSync.current) setSaveStatus(ok ? 'saved' : 'error')
    }, 300)
    schedulePush()
  }, [apply, schedulePush])

  const setSection = useCallback((key, valueOrFn) => {
    const prev = dataRef.current
    const nextValue = typeof valueOrFn === 'function' ? valueOrFn(prev[key]) : valueOrFn
    commit({ ...prev, [key]: nextValue })
  }, [commit])

  const replaceAll = useCallback((raw) => commit(sanitizeBirthdayData(raw)), [commit])
  const reset = useCallback(() => commit(defaultBirthdayData), [commit])

  const saveNow = useCallback(async () => {
    clearTimeout(localTimer.current)
    clearTimeout(pushTimer.current)
    const ok = saveLocal(dataRef.current)
    if (serverSync.current) return pushNow()
    setSaveStatus(ok ? 'saved' : 'error')
    return ok
  }, [pushNow])

  const loadFromServer = useCallback(async () => {
    const res = await api.getBirthday()
    if (res?.data) {
      const next = sanitizeBirthdayData(res.data)
      apply(next)
      saveLocal(next)
      return 'loaded'
    }
    return 'empty'
  }, [apply])

  const setServerSync = useCallback((on) => { serverSync.current = on }, [])

  // ---- first load: where does the data come from? ----
  useEffect(() => {
    let alive = true
    const admin = onAdminPath()
    const hasLocal = initial.current.status === 'ok'
    ;(async () => {
      if (admin && hasLocal) return // the owner's draft wins in /setup and /preview
      if (USE_BACKEND && !admin) {
        try {
          const res = await api.getBirthday()
          if (res?.data && alive) {
            const next = sanitizeBirthdayData(res.data)
            apply(next)
            saveLocal(next) // offline cache
            return
          }
        } catch { /* server down: fall through to local/static */ }
      }
      if (!hasLocal) {
        try {
          const r = await fetch('/birthday-data.json', { cache: 'no-store' })
          if (r.ok && (r.headers.get('content-type') || '').includes('json') && alive) {
            apply(sanitizeBirthdayData(await r.json()))
          }
        } catch { /* no static file */ }
      }
    })()
    return () => { alive = false }
  }, [apply])

  // The /preview iframe hears about edits made in the /setup tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return
      const l = loadLocal()
      if (l.data) apply(l.data)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [apply])

  useEffect(() => () => {
    clearTimeout(localTimer.current)
    clearTimeout(pushTimer.current)
  }, [])

  const value = useMemo(
    () => ({
      data, mode: USE_BACKEND ? 'server' : 'local', saveStatus, serverError, storageWarning,
      setSection, replaceAll, reset, saveNow, loadFromServer, setServerSync, pushNow,
    }),
    [data, saveStatus, serverError, storageWarning, setSection, replaceAll, reset, saveNow, loadFromServer, setServerSync, pushNow],
  )

  return <BirthdayContext.Provider value={value}>{children}</BirthdayContext.Provider>
}
