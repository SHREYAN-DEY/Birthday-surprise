import { useCallback, useState } from 'react'
import PhotoCard from '../../components/PhotoCard/PhotoCard.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Button from '../../components/Button/Button.jsx'
import SceneShell from '../../components/Common/SceneShell.jsx'
import EmptyNote from '../../components/Common/EmptyNote.jsx'
import MemoryDetail from '../../components/Common/MemoryDetail.jsx'
import { useBirthdayData } from '../../hooks/useBirthdayData.js'
import { useSceneMusic } from '../../hooks/useSceneMusic.js'
import { usableMemories, usableDates } from '../../utils/selectors.js'
import { formatDate } from '../../utils/text.js'

export default function ScrapbookScene({ onDone }) {
  const { data } = useBirthdayData()
  useSceneMusic(0.7)
  const memories = usableMemories(data)
  const dates = usableDates(data)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  if (!memories.length) {
    return <SceneShell><EmptyNote onDone={onDone}>The scrapbook is empty. Add memories in /setup.</EmptyNote></SceneShell>
  }

  return (
    <SceneShell scroll className="bg-linear-to-b from-paper to-paper-edge/60">
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-center font-hand text-5xl text-night">I kept all of these.</h1>
        <p className="mt-1 text-center font-hand text-2xl text-ink/70">(tap one to look closer)</p>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-1 gap-y-8">
          {memories.map((m, i) => (
            <div key={m.id} className={i % 2 ? '-ml-2' : '-mr-2'}>
              <PhotoCard memory={m} index={i} onOpen={() => setOpen(m)} />
            </div>
          ))}
        </div>

        {dates.length > 0 && (
          <section className="mx-auto mt-16 max-w-md" aria-label="Important dates">
            <h2 className="text-center font-hand text-4xl text-night">Little dates I remember</h2>
            <ol className="mt-6 space-y-5 border-l-2 border-dashed border-heart/50 pl-6">
              {dates.map((d, i) => (
                <li key={d.id} className="relative">
                  <span className="absolute -left-[33px] top-2 h-3 w-3 rounded-full bg-heart" aria-hidden="true" />
                  <div className="note rounded-sm p-3" style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
                    {d.date && <p className="text-xs font-bold text-ink/70">{formatDate(d.date)}</p>}
                    <p className="font-hand text-3xl leading-tight text-night">{d.title}</p>
                    {d.description && <p className="text-sm text-ink">{d.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-14 text-center"><Button onClick={onDone}>Next →</Button></div>
      </div>

      <Modal open={!!open} onClose={close} label="Memory photo">{open && <MemoryDetail memory={open} />}</Modal>
    </SceneShell>
  )
}
