'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Save,
  ArrowLeft,
  Loader2,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Calendar
} from 'lucide-react'
import Toast from '@/components/Toast'
import FileUploader from '@/components/FileUploader'

export default function ComunicadoFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const isEditing = id !== 'nuevo'

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    archivo_url: '',
    importante: false,
    fecha_expiracion: ''
  })

  useEffect(() => {
    if (isEditing) fetchComunicado()
  }, [id])

  async function fetchComunicado() {
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) setFormData({
        ...data,
        fecha_expiracion: data.fecha_expiracion ? data.fecha_expiracion.split('T')[0] : ''
      })
    } catch (err: any) {
      setToast({ message: 'Error al cargar comunicado: ' + err.message, type: 'error' })
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        fecha_expiracion: formData.fecha_expiracion || null
      }

      const { error } = isEditing
        ? await supabase.from('comunicados').update(payload).eq('id', id)
        : await supabase.from('comunicados').insert([payload])

      if (error) throw error

      setToast({ message: 'Comunicado emitido correctamente ✅', type: 'success' })
      setTimeout(() => router.push('/admin/comunicados'), 1500)
    } catch (err: any) {
      setToast({ message: 'Error al guardar: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#1a3a5c]" size={40} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header Premium */}
      <div className="flex items-center gap-5 mb-10">
        <button
          onClick={() => router.back()}
          className="group p-4 bg-white hover:bg-[#1a3a5c] hover:text-white rounded-[1.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 transition-all duration-300"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <span className="text-[10px] font-black text-[#c8902a] uppercase tracking-[0.3em] mb-1 block">Avisos Oficiales</span>
          <h1 className="text-3xl font-black text-[#1a3a5c] tracking-tight">
            {isEditing ? 'Reformular Comunicado' : 'Nuevo Comunicado Oficial'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contenido Principal */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#c8902a]/5 to-transparent rounded-bl-[200px] pointer-events-none" />

            <div className="space-y-6">
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Título del comunicado</label>
                <div className="relative group">
                  <Bell size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c8902a] transition-colors" />
                  <input
                    type="text" required value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] outline-none focus:bg-white focus:ring-4 focus:ring-[#c8902a]/10 focus:border-[#c8902a]/30 transition-all font-bold text-[#1a3a5c]"
                    placeholder="Escribe el aviso principal aquí..."
                  />
                </div>
              </div>

              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mensaje Detallado</label>
                <div className="bg-gray-50/50 p-1 rounded-[1.5rem] border border-gray-100 focus-within:bg-white transition-all">
                  <textarea
                    rows={8} value={formData.contenido}
                    onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                    className="w-full p-6 bg-transparent outline-none font-medium text-gray-700 leading-bold scrollbar-hide"
                    placeholder="Aquí redacta los detalles del comunicado..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Archivos y Configuración */}
        <div className="lg:col-span-4 space-y-8">
          {/* Tarjeta de Documento */}
          <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden relative">
            <h3 className="text-[10px] font-black text-[#1a3a5c] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c8902a] rounded-full"></span>
              Documento de Soporte (PDF)
            </h3>

            <FileUploader
              type="document"
              currentUrl={formData.archivo_url}
              onUploadSuccess={(url) => setFormData({ ...formData, archivo_url: url })}
            />

            {formData.archivo_url && (
              <a
                href={formData.archivo_url}
                target="_blank" rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <ExternalLink size={14} /> Vista Previa del PDF
              </a>
            )}
          </div>

          {/* Estado Informativo */}
          <div className="bg-[#1a3a5c] p-8 rounded-[2.5rem] shadow-2xl shadow-[#1a3a5c]/30 text-white relative">
            <div className={`absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 animate-pulse`}>
              {formData.importante ? <AlertCircle size={80} /> : <CheckCircle size={80} />}
            </div>

            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 opacity-60">
              <Info size={14} /> Gestión de Alerta
            </h3>

            <div className="space-y-6 mb-10">
              <div
                onClick={() => setFormData({ ...formData, importante: !formData.importante })}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-500 border ${formData.importante ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
              >
                <span className="text-sm font-bold">Resaltar como Importante</span>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${formData.importante ? 'bg-white' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${formData.importante ? 'right-1 bg-red-500' : 'left-1 bg-white'}`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Fecha de Expiración</label>
                <input
                  type="date"
                  value={formData.fecha_expiracion}
                  onChange={e => setFormData({ ...formData, fecha_expiracion: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 transition-all font-medium text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-16 bg-white text-[#1a3a5c] rounded-[1.2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {isEditing ? 'Actualizar Aviso' : 'Nuevo'}
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
