'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  PhoneCall, 
  MapPin, 
  Mail, 
  Map, 
  Save, 
  Loader2,
  CheckCircle2,
  Globe,
  Share2
} from 'lucide-react'
import Toast from '@/components/Toast'

interface Contacto {
  id: string;
  direccion: string;
  telefono_principal: string;
  telefono_secundario: string;
  email: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  mapa_url: string;
}

export default function GestionContactoPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  
  const [contactData, setContactData] = useState<Contacto>({
    id: '',
    direccion: '',
    telefono_principal: '',
    telefono_secundario: '',
    email: '',
    facebook_url: '',
    twitter_url: '',
    youtube_url: '',
    mapa_url: ''
  })

  useEffect(() => {
    fetchContacto()
  }, [])

  const fetchContacto = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('contacto').select('*').single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is code for "no rows returned"
        throw error
      }

      if (data) {
        setContactData(data)
      }
    } catch (err: any) {
      setToast({ message: 'Error al cargar datos de contacto', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { id, ...payload } = contactData
      
      let error;
      if (id) {
        ({ error } = await supabase.from('contacto').update(payload).eq('id', id))
      } else {
        ({ error } = await supabase.from('contacto').insert([payload]))
      }

      if (error) throw error
      
      setToast({ message: 'Información de contacto actualizada ✅', type: 'success' })
      fetchContacto()
    } catch (err: any) {
      setToast({ message: 'Error al guardar información', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a5c]" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-10 bg-[#f8f9fa] min-h-screen text-[#1a3a5c]">
      <div className="max-w-5xl mx-auto mb-10 border-b border-gray-200 pb-8 flex items-center gap-5">
        <div className="w-14 h-14 bg-[#1a3a5c] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-[#1a3a5c]/20">
          <PhoneCall size={28} />
        </div>
        <div>
          <h1 className="font-black text-2xl uppercase tracking-tighter leading-none italic">
            Datos de <span className="text-[#c8902a]">Contacto</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
            Información Oficial para el Portal Público
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* INFORMACIÓN BÁSICA */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#c8902a]"></div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-[#1a3a5c]">Información de Ubicación</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">Dirección Física</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                <textarea 
                  name="direccion"
                  value={contactData.direccion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5 resize-none"
                  placeholder="Ej: Provincia Omasuyos, Localidad Warisata..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">Teléfono Principal</label>
                <div className="relative">
                  <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    name="telefono_principal"
                    value={contactData.telefono_principal}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                    placeholder="2-XXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">Teléfono Secundario</label>
                <div className="relative">
                  <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    name="telefono_secundario"
                    value={contactData.telefono_secundario}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                    placeholder="Celular u otro"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  name="email"
                  type="email"
                  value={contactData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                  placeholder="contacto@warisata.edu.bo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#1a3a5c]"></div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-[#1a3a5c]">Presencia Digital</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">Facebook URL</label>
              <div className="relative">
                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  name="facebook_url"
                  value={contactData.facebook_url}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">Twitter / X URL</label>
              <div className="relative">
                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input 
                  name="twitter_url"
                  value={contactData.twitter_url}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">YouTube URL</label>
              <div className="relative">
                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600" size={18} />
                <input 
                  name="youtube_url"
                  value={contactData.youtube_url}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-[11px] font-bold border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAPA Y UBICACIÓN GEOGRÁFICA */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-[#1a3a5c]">Geolocalización (Google Maps)</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 px-4 block">URL de inserción del Mapa (Link "Embed")</label>
              <div className="relative">
                <Map className="absolute left-5 top-5 text-gray-300" size={20} />
                <textarea 
                  name="mapa_url"
                  value={contactData.mapa_url}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[2rem] text-[11px] font-medium border-none outline-none focus:ring-4 focus:ring-[#1a3a5c]/5 overflow-hidden"
                  placeholder="Pega aquí el src del iframe de Google Maps..."
                />
              </div>
              <p className="text-[8px] font-bold text-gray-400 px-4 mt-2 italic uppercase tracking-wider">
                * Ve a Google Maps - Compartir - Insertar un mapa - Copia solo el contenido entre comillas de 'src'
              </p>
            </div>
          </div>

          {contactData.mapa_url && (
            <div className="mt-8 relative w-full h-[250px] rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner">
               <iframe 
                src={contactData.mapa_url}
                className="w-full h-full border-none"
                allowFullScreen={true}
                loading="lazy"
               ></iframe>
            </div>
          )}
        </div>

        {/* BOTÓN DE GUARDADO */}
        <div className="md:col-span-2 flex justify-center pt-6">
          <button 
            type="submit"
            disabled={saving}
            className="w-full md:w-[400px] py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-4 group"
          >
            {saving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 className="group-hover:rotate-12 transition-transform" size={24} />
            )}
            {saving ? "Guardando Información..." : "Sincronizar Datos de Contacto"}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
