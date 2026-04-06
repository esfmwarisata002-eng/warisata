'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Toast from '@/components/Toast'

export default function TramiteForm() {
  const router = useRouter()
  const params = useParams()
  const isEdit = params?.id && params.id !== 'nuevo'
  const [form, setForm] = useState({ titulo: '', descripcion: '', tiempo_estimado: '', costo: 0, palabras_clave: '', activo: true })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  useEffect(() => {
    if (isEdit) supabase.from('tramites').select('*').eq('id', params.id).single().then(({ data }) => { if (data) setForm(data) })
  }, [isEdit, params?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = isEdit
      ? await supabase.from('tramites').update(form).eq('id', params.id)
      : await supabase.from('tramites').insert([form])
    setLoading(false)
    if (error) setToast({ msg: 'Error: ' + error.message, type: 'error' })
    else { setToast({ msg: 'Trámite guardado', type: 'success' }); setTimeout(() => router.push('/admin/tramites'), 1500) }
  }

  const is = { width: '100%', padding: '.75rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }
  const ls = { display: 'block', fontSize: '.875rem', fontWeight: '600', color: '#374151', marginBottom: '.4rem' } as React.CSSProperties

  return (
    <div>
      <Header title={isEdit ? 'Editar Trámite' : 'Nuevo Trámite'} />
      <div style={{ padding: '1.5rem', maxWidth: '700px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Título *</label>
              <input type="text" required value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} style={is} placeholder="Nombre del trámite" />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Descripción</label>
              <textarea rows={4} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={{ ...is, resize: 'vertical' }} placeholder="Descripción del trámite..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={ls}>Tiempo estimado</label>
                <input type="text" value={form.tiempo_estimado} onChange={e => setForm(f => ({ ...f, tiempo_estimado: e.target.value }))} style={is} placeholder="Ej: 3-5 días hábiles" />
              </div>
              <div>
                <label style={ls}>Costo (Bs.)</label>
                <input type="number" step="0.01" value={form.costo} onChange={e => setForm(f => ({ ...f, costo: parseFloat(e.target.value) }))} style={is} />
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Palabras clave (para búsqueda)</label>
              <input type="text" value={form.palabras_clave} onChange={e => setForm(f => ({ ...f, palabras_clave: e.target.value }))} style={is} placeholder="Ej: inscripción, documentos, matrícula" />
            </div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <input type="checkbox" id="activo" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
              <label htmlFor="activo" style={{ fontSize: '.9rem', fontWeight: '500', cursor: 'pointer' }}>Trámite activo (visible en el portal)</label>
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="button" onClick={() => router.push('/admin/tramites')} style={{ padding: '.7rem 1.5rem', border: '1.5px solid #d1d5db', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancelar</button>
              <button type="submit" disabled={loading} style={{ padding: '.7rem 1.5rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: loading ? .7 : 1 }}>
                {loading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Trámite')}
              </button>
            </div>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
