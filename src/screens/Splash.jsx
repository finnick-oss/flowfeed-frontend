import { useEffect } from 'react'
import { motion } from 'motion/react'
import { Zap } from 'lucide-react'

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
    }}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: 84, height: 84, borderRadius: 24,
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(124,58,237,0.35)',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <Zap size={38} color="#fff" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>FlowFeed</div>
        <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
          Turn comments into conversations
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 6 }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', display: 'block' }}
          />
        ))}
      </motion.div>
    </div>
  )
}
