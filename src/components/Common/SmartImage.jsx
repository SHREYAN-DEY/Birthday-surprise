import { useEffect, useState } from 'react'
import { useMediaUrl } from '../../hooks/useMediaUrl.js'

// A photo that never breaks the page: missing, slow or invalid images become a cute placeholder
export default function SmartImage({ src, alt = '', className = '', fallback, ...rest }) {
  const url = useMediaUrl(src)
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [url])

  if (!url || failed) {
    if (fallback !== undefined) return fallback
    return (
      <div className={`grid place-items-center bg-paper-edge/60 p-2 text-center font-hand text-lg text-ink/60 ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
        <span aria-hidden="true">photo goes here ✦</span>
      </div>
    )
  }
  return <img src={url} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} {...rest} />
}
