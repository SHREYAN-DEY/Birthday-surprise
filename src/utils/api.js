// All backend calls live here. The browser only ever talks to /api/* on its own site
// (a dev proxy or a Vercel rewrite forwards it), so login cookies stay first-party.
export const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true'

let csrfToken = null

async function request(path, { method = 'GET', json, form, timeout = 8000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeout)
  try {
    const headers = {}
    if (json !== undefined) headers['Content-Type'] = 'application/json'
    if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken
    const res = await fetch(path, {
      method,
      credentials: 'include',
      headers,
      body: form ?? (json !== undefined ? JSON.stringify(json) : undefined),
      signal: ctrl.signal,
    })
    let body = null
    try { body = await res.json() } catch { /* no body */ }
    if (!res.ok) {
      const err = new Error(body?.error || 'Request failed')
      err.status = res.status
      throw err
    }
    return body
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  async me() {
    const r = await request('/api/auth/me')
    csrfToken = r.csrf
    return r
  },
  async login(email, password) {
    const r = await request('/api/auth/login', { method: 'POST', json: { email, password } })
    csrfToken = r.csrf
    return r
  },
  async logout() {
    try { await request('/api/auth/logout', { method: 'POST' }) } finally { csrfToken = null }
  },
  getBirthday: () => request('/api/birthday'),
  saveBirthday: (data) => request('/api/birthday', { method: 'PUT', json: data }),
  upload(blob, kind, filename) {
    const form = new FormData()
    form.append('file', blob, filename)
    return request(`/api/upload/${kind}`, { method: 'POST', form, timeout: 60000 })
  },
  deleteUpload: (name) => request(`/api/upload/${encodeURIComponent(name)}`, { method: 'DELETE' }),
}
