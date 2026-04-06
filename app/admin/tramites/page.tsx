'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Tramite { id: string; titulo: string; descripcion: string; tiempo_estimado: string; costo: number; activo: boolean }

export default function TramitesPage() {
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchTramites = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('tramites').select('*').order('titulo')
    if (search) q = q.ilike('titulo', `%${search}%`)
    const { data } = await q
    setTramites(data ?? [])
    setLoading(false)
  }, [search])

  useEffect(() => { fetchTramites() }, [fetchTramites])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('tramites').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Trámite eliminado', type: 'success' }); fetchTramites() }
  }

  return (
    <div>
      <Header title="Trámites" subtitle="Gestión de trámites institucionales" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <input type="text" placeholder="🔍 Buscar trámite..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: '380px', padding: '.65rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }} />
          <Link href="/admin/tramites/nuevo">
            <button style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>➕ Nuevo Trámite</button>
          </Link>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['Título', 'Tiempo', 'Costo (Bs.)', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '.85rem 1rem', textAlign: 'left', fontSize: '.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando...</td></tr>
               : tramites.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay trámites</td></tr>
               : tramites.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ fontWeight: '600', fontSize: '.875rem' }}>{t.titulo}</div>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{t.descripcion?.substring(0, 55)}...</div>
                  </td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{t.tiempo_estimado || '—'}</td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.85rem', color: '#64748b' }}>Bs. {t.costo}</td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <span style={{ background: t.activo ? '#d1fae5' : '#fee2e2', color: t.activo ? '#065f46' : '#991b1b', padding: '.2rem .65rem', borderRadius: '999px', fontSize: '.75rem', fontWeight: '600' }}>
                      {t.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <Link href={`/admin/tramites/${t.id}`}><button style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem', fontWeight: '500' }}>Editar</button></Link>
                      <button onClick={() => setDeleteId(t.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem', fontWeight: '500' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar trámite?" message="Esta acción no se puede deshacer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
