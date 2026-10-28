import { MusicProvider } from './MusicContext.jsx'
import { BirthdayProvider } from './BirthdayContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { useBirthdayData } from '../hooks/useBirthdayData.js'
import { useMediaUrl } from '../hooks/useMediaUrl.js'

// The song can come from /public or from a file you uploaded in /setup
function MusicHost({ children }) {
  const { data } = useBirthdayData()
  const src = useMediaUrl(data.music.src)
  return <MusicProvider src={src}>{children}</MusicProvider>
}

export default function AppProviders({ children }) {
  return (
    <BirthdayProvider>
      <ThemeProvider>
        <MusicHost>{children}</MusicHost>
      </ThemeProvider>
    </BirthdayProvider>
  )
}
