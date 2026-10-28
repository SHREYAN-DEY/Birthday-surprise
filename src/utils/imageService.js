import { USE_BACKEND, api } from './api.js'
import { validateImageFile, validateAudioFile } from './imageValidation.js'
import { putBlob, getBlob, deleteBlob, forgetMediaUrl, listBlobIds } from './imageStore.js'
import { collectRefs, mapRefs } from './birthdaySchema.js'

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That picture couldn't be opened.")) }
    img.src = url
  })
}
const toBlob = (canvas, type, q) => new Promise((resolve) => canvas.toBlob(resolve, type, q))

// Shrinks big phone photos (max 1600px) and re-encodes them. This keeps pages fast and
// also strips hidden metadata such as GPS location from the photo.
async function resizeImage(file, max = 1600) {
  const img = await loadImage(file)
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  let blob = await toBlob(canvas, 'image/webp', 0.86)
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', 0.88)
  if (!blob) throw new Error("That picture couldn't be processed.")
  return blob
}

export async function storeImage(file) {
  await validateImageFile(file)
  const blob = await resizeImage(file)
  if (USE_BACKEND) {
    const { url } = await api.upload(blob, 'image', blob.type === 'image/webp' ? 'photo.webp' : 'photo.jpg')
    return url
  }
  return putBlob(blob)
}

export async function storeAudio(file) {
  await validateAudioFile(file)
  if (USE_BACKEND) {
    const { url } = await api.upload(new File([file], 'song.mp3', { type: 'audio/mpeg' }), 'audio', 'song.mp3')
    return url
  }
  return putBlob(file)
}

// Best-effort delete of a file we stored earlier
export async function removeStored(ref) {
  if (!ref) return
  try {
    if (ref.startsWith('idb:')) {
      await deleteBlob(ref)
      forgetMediaUrl(ref)
    } else if (USE_BACKEND && /^\/uploads\/[0-9a-f-]{36}\.(jpg|png|webp|mp3)$/i.test(ref)) {
      await api.deleteUpload(ref.split('/').pop())
    }
  } catch { /* nothing to clean up */ }
}

// Local-mode housekeeping: delete browser-stored photos no longer used anywhere
export async function cleanupUnusedImages(data) {
  const used = new Set(collectRefs(data))
  const all = await listBlobIds()
  let removed = 0
  for (const id of all) {
    if (!used.has(id)) {
      await deleteBlob(id)
      forgetMediaUrl(id)
      removed++
    }
  }
  return removed
}

// Server mode: re-upload photos that were saved only in this browser, then swap the references
export async function migrateLocalImages(data) {
  const map = new Map()
  let failed = 0
  for (const ref of new Set(collectRefs(data).filter((r) => r.startsWith('idb:')))) {
    try {
      const blob = await getBlob(ref)
      if (!blob) { failed++; continue }
      const isAudio = ref === data.music.src
      const kind = isAudio ? 'audio' : 'image'
      const name = isAudio ? 'song.mp3' : blob.type === 'image/webp' ? 'photo.webp' : 'photo.jpg'
      const { url } = await api.upload(blob, kind, name)
      map.set(ref, url)
    } catch {
      failed++
    }
  }
  return { data: mapRefs(data, (r) => map.get(r) ?? r), moved: map.size, failed }
}
