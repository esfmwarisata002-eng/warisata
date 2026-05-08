'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, ChevronLeft, Share2, User, Sparkles, Zap, Heart, Star, Quote } from 'lucide-react'
import Link from 'next/link'

export default function NoticiaDetalle() {
  const { id } = useParams()
  const [noticia, setNoticia] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticia() {
      const { data } = await supabase.from('noticias').select('*').eq('id', id).single()
      if (data) setNoticia(data)
      setLoading(false)
    }
    fetchNoticia()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-60 text-center">
         <div className="w-20 h-20 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-8" />
         <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-300">Descodificando Historia...</p>
      </div>
    </div>
  )

  if (!noticia) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-60 text-center space-y-8">
         <h1 className="text-9xl font-black text-slate-50 italic uppercase tracking-tighter">404</h1>
         <p className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Noticia no encontrada.</p>
         <Link href="/noticias" className="inline-block px-12 py-6 bg-slate-950 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all">Volver al Archivo</Link>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent font-outfit text-slate-900 overflow-x-hidden">
      <Navbar />

      <main>
        {/* CINEMATIC POST HEADER */}
        <section className="relative pt-48 pb-10 border-b border-slate-100">
           <div className="container mx-auto px-6">
              <Link href="/noticias" className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-950 hover:text-white transition-all group mb-16">
                 <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Volver al Archivo
              </Link>

              <div className="max-w-5xl space-y-12">
                 <div className="flex flex-wrap items-center gap-6">
                    <span className="px-5 py-2 bg-violet-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em]">{noticia.categoria}</span>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Calendar size={14} className="text-rose-500" /> {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                    </div>
                 </div>
                 <h1 className="text-6xl md:text-[7rem] font-black leading-[0.85] tracking-tighter uppercase italic text-slate-950">
                    {noticia.titulo}
                 </h1>
              </div>
           </div>
        </section>

        {/* FEATURED IMAGE & CONTENT */}
        <section className="py-24">
           <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto space-y-24">
                 
                 <div className="relative group">
                    <div className="absolute -inset-10 bg-gradient-to-r from-violet-600/20 via-rose-500/20 to-amber-500/20 rounded-[5rem] blur-[100px] -z-10 group-hover:opacity-100 opacity-40 transition-opacity" />
                    <div className="aspect-[21/9] rounded-[4rem] overflow-hidden shadow-3xl border-[20px] border-white group-hover:rotate-1 transition-transform duration-1000">
                       <img src={noticia.imagen_portada_url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                    </div>
                    {/* Floating Tech Badge */}
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-slate-950 rounded-full flex flex-col items-center justify-center text-white shadow-3xl animate-float">
                       <Sparkles size={64} className="text-amber-500" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                    
                    {/* Meta Sidebar */}
                    <div className="lg:col-span-3 space-y-16">
                       <div className="p-10 glass rounded-[3rem] border border-slate-100 space-y-10">
                          <div className="space-y-6">
                             <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-950">
                                <User size={40} />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Autoría</p>
                                <p className="text-xl font-black text-slate-950 uppercase italic tracking-tighter">Redacción <br /> Warisata.</p>
                             </div>
                          </div>
                          
                          <button className="w-full py-6 bg-slate-950 text-white rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all shadow-xl">
                             <Share2 size={18} /> Compartir
                          </button>
                       </div>

                       <div className="space-y-6 px-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Etiquetas</h4>
                          <div className="flex flex-wrap gap-2 text-rose-500 font-black italic">
                             #Educacion #Bolivia #Innovacion
                          </div>
                       </div>
                    </div>

                    {/* Main Text Content */}
                    <div className="lg:col-span-9 space-y-16">
                       <div className="relative">
                          <Quote className="absolute -top-10 -left-10 text-violet-100" size={80} />
                          <p className="text-3xl md:text-4xl font-black text-slate-950 leading-tight italic tracking-tighter border-l-8 border-rose-500 pl-10">
                             {noticia.resumen}
                          </p>
                       </div>

                       <div className="prose prose-2xl prose-slate max-w-none text-slate-600 font-medium leading-[1.8] italic selection:bg-amber-500 selection:text-white" dangerouslySetInnerHTML={{ __html: noticia.contenido }} />

                       {/* Decorative Footer of Article */}
                       <div className="h-px w-full bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 opacity-20" />
                       <div className="flex items-center gap-6">
                          <Heart size={32} className="text-rose-500 fill-rose-500 animate-beat" />
                          <span className="text-xs font-black uppercase tracking-widest text-slate-300">Gracias por leer sobre nuestra comunidad</span>
                       </div>
                    </div>

                 </div>

              </div>
           </div>
        </section>

        {/* RELATED SECTION PLACEHOLDER */}
        <section className="py-40 bg-slate-50">
           <div className="container mx-auto px-6 text-center space-y-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Sigue <span className="text-gradient">Explorando.</span></h2>
              <Link href="/noticias" className="inline-flex items-center gap-4 px-14 py-7 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 hover:text-white transition-all">Ver Más Crónicas</Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
