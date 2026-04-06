'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Especialidad { id: string; codigo: string; nombre: string; duracion_anios: number; imagen_url: string }

export default function EspecialidadesPage() {
  const [items, setItems] = useState<Especialidad[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('especialidades').select('*').order('nombre')
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('especialidades').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Especialidad eliminada', type: 'success' }); fetchData() }
  }

  return (
    <div>
      <Header title="Especialidades" subtitle="Gestión de especialidades académicas" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <Link href="/admin/especialidades/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>➕ Nueva Especialidad</button>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {loading ? <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>Cargando...</p>
           : items.length === 0 ? <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>No hay especialidades registradas</p>
           : items.map(e => (
            <div key={e.id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
              {e.imagen_url && <div style={{ height: '140px', overflow: 'hidden' }}><img src={e.imagen_url} alt={e.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              {!e.imagen_url && <div style={{ height: '100px', background: 'linear-gradient(135deg,#1a3a5c,#2196f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎓</div>}
              <div style={{ padding: '1.25rem' }}>
                {e.codigo && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '.15rem .5rem', borderRadius: '4px', fontSize: '.7rem', fontWeight: '700', letterSpacing: '.05em' }}>{e.codigo}</span>}
                <div style={{ fontWeight: '700', color: '#1e293b', margin: '.5rem 0 .25rem' }}>{e.nombre}</div>
                <div style={{ fontSize: '.8rem', color: '#64748b' }}>⏱️ {e.duracion_anios} años de formación</div>
                <div style={{ display: 'flex', gap: '.4rem', marginTop: '1rem' }}>
                  <Link href={`/admin/especialidades/${e.id}`}><button style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Editar</button></Link>
                  <button onClick={() => setDeleteId(e.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar especialidad?" message="Se eliminará la especialidad y sus relaciones." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
