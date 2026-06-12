import { useState } from 'react'
import { motion } from 'motion/react'
import { Zap, Loader2, MessageCircle, Send, Link2, ShieldCheck } from 'lucide-react'
import { auth } from '../lib/auth'

function InstagramIcon({ size = 18, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const FEATURES = [
  { icon: MessageCircle, label: 'Auto-reply to comments', color: '#8b5cf6' },
  { icon: Send, label: 'Smart DM sequences', color: '#06b6d4' },
  { icon: Link2, label: 'Deliver links after follow', color: '#10b981' },
]

export default function SignIn({ onSignedIn, onPrivacy }) {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const handleSignIn = async () => {
    setError(null)
    if (auth.isOAuthConfigured()) {
      // Real Meta OAuth — redirects away, callback handled in App on return
      window.location.href = auth.buildAuthUrl()
      return
    }
    // Until Tech Provider approval: connect to the pre-configured owner account
    setConnecting(true)
    const result = await auth.loginAsOwner()
    setConnecting(false)
    if (result.success) onSignedIn(result.session)
    else setError(result.error || 'Could not connect. Try again.')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Logo */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(124,58,237,0.3)', marginBottom: 24,
        }}>
          <Zap size={28} color="#fff" />
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          Welcome to FlowFeed
        </h1>
        <p style={{ fontSize: 14, color: '#555', marginTop: 8, marginBottom: 36, textAlign: 'center' }}>
          Connect your Instagram account to start automating comments and DMs
        </p>

        {/* Feature list */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 12,
                  background: '#0f0f0f', border: '1px solid #1a1a1a',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${f.color}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={f.color} />
                </div>
                <span style={{ fontSize: 13, color: '#999' }}>{f.label}</span>
              </motion.div>
            )
          })}
        </div>

        {/* Sign in button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleSignIn}
          disabled={connecting}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
            color: '#fff', fontSize: 15, fontWeight: 600,
            boxShadow: '0 4px 24px rgba(124,58,237,0.3)',
            opacity: connecting ? 0.7 : 1,
          }}
        >
          {connecting
            ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            : <InstagramIcon size={18} />}
          {connecting ? 'Connecting…' : 'Sign in with Instagram'}
        </motion.button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: 12, color: '#ef4444', marginTop: 14 }}
          >
            {error}
          </motion.p>
        )}

        {/* Trust note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20 }}>
          <ShieldCheck size={12} color="#444" />
          <span style={{ fontSize: 11, color: '#444' }}>
            Secured by Meta OAuth · We never see your password
          </span>
        </div>

        <button
          type="button"
          onClick={onPrivacy}
          style={{
            marginTop: 28, fontSize: 11, color: '#333',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', textDecorationColor: '#222',
          }}
        >
          Privacy Policy
        </button>
      </motion.div>
    </div>
  )
}
