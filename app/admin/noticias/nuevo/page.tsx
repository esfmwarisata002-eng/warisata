'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  Type, 
  Layout, 
  Star, 
  Calendar,
  Eye,
  AlignLeft
} from 'lucide-react'
import Toast from '@/components/Toast'
import FileUploader from '@/components/FileUploader'

export default function NuevaNoticiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    imagen_portada_url: '',
    destacada: false,
    vistas: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Obtener la sesión del usuario actual para el autor_id
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No se encontró una sesión activa. Por favor, inicia sesión nuevamente.')
      }

      // 2. Insertar la noticia vinculada al autor actual
      const payload = {
        ...formData,
        autor_id: session.user.id
      }

      const { error } = await supabase.from('noticias').insert([payload])

      if (error) throw error

      setToast({ message: 'Noticia publicada con éxito ✨', type: 'success' })
      setTimeout(() => router.push('/admin/noticias'), 1500)
    } catch (err: any) {
      setToast({ message: 'Error al publicar: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button 
            type="button"
            onClick={() => router.back()}
            className="group p-4 bg-white hover:bg-[#1a3a5c] hover:text-white rounded-[1.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 transition-all duration-500"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <span className="text-[10px] font-black text-[#c8902a] uppercase tracking-[0.3em] mb-1 block">Redacción Institucional</span>
            <h1 className="text-3xl font-black text-[#1a3a5c] tracking-tight">Publicar Nueva Crónica</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 relative overflow-hidden">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Título</label>
                <div className="relative">
                  <Type size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="text" required value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] outline-none focus:bg-white focus:ring-4 focus:ring-[#c8902a]/5 transition-all text-xl font-bold text-[#1a3a5c]"
                    placeholder="Título de la noticia..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resumen</label>
                <textarea 
                  rows={3} required value={formData.resumen}
                  onChange={e => setFormData({ ...formData, resumen: e.target.value })}
                  className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] outline-none focus:bg-white transition-all font-medium text-gray-600"
                  placeholder="Introducción corta..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cuerpo</label>
                <textarea 
                  rows={10} required value={formData.contenido}
                  onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                  className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] outline-none focus:bg-white transition-all text-gray-700"
                  placeholder="Escribe el contenido aquí..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-7 rounded-[2.5rem] shadow-xl border border-gray-50">
            <h3 className="text-sm font-black text-[#1a3a5c] mb-6 uppercase tracking-widest flex items-center gap-2">
              <Layout size={18} className="text-[#c8902a]" /> Portada
            </h3>
            <FileUploader 
              type="image" 
              currentUrl={formData.imagen_portada_url}
              onUploadSuccess={(url) => setFormData({ ...formData, imagen_portada_url: url })}
            />
          </div>

          <div className="bg-[#1a3a5c] p-8 rounded-[2.5rem] shadow-2xl text-white text-center">
            <div 
              onClick={() => setFormData({ ...formData, destacada: !formData.destacada })}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border mb-8 ${
                formData.destacada ? 'bg-[#c8902a] border-[#c8902a]' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star size={20} className={formData.destacada ? 'fill-white text-white' : 'text-gray-400'} />
                <span className="text-sm font-bold capitalize">Noticia destacada</span>
              </div>
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full h-16 bg-white text-[#1a3a5c] rounded-[1.2rem] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Publicar Ahora
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
