import { useEffect, useMemo } from 'react'
import { useBirthdayData } from '../hooks/useBirthdayData.js'
import { contrast, ensureContrast, lighten, luminance } from '../utils/color.js'

export const PRESETS = {
  cinnamoroll: { primary: '#c94f6d', secondary: '#a9d4f5', accent: '#f7c948', background: '#dcefff' },
  sunflower: { primary: '#9a5b0c', secondary: '#f3d27a', accent: '#f7c948', background: '#fff3cf' },
  softpink: { primary: '#b43d63', secondary: '#f4b6c8', accent: '#f7c948', background: '#ffe8ee' },
}

// Turns the chosen theme into CSS variables, nudging colors so text stays readable.
export function buildTheme(theme) {
  const base = theme.preset === 'custom' ? theme : PRESETS[theme.preset] || PRESETS.cinnamoroll
  const warnings = []

  let background = base.background
  if (luminance(background) < 0.6) {
    background = lighten(background, 0.8)
    warnings.push('Background must be light so text stays readable, so it was lightened.')
  }
  const primary = ensureContrast(base.primary, '#ffffff')
  if (primary !== base.primary) warnings.push('Primary color was darkened so white button text stays readable.')

  let secondary = base.secondary
  if (luminance(secondary) < 0.35) {
    secondary = lighten(secondary, 0.5)
    warnings.push('Secondary color was lightened to keep the sky soft.')
  }
  const accent = base.accent

  return {
    vars: {
      '--color-heart': primary,
      '--color-sky-mid': secondary,
      '--color-sky-soft': background,
      '--color-sun': accent,
    },
    resolved: { primary, secondary, accent, background },
    warnings,
    textContrast: contrast('#3a4a63', background),
  }
}

export function ThemeProvider({ children }) {
  const { data } = useBirthdayData()
  const { vars } = useMemo(() => buildTheme(data.theme), [data.theme])

  useEffect(() => {
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    return () => Object.keys(vars).forEach((k) => root.style.removeProperty(k))
  }, [vars])

  return children
}
