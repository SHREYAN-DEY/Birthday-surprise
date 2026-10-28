export default function Bow({ className = 'w-8 h-6 text-heart', style }) {
  return (
    <svg viewBox="0 0 40 28" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M20 14C14 2 2 0 2 8c0 10 10 12 18 6z" />
      <path d="M20 14C26 2 38 0 38 8c0 10-10 12-18 6z" />
      <circle cx="20" cy="14" r="4.5" />
    </svg>
  )
}
