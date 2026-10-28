import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import BirthdayExperience from './pages/BirthdayExperience.jsx'
import PreviewPage from './pages/PreviewPage.jsx'
import NotFound from './pages/NotFound.jsx'

// Only you need these, so visitors never download them
const SetupPage = lazy(() => import('./pages/SetupPage.jsx'))
const StyleGuide = import.meta.env.DEV ? lazy(() => import('./pages/StyleGuide.jsx')) : null

function PageLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-sky-soft text-ink">
      <p role="status">Loading…</p>
    </main>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<BirthdayExperience />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        {StyleGuide && <Route path="/styleguide" element={<StyleGuide />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
