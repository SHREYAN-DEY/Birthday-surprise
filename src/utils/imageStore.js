import { newId } from './id.js'

// Local-only mode keeps photos in the browser's IndexedDB. Your data (JSON) only holds a
// short reference like "idb:1234-..." so the JSON stays small and image-free.
const DB_NAME = 'birthdayMedia'
const STORE = 'files'
let dbPromise

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('Photo storage is not available in this browser.'))
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(new Error('Photo storage is not available (private browsing?).'))
    })
  }
  return dbPromise
}

function run(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const req = fn(t.objectStore(STORE))
        t.oncomplete = () => resolve(req.result)
        t.onerror = () => reject(t.error)
        t.onabort = () => reject(t.error)
      }),
  )
}

export async function putBlob(blob) {
  const id = `idb:${newId()}`
  await run('readwrite', (s) => s.put(blob, id))
  return id
}
export const getBlob = (id) => run('readonly', (s) => s.get(id))
export const deleteBlob = (id) => run('readwrite', (s) => s.delete(id))
export const listBlobIds = () => run('readonly', (s) => s.getAllKeys())

// ---- turning a reference into something an <img>/<audio> can use ----
const urlCache = new Map()

export function peekMediaUrl(ref) {
  if (!ref) return null
  return ref.startsWith('idb:') ? urlCache.get(ref) || null : ref
}
export async function resolveMediaUrl(ref) {
  if (!ref) return null
  if (!ref.startsWith('idb:')) return ref
  if (urlCache.has(ref)) return urlCache.get(ref)
  const blob = await getBlob(ref)
  if (!blob) return null
  const url = URL.createObjectURL(blob)
  urlCache.set(ref, url)
  return url
}
export function forgetMediaUrl(ref) {
  const u = urlCache.get(ref)
  if (u) {
    URL.revokeObjectURL(u)
    urlCache.delete(ref)
  }
}
