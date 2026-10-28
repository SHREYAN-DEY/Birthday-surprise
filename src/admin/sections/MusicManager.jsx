import { useRef, useState } from 'react'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useMediaUrl } from '../../hooks/useMediaUrl.js'
import { storeAudio, removeStored } from '../../utils/imageService.js'
import { defaultBirthdayData } from '../../data/defaultBirthdayData.js'

const btn = 'min-h-11 cursor-pointer rounded-lg border-2 border-sky-mid bg-white px-3 text-sm font-bold text-stone-800 hover:bg-sky-soft'

export default function MusicManager() {
  const { data, setSection } = useBirthdayData()
  const src = data.music.src
  const url = useMediaUrl(src)
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isDefault = src === defaultBirthdayData.music.src

  async function choose(file) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const ref = await storeAudio(file)
      const old = src
      setSection('music', { src: ref })
      if (old && old !== defaultBirthdayData.music.src) removeStored(old)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">
        The song starts when she taps “I promise”. Only use music you own or have a licence for. By default the site plays <code>/music/birthday-song.mp3</code> from the <code>public</code> folder.
      </p>
      <p className="text-sm font-bold text-stone-800">Current song: {isDefault ? 'public/music/birthday-song.mp3' : 'your uploaded file'}</p>
      {url && <audio controls src={url} className="w-full" preload="none" />}
      <div className="flex flex-wrap gap-2">
        <label className={`${btn} inline-flex items-center`}>
          {busy ? 'Working…' : 'Upload an MP3 (up to 15 MB)'}
          <input ref={input} type="file" className="sr-only" accept=".mp3,audio/mpeg" disabled={busy} onChange={(e) => choose(e.target.files?.[0])} />
        </label>
        {!isDefault && (
          <button type="button" className={btn} onClick={() => { removeStored(src); setSection('music', { src: defaultBirthdayData.music.src }) }}>
            Go back to the default file
          </button>
        )}
      </div>
      {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
    </div>
  )
}
