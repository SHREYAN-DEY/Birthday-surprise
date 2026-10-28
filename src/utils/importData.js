import { sanitizeBirthdayData, collectRefs } from './birthdaySchema.js'

const MAX_BYTES = 2 * 1024 * 1024
const KNOWN_KEYS = ['her', 'me', 'questions', 'memories', 'reasons', 'flowers', 'secrets', 'letter', 'theme']

// Reads a backup file as plain text, parses it as JSON, and cleans it. Nothing in it is ever executed.
export async function readBackupFile(file) {
  if (!file) throw new Error('No file selected.')
  if (file.size > MAX_BYTES) throw new Error('That file is too large to be a birthday backup.')
  let parsed
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error("That file isn't valid JSON.")
  }
  const payload = parsed && typeof parsed === 'object' && parsed.data && typeof parsed.data === 'object' ? parsed.data : parsed
  if (!payload || typeof payload !== 'object' || !KNOWN_KEYS.some((k) => k in payload)) {
    throw new Error("That doesn't look like a birthday backup.")
  }
  const data = sanitizeBirthdayData(payload)
  const refs = collectRefs(data)
  return {
    data,
    summary: {
      memories: data.memories.length, questions: data.questions.length, reasons: data.reasons.length,
      flowers: data.flowers.length, secrets: data.secrets.length, dates: data.importantDates.length,
    },
    browserOnlyPhotos: refs.filter((r) => r.startsWith('idb:')).length,
  }
}
