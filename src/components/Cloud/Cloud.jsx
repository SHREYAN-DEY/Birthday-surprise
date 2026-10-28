export default function Cloud({ className = 'w-32 text-cloud', float = false, tilt = 0, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 120 70"
      className={`${className} ${float ? 'animate-float' : ''} drop-shadow-[0_6px_6px_rgba(59,111,160,0.18)]`}
      style={{ '--tilt': `${tilt}deg`, animationDelay: `${delay}s`, transform: `rotate(${tilt}deg)` }}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="35" cy="45" r="22" />
      <circle cx="62" cy="32" r="28" />
      <circle cx="92" cy="46" r="20" />
      <rect x="25" y="46" width="78" height="21" rx="10" />
    </svg>
  )
}
