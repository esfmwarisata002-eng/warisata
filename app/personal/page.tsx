'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, ChevronRight, Users, Landmark, Linkedin, Phone } from 'lucide-react'

export default function PersonalPage() {
  const [personal, setPersonal] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Todos')

  useEffect(() => {
    async function fetchData() {
      const [persRes, catsRes] = await Promise.all([
        supabase.from('personal').select('*').order('nombre'),
        supabase.from('categorias_personal').select('*').order('nombre')
      ])
      
      if (persRes.data) setPersonal(persRes.data)
      if (catsRes.data) {
        const fetchedCats = catsRes.data
        setCategories(fetchedCats)
        
        // Find the "Dirección" category to set as default
        const desiredOrder = ['direccion', 'docente', 'programa puente', 'administrativo', 'servicio', 'parlamento amauta']
        const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        
        const sorted = [...fetchedCats].sort((a, b) => {
          const nameA = normalize(a.nombre)
          const nameB = normalize(b.nombre)
          const indexA = desiredOrder.findIndex(o => nameA.includes(normalize(o)))
          const indexB = desiredOrder.findIndex(o => nameB.includes(normalize(o)))
          return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
        })

        if (sorted.length > 0) {
          setActiveTab(sorted[0].id)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const desiredOrder = ['direccion', 'docente', 'programa puente', 'administrativo', 'servicio', 'parlamento amauta']
  
  const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const sortedCategories = [...categories].sort((a, b) => {
    const nameA = normalize(a.nombre)
    const nameB = normalize(b.nombre)
    const indexA = desiredOrder.findIndex(o => nameA.includes(normalize(o)))
    const indexB = desiredOrder.findIndex(o => nameB.includes(normalize(o)))
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
  })

  const filteredPersonal = personal.filter(p => activeTab === 'Todos' || p.categoria_id === activeTab)

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Outfit'] text-slate-800 selection:bg-amber-500 selection:text-[#002147] scroll-smooth">
      <Navbar />

      <main className="relative z-10 w-full overflow-hidden">
        
        {/* MINIMALIST HERO SECTION */}
        <section className="relative pt-40 pb-12 px-6 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-1/2 h-64 bg-emerald-50/30 -skew-x-12 translate-x-1/4 z-0" />
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 animate-fade-in-up w-full">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 mb-8 shadow-sm">
               <Users size={18} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal & Autoridades</span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
          </div>
        </section>

        {/* ELEGANT CATEGORY BAR - GLASSMORPHISM */}
        <div className="sticky top-[72px] z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 py-6 mb-16 shadow-sm">
           <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center justify-center gap-4 min-w-max">
                 {sortedCategories.map(cat => (
                   <button
                     key={cat.id}
                     onClick={() => setActiveTab(cat.id)}
                     className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                       activeTab === cat.id 
                        ? 'bg-[#002147] text-white shadow-xl scale-105' 
                        : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105 border border-slate-100'
                     }`}
                   >
                     {cat.nombre}
                   </button>
                 ))}
                 <button
                    onClick={() => setActiveTab('Todos')}
                    className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                      activeTab === 'Todos' 
                       ? 'bg-[#002147] text-white shadow-xl scale-105' 
                       : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105 border border-slate-100'
                    }`}
                 >
                   Todos
                 </button>
              </div>
           </div>
        </div>

        {/* DYNAMIC STAFF GRID */}
        <section className="pb-32 relative z-20">
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                  [1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-96 bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse" />)
                ) : (
                  filteredPersonal.map((p, idx) => (
                    <div 
                      key={p.id} 
                      className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,33,71,0.05)] hover:shadow-[0_30px_80px_rgba(0,33,71,0.15)] transition-all duration-700 overflow-hidden animate-fade-in-up hover:-translate-y-3 flex flex-col"
                      style={{ animationDelay: `${(idx % 8) * 0.05}s` }}
                    >
                       {/* Image Section */}
                       <div className="relative h-60 overflow-hidden bg-slate-50 w-full shrink-0">
                          <img 
                            src={p.foto_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=400'} 
                            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                            alt={p.nombre} 
                          />
                          {/* Elegant Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#002147] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700 z-10" />
                          
                          {/* Floating Contact Icons on Hover */}
                          <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                             {p.email && (
                               <a href={`mailto:${p.email}`} className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-xl hover:bg-emerald-600 hover:text-white transition-all">
                                  <Mail size={18} />
                               </a>
                             )}
                             {p.telefono && (
                               <a href={`tel:${p.telefono}`} className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-xl hover:bg-emerald-600 hover:text-white transition-all">
                                  <Phone size={18} />
                               </a>
                             )}
                          </div>
                       </div>
                       
                       {/* Information Section - COMPACT & MINIMALIST */}
                       <div className="p-6 flex flex-col items-center text-center bg-white">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">
                             {p.cargo}
                          </span>
                          <h3 className="text-base lg:text-lg font-black text-[#002147] leading-tight group-hover:text-emerald-700 transition-colors uppercase">
                             {p.nombre} {p.apellidos}
                          </h3>
                       </div>
                    </div>
                  ))
                )}
              </div>
           </div>
        </section>

        {/* INSTITUTIONAL VALUES FOOTER - CINEMATIC EMERALD */}
        <section className="py-40 relative overflow-hidden bg-[#002147] text-center">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#002147] to-[#002147] z-0" />
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] z-10" />
           
           <div className="max-w-5xl mx-auto px-6 relative z-20 space-y-12">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(16,185,129,0.3)] rotate-12">
                 <Landmark size={40} className="text-[#002147] -rotate-12" />
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                 Calidad & <span className="font-serif-formal italic font-normal text-emerald-400 underline decoration-emerald-500/30 underline-offset-8">Trayectoria</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
                 Nuestra planta docente representa la herencia pedagógica de Warisata, uniendo la sabiduría comunitaria con el rigor científico moderno.
              </p>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
