'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/admin')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Credenciales incorrectas. Inténtelo de nuevo.' : error.message)
        setLoading(false)
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.')
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2540 60%, #c8902a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #1a3a5c, #2196f3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.8rem',
            color: 'white'
          }}>
            🏫
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a3a5c', marginBottom: '.3rem' }}>
            ESFM Warisata
          </h1>
          <p style={{ color: '#64748b', fontSize: '.9rem' }}>
            Sistema de Gestión Institucional
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '.875rem', fontWeight: '500', color: '#374151', marginBottom: '.4rem' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@warisata.edu.bo"
              style={{
                width: '100%',
                padding: '.75rem 1rem',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '.95rem',
                outline: 'none',
                transition: 'border .2s'
              }}
              onFocus={e => (e.target.style.borderColor = '#1a3a5c')}
              onBlur={e => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '.875rem', fontWeight: '500', color: '#374151', marginBottom: '.4rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '.75rem 1rem',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '.95rem',
                outline: 'none',
                transition: 'border .2s'
              }}
              onFocus={e => (e.target.style.borderColor = '#1a3a5c')}
              onBlur={e => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '.85rem',
              background: 'linear-gradient(135deg, #1a3a5c, #264e7a)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '.8rem' }}>
          © 2025 ESFM Warisata · Todos los derechos reservados
        </p>
      </div>
    </div>
  )
}
