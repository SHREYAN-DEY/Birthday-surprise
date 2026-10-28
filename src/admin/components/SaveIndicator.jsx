export default function SaveIndicator({ status }) {
  const map = {
    saving: ['Saving…', 'text-stone-600'],
    saved: ['Saved ✓', 'text-green-800'],
    error: ["Couldn't save", 'text-red-700'],
  }
  const [text, color] = map[status] || map.saved
  return <span role="status" aria-live="polite" className={`text-sm font-bold ${color}`}>{text}</span>
}
