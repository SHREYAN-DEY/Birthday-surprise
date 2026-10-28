import { useCallback, useState } from 'react'

// Tiny useState that remembers its value. Never throws if storage is blocked or corrupted.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : JSON.parse(raw)
    } catch {
      return initial
    }
  })
  const set = useCallback(
    (next) => {
      setValue(next)
      try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
    },
    [key],
  )
  return [value, set]
}
