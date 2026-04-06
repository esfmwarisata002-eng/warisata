'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Toast from '@/components/Toast'

export default function DescargaForm() {
  const router = useRouter()
  const params = useParams()
  const isEdit = params?.id && params.id !== 'nuevo'
  const [form, setForm] = useState({ titulo: '', descripcion: '', archivo_url: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  useEffect(() => {
    if (isEdit) supabase.from('descargas').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) setForm({ titulo: data.titulo, descripcion: data.descripcion ?? '', archivo_url: data.archivo_url })
    })
  }, [isEdit, params?.id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setUploading(true)
    const file = e.target.files[0]
    const { data, error } = await supabase.storage.from('documentos').upload(`descargas/${Date.now()}-${file.name}`, file, { upsert: true })
    if (!error && data) {
      const { data: url } = supabase.storage.from('documentos').getPublicUrl(data.path)
      setForm(f => ({ ...f, archivo_url: url.publicUrl }))
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = isEdit
      ? await supabase.from('descargas').update(form).eq('id', params.id)
      : await supabase.from('descargas').insert([form])
    setLoading(false)
    if (error) setToast({ msg: 'Error: ' + error.message, type: 'error' })
    else { setToast({ msg: 'Descarga guardada', type: 'success' }); setTimeout(() => router.push('/admin/descargas'), 1500) }
  }

  const is = { width: '100%', padding: '.75rem 1rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '.9rem', outline: 'none' }
  const ls = { display: 'block', fontSize: '.875rem', fontWeight: '600', color: '#374151', marginBottom: '.4rem' } as React.CSSProperties

  return (
    <div>
      <Header title={isEdit ? 'Editar Descarga' : 'Nueva Descarga'} />
      <div style={{ padding: '1.5rem', maxWidth: '600px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Título *</label>
              <input type="text" required value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} style={is} placeholder="Nombre del documento" />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={ls}>Descripción</label>
              <textarea rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={{ ...is, resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={ls}>Archivo *</label>
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={handleFileUpload} style={{ display: 'block', marginBottom: '.5rem' }} />
              {uploading && <span style={{ fontSize: '.8rem', color: '#3b82f6' }}>Subiendo archivo...</span>}
              {form.archivo_url && <a href={form.archivo_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.85rem', color: '#2563eb' }}>📄 Ver archivo actual</a>}
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="button" onClick={() => router.push('/admin/descargas')} style={{ padding: '.7rem 1.5rem', border: '1.5px solid #d1d5db', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancelar</button>
              <button type="submit" disabled={loading || !form.archivo_url} style={{ padding: '.7rem 1.5rem', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: (loading || !form.archivo_url) ? .6 : 1 }}>
                {loading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Descarga')}
              </button>
            </div>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
