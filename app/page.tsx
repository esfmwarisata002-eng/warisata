'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
   ArrowRight,
   BookOpen,
   GraduationCap,
   FileText,
   Phone,
   ShieldCheck,
   Scale,
   Lightbulb,
   Users,
   Sparkles,
   MapPin,
   Clock,
   Globe,
   ArrowUpRight,
   ChevronRight,
   Camera
} from 'lucide-react'

export default function Home() {
   const [noticias, setNoticias] = useState<any[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      supabase.from('noticias').select('*').order('fecha_publicacion', { ascending: false }).limit(3)
         .then(({ data }) => { if (data) setNoticias(data); setLoading(false) })
   }, [])

   return (
      <div className="min-h-screen bg-[#fdfcfb] font-['Outfit'] text-slate-900 selection:bg-emerald-600 selection:text-white">
         <Navbar />

         <main>

            {/* ─── REFINED HERO ─── */}
            <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center px-6 pt-20">
               {/* ARTISTIC BACKGROUND SKETCH - COMPLETE SCALE */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 opacity-[0.35] select-none pointer-events-none">
                  <img
                     src="/warisata_sketch.png"
                     alt="Warisata Sketch Background"
                     className="w-full h-full object-contain scale-110"
                  />
               </div>

               <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-16 animate-fade-in relative z-10 w-full">
                  <div className="flex flex-col items-center gap-6 animate-fade-in">
                     <img src="/logo_oficial.png" alt="Escudo Oficial" className="w-20 h-20 lg:w-28 lg:h-28 object-contain drop-shadow-2xl" />
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Institución Benemérita</span>
                        <div className="w-8 h-[1px] bg-emerald-500" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h1 className="text-3xl md:text-6xl font-black text-[#002147] tracking-tighter uppercase leading-[1.1] animate-fade-in">
                        Forjando el futuro de la <br /> <span className="text-emerald-500 font-serif-formal italic font-normal normal-case tracking-normal underline decoration-emerald-200 underline-offset-8">educación boliviana.</span>
                     </h1>
                     <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium italic font-serif-formal opacity-80">
                        Institución líder en formación docente, preservando el legado histórico de Warisata con innovación y compromiso social.
                     </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                     <Link href="/institucion" className="px-8 py-4 bg-[#002147] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center gap-3 group">
                        Nuestra Identidad <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                     <Link href="/tramites" className="px-8 py-4 border-2 border-slate-100 text-[#002147] rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">
                        Admisiones 2026
                     </Link>
                  </div>
               </div>

               {/* Subtle background decoration */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-emerald-500/[0.02] -z-20 blur-[120px] rounded-full" />
            </section>

            {/* ─── PABELLÓN MÉXICO HIGHLIGHT (NEW) ─── */}
            <section className="py-24 px-6">
               <div className="max-w-[1700px] mx-auto bg-[#002147] rounded-[5rem] overflow-hidden relative group">
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#002147] via-[#002147]/40 to-transparent" />
                  <img
                     src="/pabellon_mexico_hd.jpg"
                     alt="Pabellón México de Noche"
                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s] opacity-90"
                  />
                  {/* Subtle overlay for text readability */}
                  <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

                  <div className="relative z-20 max-w-7xl mx-auto px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                     <div className="space-y-10 text-white">
                        <div className="space-y-8">
                           <div className="inline-flex items-center gap-3 text-emerald-400 uppercase text-[10px] font-black tracking-[0.5em]">
                              <Camera size={16} /> Monumento Histórico
                           </div>
                           <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Pabellón <br /> <span className="text-emerald-400 font-serif-formal italic font-normal normal-case tracking-normal">México.</span></h2>
                        </div>
                        <p className="text-xl text-slate-300 font-medium italic font-serif-formal leading-relaxed max-w-xl">
                           El corazón Prestigio de Rango Superior.tónico de Warisata, símbolo de la hermandad latinoamericana y testigo de la primera escuela ayllu del continente.
                        </p>
                        <Link href="/galeria" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors group">
                           Explora nuestras actividades<ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                     </div>
                     <div className="hidden lg:flex justify-end">
                        <div className="p-1 w-72 h-72 rounded-[3rem] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-center space-y-4">
                           <span className="text-5xl font-black text-emerald-400">1931</span>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Patrimonio vivo</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* ─── SOPHISTICATED QUICK ACCESS ─── */}
            <section className="pt-4 pb-32 bg-[#fdfcfb]">
               <div className="max-w-7xl mx-auto px-6 space-y-20">
                  <div className="text-center space-y-16">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Servicios Digitales</span>
                     <h2 className="text-4xl md:text-5xl font-black text-[#002147] tracking-tighter uppercase">Gestión de <span className="text-emerald-500 font-serif-formal italic font-normal normal-case tracking-normal">aprendizaje.</span></h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {[
                        { icon: <GraduationCap size={28} />, title: 'Especialidades', desc: 'Conoce nuestra oferta académica superior.', href: '/especialidades', color: 'border-t-blue-500 text-blue-600' },
                        { icon: <FileText size={28} />, title: 'Trámites', desc: 'Procesos de admisión y certificaciones.', href: '/tramites', color: 'border-t-emerald-500 text-emerald-600' },
                        { icon: <Users size={28} />, title: 'Personal', desc: 'Directorio de docentes y administrativos.', href: '/personal', color: 'border-t-amber-500 text-amber-600' },
                        { icon: <Phone size={28} />, title: 'Contacto', desc: 'Canales de atención y geolocalización.', href: '/contacto', color: 'border-t-rose-500 text-rose-600' },
                     ].map((s, i) => (
                        <Link key={i} href={s.href} className={`group bg-white p-10 rounded-[3rem] border-t-4 border-l border-r border-b border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 ${s.color.split(' ')[0]}`}>
                           <div className={`w-14 h-14 bg-slate-50 ${s.color.split(' ')[1]} rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#002147] group-hover:text-white transition-all duration-500`}>
                              {s.icon}
                           </div>
                           <div className="space-y-3">
                              <h4 className="text-xl font-black text-[#002147] tracking-tight">{s.title}</h4>
                              <p className="text-sm text-slate-400 leading-relaxed font-medium">{s.desc}</p>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </section>

            {/* ─── BALANCED IDENTITY ─── */}
            <section className="pt-12 pb-32 bg-white">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                     <div className="space-y-10">
                        <div className="space-y-6">
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Nuestro Legado</span>
                           <h2 className="text-3xl md:text-5xl font-black text-[#002147] tracking-tighter uppercase leading-tight">La Escuela Ayllu <br /> vive en <span className="text-emerald-500 font-serif-formal italic font-normal normal-case tracking-normal">Warisata.</span></h2>
                        </div>
                        <div className="space-y-6 text-lg text-slate-500 font-medium leading-relaxed border-l-2 border-emerald-500 pl-8">
                           <p>Desde su fundación en 1931, hemos liderado la formación docente bajo principios de liberación, trabajo y comunidad.</p>
                           <p>Fusionamos la sabiduría ancestral con la innovación pedagógica para transformar la educación nacional.</p>
                        </div>
                        <Link href="/institucion" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#002147] hover:text-emerald-600 transition-colors group">
                           Conocer nuestra historia <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                     <div className="relative group">
                     <div className="rounded-[4rem] overflow-hidden shadow-2xl relative z-10">
                        <img src="/vir3-3.jpg" alt="Identidad Institucional" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-[3s]" />
                     </div>
                    {/* Decorative back-frame */}
                    <div className="absolute -top-6 -right-6 w-full h-full border-2 border-emerald-100 rounded-[4rem] -z-0 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                    
                    <div className="absolute -bottom-8 -left-8 p-12 bg-[#002147] text-white rounded-[3rem] shadow-2xl hidden md:block z-20">
                       <Sparkles className="text-emerald-400 mb-6" size={32} />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Sede Central</p>
                          <p className="text-2xl font-black tracking-tighter">Warisata, La Paz</p>
                       </div>
                    </div>
                 </div>
                  </div>
               </div>
            </section>

            {/* ─── ELEGANT NEWS GRID ─── */}
            <section className="pt-12 pb-32 bg-[#fdfcfb]">
               <div className="max-w-7xl mx-auto px-6 space-y-20">
                  <div className="flex items-end justify-between border-b border-slate-100 pb-10">
                     <div className="space-y-3 text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Actualidad</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#002147] tracking-tighter uppercase leading-none">Noticias <span className="text-emerald-500 font-serif-formal italic font-normal normal-case tracking-normal">recientes.</span></h2>
                     </div>
                     <Link href="/noticias" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors">Ver todas →</Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     {loading ? [1, 2, 3].map(i => <div key={i} className="h-[450px] rounded-[3.5rem] bg-slate-100 animate-pulse" />) :
                        noticias.map(n => (
                           <Link href={`/noticias/${n.id}`} key={n.id} className="group relative">
                              <div className="relative h-[450px] rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                                 <img 
                                    src={n.imagen_portada_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600'} 
                                    alt={n.titulo} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                 
                                 {/* Floating Date Badge */}
                                 <div className="absolute top-8 left-8 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
                                    <span className="text-[9px] font-black text-[#002147] uppercase tracking-[0.2em]">
                                       {new Date(n.fecha_publicacion).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })}
                                    </span>
                                 </div>
                              </div>
                              
                              <div className="mt-8 space-y-4 px-2">
                                 <h4 className="text-2xl font-black text-[#002147] leading-[1.2] group-hover:text-emerald-600 transition-colors line-clamp-2 tracking-tighter uppercase">
                                    {n.titulo}
                                 </h4>
                                 <div className="flex items-center gap-3">
                                    <div className="w-6 h-[1px] bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leer artículo</span>
                                 </div>
                              </div>
                           </Link>
                        ))
                     }
                  </div>
               </div>
            </section>

            {/* ─── DISCRETE CTA ─── */}
            <section className="pt-4 pb-32 px-6">
               <div className="max-w-7xl mx-auto bg-[#002147] p-20 md:p-32 rounded-[5rem] text-center space-y-12 relative overflow-hidden group">
                  {/* Animated Background Elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-0 group-hover:scale-125 transition-transform duration-1000" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-0" />
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-8">
                     <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Únete a nuestra <br /> <span className="text-emerald-400 font-serif-formal italic font-normal normal-case tracking-normal">comunidad académica.</span></h2>
                     <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium leading-relaxed opacity-80">
                        Forma parte de la institución líder en formación docente. Infórmate sobre los procesos de admisión para la gestión 2026.
                     </p>
                  </div>
                  
                  <div className="relative z-10 pt-6">
                     <Link href="/tramites?tab=convocatorias" className="inline-flex items-center gap-6 px-12 py-6 bg-white text-[#002147] rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 hover:text-[#002147] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] group hover:scale-105 active:scale-95">
                        Ver Requisitos de Admisión <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </Link>
                  </div>
               </div>
            </section>

         </main>

         <Footer />
      </div>
   )
}
