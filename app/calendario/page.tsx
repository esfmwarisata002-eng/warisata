'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Zap, 
  Star, 
  Sparkles, 
  ChevronRight, 
  Filter,
  GraduationCap,
  Music,
  Users,
  Award
} from 'lucide-react'

export default function CalendarioPage() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const eventos = [
    {
      id: 1,
      date: '21 OCT',
      time: '09:00 AM',
      title: 'Seminario Pedagógico Comunitario',
      category: 'Académico',
      location: 'Auditorio Central',
      description: 'Un encuentro para reflexionar sobre las prácticas educativas ancestrales y su integración con la tecnología moderna.',
      icon: GraduationCap,
      color: 'bg-violet-600'
    },
    {
      id: 2,
      date: '15 NOV',
      time: '14:30 PM',
      title: 'Expo-Warisata: Innovación y Arte',
      category: 'Cultura',
      location: 'Plaza Principal',
      description: 'Muestra anual de proyectos artísticos y tecnológicos desarrollados por los estudiantes de todas las especialidades.',
      icon: Music,
      color: 'bg-rose-500'
    },
    {
      id: 3,
      date: '02 DIC',
      time: '08:00 AM',
      title: 'Lanzamiento Convocatoria 2026',
      category: 'Admisión',
      location: 'Portal Digital / Secretaría',
      description: 'Inicio oficial del proceso de admisión para la gestión 2026. Publicación de requisitos y cronograma de exámenes.',
      icon: Zap,
      color: 'bg-amber-500'
    },
    {
       id: 4,
       date: '10 DIC',
       time: '10:00 AM',
       title: 'Encuentro de Ex-Alumnos (Ayni)',
       category: 'Institucional',
       location: 'Canchas Polifuncionales',
       description: 'Jornada de reciprocidad y reencuentro con egresados para fortalecer la red institucional.',
       icon: Users,
       color: 'bg-cyan-500'
    },
    {
       id: 5,
       date: '20 DIC',
       time: '18:00 PM',
       title: 'Gala de Grado 2025',
       category: 'Académico',
       location: 'Auditorio Central',
       description: 'Acto de graduación de la promoción 2025 de maestros y maestras de vanguardia.',
       icon: Award,
       color: 'bg-violet-600'
    }
  ]

  const categories = ['Todos', 'Académico', 'Cultura', 'Admisión', 'Institucional']
  const filteredEventos = eventos.filter(e => activeFilter === 'Todos' || e.category === activeFilter)

  return (
    <div className="min-h-screen bg-transparent font-outfit text-slate-900 overflow-x-hidden">
      <Navbar />

      <main>
        {/* CINEMATIC CALENDAR HEADER */}
        <section className="relative pt-48 pb-32 overflow-hidden border-b border-slate-100 bg-slate-50">
           <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-amber-50 to-transparent -z-10 opacity-50" />
           <div className="container mx-auto px-6">
              <div className="max-w-4xl space-y-10">
                 <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-xl border border-amber-50 animate-float">
                    <CalendarIcon className="text-amber-500" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Cronograma de Impacto</span>
                 </div>
                 <h1 className="text-6xl md:text-9xl font-black leading-[0.8] tracking-tighter uppercase italic">
                   Ritmo <br /><span className="text-gradient">Académico.</span>
                 </h1>
                 <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed italic">
                    Planifica tu trayectoria en la ESFM Warisata. Eventos, hitos y celebraciones que marcan nuestro latir pedagógico.
                 </p>
              </div>
           </div>
        </section>

        {/* FILTERS - TECHNICOLOR STYLE */}
        <div className="sticky top-[100px] z-[50] py-8 bg-white/80 backdrop-blur-3xl border-b border-slate-50">
           <div className="container mx-auto px-6">
              <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 <div className="flex items-center gap-3 mr-6 text-slate-300">
                    <Filter size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Filtrar por:</span>
                 </div>
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setActiveFilter(cat)}
                     className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-xl ${
                       activeFilter === cat 
                        ? 'bg-slate-950 text-white shadow-slate-200 lg:scale-110' 
                        : 'bg-slate-50 text-slate-400 hover:bg-white hover:shadow-lg'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* EVENTS TIMELINE */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 max-w-6xl">
             <div className="space-y-12">
                {filteredEventos.length > 0 ? (
                  filteredEventos.map((e, index) => (
                    <div key={e.id} className="group relative">
                       {/* Timeline Line */}
                       {index !== filteredEventos.length - 1 && (
                         <div className="absolute left-10 md:left-24 top-24 bottom-0 w-1 bg-slate-100 -z-10 group-hover:bg-slate-200 transition-colors" />
                       )}
                       
                       <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                          {/* Date Block */}
                          <div className="flex-shrink-0 flex items-center md:items-start gap-8">
                             <div className="w-20 md:w-48 h-24 md:h-48 glass bg-white/50 border border-slate-100 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-slate-950 group-hover:bg-slate-950 group-hover:text-white transition-all duration-700">
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40">{e.date.split(' ')[1]}</span>
                                <span className="text-3xl md:text-6xl font-black italic tracking-tighter leading-none">{e.date.split(' ')[0]}</span>
                             </div>
                             <div className="md:hidden flex-1 h-[2px] bg-slate-100 group-hover:bg-violet-600 transition-all duration-700" />
                          </div>

                          {/* Content Block */}
                          <div className="flex-1 pb-20">
                             <div className="p-10 lg:p-16 glass bg-white/50 border border-slate-100 rounded-[4rem] shadow-2xl hover:bg-white hover:shadow-3xl transition-all duration-700 group-hover:-translate-y-4">
                                <div className="flex flex-wrap items-center gap-6 mb-8">
                                   <div className={`px-6 py-2 ${e.color} text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-lg`}>
                                      <e.icon size={14} /> {e.category}
                                   </div>
                                   <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                      <Clock size={16} className="text-slate-400" /> {e.time}
                                   </div>
                                </div>
                                
                                <h3 className="text-4xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.9] mb-8">
                                   {e.title}
                                </h3>
                                
                                <p className="text-lg text-slate-400 font-medium italic leading-relaxed max-w-3xl mb-10">
                                   {e.description}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-slate-50">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-500 transition-colors">
                                         <MapPin size={24} />
                                      </div>
                                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{e.location}</span>
                                   </div>
                                   <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-violet-600 hover:gap-6 transition-all">
                                      Añadir a mi Calendario <ChevronRight size={18} />
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-60 text-center space-y-12">
                    <div className="text-[12rem] text-slate-50 font-black italic select-none uppercase">Empty.</div>
                    <h3 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter">Sin eventos programados...</h3>
                    <button onClick={() => setActiveFilter('Todos')} className="px-16 py-8 bg-slate-950 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all shadow-3xl">Ver Todo el Año</button>
                  </div>
                )}
             </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 bg-slate-950 mx-6 mb-20 rounded-[5rem] relative overflow-hidden flex flex-col items-center text-center text-white">
           <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-violet-600 via-rose-500 via-amber-500 via-cyan-500 to-indigo-600" />
           <div className="relative z-10 space-y-12 max-w-4xl px-6">
              <Sparkles className="text-amber-500 mx-auto animate-float" size={64} />
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">¿Organizando un <br /> evento institucional?</h2>
              <p className="text-2xl text-white/40 font-medium italic">Coordina con la Dirección Académica para integrar actividades al calendario oficial.</p>
              <div className="flex flex-wrap justify-center gap-10 pt-8">
                 <button className="px-16 py-8 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-3xl">Solicitar Fecha</button>
                 <button className="px-16 py-8 glass text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all">Ver Normativa de Eventos</button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
