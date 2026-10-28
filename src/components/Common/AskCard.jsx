import { useRef, useState } from 'react'
import Button from '../Button/Button.jsx'
import RunawayButton from './RunawayButton.jsx'
import { noMessages as fallbackMessages } from '../../data/defaultMessages.js'

// One YES/NO question. YES always works. NO is playful and keeps escaping.
export default function AskCard({ question, yesText = 'YES', noText = 'NO', noMessages, onYes, disabled = false }) {
  const yesRef = useRef(null)
  const textRef = useRef(null)
  const [tries, setTries] = useState(0)

  const pool = (noMessages || []).filter(Boolean)
  const messages = pool.length ? pool : fallbackMessages
  const message = tries ? messages[(tries - 1) % messages.length] : ''

  return (
    <div className="paper mx-auto w-full max-w-md -rotate-1 rounded-sm px-5 py-8 text-center">
      <h2 ref={textRef} className="font-hand text-4xl leading-tight text-night sm:text-5xl">{question}</h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button ref={yesRef} onClick={onYes} disabled={disabled} aria-describedby="no-hint">{yesText}</Button>
        <RunawayButton avoidRefs={[yesRef, textRef]} onTry={() => setTries((t) => t + 1)} disabled={disabled}>
          {noText}
        </RunawayButton>
      </div>
      <p aria-live="polite" className="mt-5 min-h-8 font-hand text-2xl text-heart">{message}</p>
      <p id="no-hint" className="sr-only">
        The second button is playful and keeps running away. Choosing the first button always works.
      </p>
    </div>
  )
}
