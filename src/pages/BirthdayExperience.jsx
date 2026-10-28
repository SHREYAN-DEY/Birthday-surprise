import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { SCENES } from '../scenes/index.js'
import MusicPlayer from '../components/MusicPlayer/MusicPlayer.jsx'
import { useMusic } from '../hooks/useMusic.js'
import { useBirthdayData } from '../hooks/useBirthdayData.js'

export default function BirthdayExperience({ startScene = 'loading' }) {
  const { data } = useBirthdayData()
  const { pause } = useMusic()
  const [index, setIndex] = useState(() => Math.max(0, SCENES.findIndex((s) => s.id === startScene)))
  const [run, setRun] = useState(0)

  useEffect(() => {
    document.title = data.general.pageTitle || 'For you ♡'
  }, [data.general.pageTitle])

  // Leaving the experience (e.g. going to /setup) stops the music
  useEffect(() => pause, [pause])

  // Next scene, skipping any that have nothing to show
  const next = useCallback(() => {
    setIndex((cur) => {
      let i = cur + 1
      while (i < SCENES.length - 1 && SCENES[i].skip?.(data)) i++
      return Math.min(i, SCENES.length - 1)
    })
  }, [data])

  const replay = useCallback(() => {
    setIndex(0)
    setRun((r) => r + 1)
  }, [])

  const scene = SCENES[index]
  const Scene = scene.Component

  return (
    <>
      <AnimatePresence mode="wait">
        <Scene key={`${run}-${scene.id}`} onDone={next} onReplay={replay} />
      </AnimatePresence>
      {index > 0 && <MusicPlayer />}
    </>
  )
}
