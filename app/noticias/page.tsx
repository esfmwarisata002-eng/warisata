'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowUpRight, Search, Calendar, Landmark, BookOpen, Clock, Newspaper, ChevronDown, ChevronUp, Share2, FileText, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('Todas')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNoticias() {
      const { data } = await supabase.from('noticias').select('*').order('fecha_publicacion', { ascending: false })
      if (data) setNoticias(data)
      setLoading(false)
    }
    fetchNoticias()
  }, [])

  const filteredNoticias = noticias.filter(n => {
    const matchesSearch = n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.resumen?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === 'Todas' || n.categoria === selectedTag
    return matchesSearch && matchesTag
  })

  const categories = ['Todas', ...new Set(noticias.map(n => n.categoria).filter(Boolean))]

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Outfit'] text-slate-800 selection:bg-amber-500 selection:text-[#002147] scroll-smooth">
      <Navbar />

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* MINIMALIST HERO SECTION */}
        <section className="relative pt-40 pb-10 px-6 overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1/2 h-64 bg-emerald-50/30 skew-x-12 -translate-x-1/4 z-0" />
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 animate-fade-in-up w-full">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 mb-8 shadow-sm">
               <Newspaper size={18} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Actualidad & Crónica</span>
            </div>
            
            <div className="w-full max-w-xl mx-auto mb-8 relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
               <input 
                 type="text" 
                 placeholder="Buscar crónicas..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-[#002147] font-bold text-sm focus:outline-none focus:border-emerald-500 focus:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all placeholder:text-slate-400 shadow-sm"
               />
            </div>
            
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
          </div>
        </section>

        {/* ELEGANT CATEGORY BAR - GLASSMORPHISM */}
        <div className="sticky top-[72px] z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 py-6 mb-20 shadow-sm">
           <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center justify-center gap-4 min-w-max">
                 {categories.map((cat) => (
                   <button
                     key={cat as string}
                     onClick={() => { setSelectedTag(cat as string); setExpandedId(null); }}
                     className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                       selectedTag === cat 
                        ? 'bg-[#002147] text-white shadow-xl scale-105' 
                        : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105 border border-slate-100'
                     }`}
                   >
                     {cat as string}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* DYNAMIC LIST */}
        <section className="pb-32 relative z-20">
           <div className="max-w-7xl mx-auto px-6">
              {loading ? (
                <div className="space-y-10">
                   {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-12">
                   {filteredNoticias.map((n, idx) => (
                     <article 
                        key={n.id} 
                        id={`noticia-${n.id}`}
                        className={`group relative flex flex-col lg:flex-row bg-white rounded-[3rem] border border-slate-100 transition-all duration-700 overflow-hidden shadow-[0_15px_50px_rgba(0,33,71,0.05)] hover:shadow-[0_30px_80px_rgba(0,33,71,0.12)] hover:-translate-y-2 animate-fade-in-up ${expandedId === n.id ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-[#f8f9fc]' : ''}`}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {/* Abstract Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Image Side */}
                        <div className={`relative w-full lg:w-[480px] shrink-0 overflow-hidden bg-[#002147] transition-all duration-1000 ${expandedId === n.id ? 'lg:w-[550px]' : ''}`}>
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000 z-10" />
                           <img src={n.imagen_portada_url || '/warisata_noche.jpg'} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out" alt={n.titulo} />
                           
                           {/* Badge */}
                           <div className="absolute top-8 left-8 z-20 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl shadow-2xl">
                              {n.categoria || 'Institucional'}
                           </div>
                        </div>

                        {/* Content Side */}
                        <div className="p-10 md:p-16 flex-1 flex flex-col relative z-10">
                           <div className="flex items-center gap-4 text-slate-400 mb-8">
                              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-emerald-500">
                                 <Calendar size={18} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest">{new Date(n.fecha_publicacion).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                           </div>
                           
                           <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#002147] leading-[1] tracking-tight group-hover:text-emerald-600 transition-colors duration-500 mb-8">
                              {n.titulo}
                           </h2>

                           {/* SUMMARY */}
                           {expandedId !== n.id && (
                             <p className="text-xl text-slate-500 font-medium italic border-l-4 border-slate-100 pl-8 line-clamp-3 leading-relaxed mb-10">
                                {n.resumen || n.contenido.replace(/<[^>]+>/g, '').substring(0, 180) + '...'}
                             </p>
                           )}

                           {/* FULL CONTENT */}
                           <div className={`overflow-hidden transition-all duration-1000 ease-in-out ${expandedId === n.id ? 'max-h-[5000px] opacity-100 mt-2 mb-10' : 'max-h-0 opacity-0'}`}>
                              <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-12" />
                              <div 
                                 className="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed text-justify prose-headings:text-[#002147] prose-headings:font-black prose-p:mb-8 prose-emerald"
                                 dangerouslySetInnerHTML={{ __html: n.contenido }}
                              />
                              
                              {n.pdf_url && (
                                <div className="mt-16 p-10 bg-[#f8f9fc] rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group/pdf hover:border-emerald-500/30 transition-all shadow-sm">
                                   <div className="flex items-center gap-6">
                                      <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-500 group-hover/pdf:scale-110 transition-transform">
                                        <FileText size={32} />
                                      </div>
                                      <div>
                                         <p className="text-lg font-black text-[#002147]">Documento Oficial</p>
                                         <p className="text-base text-slate-400 font-medium italic mt-1">Expediente adjunto para descarga o visualización</p>
                                      </div>
                                   </div>
                                   <a href={n.pdf_url} target="_blank" className="flex items-center gap-3 px-10 py-4.5 bg-[#002147] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl hover:-translate-y-1 whitespace-nowrap">
                                      Explorar PDF <ArrowUpRight size={18} />
                                   </a>
                                </div>
                              )}

                              {n.imagenes && n.imagenes.length > 0 && (
                                 <div className="mt-16 space-y-8">
                                    <div className="flex items-center gap-4">
                                       <div className="h-[1px] flex-1 bg-slate-100"></div>
                                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Galería Fotográfica</span>
                                       <div className="h-[1px] flex-1 bg-slate-100"></div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                       {n.imagenes.slice(1).map((img: string, i: number) => (
                                          <div key={i} className="group/img relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                                             <img src={img} alt={`Imagen ${i+1}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="mt-auto pt-10 border-t border-slate-50 flex items-center justify-between">
                              <button 
                                 onClick={() => toggleExpand(n.id)}
                                 className="flex items-center gap-4 text-[#002147] font-black uppercase text-xs tracking-[0.2em] hover:text-emerald-600 transition-all group/btn"
                              >
                                 {expandedId === n.id ? (
                                   <><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-all"><ChevronUp size={20} /></div> Contraer historia</>
                                 ) : (
                                   <><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-all"><ChevronDown size={20} /></div> Leer crónica completa</>
                                 )}
                              </button>
                              <div className="flex items-center gap-4 text-slate-300">
                                 <button className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-emerald-500/20">
                                    <Share2 size={18} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </article>
                   ))}
                </div>
              )}
           </div>
        </section>

        {/* NEWSLETTER - CINEMATIC EMERALD EDITION */}
        <section className="py-40 relative overflow-hidden bg-[#002147] text-center">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 via-[#002147] to-[#002147] z-0" />
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] z-10" />
           
           <div className="max-w-4xl mx-auto px-6 relative z-20 space-y-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(16,185,129,0.3)] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <Mail className="text-[#002147] -rotate-12" size={36} />
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                 Boletín <span className="font-serif-formal italic font-normal text-emerald-400 underline decoration-emerald-500/30 underline-offset-8">Informativo</span>
              </h2>
              
              <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                 Únete a nuestra lista exclusiva para recibir comunicados oficiales y la crónica institucional directamente en tu correo.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto pt-8">
                 <input 
                   type="email" 
                   placeholder="Tu correo electrónico..." 
                   className="px-10 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-base tracking-wide focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all flex-1 placeholder:text-slate-500 backdrop-blur-md" 
                 />
                 <button className="px-12 py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3">
                    Suscribirse <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
