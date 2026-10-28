import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'birthdayExperience:music:v1'
const DEFAULTS = { volume: 0.6, muted: false }

export const MusicContext = createContext(null)

const clamp01 = (n) => Math.min(1, Math.max(0, n))

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const data = JSON.parse(raw)
    return {
      volume: typeof data.volume === 'number' ? clamp01(data.volume) : DEFAULTS.volume,
      muted: data.muted === true,
    }
  } catch {
    return DEFAULTS
  }
}

export function MusicProvider({ src, children }) {
  const audioRef = useRef(null)
  const levelRef = useRef(1)
  const fadeRef = useRef(null)

  const [initial] = useState(loadSettings)
  const [volume, setVolumeState] = useState(initial.volume)
  const [muted, setMuted] = useState(initial.muted)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, muted })) } catch { /* ignore */ }
  }, [volume, muted])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.muted = muted
    a.volume = clamp01(volume * levelRef.current)
  }, [volume, muted])

  // A new song means a fresh start
  useEffect(() => {
    setAvailable(true)
    setPlaying(false)
  }, [src])

  useEffect(() => () => clearInterval(fadeRef.current), [])

  const play = useCallback(async () => {
    const a = audioRef.current
    if (!a || !a.getAttribute('src')) return
    try { await a.play() } catch { /* blocked, or file missing (onError handles that) */ }
  }, [])

  const pause = useCallback(() => audioRef.current?.pause(), [])

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) play()
    else pause()
  }, [play, pause])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  const setVolume = useCallback((v) => {
    const next = clamp01(Number(v))
    setVolumeState(next)
    if (next > 0) setMuted(false)
  }, [])

  const setLevel = useCallback((level, ms = 900) => {
    const a = audioRef.current
    levelRef.current = clamp01(level)
    if (!a) return
    clearInterval(fadeRef.current)
    const start = a.volume
    const target = clamp01(volume * levelRef.current)
    const steps = 20
    let i = 0
    fadeRef.current = setInterval(() => {
      i += 1
      a.volume = clamp01(start + ((target - start) * i) / steps)
      if (i >= steps) clearInterval(fadeRef.current)
    }, ms / steps)
  }, [volume])

  const value = useMemo(
    () => ({ playing, available, volume, muted, play, pause, toggle, toggleMute, setVolume, setLevel }),
    [playing, available, volume, muted, play, pause, toggle, toggleMute, setVolume, setLevel],
  )

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={src || undefined}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setAvailable(false)
          setPlaying(false)
        }}
      />
    </MusicContext.Provider>
  )
}
