'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Noticia {
  id: string; titulo: string; resumen: string; imagen_portada_url: string
  destacada: boolean; vistas: number; fecha_publicacion: string
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchNoticias = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('noticias').select('*').order('fecha_publicacion', { ascending: false })
    if (search) q = q.ilike('titulo', `%${search}%`)
    const { data } = await q
    setNoticias(data ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchNoticias() }, [fetchNoticias])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('noticias').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar la noticia', type: 'error' })
    else { setToast({ msg: 'Noticia eliminada correctamente', type: 'success' }); fetchNoticias() }
  }

  return (
    <div>
      <Header title="Noticias" subtitle="Gestión de noticias institucionales" />
      <div style={{ padding: '1.5rem' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
          <input type="text" placeholder="🔍 Buscar noticia..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: '380px', padding: '.65rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }} />
          <Link href="/admin/noticias/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>
              ➕ Nueva Noticia
            </button>
          </Link>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Título', 'Fecha', 'Estado', 'Vistas', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '.85rem 1rem', textAlign: 'left', fontSize: '.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando...</td></tr>
              ) : noticias.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No se encontraron noticias</td></tr>
              ) : noticias.map((n, i) => (
                <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '.875rem' }}>{n.titulo}</div>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8', marginTop: '2px' }}>{n.resumen?.substring(0, 60)}...</div>
                  </td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{new Date(n.fecha_publicacion).toLocaleDateString('es-BO')}</td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    {n.destacada
                      ? <span style={{ background: '#fef3c7', color: '#92400e', padding: '.2rem .65rem', borderRadius: '999px', fontSize: '.75rem', fontWeight: '600' }}>⭐ Destacada</span>
                      : <span style={{ background: '#f1f5f9', color: '#64748b', padding: '.2rem .65rem', borderRadius: '999px', fontSize: '.75rem' }}>Normal</span>}
                  </td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{n.vistas}</td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <Link href={`/admin/noticias/${n.id}`}>
                        <button style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem', fontWeight: '500' }}>Editar</button>
                      </Link>
                      <button onClick={() => setDeleteId(n.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem', fontWeight: '500' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="¿Eliminar noticia?"
        message="Esta acción no se puede deshacer. La noticia será eliminada permanentemente."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
