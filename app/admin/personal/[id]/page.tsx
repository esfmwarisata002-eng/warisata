'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Save, ArrowLeft, Loader2, User, Briefcase, Mail, Phone, Tag, Info } from 'lucide-react'
import Toast from '@/components/Toast'
import FileUploader from '@/components/FileUploader'

interface Categoria {
  id: string
  nombre: string
}

export default function PersonalFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const isEditing = id !== 'nuevo'

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    cargo: '',
    email: '',
    telefono: '',
    categoria_id: '',
    foto_url: '',
    orden: 0
  })

  useEffect(() => {
    fetchCategorias()
    if (isEditing) fetchPersonal()
  }, [id])

  async function fetchCategorias() {
    const { data, error } = await supabase
      .from('categorias_personal')
      .select('*')
      .order('orden')
    
    if (!error && data) {
      setCategorias(data)
      if (!isEditing && data.length > 0) {
        setFormData(prev => ({ ...prev, categoria_id: data[0].id }))
      }
    }
  }

  async function fetchPersonal() {
    try {
      const { data, error } = await supabase
        .from('personal')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) setFormData(data)
    } catch (err: any) {
      setToast({ message: 'Error al cargar personal: ' + err.message, type: 'error' })
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = isEditing
        ? await supabase.from('personal').update(formData).eq('id', id)
        : await supabase.from('personal').insert([formData])

      if (error) throw error

      setToast({ message: 'Personal guardado correctamente', type: 'success' })
      setTimeout(() => router.push('/admin/personal'), 1500)
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
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="group p-3 bg-white hover:bg-[#1a3a5c] hover:text-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1a3a5c] tracking-tight">
            {isEditing ? 'Perfeccionar Perfil' : 'Añadir nuevo Talento'}
          </h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
            <Info size={14} className="text-[#c8902a]" />
            <p>La información será visible en el portal institucional</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Foto y Media */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c8902a]/10 to-transparent rounded-bl-[100px] pointer-events-none" />
            <h3 className="text-sm font-black text-[#1a3a5c] mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c8902a] rounded-full"></span>
              Imagen de Perfil
            </h3>
            
            <FileUploader 
              type="image" 
              currentUrl={formData.foto_url}
              onUploadSuccess={(url) => setFormData({ ...formData, foto_url: url })}
            />
            
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Resultado esperado</p>
              <p className="text-xs text-gray-400">La imagen pasará por un proceso de compresión automática de alta calidad para pesar menos de 500kb.</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Información Detallada */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative">
            <h3 className="text-sm font-black text-[#1a3a5c] mb-8 uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
              <User size={18} className="text-[#c8902a]" />
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nombres del personal</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1a3a5c] transition-colors" />
                  <input 
                    type="text" required value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#c8902a]/10 focus:border-[#c8902a]/30 transition-all font-medium"
                    placeholder="Juan Carlos"
                  />
                </div>
              </div>
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Apellidos del personal</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1a3a5c] transition-colors" />
                  <input 
                    type="text" required value={formData.apellidos}
                    onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#c8902a]/10 focus:border-[#c8902a]/30 transition-all font-medium"
                    placeholder="Mamani Quispe"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-black text-[#1a3a5c] mb-8 uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4 pt-4">
              <Briefcase size={18} className="text-[#c8902a]" />
              Cargo e Institución
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Categoría</label>
                <div className="relative group">
                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1a3a5c] transition-colors z-10" />
                  <select 
                    required value={formData.categoria_id}
                    onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#c8902a]/10 focus:border-[#c8902a]/30 transition-all font-medium appearance-none relative"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cargo</label>
                <div className="relative group">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1a3a5c] transition-colors" />
                  <input 
                    type="text" required value={formData.cargo}
                    onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#c8902a]/10 focus:border-[#c8902a]/30 transition-all font-medium"
                    placeholder="Director Académico"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Corporativo</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="email" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white transition-all font-medium"
                    placeholder="correo@warisata.edu.bo"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Teléfono</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="text" value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white transition-all font-medium"
                    placeholder="+591 70000000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-10">
              <button 
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#1a3a5c] to-[#264e7a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[#1a3a5c]/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isEditing ? 'Actualizar Registro' : 'Inmortalizar Perfil'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
