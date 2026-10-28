export const displayName = (data) => data.her.name.trim() || data.her.nickname.trim() || 'you'

// Lets you type [HER_NAME] and [MY_NAME] anywhere in your text
export function fillTokens(text, data) {
  return String(text ?? '')
    .replaceAll('[HER_NAME]', displayName(data))
    .replaceAll('[MY_NAME]', data.me.name.trim() || 'me')
}

export function formatDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}
