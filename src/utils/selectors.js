// "Usable" = filled in enough to show. Blank rows in the dashboard are simply skipped.
export const usableQuestions = (d) => d.questions.filter((q) => q.question.trim())
export const usableMemories = (d) => d.memories.filter((m) => m.image || m.title.trim())
export const usableReasons = (d) => d.reasons.filter((r) => r.text.trim() || r.image)
export const usableFlowers = (d) => d.flowers.filter((f) => f.message.trim() || f.image)
export const usableDates = (d) =>
  d.importantDates
    .filter((x) => x.title.trim() || x.date)
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'))
export const secretsFor = (d, trigger) =>
  d.secrets.filter((s) => s.trigger === trigger && (s.message.trim() || s.image))
export const hasFinalSurprise = (d) =>
  !!(d.finalSurprise.message.trim() || d.finalSurprise.image || d.finalSurprise.title.trim())
