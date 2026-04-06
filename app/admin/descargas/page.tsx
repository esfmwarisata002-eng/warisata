'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Descarga { id: string; titulo: string; descripcion: string; archivo_url: string; descargas_count: number; created_at: string }

export default function DescargasPage() {
  const [items, setItems] = useState<Descarga[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('descargas').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('descargas').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Descarga eliminada', type: 'success' }); fetchData() }
  }

  return (
    <div>
      <Header title="Descargas" subtitle="Gestión de materiales descargables" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <Link href="/admin/descargas/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>➕ Nueva Descarga</button>
          </Link>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Título', 'Descripción', 'Descargas', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '.85rem 1rem', textAlign: 'left', fontSize: '.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando...</td></tr>
               : items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay archivos de descarga</td></tr>
               : items.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ fontWeight: '600', fontSize: '.875rem' }}>{d.titulo}</div>
                    <a href={d.archivo_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.75rem', color: '#2563eb', textDecoration: 'none' }}>📄 Ver archivo</a>
                  </td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{d.descripcion?.substring(0, 60) || '—'}</td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b', textAlign: 'center' }}>{d.descargas_count}</td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{new Date(d.created_at).toLocaleDateString('es-BO')}</td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <Link href={`/admin/descargas/${d.id}`}><button style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Editar</button></Link>
                      <button onClick={() => setDeleteId(d.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar descarga?" message="Esta acción no se puede deshacer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
