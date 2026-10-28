import RichText from './RichText.jsx'
import { fillTokens } from '../../utils/text.js'

export default function LetterBody({ data }) {
  const l = data.letter
  const sign = l.signoff || data.me.name
  const t = (s) => fillTokens(s, data)
  const empty = ![l.opening, l.main, l.favoriteMemory, l.wish, l.ending, sign].some((v) => v && v.trim())

  if (empty) return <p className="font-hand text-3xl text-ink/60">This letter is still blank. Write it in /setup ♡</p>
  return (
    <article className="space-y-4 font-hand text-2xl leading-relaxed text-ink sm:text-[1.7rem]">
      {l.opening && <p className="text-3xl text-night">{t(l.opening)}</p>}
      {l.main && <RichText text={t(l.main)} />}
      {l.favoriteMemory && <RichText text={t(l.favoriteMemory)} />}
      {l.wish && <RichText text={t(l.wish)} />}
      {l.ending && <RichText text={t(l.ending)} className="pt-2" />}
      {sign && <p className="pt-2 text-right text-3xl text-heart">{sign}</p>}
    </article>
  )
}
