'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Evento { id: string; titulo: string; fecha_evento: string; portada_url: string }
interface Foto { id: string; evento_id: string; foto_url: string; descripcion: string }

export default function GaleriaPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selectedEvento, setSelectedEvento] = useState<string | null>(null)
  const [fotos, setFotos] = useState<Foto[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<'evento' | 'foto'>('evento')
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)
  const [newEventoForm, setNewEventoForm] = useState({ titulo: '', descripcion: '', fecha_evento: '' })
  const [showNewEvento, setShowNewEvento] = useState(false)

  const fetchEventos = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('eventos').select('*').order('fecha_evento', { ascending: false })
    setEventos(data ?? [])
    setLoading(false)
  }, [])

  const fetchFotos = useCallback(async (eventoId: string) => {
    const { data } = await supabase.from('fotos_evento').select('*').eq('evento_id', eventoId).order('orden')
    setFotos(data ?? [])
  }, [])

  useEffect(() => { fetchEventos() }, [fetchEventos])
  useEffect(() => { if (selectedEvento) fetchFotos(selectedEvento) }, [selectedEvento, fetchFotos])

  const handleCreateEvento = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('eventos').insert([newEventoForm])
    if (error) setToast({ msg: 'Error al crear evento', type: 'error' })
    else { setToast({ msg: 'Evento creado', type: 'success' }); setShowNewEvento(false); setNewEventoForm({ titulo: '', descripcion: '', fecha_evento: '' }); fetchEventos() }
  }

  const handleUploadFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedEvento) return
    setUploading(true)
    const files = Array.from(e.target.files)
    for (const file of files) {
      const { data, error } = await supabase.storage.from('imagenes').upload(`galeria/${Date.now()}-${file.name}`, file, { upsert: true })
      if (!error && data) {
        const { data: url } = supabase.storage.from('imagenes').getPublicUrl(data.path)
        await supabase.from('fotos_evento').insert([{ evento_id: selectedEvento, foto_url: url.publicUrl }])
      }
    }
    setUploading(false)
    fetchFotos(selectedEvento)
    setToast({ msg: `${files.length} foto(s) subida(s)`, type: 'success' })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = deleteType === 'evento'
      ? await supabase.from('eventos').delete().eq('id', deleteId)
      : await supabase.from('fotos_evento').delete().eq('id', deleteId)
    setDeleteId(null)
    if (error) setToast({ msg: 'Error al eliminar', type: 'error' })
    else {
      setToast({ msg: 'Eliminado correctamente', type: 'success' })
      if (deleteType === 'evento') { setSelectedEvento(null); fetchEventos() }
      else if (selectedEvento) fetchFotos(selectedEvento)
    }
  }

  const is = { width: '100%', padding: '.75rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }
  const ls = { display: 'block', fontSize: '.875rem', fontWeight: '600', color: '#374151', marginBottom: '.4rem' } as React.CSSProperties

  return (
    <div>
      <Header title="Galería de Eventos" subtitle="Gestión de eventos fotográficos" />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

          {/* Events Panel */}
          <div style={{ width: '320px', flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a3a5c', margin: 0 }}>Eventos</h3>
                <button onClick={() => setShowNewEvento(true)} style={{ padding: '.35rem .8rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem', fontWeight: '600' }}>+ Nuevo</button>
              </div>

              {showNewEvento && (
                <form onSubmit={handleCreateEvento} style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '.75rem' }}>
                    <label style={ls}>Título *</label>
                    <input type="text" required value={newEventoForm.titulo} onChange={e => setNewEventoForm(f => ({ ...f, titulo: e.target.value }))} style={is} />
                  </div>
                  <div style={{ marginBottom: '.75rem' }}>
                    <label style={ls}>Fecha *</label>
                    <input type="date" required value={newEventoForm.fecha_evento} onChange={e => setNewEventoForm(f => ({ ...f, fecha_evento: e.target.value }))} style={is} />
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button type="button" onClick={() => setShowNewEvento(false)} style={{ flex: 1, padding: '.5rem', border: '1px solid #d1d5db', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>Cancelar</button>
                    <button type="submit" style={{ flex: 1, padding: '.5rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem', fontWeight: '600' }}>Crear</button>
                  </div>
                </form>
              )}

              {loading ? <p style={{ color: '#94a3b8', fontSize: '.875rem' }}>Cargando...</p>
               : eventos.map(ev => (
                <div key={ev.id} onClick={() => setSelectedEvento(ev.id)} style={{ padding: '.75rem', borderRadius: '8px', cursor: 'pointer', background: selectedEvento === ev.id ? '#eff6ff' : 'transparent', border: selectedEvento === ev.id ? '1.5px solid #bfdbfe' : '1.5px solid transparent', marginBottom: '.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '.875rem', fontWeight: '600', color: '#1e293b' }}>{ev.titulo}</div>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{new Date(ev.fecha_evento).toLocaleDateString('es-BO')}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteType('evento'); setDeleteId(ev.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '.9rem', padding: '.2rem' }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>

          {/* Photos Panel */}
          <div style={{ flex: 1 }}>
            {!selectedEvento ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
                <p style={{ color: '#94a3b8', fontSize: '.95rem' }}>Selecciona un evento para ver y gestionar sus fotos</p>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a3a5c', margin: 0 }}>Fotos del evento</h3>
                  <div>
                    <label style={{ padding: '.55rem 1.25rem', background: '#10b981', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '.875rem', fontWeight: '600' }}>
                      {uploading ? 'Subiendo...' : '📤 Subir fotos'}
                      <input type="file" accept="image/*" multiple onChange={handleUploadFotos} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                  </div>
                </div>
                {fotos.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem', fontSize: '.875rem' }}>No hay fotos en este evento. ¡Sube las primeras!</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {fotos.map(f => (
                      <div key={f.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9', aspectRatio: '4/3' }}>
                        <img src={f.foto_url} alt={f.descripcion || 'Foto'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => { setDeleteType('foto'); setDeleteId(f.id) }}
                          style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239,68,68,.9)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '.25rem .5rem', fontSize: '.75rem', fontWeight: '600' }}>✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} title={`¿Eliminar ${deleteType === 'evento' ? 'evento' : 'foto'}?`} message="Esta acción no se puede deshacer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
