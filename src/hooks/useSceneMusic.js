import { useEffect } from 'react'
import { useMusic } from './useMusic.js'

// A scene says how loud its music should feel (0 to 1). The visitor's own volume still wins.
export function useSceneMusic(level, ms = 1200) {
  const { setLevel } = useMusic()
  useEffect(() => {
    setLevel(level, ms)
  }, [level, ms, setLevel])
}
