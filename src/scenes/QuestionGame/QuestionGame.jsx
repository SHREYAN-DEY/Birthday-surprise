import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import AskCard from '../../components/Common/AskCard.jsx'
import Character from '../../components/Character/Character.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import EmptyNote from '../../components/Common/EmptyNote.jsx'
import HeartBurst from '../../components/HeartParticles/HeartBurst.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { usableQuestions } from '../../utils/selectors.js'
import { fillTokens } from '../../utils/text.js'

export default function QuestionGame({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.8)
  const questions = usableQuestions(data)
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  if (!questions.length) {
    return <SceneShell><EmptyNote onDone={onDone}>No questions yet. Add some in /setup.</EmptyNote></SceneShell>
  }

  const q = questions[Math.min(index, questions.length - 1)]
  const t = (s) => fillTokens(s, data)

  function yes() {
    if (answered) return
    setAnswered(true)
    timer.current = setTimeout(() => {
      if (index + 1 >= questions.length) onDone()
      else {
        setIndex(index + 1)
        setAnswered(false)
      }
    }, q.successMessage ? 1700 : 900)
  }

  return (
    <SceneShell className="bg-linear-to-b from-sky-soft to-blush/60">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-10">
        <div className="flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1} aria-label="Question progress">
          {questions.map((x, k) => (
            <span key={x.id} className={`h-2.5 w-2.5 rounded-full ${k <= index ? 'bg-heart' : 'bg-white/80'}`} />
          ))}
        </div>

        <Character className="w-24" />

        <div className="w-full">
          <AnimatePresence mode="wait">
            {answered ? (
              <motion.p key={`${q.id}-yes`} className="mx-auto max-w-md text-center font-hand text-4xl text-night sm:text-5xl"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {q.successMessage ? t(q.successMessage) : '❤️'}
              </motion.p>
            ) : (
              <motion.div key={q.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AskCard question={t(q.question)} yesText={q.yesText} noText={q.noText} noMessages={q.noMessages} onYes={yes} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {answered && <HeartBurst key={q.id} count={10} />}
    </SceneShell>
  )
}
