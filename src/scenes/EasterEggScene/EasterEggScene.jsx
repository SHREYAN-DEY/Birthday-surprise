import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Cloud from '../../components/Cloud/Cloud.jsx'
import Star from '../../components/Doodles/Star.jsx'
import Heart from '../../components/Doodles/Heart.jsx'
import Character from '../../components/Character/Character.jsx'
import SunflowerPlant from '../../components/Sunflower/SunflowerPlant.jsx'
import SecretBubble from '../../components/Common/SecretBubble.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { secretsFor } from '../../utils/selectors.js'
import { fillTokens } from '../../utils/text.js'

const SUNFLOWER_LINES = ['Hey!', 'Ow.', 'That tickles.', 'Stop poking the flower 😭🌻', 'Okay, okay... take this.']

// Totally optional: nothing here is needed to finish the story
export default function EasterEggScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.75)
  const counts = useRef({})
  const secretIdx = useRef({})
  const hideTimer = useRef(null)
  const [bubble, setBubble] = useState(null)
  const [starClicks, setStarClicks] = useState(0)

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  const close = useCallback(() => setBubble(null), [])

  const show = useCallback((text, trigger) => {
    let secret = null
    if (trigger) {
      const list = secretsFor(data, trigger)
      if (list.length) {
        const i = secretIdx.current[trigger] ?? 0
        secret = { ...list[i % list.length], message: fillTokens(list[i % list.length].message, data) }
        secretIdx.current[trigger] = i + 1
      }
    }
    setBubble({ key: Math.random(), text, secret })
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setBubble(null), secret ? 9000 : 3500)
  }, [data])

  function hit(key) {
    const n = (counts.current[key] = (counts.current[key] || 0) + 1)
    if (key === 'heart') show('You found me ❤️', 'heart')
    else if (key === 'gift') show('You really clicked it 😂', 'gift')
    else if (key === 'cloud') {
      if (n === 1) show("I'm just a cloud.")
      else show(n === 2 ? 'Okay fine...' : 'Still just a cloud.', 'cloud')
    } else if (key === 'star') {
      setStarClicks(n)
      if (n >= 3) show("Okay, you've earned this.", 'star')
    } else if (key === 'sunflower') {
      show(SUNFLOWER_LINES[Math.min(n - 1, SUNFLOWER_LINES.length - 1)], n >= 5 ? 'sunflower' : null)
    } else if (key === 'mascot') {
      if (n === 1) show('Again?')
      else if (n === 2) show('You really like clicking me.')
      else show("Fine. Here's a secret.", 'mascot')
    }
  }

  const spot = 'absolute cursor-pointer'
  return (
    <SceneShell className="bg-linear-to-b from-sky-mid via-sky-soft to-blush/50">
      <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pt-10 text-center pointer-events-none">
        <h1 className="font-hand text-4xl text-night sm:text-5xl pointer-events-auto">Psst... not everything here is just decoration.</h1>
        <p className="mt-1 font-hand text-2xl text-night/70 pointer-events-auto">Poke around if you like.</p>
      </div>

      {/* Heart */}
      <button type="button" className={`${spot} bottom-[9%] left-[7%] p-4 opacity-40 hover:opacity-100 z-20`} onClick={() => hit('heart')} aria-label="A tiny hidden heart">
        <Heart className="h-5 w-5 text-heart pointer-events-none" />
      </button>

      {/* Gift Box */}
      <button type="button" className={`${spot} left-[58%] top-[56%] -rotate-6 text-center p-3 z-20`} onClick={() => hit('gift')} aria-label="A box labelled do not open">
        <span className="block text-5xl pointer-events-none" aria-hidden="true">🎁</span>
        <span className="note block rounded-sm px-1 font-hand text-sm font-bold text-night">DO NOT OPEN</span>
      </button>

      {/* Cloud */}
      <button type="button" className={`${spot} left-[8%] top-[30%] p-4 z-20`} onClick={() => hit('cloud')} aria-label="A cloud">
        <Cloud float className="w-28 text-white pointer-events-none" tilt={-4} />
      </button>

      {/* Star */}
      <motion.button type="button" className={`${spot} right-[12%] top-[28%] p-4 z-20`} onClick={() => hit('star')} aria-label="A star"
        animate={{ scale: 1 + starClicks * 0.25, rotate: starClicks * 40 }} whileHover={{ scale: 1.2 }}>
        <Star className="h-10 w-10 animate-twinkle text-sun pointer-events-none" />
      </motion.button>

      {/* Sunflower */}
      <div className={`${spot} bottom-[6%] right-[8%] z-20`}>
        <SunflowerPlant seed={4} width={4.5} label="A sunflower" onPick={() => hit('sunflower')} interactive={false} />
        <button type="button" className="absolute inset-0 z-30 cursor-pointer" onClick={() => hit('sunflower')} aria-label="Poke the sunflower" />
      </div>

      {/* Mascot / Character */}
      <button type="button" className={`${spot} bottom-[24%] left-[30%] p-4 z-20`} onClick={() => hit('mascot')} aria-label="The little cloud guide">
        <Character className="w-24 pointer-events-none" />
      </button>

      <button type="button" onClick={onDone} className="fixed bottom-4 left-1/2 z-30 min-h-12 -translate-x-1/2 cursor-pointer rounded-full border-2 border-heart bg-heart px-6 text-lg font-bold text-white shadow-[0_4px_0_rgba(58,74,99,0.18)]" style={{ display: bubble ? 'none' : undefined }}>
        On to the flowers →
      </button>

      <SecretBubble bubble={bubble} onClose={close} />
    </SceneShell>
  )
}
