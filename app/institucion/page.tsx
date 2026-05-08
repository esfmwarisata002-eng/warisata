'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Landmark, Target, Star, History, ChevronDown, ChevronUp, Quote, Network, Calendar, Maximize2, Sparkles, BookOpen } from 'lucide-react'

export default function InstitutionalPage() {
  const [secciones, setSecciones] = useState<any[]>([])
  const [organigrama, setOrganigrama] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('historia')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOrganigrama, setShowOrganigrama] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [seccionesRes, organigramaRes] = await Promise.all([
          supabase.from('secciones_institucionales').select('*').order('slug'),
          supabase.from('organigrama_oficial').select('*').limit(1).single()
        ])
        
        if (seccionesRes.data) setSecciones(seccionesRes.data)
        if (organigramaRes.data) setOrganigrama(organigramaRes.data)
      } catch (err) { 
        console.error(err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetchData()
  }, [])

  const findBySlug = (keyword: string) => secciones.find(s => s.slug?.toLowerCase().includes(keyword.toLowerCase()))

  const mision = findBySlug('mision')
  const vision = findBySlug('vision')
  const historia = findBySlug('historia')
  const otras = secciones.filter(s => !['mision', 'vision', 'historia'].some(k => s.slug?.includes(k)))

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#002147] border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  )

  const tabs = [
    { id: 'historia', label: 'Nuestra Historia', icon: <History size={18} /> },
    { id: 'mision_vision', label: 'Misión y Visión', icon: <Target size={18} /> },
    { id: 'organigrama', label: 'Organigrama', icon: <Network size={18} /> },
  ]

  if (otras.length > 0) {
    tabs.push({ id: 'otros', label: 'Más Información', icon: <Landmark size={18} /> })
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Outfit'] text-slate-800 selection:bg-amber-500 selection:text-[#002147]">
      <Navbar />
      
      <main className="relative w-full overflow-hidden">
        
        {/* 1. EDITORIAL HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -skew-x-12 translate-x-1/4 z-0" />
          <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            {/* Text Content */}
            <div className="flex-1 space-y-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-sm border border-slate-100 text-emerald-600">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Excelencia Académica</span>
              </div>
              
              <div className="relative group">
                <h1 className="flex flex-col font-black tracking-tight leading-[1.05]">
                  <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-slate-400 mb-4 block font-bold">
                    Nuestra Identidad
                  </span>
                  <span className="text-5xl md:text-6xl lg:text-7xl text-[#002147] transition-transform duration-500 group-hover:translate-x-1">
                    Nuestra 
                  </span>
                  <span className="text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 mt-1">
                    Esencia.
                  </span>
                </h1>
                <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 mt-8 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.2)]" />
              </div>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-xl font-medium leading-relaxed border-l-4 border-slate-100 pl-6">
                Fundada en los valores de la educación indigenal, la ESFM Warisata trasciende el tiempo como un faro de conocimiento y revolución pedagógica.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl">
                  <BookOpen size={18} className="text-emerald-500" />
                  +80 Años de Historia
                </div>
              </div>
            </div>

            {/* 1. EDITORIAL HERO IMAGE SECTION */}
            <div className="flex-1 w-full relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Decorative Back-Frame (Offset) */}
                <div className="absolute -top-6 -right-6 w-full h-full border-2 border-emerald-200 rounded-[3rem] -z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                
                {/* Main Image Container */}
                <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,33,71,0.2)] z-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/60 via-transparent to-transparent opacity-40 z-20" />
                  <img 
                    src={historia?.imagen_url || "/pabellon_mexico_hd.jpg"} 
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[3s] ease-out" 
                    alt="Institución" 
                  />
                  
                  {/* Floating Info Overlay inside the image */}
                  <div className="absolute bottom-10 left-10 z-30 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                      <Landmark size={24} className="text-white" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Patrimonio Histórico</p>
                      <p className="text-white font-black text-xl tracking-tighter">Pabellón México</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Floating Element (External) */}
                <div className="absolute -bottom-10 -right-10 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl z-30 border border-white/50 hidden md:block group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="text-emerald-500 mb-2" size={24} />
                    <span className="text-3xl font-black text-[#002147] tracking-tighter">1931</span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black">FUNDACIÓN</span>
                  </div>
                </div>

                {/* Background Glow */}
                <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-[100px] -z-20" />
              </div>
            </div>
          </div>
        </section>

        {/* TABS NAVIGATION */}
        <section className="sticky top-20 z-40 bg-white/60 backdrop-blur-2xl border-y border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center overflow-x-auto no-scrollbar gap-4 py-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative flex items-center gap-3 px-8 py-4 rounded-[1.25rem] font-bold text-sm transition-all duration-500 whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-[#002147] text-white shadow-xl shadow-[#002147]/20 scale-105' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-[#002147]'}
                  `}
                >
                  <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENT AREA */}
        <div className="min-h-[600px] animate-fade-in">
          
          {/* TAB: HISTORIA */}
          {activeTab === 'historia' && historia && (
            <section className="py-24 bg-[#f8f9fc] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0" />
              
              <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl mb-8 border border-slate-50 rotate-3 group-hover:rotate-0 transition-transform">
                    <History className="text-emerald-500" size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#002147] tracking-tight leading-none mb-6">
                    {historia.titulo}
                  </h2>
                  <p className="text-slate-400 uppercase tracking-[0.4em] text-xs font-bold">Un Legado de Revolución Pedagógica</p>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto mt-10 rounded-full" />
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-white p-10 md:p-20 rounded-[3rem] shadow-[0_30px_90px_rgba(0,33,71,0.06)] border border-slate-50 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                    
                    <div className={`relative overflow-hidden transition-all duration-1000 ease-in-out ${isExpanded ? 'max-h-[5000px]' : 'max-h-[450px]'}`}>
                      <div 
                        className="text-lg md:text-xl text-slate-600 leading-[1.8] font-medium text-justify prose prose-emerald max-w-none prose-headings:text-[#002147] prose-p:mb-8"
                        dangerouslySetInnerHTML={{ __html: historia.contenido }} 
                      />
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-10" />
                      )}
                    </div>

                    <div className="mt-12 flex justify-center">
                      <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group flex items-center gap-4 px-10 py-5 bg-[#002147] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all duration-500 shadow-2xl hover:-translate-y-1 active:scale-95"
                      >
                        {isExpanded ? 'Contraer Crónica' : 'Explorar Historia Completa'}
                        {isExpanded ? (
                          <ChevronUp size={20} className="animate-bounce" />
                        ) : (
                          <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB: MISION Y VISION */}
          {activeTab === 'mision_vision' && (mision || vision) && (
            <section className="py-24 bg-white relative">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                  {mision && (
                    <div className="group relative p-12 lg:p-16 rounded-[3rem] bg-[#002147] overflow-hidden hover:-translate-y-3 transition-all duration-700 shadow-2xl">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 group-hover:bg-emerald-500/20 transition-all duration-1000" />
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-[#002147] mb-10 shadow-2xl group-hover:rotate-[15deg] transition-transform duration-500">
                          <Target size={36} />
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                          {mision.titulo}
                        </h2>
                        <div className="w-12 h-1 bg-emerald-500 mb-6 rounded-full" />
                        <p className="text-slate-300 text-base lg:text-lg leading-[1.6] font-medium italic border-l-2 border-white/10 pl-6">
                          "{mision.contenido}"
                        </p>
                      </div>
                    </div>
                  )}

                  {vision && (
                    <div className="group relative p-12 lg:p-16 rounded-[3rem] bg-slate-50 overflow-hidden hover:-translate-y-3 transition-all duration-700 shadow-xl border border-slate-100">
                      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 group-hover:bg-emerald-500/10 transition-all duration-1000" />
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-emerald-500 mb-10 shadow-xl group-hover:-rotate-[15deg] transition-transform duration-500">
                          <Star size={36} />
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-black text-[#002147] uppercase tracking-tighter mb-6 leading-none">
                          {vision.titulo}
                        </h2>
                        <div className="w-12 h-1 bg-emerald-500 mb-6 rounded-full" />
                        <p className="text-slate-500 text-base lg:text-lg leading-[1.6] font-medium italic border-l-2 border-slate-200 pl-6">
                          "{vision.contenido}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TAB: ORGANIGRAMA */}
          {activeTab === 'organigrama' && organigrama?.imagen_url && (
            <section className="py-24 bg-[#f8f9fc] relative">
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                  <Network className="mx-auto text-[#002147] mb-6" size={48} strokeWidth={1.5} />
                  <h2 className="text-4xl md:text-5xl font-black text-[#002147] tracking-tight">
                    Estructura Organizacional
                  </h2>
                  <div className="w-24 h-1.5 bg-[#002147] mx-auto mt-8 rounded-full" />
                </div>

                <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-[0_20px_80px_rgba(0,33,71,0.08)] border border-slate-100 flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-8">
                    <Calendar size={14} /> Actualizado: {new Date(organigrama.actualizado_el).toLocaleDateString()}
                  </p>
                  
                  <div 
                    className="relative group rounded-[2rem] overflow-hidden shadow-2xl cursor-zoom-in bg-white border-4 border-white w-full max-w-5xl"
                    onClick={() => setShowOrganigrama(true)}
                  >
                    <img 
                      src={organigrama.imagen_url} 
                      alt="Organigrama ESFM Warisata" 
                      className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#002147]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-[#002147] shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                        <Maximize2 size={32} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB: OTROS */}
          {activeTab === 'otros' && otras.length > 0 && (
            <section className="py-24 bg-[#002147] text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] z-0" />
              <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              
              <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="space-y-12">
                  {otras.map((sec) => (
                    <div 
                      key={sec.id} 
                      className="group relative bg-white/5 border border-white/10 p-10 md:p-16 rounded-[3rem] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <Quote className="text-emerald-500/30 mb-8 transform group-hover:scale-110 transition-transform" size={48} />
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight">{sec.titulo}</h3>
                      <div 
                        className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium prose prose-invert max-w-none prose-emerald" 
                        dangerouslySetInnerHTML={{ __html: sec.contenido }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* LIGHTBOX ORGANIGRAMA */}
        {showOrganigrama && (
          <div 
            className="fixed inset-0 z-[200] bg-[#002147]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fade-in" 
            onClick={() => setShowOrganigrama(false)}
          >
            <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
              <img 
                src={organigrama?.imagen_url} 
                alt="Organigrama Ampliado" 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl bg-white p-4"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button className="absolute top-8 right-8 w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-[#002147] transition-all z-50 shadow-lg">
              <span className="sr-only">Cerrar</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        )}

      </main>
      <Footer />
    </div>
  )
}
