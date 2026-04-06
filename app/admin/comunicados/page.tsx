'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Comunicado { id: string; titulo: string; fecha_publicacion: string; importante: boolean; archivo_url: string }

export default function ComunicadosPage() {
  const [items, setItems] = useState<Comunicado[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('comunicados').select('*').order('fecha_publicacion', { ascending: false })
    if (search) q = q.ilike('titulo', `%${search}%`)
    const { data } = await q
    setItems(data ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('comunicados').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Comunicado eliminado', type: 'success' }); fetchData() }
  }

  return (
    <div>
      <Header title="Comunicados" subtitle="Gestión de comunicados institucionales" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <input type="text" placeholder="🔍 Buscar comunicado..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: '380px', padding: '.65rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }} />
          <Link href="/admin/comunicados/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>➕ Nuevo Comunicado</button>
          </Link>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Título', 'Fecha', 'Prioridad', 'Archivo', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '.85rem 1rem', textAlign: 'left', fontSize: '.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando...</td></tr>
               : items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay comunicados</td></tr>
               : items.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '.85rem 1rem', fontWeight: '600', fontSize: '.875rem' }}>{c.titulo}</td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{new Date(c.fecha_publicacion).toLocaleDateString('es-BO')}</td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <span style={{ background: c.importante ? '#fef3c7' : '#f1f5f9', color: c.importante ? '#92400e' : '#64748b', padding: '.2rem .65rem', borderRadius: '999px', fontSize: '.75rem', fontWeight: '600' }}>
                      {c.importante ? '🔴 Importante' : 'Normal'}
                    </span>
                  </td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem' }}>
                    {c.archivo_url ? <a href={c.archivo_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>📄 Ver archivo</a> : '—'}
                  </td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <Link href={`/admin/comunicados/${c.id}`}><button style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Editar</button></Link>
                      <button onClick={() => setDeleteId(c.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar comunicado?" message="Esta acción no se puede deshacer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
