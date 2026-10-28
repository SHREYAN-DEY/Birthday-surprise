import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-sky-soft p-6 text-center">
      <div>
        <h1 className="font-hand text-5xl text-night">This cloud is empty ☁️</h1>
        <p className="mt-2 text-ink">There's nothing here.</p>
        <Link to="/" className="mt-4 inline-block font-bold text-sky-deep underline">Back to the start</Link>
      </div>
    </main>
  )
}
