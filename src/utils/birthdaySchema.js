import { defaultBirthdayData as D, SCHEMA_VERSION, SECRET_TRIGGERS, THEME_PRESETS } from '../data/defaultBirthdayData.js'
import { newId } from './id.js'

// This file is the client-side "bouncer". Anything that comes from localStorage,
// an imported file, or the server passes through here, so scenes never see weird data.
// (The server validates again with Zod: never trust the browser alone.)

const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const str = (v, max, fb = '') => (typeof v === 'string' ? v.replace(CTRL, '').slice(0, max) : fb)
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {})
const bool = (v, fb) => (typeof v === 'boolean' ? v : fb)
const hex = (v, fb) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : fb)
const day = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '')
const idOf = (v) => (typeof v === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(v) ? v : newId())

// Allowed image/audio references: a browser-stored file, a site path, or an https link.
// Anything else (javascript:, data:, //evil.com) becomes an empty string.
export const REF_PATTERN = /^(idb:[a-f0-9-]{36}|\/(?!\/)\S*|https:\/\/\S+)$/i
const ref = (v) => {
  const s = str(v, 600).trim()
  return REF_PATTERN.test(s) ? s : ''
}

const list = (v, fn, max) => (Array.isArray(v) ? v.slice(0, max).map((x) => fn(obj(x))) : null)

export function sanitizeBirthdayData(raw) {
  const r = obj(raw)
  const g = obj(r.general), h = obj(r.her), u = obj(h.profileUsage), m = obj(r.me)
  const l = obj(r.letter), fs = obj(r.finalSurprise), mu = obj(r.music), t = obj(r.theme)

  return {
    schemaVersion: SCHEMA_VERSION,
    general: {
      pageTitle: str(g.pageTitle, 100, D.general.pageTitle) || D.general.pageTitle,
      couplePhoto: ref(g.couplePhoto),
      couplePhotoCaption: str(g.couplePhotoCaption, 200),
    },
    her: {
      name: str(h.name, 100), nickname: str(h.nickname, 100), birthday: day(h.birthday),
      age: str(h.age, 3).replace(/\D/g, ''),
      favoriteColor: str(h.favoriteColor, 60), favoriteCharacter: str(h.favoriteCharacter, 100),
      favoriteFlower: str(h.favoriteFlower, 100), favoriteFood: str(h.favoriteFood, 100),
      favoriteSong: str(h.favoriteSong, 150), description: str(h.description, 500),
      profileImage: ref(h.profileImage),
      profileUsage: {
        opening: bool(u.opening, D.her.profileUsage.opening),
        memories: bool(u.memories, D.her.profileUsage.memories),
        finalReveal: bool(u.finalReveal, D.her.profileUsage.finalReveal),
        finalSurprise: bool(u.finalSurprise, D.her.profileUsage.finalSurprise),
      },
    },
    me: {
      name: str(m.name, 100), nickname: str(m.nickname, 100),
      relationshipTitle: str(m.relationshipTitle, 100), description: str(m.description, 500),
    },
    mainMessage: str(r.mainMessage, 10000),
    letter: {
      opening: str(l.opening, 500), main: str(l.main, 10000), favoriteMemory: str(l.favoriteMemory, 10000),
      wish: str(l.wish, 10000), ending: str(l.ending, 1000), signoff: str(l.signoff, 100),
    },
    questions:
      list(r.questions, (q) => ({
        id: idOf(q.id), question: str(q.question, 500), yesText: str(q.yesText, 60, 'YES'),
        noText: str(q.noText, 60, 'NO'), successMessage: str(q.successMessage, 200),
        noMessages: Array.isArray(q.noMessages) ? q.noMessages.slice(0, 20).map((x) => str(x, 200)) : [],
      }), 50) ?? D.questions,
    memories:
      list(r.memories, (x) => ({
        id: idOf(x.id), image: ref(x.image), title: str(x.title, 150), caption: str(x.caption, 500),
        date: day(x.date), location: str(x.location, 150), personalNote: str(x.personalNote, 2000),
      }), 100) ?? D.memories,
    reasons:
      list(r.reasons, (x) => ({ id: idOf(x.id), text: str(x.text, 1000), image: ref(x.image) }), 200) ?? D.reasons,
    flowers:
      list(r.flowers, (x) => ({ id: idOf(x.id), message: str(x.message, 1000), image: ref(x.image) }), 200) ?? D.flowers,
    secrets:
      list(r.secrets, (x) => ({
        id: idOf(x.id), trigger: SECRET_TRIGGERS.includes(x.trigger) ? x.trigger : 'heart',
        message: str(x.message, 2000), image: ref(x.image),
      }), 50) ?? D.secrets,
    importantDates:
      list(r.importantDates, (x) => ({
        id: idOf(x.id), date: day(x.date), title: str(x.title, 150),
        description: str(x.description, 1000), photo: ref(x.photo),
      }), 100) ?? D.importantDates,
    finalSurprise: { title: str(fs.title, 150), message: str(fs.message, 10000), image: ref(fs.image) },
    music: { src: ref(mu.src) || D.music.src },
    theme: {
      preset: THEME_PRESETS.includes(t.preset) ? t.preset : D.theme.preset,
      primary: hex(t.primary, D.theme.primary), secondary: hex(t.secondary, D.theme.secondary),
      accent: hex(t.accent, D.theme.accent), background: hex(t.background, D.theme.background),
    },
  }
}

// Every image/audio reference found in the data (used for cleanup & migration)
export function collectRefs(data) {
  const out = []
  const add = (v) => v && out.push(v)
  add(data.general.couplePhoto); add(data.her.profileImage); add(data.finalSurprise.image); add(data.music.src)
  data.memories.forEach((x) => add(x.image))
  data.reasons.forEach((x) => add(x.image))
  data.flowers.forEach((x) => add(x.image))
  data.secrets.forEach((x) => add(x.image))
  data.importantDates.forEach((x) => add(x.photo))
  return out
}

// Applies fn to every reference and returns a new data object
export function mapRefs(data, fn) {
  return {
    ...data,
    general: { ...data.general, couplePhoto: fn(data.general.couplePhoto) },
    her: { ...data.her, profileImage: fn(data.her.profileImage) },
    finalSurprise: { ...data.finalSurprise, image: fn(data.finalSurprise.image) },
    music: { ...data.music, src: fn(data.music.src) },
    memories: data.memories.map((x) => ({ ...x, image: fn(x.image) })),
    reasons: data.reasons.map((x) => ({ ...x, image: fn(x.image) })),
    flowers: data.flowers.map((x) => ({ ...x, image: fn(x.image) })),
    secrets: data.secrets.map((x) => ({ ...x, image: fn(x.image) })),
    importantDates: data.importantDates.map((x) => ({ ...x, photo: fn(x.photo) })),
  }
}
