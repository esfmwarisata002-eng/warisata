'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Personal { id: string; nombre: string; apellidos: string; cargo: string; email: string; foto_url: string }

export default function PersonalPage() {
  const [items, setItems] = useState<Personal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('personal').select('*').order('apellidos')
    if (search) q = q.or(`nombre.ilike.%${search}%,apellidos.ilike.%${search}%,cargo.ilike.%${search}%`)
    const { data } = await q
    setItems(data ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('personal').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Registro eliminado', type: 'success' }); fetchData() }
  }

  return (
    <div>
      <Header title="Personal" subtitle="Gestión de directivos y docentes" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <input type="text" placeholder="🔍 Buscar por nombre, apellido o cargo..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: '420px', padding: '.65rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }} />
          <Link href="/admin/personal/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>➕ Agregar Personal</button>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {loading ? (
            <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>Cargando...</p>
          ) : items.length === 0 ? (
            <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>No se encontraron resultados</p>
          ) : items.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a3a5c,#2196f3)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '1rem' }}>
                {p.foto_url ? <img src={p.foto_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : `${p.nombre[0]}${p.apellidos[0]}`}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '.9rem', color: '#1e293b' }}>{p.nombre} {p.apellidos}</div>
                <div style={{ fontSize: '.8rem', color: '#c8902a', fontWeight: '600', marginTop: '2px' }}>{p.cargo}</div>
                {p.email && <div style={{ fontSize: '.75rem', color: '#94a3b8', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email}</div>}
                <div style={{ display: 'flex', gap: '.4rem', marginTop: '.75rem' }}>
                  <Link href={`/admin/personal/${p.id}`}><button style={{ padding: '.35rem .75rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.75rem' }}>Editar</button></Link>
                  <button onClick={() => setDeleteId(p.id)} style={{ padding: '.35rem .75rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.75rem' }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar registro?" message="Se eliminará permanentemente este registro del personal." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
