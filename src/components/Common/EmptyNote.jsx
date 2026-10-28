import Button from '../Button/Button.jsx'

// Shown in previews when a scene has nothing to show yet
export default function EmptyNote({ children, onDone }) {
  return (
    <div className="relative z-10 grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-hand text-3xl text-night">{children}</p>
        {onDone && <Button className="mt-5" onClick={onDone}>Continue →</Button>}
      </div>
    </div>
  )
}
