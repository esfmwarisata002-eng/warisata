'use client'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const configs = {
    success: { bg: '#d1fae5', color: '#065f46', icon: '✅' },
    error:   { bg: '#fee2e2', color: '#991b1b', icon: '❌' },
    info:    { bg: '#dbeafe', color: '#1e40af', icon: 'ℹ️' },
  }
  const cfg = configs[type]

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
      background: cfg.bg, color: cfg.color,
      padding: '.85rem 1.25rem', borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0,0,0,.15)',
      display: 'flex', alignItems: 'center', gap: '.75rem',
      maxWidth: '360px', minWidth: '250px',
    }}>
      <span>{cfg.icon}</span>
      <span style={{ fontSize: '.9rem', fontWeight: '500', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: cfg.color, fontSize: '1.2rem', padding: 0, lineHeight: 1 }}>×</button>
    </div>
  )
}
