'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Image as ImageIcon, Maximize2, X, ArrowLeft, Camera, Calendar, Images, Sparkles, LayoutGrid, Heart, ArrowRight, ChevronRight } from 'lucide-react'

interface Evento {
  id: string
  titulo: string
  fecha_evento: string
  portada_url: string | null
}

interface Foto {
  id: string
  evento_id: string
  foto_url: string
  descripcion: string | null
}

export default function GaleriaPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [fotos, setFotos] = useState<Foto[]>([])
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [loadingEventos, setLoadingEventos] = useState(true)
  const [loadingFotos, setLoadingFotos] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Foto | null>(null)

  const fetchEventos = useCallback(async () => {
    setLoadingEventos(true)
    try {
      const { data } = await supabase.from('eventos').select('*').order('fecha_evento', { ascending: false })
      if (data) setEventos(data)
    } catch (error) { console.error('Error:', error) } finally { setLoadingEventos(false) }
  }, [])

  const fetchFotos = useCallback(async (eventoId: string) => {
    setLoadingFotos(true)
    try {
      const { data } = await supabase.from('fotos_evento').select('*').eq('evento_id', eventoId)
      if (data) setFotos(data)
    } catch (error) { console.error('Error:', error) } finally { setLoadingFotos(false) }
  }, [])

  useEffect(() => { fetchEventos() }, [fetchEventos])
  useEffect(() => { if (selectedEvento) fetchFotos(selectedEvento.id) }, [selectedEvento, fetchFotos])

  const getCoverImage = (ev: Evento) => ev.portada_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop'

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Outfit'] text-slate-800 selection:bg-emerald-600 selection:text-white scroll-smooth">
      <Navbar />

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* HEADER SECTION */}
        <section className="pt-40 pb-16 px-6">
           <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                 <Camera size={18} />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Galería Institucional</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#002147] tracking-tighter uppercase mb-4">
                 Registros & <span className="text-emerald-600">Eventos</span>
              </h1>
              <div className="w-16 h-1 bg-emerald-500 rounded-full" />
           </div>
        </section>

        {/* VIEW 1: ALBUMS GRID */}
        {!selectedEvento ? (
          <section className="pb-40">
            <div className="max-w-7xl mx-auto px-6">
               {loadingEventos ? (
                 <div className="space-y-12">
                    <div className="w-full h-[500px] bg-white rounded-[3rem] animate-pulse shadow-sm" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {[1,2,3].map(i => <div key={i} className="h-[400px] bg-white rounded-[2rem] animate-pulse shadow-sm" />)}
                    </div>
                 </div>
               ) : eventos.length > 0 ? (
                 <div className="space-y-16">
                    {/* LATEST ALBUM BANNER */}
                    <div 
                      onClick={() => setSelectedEvento(eventos[0])}
                      className="group relative w-full h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden cursor-pointer shadow-[0_40px_100px_rgba(0,33,71,0.15)] transition-all duration-1000 hover:-translate-y-2"
                    >
                       <img src={getCoverImage(eventos[0])} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="Destacado" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#002147] via-[#002147]/40 to-transparent z-10" />
                       
                       <div className="absolute inset-0 p-12 md:p-20 flex flex-col justify-end z-20">
                          <div className="space-y-6 max-w-4xl">
                             <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                                <Sparkles size={16} /> Álbum Destacado
                             </div>
                             <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] group-hover:text-emerald-400 transition-colors">
                                {eventos[0].titulo}
                             </h2>
                             <div className="flex items-center gap-6 text-slate-300">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                   <Calendar size={18} className="text-emerald-500" />
                                   {new Date(eventos[0].fecha_evento).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <div className="h-4 w-px bg-white/20" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform flex items-center gap-2">
                                   Explorar Colección <ArrowRight size={14} />
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* REGULAR GRID (Excluding the first one) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                       {eventos.slice(1).map((ev, idx) => (
                         <div 
                           key={ev.id}
                           onClick={() => setSelectedEvento(ev)}
                           className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,33,71,0.04)] hover:shadow-[0_30px_80px_rgba(0,33,71,0.12)] transition-all duration-700 overflow-hidden cursor-pointer hover:-translate-y-3 animate-fade-in-up"
                           style={{ animationDelay: `${idx * 0.05}s` }}
                         >
                            <div className="h-64 overflow-hidden relative">
                               <img src={getCoverImage(ev)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={ev.titulo} />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="p-8 space-y-4">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                     {new Date(ev.fecha_evento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                                  </span>
                                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                     <ChevronRight size={16} />
                                  </div>
                               </div>
                               <h3 className="text-xl font-black text-[#002147] leading-tight uppercase group-hover:text-emerald-700 transition-colors">
                                  {ev.titulo}
                               </h3>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="py-40 bg-white rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col items-center justify-center text-center">
                   <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
                     <Images size={48} className="text-emerald-200" />
                   </div>
                   <h3 className="text-4xl font-black text-[#002147] mb-4 tracking-tighter">Sin Álbumes</h3>
                   <p className="text-lg text-slate-400 max-w-sm font-medium">Aún no hay colecciones visuales publicadas.</p>
                 </div>
               )}
            </div>
          </section>
        ) : (
          /* VIEW 2: STANDARD PHOTO GRID */
          <div className="animate-fade-in px-6">
             <div className="max-w-7xl mx-auto">
                <button 
                  onClick={() => setSelectedEvento(null)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#002147] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all mb-12 shadow-lg hover:bg-emerald-600 hover:scale-105"
                >
                  <ArrowLeft size={16} /> Volver a Álbumes
                </button>

                <div className="mb-16">
                   <h2 className="text-3xl md:text-5xl font-black text-[#002147] uppercase tracking-tighter mb-2">
                      {selectedEvento.titulo}
                   </h2>
                   <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">
                      {new Date(selectedEvento.fecha_evento).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </span>
                </div>

                {loadingFotos ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-40">
                     {fotos.map((f, i) => (
                       <div 
                         key={f.id}
                         onClick={() => setSelectedImage(f)}
                         className="aspect-square rounded-[2rem] overflow-hidden cursor-zoom-in group relative border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                       >
                          <img src={f.foto_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery photo" />
                          <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>
        )}

        {/* STANDARD LIGHTBOX */}
        {selectedImage && (
          <div className="fixed inset-0 z-[200] bg-[#002147]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-10 right-10 text-white hover:text-emerald-400">
              <X size={40} />
            </button>
            <div className="relative max-w-5xl w-full flex flex-col items-center gap-8">
               <img src={selectedImage.foto_url} className="max-h-[80vh] w-auto shadow-2xl rounded-2xl animate-in zoom-in-95 duration-500" alt="Expanded" />
               <p className="text-white font-bold text-center uppercase tracking-widest text-xs">{selectedImage.descripcion || selectedEvento?.titulo}</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
