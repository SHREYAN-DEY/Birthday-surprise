import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/quicksand'
import '@fontsource/caveat'
import './index.css'
import App from './App.jsx'
import AppProviders from './context/AppProviders.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/birthday-surprise/">
      {/* reducedMotion="user" makes every Motion animation respect the device setting */}
      <MotionConfig reducedMotion="user">
        <AppProviders>
          <App />
        </AppProviders>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
