'use client'
import { useEffect, useState, useMemo, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  FileText, Download, Calendar, ArrowRight, Search, Info, BookOpen, 
  ListChecks, Clock, ChevronRight, ChevronDown, ChevronUp, MapPin, 
  ListOrdered, AlertCircle, Coins, Network, LayoutGrid, FileSearch,
  Sparkles, ShieldCheck, GraduationCap, Eye
} from 'lucide-react'

interface Requisito {
  descripcion: string
  obligatorio: boolean
  costo: number
}

interface Paso {
  paso_numero: number
  descripcion: string
  lugar: string
}

interface Tramite {
  id: string
  titulo: string
  descripcion: string
  tiempo_estimado: string
  costo: number
  categoria_id: string
  requisitos: Requisito[]
  pasos: Paso[]
}

interface Categoria {
  id: string
  nombre: string
  orden: number
}

export default function TramitesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><div className="w-16 h-16 border-4 border-[#002147] border-t-emerald-500 rounded-full animate-spin" /></div>}>
      <TramitesContent />
    </Suspense>
  )
}

function TramitesContent() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as 'convocatorias' | 'tramites') || 'tramites'

  const [convocatorias, setConvocatorias] = useState<any[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'convocatorias' | 'tramites'>(initialTab)
  const [selectedTramite, setSelectedTramite] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'convocatorias' || tab === 'tramites') {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      try {
        const [convRes, catRes, tramRes, reqRes, pasosRes] = await Promise.all([
          supabase.from('convocatorias').select('*').order('created_at', { ascending: false }),
          supabase.from('tramite_categorias').select('*').order('orden'),
          supabase.from('tramites').select('*').order('titulo'),
          supabase.from('tramite_requisito').select('tramite_id, obligatorio, costo, requisitos(descripcion)'),
          supabase.from('pasos_tramite').select('*').order('paso_numero')
        ])
        
        if (convRes.data) setConvocatorias(convRes.data)
        if (catRes.data) setCategorias(catRes.data)
        
        if (tramRes.data) {
          const formattedTramites = tramRes.data.map((t: any) => {
            const reqs = reqRes.data?.filter(r => r.tramite_id === t.id).map(r => ({
              descripcion: r.requisitos?.descripcion || 'Requisito sin descripción',
              obligatorio: r.obligatorio,
              costo: r.costo || 0
            })) || []
            
            const pasos = pasosRes.data?.filter(p => p.tramite_id === t.id) || []
            
            return {
              ...t,
              requisitos: reqs,
              pasos: pasos
            }
          })
          setTramites(formattedTramites)
          
          const legalCat = catRes.data?.find(c => c.nombre.toLowerCase().includes('legalizac'))
          if (legalCat) {
            setExpandedCategory(legalCat.id)
            const firstInLegal = formattedTramites.find(t => t.categoria_id === legalCat.id)
            if (firstInLegal) {
              setSelectedTramite(firstInLegal.id)
            } else if (formattedTramites.length > 0) {
              setSelectedTramite(formattedTramites[0].id)
            }
          } else if (formattedTramites.length > 0) {
            setSelectedTramite(formattedTramites[0].id)
            setExpandedCategory(formattedTramites[0].categoria_id)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const groupedTramites = useMemo(() => {
    const filtered = tramites.filter(t => 
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.descripcion && t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    
    const groups: { [key: string]: Tramite[] } = {}
    categorias.forEach(cat => {
      groups[cat.id] = filtered.filter(t => t.categoria_id === cat.id)
    })
    
    const withoutCat = filtered.filter(t => !t.categoria_id)
    if (withoutCat.length > 0) {
      groups['others'] = withoutCat
    }
    
    return groups
  }, [tramites, categorias, searchTerm])

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Outfit'] text-slate-800 selection:bg-emerald-500 selection:text-[#002147] scroll-smooth">
      <Navbar />

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* COMPACT HEADER: TABS & SEARCH */}
        <section className="pt-40 pb-12 px-6 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Tabs Left */}
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner shrink-0">
                <button 
                  onClick={() => setActiveTab('tramites')}
                  className={`flex items-center gap-4 px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                    activeTab === 'tramites' 
                    ? 'bg-[#002147] text-white shadow-xl scale-105' 
                    : 'text-slate-400 hover:text-[#002147]'
                  }`}
                >
                   <FileText size={18} />
                   Trámites
                </button>

                <button 
                  onClick={() => setActiveTab('convocatorias')}
                  className={`flex items-center gap-4 px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                    activeTab === 'convocatorias' 
                    ? 'bg-[#002147] text-white shadow-xl scale-105' 
                    : 'text-slate-400 hover:text-[#002147]'
                  }`}
                >
                   <Calendar size={18} />
                   Convocatorias
                </button>
            </div>

            {/* Search Right */}
            {activeTab === 'tramites' && (
              <div className="relative group w-full lg:max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center bg-white rounded-full border border-slate-200 overflow-hidden px-6 py-1">
                  <Search className="text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar trámites..."
                    className="w-full px-4 py-4 bg-transparent text-[#002147] font-bold text-sm outline-none placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="py-20 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            
            {activeTab === 'tramites' ? (
              <div className="animate-fade-in space-y-12">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* PANEL IZQUIERDO: CATEGORÍAS & LISTA */}
                  <div className="lg:col-span-4 space-y-6 max-h-[1000px] overflow-y-auto pr-2 scrollbar-hide">
                    {categorias.map((cat, idx) => {
                      const isExpanded = expandedCategory === cat.id;
                      const hasTramites = groupedTramites[cat.id]?.length > 0;
                      if (!hasTramites) return null;

                      return (
                        <div 
                          key={cat.id} 
                          className={`group rounded-[2.5rem] border transition-all duration-700 overflow-hidden ${
                            isExpanded 
                             ? 'bg-white border-emerald-500 shadow-[0_30px_70px_rgba(0,33,71,0.1)]' 
                             : 'bg-white/60 backdrop-blur-md border-slate-100 hover:border-emerald-200 hover:shadow-xl'
                          }`}
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <button 
                            onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                            className={`w-full px-8 py-7 flex items-center justify-between transition-all duration-700 ${
                              isExpanded ? 'bg-emerald-600 text-white' : 'text-[#002147]'
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                isExpanded ? 'bg-white text-emerald-600 rotate-12' : 'bg-slate-50 text-emerald-500'
                              }`}>
                                 <GraduationCap size={20} />
                              </div>
                              <span className="font-black text-xs uppercase tracking-[0.2em]">{cat.nombre}</span>
                            </div>
                            <ChevronDown size={20} className={`transition-transform duration-700 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          <div className={`transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 space-y-3 bg-[#f8f9fc]">
                              {groupedTramites[cat.id].map(t => (
                                <button 
                                  key={t.id} 
                                  onClick={() => setSelectedTramite(t.id)} 
                                  className={`w-full text-left px-7 py-5 rounded-[1.8rem] transition-all duration-500 flex items-center justify-between group/item ${
                                    selectedTramite === t.id 
                                     ? 'bg-white border-emerald-500 shadow-lg scale-[1.02] border' 
                                     : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <h4 className={`font-bold text-sm leading-tight transition-colors ${selectedTramite === t.id ? 'text-emerald-700' : 'text-[#002147]'}`}>
                                       {t.titulo}
                                    </h4>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2 block">
                                       {t.tiempo_estimado || 'Tiempo Variable'}
                                    </span>
                                  </div>
                                  <ChevronRight size={18} className={`transition-all duration-500 ${selectedTramite === t.id ? 'text-emerald-600 translate-x-1' : 'opacity-0'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* PANEL DERECHO: DETALLES CINEMÁTICOS */}
                  <div className="lg:col-span-8">
                    {selectedTramite ? (
                      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_40px_100px_rgba(0,33,71,0.08)] border border-slate-50 relative overflow-hidden animate-fade-in-up">
                        {/* Elegant Decorative Elements */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <div className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-12 relative z-10">
                          <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                               <ShieldCheck size={16} /> 
                               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocolo Oficial de Gestión</span>
                            </div>
                            <h2 className="text-lg lg:text-xl font-black text-[#002147] tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                               {tramites.find(t => t.id === selectedTramite)?.titulo}
                            </h2>
                            <div className="space-y-4">
                               <p className="text-base text-slate-500 font-serif-formal italic leading-relaxed">
                                  {tramites.find(t => t.id === selectedTramite)?.descripcion || 'Guía institucional para la correcta presentación de documentación y gestión académica.'}
                               </p>
                               
                               <div className="flex items-center gap-4 text-[#002147] font-black uppercase tracking-[0.4em] text-xs pt-4 border-t border-slate-100">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                                     <ListOrdered size={20} />
                                  </div>
                                  Requisitos & Documentación
                               </div>
                            </div>
                          </div>
                          
                          <div className="shrink-0 group w-full xl:w-auto">
                             <div className="bg-[#002147] p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10">
                                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Arancel Total</p>
                                   <div className="flex items-center justify-center gap-3">
                                      <span className="text-5xl font-black text-white">
                                         {tramites.find(t => t.id === selectedTramite)?.requisitos.reduce((acc, r) => acc + (r.costo || 0), 0) || 0}
                                      </span>
                                      <div className="flex flex-col items-start">
                                         <span className="text-sm font-black text-emerald-400 uppercase">Bs.</span>
                                         <span className="text-[9px] text-slate-400 font-bold">Oficial</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>

                        <div className="relative z-10 space-y-6">
                           
                           <div className="flex flex-col gap-3">
                              {tramites.find(t => t.id === selectedTramite)?.requisitos.map((req, i) => (
                                <div key={i} className="group flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-emerald-50/30 transition-all duration-300 border border-transparent hover:border-emerald-100">
                                  <div className="flex items-center gap-5 flex-1">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${req.obligatorio ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                                        <FileText size={16} />
                                     </div>
                                     <span className="text-sm font-bold text-slate-700 leading-tight">
                                        {req.descripcion}
                                     </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 shrink-0 ml-6">
                                     <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${req.obligatorio ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                        {req.obligatorio ? 'Indispensable' : 'Opcional'}
                                     </span>
                                     <div className="text-[10px] font-black text-[#002147] bg-white px-4 py-1.5 rounded-xl border border-slate-100 shadow-sm min-w-[70px] text-center">
                                        {req.costo > 0 ? `${req.costo} Bs.` : 'Gratis'}
                                     </div>
                                  </div>
                                </div>
                              ))}
                           </div>

                           {(!tramites.find(t => t.id === selectedTramite)?.requisitos.length) && (
                              <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Info size={48} className="mx-auto text-slate-300 mb-6" />
                                <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Sincronizando requisitos oficiales...</p>
                              </div>
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl min-h-[800px] flex flex-col items-center justify-center text-center p-16">
                         <div className="w-40 h-40 bg-emerald-50 rounded-[3rem] flex items-center justify-center mb-10 rotate-3 transition-transform hover:rotate-0">
                            <BookOpen size={64} className="text-emerald-400" />
                         </div>
                         <h3 className="text-4xl font-black text-[#002147] mb-6">Información <br />Centralizada</h3>
                         <p className="text-lg text-slate-400 max-w-sm leading-relaxed font-medium">
                            Selecciona una categoría y un trámite para visualizar el flujo de trabajo y la documentación requerida.
                         </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in space-y-12">
                {loading ? (
                  <div className="space-y-10">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />)}
                  </div>
                ) : convocatorias.length > 0 ? (
                  <div className="space-y-12">
                    {/* MODERATE SPLIT CONVOCATORIA */}
                    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,33,71,0.08)] overflow-hidden relative group min-h-[750px]">
                      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600 z-30" />
                      
                      <div className="flex flex-col lg:grid lg:grid-cols-12 h-full">
                        
                        {/* LEFT: INFO CONTENT */}
                        <div className="lg:col-span-4 p-10 md:p-14 lg:p-16 flex flex-col justify-center space-y-10 bg-white relative z-20 border-b lg:border-b-0 lg:border-r border-slate-100">
                           <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                  convocatorias[0].estado === 'abierta' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                   {convocatorias[0].estado || 'Vigente'}
                                </span>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                   Cierre: {convocatorias[0].fecha_fin ? new Date(convocatorias[0].fecha_fin).toLocaleDateString() : '--'}
                                </div>
                              </div>

                              <h3 className="text-3xl md:text-4xl font-black text-[#002147] leading-tight tracking-tighter">
                                {convocatorias[0].titulo}
                              </h3>

                              <p className="text-base text-slate-500 font-serif-formal italic leading-relaxed">
                                {convocatorias[0].descripcion}
                              </p>
                           </div>

                           <div className="space-y-6 pt-6 border-t border-slate-50">
                              <div className="flex flex-col gap-4">
                                 <a 
                                   href={convocatorias[0].documento_pdf_url} 
                                   target="_blank" 
                                   className="w-full flex items-center justify-center gap-4 px-10 py-5 bg-[#002147] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl group/btn"
                                 >
                                   Descargar PDF <Download size={18} />
                                 </a>
                              </div>
                              
                              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <ShieldCheck size={20} className="text-emerald-500" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Documento Verificado</span>
                              </div>
                           </div>
                        </div>

                        {/* RIGHT: PDF PREVIEW */}
                        <div className="lg:col-span-8 bg-slate-50 relative flex flex-col overflow-hidden min-h-[600px] lg:min-h-0">
                           {convocatorias[0].documento_pdf_url ? (
                             <iframe 
                               src={`https://docs.google.com/viewer?url=${encodeURIComponent(convocatorias[0].documento_pdf_url)}&embedded=true`}
                               className="absolute inset-0 w-full h-full border-0 z-10"
                               title="Vista previa convocatoria"
                             />
                           ) : (
                             <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-6 relative z-10">
                                <FileSearch size={64} className="opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Vista previa no disponible</p>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-32 bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                       <Info size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-3xl font-black text-[#002147] mb-4">Sin Procesos Activos</h3>
                    <p className="text-slate-500 max-w-sm font-medium">Próximamente publicaremos nuevas convocatorias.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CINEMATIC HELP FOOTER */}
        <section className="py-40 relative overflow-hidden bg-[#002147]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/40 via-transparent to-transparent z-0" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
             <div className="max-w-4xl mx-auto space-y-12">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-12 mb-16">
                   <Network size={40} className="text-[#002147] -rotate-12" />
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                   Asistencia <br />
                   <span className="font-serif-formal italic font-normal text-emerald-400">Institucional.</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-300 font-serif-formal italic max-w-2xl mx-auto leading-relaxed">
                   ¿Tienes dudas sobre los requisitos o el flujo de algún trámite? Nuestro equipo de secretaría está disponible para guiarte en cada paso.
                </p>
                <div className="pt-10">
                   <Link 
                     href="/contacto" 
                     className="inline-flex items-center gap-4 px-14 py-6 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-[#002147] transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105"
                   >
                     Contactar Secretaría <ArrowRight size={18} />
                   </Link>
                </div>
             </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
