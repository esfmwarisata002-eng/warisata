'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface EventoAcademico { id: string; titulo: string; descripcion: string; fecha_inicio: string; fecha_fin: string; tipo: string; color: string }

const TIPOS = ['feriado', 'examen', 'matriculacion', 'actividad', 'reunion']
const EMPTY = { titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', tipo: 'actividad', color: '#3788d8' }

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<EventoAcademico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<EventoAcademico | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('eventos_academicos').select('*').order('fecha_inicio')
    setEventos(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openEdit = (ev: EventoAcademico) => {
    setEditItem(ev)
    setForm({ titulo: ev.titulo, descripcion: ev.descripcion ?? '', fecha_inicio: ev.fecha_inicio.substring(0, 16), fecha_fin: ev.fecha_fin.substring(0, 16), tipo: ev.tipo ?? 'actividad', color: ev.color ?? '#3788d8' })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const { error } = editItem
      ? await supabase.from('eventos_academicos').update(form).eq('id', editItem.id)
      : await supabase.from('eventos_academicos').insert([form])
    setSaving(false)
    if (error) setToast({ msg: 'Error al guardar', type: 'error' })
    else { setToast({ msg: 'Evento guardado', type: 'success' }); setShowForm(false); setEditItem(null); setForm(EMPTY); fetchData() }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('eventos_academicos').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else { setToast({ msg: 'Evento eliminado', type: 'success' }); fetchData() }
  }

  const is = { width: '100%', padding: '.75rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }
  const ls = { display: 'block', fontSize: '.875rem', fontWeight: '600', color: '#374151', marginBottom: '.4rem' } as React.CSSProperties

  return (
    <div>
      <Header title="Calendario Académico" subtitle="Gestión del calendario de eventos institucionales" />
      <div style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

        {/* Eventos List */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
            <button onClick={() => { setEditItem(null); setForm(EMPTY); setShowForm(true) }} style={{ padding: '.65rem 1.25rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '.9rem' }}>
              ➕ Nuevo Evento
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {loading ? <p style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem' }}>Cargando...</p>
             : eventos.length === 0 ? <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}><p style={{ color: '#94a3b8' }}>No hay eventos en el calendario</p></div>
             : eventos.map(ev => (
              <div key={ev.id} style={{ background: '#fff', borderRadius: '10px', padding: '1.1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${ev.color || '#3788d8'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '.9rem', color: '#1e293b' }}>{ev.titulo}</span>
                    <span style={{ background: '#f1f5f9', color: '#64748b', padding: '.1rem .5rem', borderRadius: '4px', fontSize: '.7rem', textTransform: 'capitalize' }}>{ev.tipo}</span>
                  </div>
                  <div style={{ fontSize: '.8rem', color: '#64748b' }}>
                    {new Date(ev.fecha_inicio).toLocaleDateString('es-BO')} → {new Date(ev.fecha_fin).toLocaleDateString('es-BO')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.4rem' }}>
                  <button onClick={() => openEdit(ev)} style={{ padding: '.4rem .8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Editar</button>
                  <button onClick={() => setDeleteId(ev.id)} style={{ padding: '.4rem .8rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Panel */}
        {showForm && (
          <div style={{ width: '350px', flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a3a5c', margin: 0 }}>{editItem ? 'Editar Evento' : 'Nuevo Evento'}</h3>
                <button onClick={() => { setShowForm(false); setEditItem(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '.9rem' }}>
                  <label style={ls}>Título *</label>
                  <input type="text" required value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} style={is} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '.9rem' }}>
                  <div>
                    <label style={ls}>Inicio *</label>
                    <input type="datetime-local" required value={form.fecha_inicio} onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} style={is} />
                  </div>
                  <div>
                    <label style={ls}>Fin *</label>
                    <input type="datetime-local" required value={form.fecha_fin} onChange={e => setForm(f => ({ ...f, fecha_fin: e.target.value }))} style={is} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '.75rem', marginBottom: '.9rem' }}>
                  <div>
                    <label style={ls}>Tipo</label>
                    <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} style={is}>
                      {TIPOS.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ls}>Color</label>
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '50px', height: '44px', border: '1.5px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', padding: '2px' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={ls}>Descripción</label>
                  <textarea rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={{ ...is, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button type="button" onClick={() => { setShowForm(false); setEditItem(null) }} style={{ flex: 1, padding: '.65rem', border: '1.5px solid #d1d5db', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '.875rem', fontWeight: '500' }}>Cancelar</button>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: '.65rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '.875rem', fontWeight: '600', opacity: saving ? .7 : 1 }}>
                    {saving ? 'Guardando...' : (editItem ? 'Actualizar' : 'Crear')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={!!deleteId} title="¿Eliminar evento?" message="El evento será eliminado del calendario." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
