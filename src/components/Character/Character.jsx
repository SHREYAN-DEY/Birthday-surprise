import Bow from '../Doodles/Bow.jsx'

// The cloud mascot. Replace this drawing with your own artwork whenever you like.
export default function Character({ className = 'w-40', float = true }) {
  const blink = { transformBox: 'fill-box', transformOrigin: 'center' }
  return (
    <div className={`relative ${className} ${float ? 'animate-float' : ''}`}>
      <svg viewBox="0 0 120 76" className="w-full overflow-visible drop-shadow-[0_6px_6px_rgba(59,111,160,0.2)]" aria-hidden="true">
        <g className="fill-sky-mid stroke-sky-mid" strokeWidth="5" strokeLinejoin="round">
          <circle cx="35" cy="45" r="22" /><circle cx="62" cy="32" r="28" /><circle cx="92" cy="46" r="20" />
          <rect x="25" y="46" width="78" height="21" rx="10" />
        </g>
        <g className="fill-white">
          <circle cx="35" cy="45" r="22" /><circle cx="62" cy="32" r="28" /><circle cx="92" cy="46" r="20" />
          <rect x="25" y="46" width="78" height="21" rx="10" />
        </g>
        <circle cx="49" cy="45" r="3.4" className="fill-night animate-blink" style={blink} />
        <circle cx="75" cy="45" r="3.4" className="fill-night animate-blink" style={blink} />
        <ellipse cx="40" cy="53" rx="5.5" ry="3.2" className="fill-blush" opacity="0.9" />
        <ellipse cx="84" cy="53" rx="5.5" ry="3.2" className="fill-blush" opacity="0.9" />
        <path d="M57 52Q62 57 67 52" className="stroke-night" fill="none" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <Bow className="absolute -top-2 right-2 w-[26%] -rotate-12 text-heart" />
    </div>
  )
}
