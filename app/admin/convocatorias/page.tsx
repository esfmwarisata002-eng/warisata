'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Convocatoria { id: string; titulo: string; fecha_inicio: string; fecha_fin: string; estado: string; documento_pdf_url: string }

const estadoColors: Record<string, { bg: string; color: string }> = {
  abierta:   { bg: '#d1fae5', color: '#065f46' },
  en_curso:  { bg: '#dbeafe', color: '#1e40af' },
  cerrada:   { bg: '#fee2e2', color: '#991b1b' },
}

export default function ConvocatoriasPage() {
  const [items, setItems] = useState<Convocatoria[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('convocatorias').select('*').order('fecha_inicio', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('convocatorias').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Convocatoria eliminada', type: 'success' }); fetchData() }
  }

  return (
    <div>
      <Header title="Convocatorias" subtitle="Gestión de convocatorias de admisión" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <Link href="/admin/convocatorias/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>➕ Nueva Convocatoria</button>
          </Link>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Título', 'Inicio', 'Fin', 'Estado', 'Documento', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '.85rem 1rem', textAlign: 'left', fontSize: '.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando...</td></tr>
               : items.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay convocatorias</td></tr>
               : items.map((c, i) => {
                const ec = estadoColors[c.estado] ?? { bg: '#f1f5f9', color: '#64748b' }
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={{ padding: '.85rem 1rem', fontWeight: '600', fontSize: '.875rem' }}>{c.titulo}</td>
                    <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{new Date(c.fecha_inicio).toLocaleDateString('es-BO')}</td>
                    <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{new Date(c.fecha_fin).toLocaleDateString('es-BO')}</td>
                    <td style={{ padding: '.85rem 1rem' }}>
                      <span style={{ background: ec.bg, color: ec.color, padding: '.2rem .65rem', borderRadius: '999px', fontSize: '.75rem', fontWeight: '600', textTransform: 'capitalize' }}>{c.estado?.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '.85rem 1rem' }}>
                      {c.documento_pdf_url ? <a href={c.documento_pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontSize: '.85rem', textDecoration: 'none' }}>📄 PDF</a> : '—'}
                    </td>
                    <td style={{ padding: '.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <Link href={`/admin/convocatorias/${c.id}`}><button style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Editar</button></Link>
                        <button onClick={() => setDeleteId(c.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar convocatoria?" message="Esta acción no se puede deshacer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
