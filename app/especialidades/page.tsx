'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { GraduationCap, Clock, Landmark, ArrowRight, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEspecialidades() {
      const { data } = await supabase.from('especialidades').select('*').order('nombre')
      if (data) setEspecialidades(data)
      setLoading(false)
    }
    fetchEspecialidades()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Outfit'] text-slate-800 selection:bg-amber-500 selection:text-[#002147]">
      <Navbar />

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* EDITORIAL HERO SECTION - FULLSCREEN IMPACT */}
        <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden bg-white">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -skew-x-12 translate-x-1/4 z-0" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0" />
          
          <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up w-full">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 mb-10 shadow-sm">
               <GraduationCap size={20} className="animate-bounce" />
               <span className="text-xs font-black uppercase tracking-[0.4em]">Formación Profesional Superior</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#002147] tracking-tighter leading-[0.9] mb-8">
               Oferta <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 font-serif-formal italic font-bold">
                 Académica.
               </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
               Forjando el futuro de la educación boliviana con excelencia académica, 
               compromiso social y raíces comunitarias.
            </p>

            <div className="flex justify-center">
              <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            </div>
          </div>
        </section>

        {/* 2. INSTITUTIONAL STATS - PREMIUM ACCENT */}
        <section className="relative z-30 -mt-16 mb-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(0,33,71,0.08)] border border-white/50">
            <div className="text-center space-y-2 border-r border-slate-100 last:border-0">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">93</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Años de Historia</div>
            </div>
            <div className="text-center space-y-2 border-r border-slate-100 last:border-0">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">100%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titulación Oficial</div>
            </div>
            <div className="text-center space-y-2 border-r border-slate-100 last:border-0">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">+500</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nuevos Maestros</div>
            </div>
            <div className="text-center space-y-2 last:border-0">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter">6</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Especialidades</div>
            </div>
          </div>
        </section>

        {/* DYNAMIC GRID OF SPECIALTIES */}
        <section className="py-20 relative z-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.02] pointer-events-none" />
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                 {loading ? (
                   [1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className="h-[400px] bg-white rounded-[2rem] shadow-sm animate-pulse border border-slate-100" />
                   ))
                 ) : (
                   especialidades.map((esp, idx) => {
                     const n = esp.nombre.toUpperCase()
                     const fallbackImage = 
                       n.includes('AGROPECUARIA') ? 'https://images.pexels.com/photos/36185897/pexels-photo-36185897.jpeg' :
                       n.includes('INICIAL') ? 'https://images.pexels.com/photos/8923959/pexels-photo-8923959.jpeg' :
                       n.includes('MUSICAL') ? 'https://images.pexels.com/photos/8190773/pexels-photo-8190773.jpeg' :
                       n.includes('PRIMARIA') ? 'https://images.pexels.com/photos/10646409/pexels-photo-10646409.jpeg' :
                       n.includes('TEXTIL') ? 'https://images.pexels.com/photos/5894218/pexels-photo-5894218.jpeg' :
                       n.includes('MECANICA') ? 'https://images.pexels.com/photos/34337558/pexels-photo-34337558.jpeg' : null

                     return (
                       <div 
                         key={esp.id} 
                         className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,33,71,0.12)] transition-all duration-700 overflow-hidden animate-fade-in-up hover:-translate-y-2"
                         style={{ animationDelay: `${idx * 0.1}s` }}
                       >
                          {/* Header Image / Graphic */}
                          <div className="relative h-56 overflow-hidden bg-[#002147]">
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700 z-10" />
                             {(esp.imagen_url || fallbackImage) ? (
                               <img 
                                 src={esp.imagen_url || fallbackImage} 
                                 className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                 alt={esp.nombre} 
                               />
                             ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-gradient-to-br from-[#002147] to-[#00122a]">
                                  <BookOpen size={40} strokeWidth={1.5} />
                               </div>
                             )}
                             
                             {/* Floating Badge */}
                             <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md text-[#002147] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                {esp.codigo || 'ESFM'}
                             </div>
                          </div>

                          {/* Content Body */}
                          <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between relative z-10 bg-white">
                             <div className="space-y-4 mb-6">
                                <h3 className="text-xl lg:text-2xl font-black text-[#002147] leading-tight tracking-tight group-hover:text-emerald-600 transition-colors duration-300">
                                   {esp.nombre}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                                   {esp.descripcion || 'Formación docente de excelencia con enfoque comunitario y productivo.'}
                                </p>
                             </div>
                             
                             <div className="flex flex-col gap-6 mt-auto">
                                <div className="flex items-center gap-3">
                                   <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-emerald-700 border border-emerald-50">
                                      <Clock size={14} />
                                      <span className="text-[10px] font-bold uppercase tracking-wider">{esp.duracion_anios || 5} Años</span>
                                   </div>
                                   <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-emerald-700 border border-emerald-50">
                                      <Landmark size={14} />
                                      <span className="text-[10px] font-bold uppercase tracking-wider">Lics.</span>
                                   </div>
                                </div>

                                <div className="w-full h-px bg-slate-100 group-hover:bg-emerald-500/20 transition-colors" />

                                <button className="flex items-center justify-between w-full text-[#002147] font-black text-[9px] uppercase tracking-widest group/btn">
                                   Ver Detalle
                                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all">
                                      <ArrowRight size={14} />
                                   </div>
                                </button>
                             </div>
                          </div>
                       </div>
                     )
                   })
                 )}
              </div>
           </div>
        </section>

        {/* CALL TO ACTION - CINEMATIC VERSION */}
        <section className="py-40 relative overflow-hidden bg-[#002147] text-center">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-[#002147] to-[#002147] z-0" />
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] z-10" />
           
           <div className="max-w-5xl mx-auto px-6 relative z-20 space-y-12">
              <div className="inline-block px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                 Inscripciones Abiertas 2026
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                 ¿Sientes el llamado <br className="hidden md:block"/> de la docencia?
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                 Únete a Warisata, la cuna de la revolución pedagógica, y conviértete en el maestro que transformará el futuro de Bolivia.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                 <Link href="/tramites" className="group relative px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest overflow-hidden transition-all hover:bg-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                    <span className="relative z-10">Iniciar Admisión</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                 </Link>
                 <Link href="/contacto" className="px-12 py-5 bg-white/5 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md">
                    Hablar con un Asesor
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
