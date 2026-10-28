export function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
export function luminance(h) {
  const [r, g, b] = hexToRgb(h).map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}
function mix(h, toward, t) {
  const a = hexToRgb(h), b = hexToRgb(toward)
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
export const lighten = (h, t) => mix(h, '#ffffff', t)
export const darken = (h, t) => mix(h, '#000000', t)

// Nudges `color` until it has at least `min` contrast against `against`
export function ensureContrast(color, against, min = 4.5) {
  let c = color
  for (let i = 0; i < 25 && contrast(c, against) < min; i++) {
    c = mix(c, luminance(against) > 0.5 ? '#000000' : '#ffffff', 0.08)
  }
  return c
}
