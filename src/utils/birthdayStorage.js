import { sanitizeBirthdayData } from './birthdaySchema.js'

// Versioned key: if the data shape ever changes, bump to :v2 and migrate.
export const STORAGE_KEY = 'birthdayExperience:v1'

// Returns { data, status } where status is 'ok' | 'empty' | 'corrupt'. Never throws.
export function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: null, status: 'empty' }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') throw new Error('not an object')
    return { data: sanitizeBirthdayData(parsed), status: 'ok' }
  } catch {
    // Keep a copy of the unreadable text so it can be recovered by hand, then fall back to defaults
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) localStorage.setItem(`${STORAGE_KEY}:corrupt`, raw.slice(0, 200000))
    } catch { /* ignore */ }
    return { data: null, status: 'corrupt' }
  }
}

export function saveLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function clearLocal() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}
