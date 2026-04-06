interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '14px', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,.3)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '.75rem', textAlign: 'center' }}>⚠️</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a3a5c', marginBottom: '.5rem', textAlign: 'center' }}>{title}</h3>
        <p style={{ color: '#64748b', fontSize: '.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>{message}</p>
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
          <button onClick={onCancel} style={{ padding: '.65rem 1.5rem', border: '1.5px solid #d1d5db', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '.9rem', fontWeight: '500', color: '#374151' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ padding: '.65rem 1.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '.9rem', fontWeight: '600' }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
