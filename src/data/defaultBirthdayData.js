import { defaultQuestions } from './defaultQuestions.js'
import { defaultMemories } from './defaultMemories.js'
import { defaultReasons, defaultFlowers, defaultSecrets } from './defaultMessages.js'

export const SCHEMA_VERSION = 1

export const SECRET_TRIGGERS = ['heart', 'gift', 'cloud', 'star', 'sunflower', 'mascot', 'final']
export const THEME_PRESETS = ['cinnamoroll', 'sunflower', 'softpink', 'custom']

export const defaultBirthdayData = {
  schemaVersion: SCHEMA_VERSION,
  general: { pageTitle: 'For you ♡', couplePhoto: '', couplePhotoCaption: '' },
  her: {
    name: '', nickname: '', birthday: '', age: '',
    favoriteColor: '', favoriteCharacter: '', favoriteFlower: '', favoriteFood: '', favoriteSong: '',
    description: '', profileImage: '',
    profileUsage: { opening: true, memories: false, finalReveal: true, finalSurprise: false },
  },
  me: { name: '', nickname: '', relationshipTitle: '', description: '' },
  mainMessage: '',
  letter: { opening: '', main: '', favoriteMemory: '', wish: '', ending: '', signoff: '' },
  questions: defaultQuestions,
  memories: defaultMemories,
  reasons: defaultReasons,
  flowers: defaultFlowers,
  secrets: defaultSecrets,
  importantDates: [],
  finalSurprise: { title: '', message: '', image: '' },
  music: { src: '/music/birthday-song.mp3' },
  theme: { preset: 'cinnamoroll', primary: '#c94f6d', secondary: '#a9d4f5', accent: '#f7c948', background: '#dcefff' },
}
