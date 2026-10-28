import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { useMusic } from '../../hooks/useMusic.js'

const iconBtn = 'grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-sky-soft'

export default function MusicPlayer() {
  const { playing, available, volume, muted, toggle, toggleMute, setVolume } = useMusic()
  if (!available) return null
  return (
    <div
      className="fixed right-3 z-40 flex items-center gap-1 rounded-full border-2 border-sky-mid bg-cloud/90 p-1 shadow-[0_4px_0_rgba(58,74,99,0.12)]"
      style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
      role="group"
      aria-label="Music controls"
    >
      <button type="button" className={iconBtn} onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'}>
        {playing ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
      </button>
      <button type="button" className={iconBtn} onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute' : 'Mute'}>
        {muted ? <FaVolumeMute aria-hidden="true" /> : <FaVolumeUp aria-hidden="true" />}
      </button>
      <input
        type="range" min="0" max="1" step="0.05"
        value={muted ? 0 : volume}
        onChange={(e) => setVolume(e.target.value)}
        aria-label="Music volume"
        className="mr-2 w-20 accent-heart"
      />
    </div>
  )
}
