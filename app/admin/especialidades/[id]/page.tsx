'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Toast from '@/components/Toast'

export default function EspecialidadForm() {
  const router = useRouter()
  const params = useParams()
  const isEdit = params?.id && params.id !== 'nuevo'
  const [form, setForm] = useState({ codigo: '', nombre: '', descripcion: '', duracion_anios: 5, perfil_egreso: '', imagen_url: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  useEffect(() => {
    if (isEdit) supabase.from('especialidades').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) setForm({ codigo: data.codigo ?? '', nombre: data.nombre, descripcion: data.descripcion ?? '', duracion_anios: data.duracion_anios, perfil_egreso: data.perfil_egreso ?? '', imagen_url: data.imagen_url ?? '' })
    })
  }, [isEdit, params?.id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setUploading(true)
    const file = e.target.files[0]
    const { data, error } = await supabase.storage.from('imagenes').upload(`especialidades/${Date.now()}-${file.name}`, file, { upsert: true })
    if (!error && data) {
      const { data: url } = supabase.storage.from('imagenes').getPublicUrl(data.path)
      setForm(f => ({ ...f, imagen_url: url.publicUrl }))
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = isEdit
      ? await supabase.from('especialidades').update(form).eq('id', params.id)
      : await supabase.from('especialidades').insert([form])
    setLoading(false)
    if (error) setToast({ msg: 'Error: ' + error.message, type: 'error' })
    else { setToast({ msg: 'Especialidad guardada', type: 'success' }); setTimeout(() => router.push('/admin/especialidades'), 1500) }
  }

  const is = { width: '100%', padding: '.75rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }
  const ls = { display: 'block', fontSize: '.875rem', fontWeight: '600', color: '#374151', marginBottom: '.4rem' } as React.CSSProperties

  return (
    <div>
      <Header title={isEdit ? 'Editar Especialidad' : 'Nueva Especialidad'} />
      <div style={{ padding: '1.5rem', maxWidth: '700px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={ls}>Código</label>
                <input type="text" value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} style={is} placeholder="EDU-01" />
              </div>
              <div>
                <label style={ls}>Nombre *</label>
                <input type="text" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={is} placeholder="Nombre de la especialidad" />
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Descripción</label>
              <textarea rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={{ ...is, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Duración (años)</label>
              <input type="number" min={1} max={10} value={form.duracion_anios} onChange={e => setForm(f => ({ ...f, duracion_anios: parseInt(e.target.value) }))} style={is} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Perfil de Egreso</label>
              <textarea rows={4} value={form.perfil_egreso} onChange={e => setForm(f => ({ ...f, perfil_egreso: e.target.value }))} style={{ ...is, resize: 'vertical' }} placeholder="Descripción del perfil de egreso..." />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={ls}>Imagen</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '.5rem' }} />
              {uploading && <span style={{ fontSize: '.8rem', color: '#3b82f6' }}>Subiendo...</span>}
              {form.imagen_url && <img src={form.imagen_url} alt="preview" style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '.5rem' }} />}
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="button" onClick={() => router.push('/admin/especialidades')} style={{ padding: '.7rem 1.5rem', border: '1.5px solid #d1d5db', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancelar</button>
              <button type="submit" disabled={loading} style={{ padding: '.7rem 1.5rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: loading ? .7 : 1 }}>
                {loading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Especialidad')}
              </button>
            </div>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
