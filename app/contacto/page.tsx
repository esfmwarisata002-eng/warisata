'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Users,
  PlayCircle,
  Globe,
  Sparkles,
  Clock,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Home
} from 'lucide-react'

interface ContactoData {
  direccion: string;
  telefono_principal: string;
  telefono_secundario: string;
  email: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  mapa_url: string;
}

export default function ContactoPage() {
  const [contactData, setContactData] = useState<ContactoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContacto() {
      try {
        const { data } = await supabase.from('contacto').select('*').single()
        if (data) setContactData(data)
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchContacto()
  }, [])

  return (
    <div className="min-h-screen bg-[#fdfcfb] font-['Outfit'] text-slate-900 selection:bg-emerald-600 selection:text-white">
      <Navbar />

      <main className="pt-40 pb-40 px-6">
        <div className="max-w-[1700px] mx-auto space-y-16">
           
           {/* REFINED HEADER WITH ENLARGED STATUS */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-slate-200/60 pb-12 animate-fade-in">
              <div className="space-y-4">
                 {/* Breadcrumbs */}
                 <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <a href="/" className="hover:text-emerald-600 transition-colors">Inicio</a>
                    <ChevronRight size={12} />
                    <span className="text-emerald-600">Contacto</span>
                 </nav>
                 <h1 className="text-5xl md:text-6xl font-black text-[#002147] tracking-tighter uppercase leading-none">
                    Atención <span className="text-emerald-500 font-serif-formal italic font-normal lowercase tracking-normal">institucional.</span>
                 </h1>
              </div>
              
              {/* ENLARGED STATUS SECTION ON THE RIGHT */}
              <div className="flex flex-col md:items-end gap-6">
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-xs font-black uppercase tracking-[0.2em]">Abierto Ahora</span>
                    </div>
                    <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-[#002147] text-white shadow-xl shadow-emerald-900/10">
                       <Clock size={16} className="text-emerald-400" />
                       <span className="text-xs font-black uppercase tracking-[0.2em]">08:00 AM — 18:00 PM</span>
                    </div>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pr-4">Horario de Oficina Institucional</p>
              </div>
           </div>

           {/* 3-COLUMN PILLAR & ANCHOR GRID */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* SIDE PILLAR: CHANNELS (25%) */}
              <div className="lg:col-span-3 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,33,71,0.03)] flex flex-col justify-between group hover:border-emerald-200 transition-all duration-700">
                 <div className="space-y-12">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                       <Mail size={24} />
                    </div>
                    <div className="space-y-10">
                       <div className="space-y-1 group/item cursor-pointer">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400">E-mail Oficial</h4>
                          <p className="text-xl font-black text-[#002147] group-hover/item:text-emerald-600 transition-colors break-all leading-tight">
                             {contactData?.email || 'contacto@warisata.edu.bo'}
                          </p>
                       </div>
                       <div className="space-y-1 group/item cursor-pointer">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400">Línea Telefónica</h4>
                          <p className="text-xl font-black text-[#002147] group-hover/item:text-emerald-600 transition-colors leading-tight">
                             {contactData?.telefono_principal || '+591 2 2840000'}
                          </p>
                       </div>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-slate-50 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Canales Verificados</p>
                 </div>
              </div>

              {/* CENTER ANCHOR: THE MAP (50%) */}
              <div className="lg:col-span-6 flex flex-col space-y-6">
                 <div className="bg-white p-3 rounded-[4.5rem] shadow-[0_30px_80px_rgba(0,33,71,0.06)] border border-slate-100 overflow-hidden relative group h-[600px]">
                    <div className="h-full rounded-[3.8rem] overflow-hidden relative grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]">
                       {loading ? <div className="w-full h-full bg-slate-50 animate-pulse" /> : (
                         <iframe src={contactData?.mapa_url} className="w-full h-full border-none" loading="lazy"></iframe>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    <div className="absolute bottom-10 left-10 right-10 z-20 flex items-center justify-between gap-4">
                       <div className="p-6 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col items-start gap-0.5 flex-1 max-w-[300px]">
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-600">Sede Central Warisata</span>
                          <p className="text-sm font-black text-[#002147] leading-tight truncate w-full">{contactData?.direccion || 'Provincia Omasuyos'}</p>
                       </div>
                       <a href={contactData?.mapa_url} target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#002147] text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl hover:bg-emerald-600 transition-all transform hover:rotate-12 shrink-0">
                          <Navigation size={24} />
                       </a>
                    </div>
                 </div>
              </div>

              {/* SIDE PILLAR: COMMUNITY (25%) */}
              <div className="lg:col-span-3 bg-[#002147] p-10 rounded-[3.5rem] text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                 <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
                 
                 <div className="space-y-12 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                       <Clock size={24} />
                    </div>
                    <div className="space-y-10">
                       <div className="space-y-1">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Disponibilidad</h4>
                          <p className="text-2xl font-black">Lun — Vie</p>
                          <p className="text-lg font-bold text-slate-400 italic">08:00 AM — 18:00 PM</p>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Comunidad Digital</h4>
                          <div className="flex gap-4">
                             <a href={contactData?.facebook_url || '#'} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-all"><Users size={20} /></a>
                             <a href={contactData?.youtube_url || '#'} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-all"><PlayCircle size={20} /></a>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-8 border-t border-white/10 relative z-10">
                    <button className="flex items-center gap-3 text-emerald-400 font-black uppercase text-[9px] tracking-widest group-hover:gap-5 transition-all">
                       Portal Web <ChevronRight size={16} />
                    </button>
                 </div>
              </div>

           </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
