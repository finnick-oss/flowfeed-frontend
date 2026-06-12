export default function Footer({ onPrivacy }) {
  return (
    <footer style={{
      borderTop: '1px solid #111',
      padding: '14px 20px',
      display: 'flex',
      background: '#080808',
      flexShrink: 0,
      marginTop: 'auto',
    }}>
      <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ fontSize: 11, color: '#333' }}>
        © 2026 FlowFeed · Created by{' '}
        <a
          href="https://instagram.com/whoanuragbhatt"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#444', textDecoration: 'none', borderBottom: '1px solid #333' }}
        >
          @whoanuragbhatt
        </a>
      </span>
      <button
        type="button"
        onClick={onPrivacy}
        style={{ fontSize: 11, color: '#333', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#222' }}
      >
        Privacy Policy
      </button>
      </div>
    </footer>
  )
}
