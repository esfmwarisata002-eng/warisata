'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, GraduationCap, ChevronRight, User, Search, Globe, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Institución', href: '/institucion' },
    { name: 'Especialidades', href: '/especialidades' },
    { name: 'Noticias', href: '/noticias' },
    { name: 'Personal', href: '/personal' },
    { name: 'Trámites', href: '/tramites' },
    { name: 'Galería', href: '/galeria' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 ${
        isScrolled ? 'pt-4' : 'pt-8'
      }`}>
        
        {/* FLOATING ISLAND NAVBAR */}
        <header className={`max-w-[1400px] mx-auto transition-all duration-700 relative ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem]' 
            : 'bg-white/10 backdrop-blur-md border border-white/10 rounded-[2.5rem]'
        }`}>
          
          <div className="px-6 lg:px-10 py-3 lg:py-4 flex items-center justify-between">
            
            {/* LOGO SECTION */}
            <Link href="/" className="flex items-center gap-4 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative w-12 h-12 lg:w-16 lg:h-16 transition-all duration-500 transform group-hover:scale-110">
                 <img 
                    src="/logo_oficial.png" 
                    alt="Escudo ESFM Warisata" 
                    className="w-full h-full object-contain drop-shadow-md"
                 />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl lg:text-2xl font-black tracking-tighter leading-none transition-colors duration-500 ${
                  isScrolled ? 'text-[#002147]' : 'text-slate-900'
                }`}>ESFM <span className="text-emerald-600 italic font-serif-formal font-normal lowercase tracking-normal text-2xl lg:text-3xl">Warisata</span></span>
                <span className={`hidden md:block text-[8px] font-black tracking-[0.4em] uppercase mt-1 transition-colors duration-500 ${
                  isScrolled ? 'text-slate-400' : 'text-slate-500'
                }`}>Excelencia Académica</span>
              </div>
            </Link>

            {/* DESKTOP NAV - PESTAÑAS / TABS STYLE */}
            <nav className="hidden xl:flex items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-full relative group ${
                      isActive 
                        ? 'text-white bg-[#002147] shadow-lg scale-105' 
                        : isScrolled ? 'text-slate-500 hover:text-[#002147]' : 'text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-white scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 -z-0 opacity-0 group-hover:opacity-100 shadow-sm" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              <Link 
                href="/admin" 
                className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  isScrolled 
                    ? 'bg-emerald-600 text-white hover:bg-[#002147] shadow-lg shadow-emerald-600/20' 
                    : 'bg-[#002147] text-white hover:bg-emerald-600 shadow-xl'
                }`}
              >
                <User size={14} /> Intranet
              </Link>

              {/* MOBILE MENU TOGGLE */}
              <button 
                className={`xl:hidden p-3 rounded-2xl transition-all duration-500 ${
                  isScrolled ? 'bg-slate-100 text-[#002147]' : 'bg-white/20 text-[#002147]'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* FULLSCREEN MOBILE MENU */}
      <div className={`xl:hidden fixed inset-0 z-[90] bg-[#002147] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] flex flex-col ${
        isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-full'
      }`}>
        <div className="absolute top-0 right-0 w-[80%] h-full bg-emerald-500/5 -z-10 blur-[120px] rounded-full" />
        
        <div className="flex-1 overflow-y-auto px-10 py-48 flex flex-col items-center justify-center text-center">
          <div className="space-y-12 w-full">
            <div className="flex items-center justify-center gap-4 mb-8">
               <div className="w-12 h-[1px] bg-emerald-500/30" />
               <Sparkles className="text-emerald-500" size={20} />
               <div className="w-12 h-[1px] bg-emerald-500/30" />
            </div>
            
            <nav className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <Link 
                   key={link.name} 
                   href={link.href} 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="group relative"
                   style={{ transitionDelay: `${idx * 50}ms` }}
                >
                   <span className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white group-hover:text-emerald-500 transition-colors block leading-none">
                      {link.name}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-[1em] text-white/20 mt-2 block opacity-0 group-hover:opacity-100 transition-all">Explorar</span>
                </Link>
              ))}
            </nav>

            <div className="pt-20 border-t border-white/5 w-full max-w-xs mx-auto">
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-4 w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-[#002147] transition-all shadow-2xl"
              >
                 <User size={18} /> Acceder a Intranet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
