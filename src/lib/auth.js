import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Meta / Instagram OAuth config — set these once Tech Provider is approved.
// VITE_META_APP_ID    → your Meta app ID
// VITE_OAUTH_REDIRECT → must match the redirect URI whitelisted in the Meta app
const META_APP_ID = import.meta.env.VITE_META_APP_ID || ''
const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT || window.location.origin

// Scopes needed for comment automation + DM sequences
const SCOPES = [
  'instagram_basic',
  'instagram_manage_comments',
  'instagram_manage_messages',
  'pages_show_list',
  'pages_manage_metadata',
].join(',')

const SESSION_KEY = 'flowfeed_session'

export const auth = {
  /** True once Meta OAuth is configured (Tech Provider approved + env vars set) */
  isOAuthConfigured() {
    return Boolean(META_APP_ID)
  },

  /** Full Meta OAuth dialog URL the Sign in button redirects to */
  buildAuthUrl() {
    const state = crypto.randomUUID()
    sessionStorage.setItem('flowfeed_oauth_state', state)
    const params = new URLSearchParams({
      client_id: META_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      response_type: 'code',
      state,
    })
    return `https://www.facebook.com/v21.0/dialog/oauth?${params}`
  },

  /** Detect ?code= on page load (user returning from Meta) */
  getCallbackCode() {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    if (!code) return null
    const expected = sessionStorage.getItem('flowfeed_oauth_state')
    if (expected && state !== expected) return null
    return code
  },

  /** Exchange the OAuth code for a session via the backend */
  async completeLogin(code) {
    try {
      const res = await axios.post(`${BASE}/api/auth/instagram`, {
        code,
        redirect_uri: REDIRECT_URI,
      }, { timeout: 15000 })
      const session = res.data
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      // Clean the ?code= from the URL
      window.history.replaceState({}, '', window.location.pathname)
      return { success: true, session }
    } catch (e) {
      window.history.replaceState({}, '', window.location.pathname)
      return { success: false, error: e.response?.data?.error || e.message }
    }
  },

  /**
   * Owner login — used until Tech Provider is approved.
   * Asks the backend (already wired to the owner's Instagram account)
   * for the real account identity; falls back to a local session if
   * the backend is unreachable.
   */
  async loginAsOwner() {
    let session
    try {
      const res = await axios.get(`${BASE}/api/me`, { timeout: 10000 })
      session = { ...res.data, connected_at: new Date().toISOString() }
    } catch {
      session = {
        provider: 'owner',
        username: 'whoanuragbhatt',
        connected_at: new Date().toISOString(),
      }
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true, session }
  },

  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem('flowfeed_oauth_state')
  },
}
