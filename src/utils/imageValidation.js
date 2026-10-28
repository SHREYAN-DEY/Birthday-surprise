export const MAX_IMAGE_BYTES = 8 * 1024 * 1024
export const MAX_AUDIO_BYTES = 15 * 1024 * 1024
const EXT = { 'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/webp': ['webp'] }

async function head(file, n = 12) {
  return new Uint8Array(await file.slice(0, n).arrayBuffer())
}

// Looks at the actual first bytes of the file ("magic numbers"), not just its name or MIME type
export async function sniffImageType(file) {
  const b = await head(file)
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png'
  const s = (from, to) => String.fromCharCode(...b.slice(from, to))
  if (s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return 'image/webp'
  return null
}

export async function validateImageFile(file) {
  if (!(file instanceof Blob)) throw new Error('No file selected.')
  if (file.size === 0) throw new Error('That file is empty.')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('That photo is too big (max 8 MB).')
  const real = await sniffImageType(file)
  if (!real) throw new Error('Please choose a JPEG, PNG or WebP photo.')
  if (file.name) {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!EXT[real].includes(ext)) throw new Error("The file name doesn't match the picture inside.")
  }
  return real
}

export async function validateAudioFile(file) {
  if (!(file instanceof Blob)) throw new Error('No file selected.')
  if (file.size === 0) throw new Error('That file is empty.')
  if (file.size > MAX_AUDIO_BYTES) throw new Error('That song is too big (max 15 MB).')
  if (file.name && file.name.split('.').pop().toLowerCase() !== 'mp3') throw new Error('Please choose an .mp3 file.')
  const b = await head(file, 3)
  const isId3 = b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33
  const isFrame = b[0] === 0xff && (b[1] & 0xe0) === 0xe0
  if (!isId3 && !isFrame) throw new Error("That doesn't look like a real MP3 file.")
}
