'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  Newspaper, 
  Type, 
  Layout, 
  Star, 
  Info,
  Calendar,
  Eye,
  AlignLeft
} from 'lucide-react'
import Toast from '@/components/Toast'
import FileUploader from '@/components/FileUploader'

export default function NoticiaFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const isEditing = id !== 'nuevo'

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    imagen_portada_url: '',
    destacada: false,
    vistas: 0
  })

  useEffect(() => {
    if (isEditing) fetchNoticia()
  }, [id])

  async function fetchNoticia() {
    try {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) setFormData(data)
    } catch (err: any) {
      setToast({ message: 'Error al cargar noticia: ' + err.message, type: 'error' })
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = isEditing
        ? await supabase.from('noticias').update(formData).eq('id', id)
        : await supabase.from('noticias').insert([formData])

      if (error) throw error

      setToast({ message: 'Noticia guardada con éxito ✨', type: 'success' })
      setTimeout(() => router.push('/admin/noticias'), 1500)
    } catch (err: any) {
      setToast({ message: 'Error al publicar: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#c8902a]" size={48} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Creativo */}
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
            <span className="text-[10px] font-black text-[#c8902a] uppercase tracking-[0.3em] mb-1 block">Editor de Contenidos</span>
            <h1 className="text-3xl font-black text-[#1a3a5c] tracking-tight">
              {isEditing ? 'Perfeccionar Noticia' : 'Crear Crónica Nueva'}
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 px-4 py-2 border-r border-gray-100">
              <Eye size={16} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-600">{formData.vistas} <span className="font-normal text-gray-400">Lecturas</span></span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-600">Hoy</span>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal: Contenido */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#c8902a]/5 to-transparent rounded-bl-[200px] pointer-events-none" />
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Título de la Noticia</label>
                <div className="relative group">
                  <Type size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c8902a] transition-colors" />
                  <input 
                    type="text" required value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] outline-none focus:bg-white focus:ring-4 focus:ring-[#c8902a]/5 focus:border-[#c8902a]/20 transition-all text-xl font-bold text-[#1a3a5c]"
                    placeholder="Escribe el título aquí..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resumen Corto</label>
                <div className="relative group">
                  <AlignLeft size={20} className="absolute left-5 top-5 text-gray-300 group-focus-within:text-[#c8902a] transition-colors" />
                  <textarea 
                    rows={3} required value={formData.resumen}
                    onChange={e => setFormData({ ...formData, resumen: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] outline-none focus:bg-white focus:ring-4 focus:ring-[#c8902a]/5 focus:border-[#c8902a]/20 transition-all font-medium text-gray-600 leading-relaxed"
                    placeholder="Escribe una breve introducción..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cuerpo de la noticia</label>
                <div className="bg-gray-50/50 p-1 rounded-[1.5rem] border border-gray-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#c8902a]/5 transition-all">
                  <textarea 
                    rows={12} required value={formData.contenido}
                    onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                    className="w-full p-6 bg-transparent outline-none font-medium text-gray-700 leading-bold"
                    placeholder="Desarrolla toda la información aquí..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral */}
        <div className="lg:col-span-4 space-y-8">
          {/* Multimedia */}
          <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden group">
            <h3 className="text-sm font-black text-[#1a3a5c] mb-6 uppercase tracking-widest flex items-center gap-2">
              <Layout size={18} className="text-[#c8902a]" />
              Imagen Principal
            </h3>
            
            <FileUploader 
              type="image" 
              currentUrl={formData.imagen_portada_url}
              onUploadSuccess={(url) => setFormData({ ...formData, imagen_portada_url: url })}
            />
            <p className="text-[10px] text-gray-400 mt-4 text-center">Recomendado: 1200x800px</p>
          </div>

          {/* Opciones Especiales */}
          <div className="bg-[#1a3a5c] p-8 rounded-[2.5rem] shadow-2xl shadow-[#1a3a5c]/20 text-white">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-80">
              <Star size={14} /> Publicación Premium
            </h3>

            <div 
              onClick={() => setFormData({ ...formData, destacada: !formData.destacada })}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-500 border ${
                formData.destacada ? 'bg-[#c8902a] border-[#c8902a]' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star size={20} className={formData.destacada ? 'fill-white text-white' : 'text-gray-500'} />
                <span className="text-sm font-bold">Resaltar noticia</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${formData.destacada ? 'bg-white' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${formData.destacada ? 'right-1 bg-[#c8902a]' : 'left-1 bg-white'}`} />
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit" disabled={loading}
                className="w-full h-16 bg-white text-[#1a3a5c] rounded-[1.2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isEditing ? 'Guardar Cambios' : 'Publicar Noticia'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
