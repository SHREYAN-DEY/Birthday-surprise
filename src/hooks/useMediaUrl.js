import { useEffect, useState } from 'react'
import { peekMediaUrl, resolveMediaUrl } from '../utils/imageStore.js'

// Turns "idb:..." / "/uploads/..." / "https://..." into a URL the browser can load
export function useMediaUrl(ref) {
  const [url, setUrl] = useState(() => peekMediaUrl(ref))
  useEffect(() => {
    let alive = true
    const quick = peekMediaUrl(ref)
    if (quick) {
      setUrl(quick)
      return undefined
    }
    setUrl(null)
    if (!ref) return undefined
    resolveMediaUrl(ref)
      .then((u) => alive && setUrl(u))
      .catch(() => alive && setUrl(null))
    return () => { alive = false }
  }, [ref])
  return url
}
