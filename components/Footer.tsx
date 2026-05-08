'use client'
import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowUp, GraduationCap } from 'lucide-react'

const css = `
  .footer-wrapper {
    background: #00122a;
    font-family: 'Inter', 'Outfit', sans-serif;
    border-top-left-radius: 4rem;
    border-top-right-radius: 4rem;
    padding-top: 80px;
    margin-top: -40px; /* Overlap slightly with content above */
    position: relative;
    z-index: 5;
  }
  .footer-main {
    max-width: 1200px; margin: 0 auto; padding: 0 40px 60px;
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px;
  }
  .footer-brand { display: flex; flex-direction: column; gap: 24px; }
  .footer-logo { display: inline-flex; items-center; gap: 12px; text-decoration: none; }
  .footer-icon-box {
    width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 1rem; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2);
  }
  .footer-brand-title { font-size: 20px; font-weight: 900; color: #fff; font-family: 'Outfit', sans-serif; line-height: 1.1; margin: 0; }
  .footer-brand-sub { font-size: 9px; color: #f59e0b; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; margin-top: 4px; }
  .footer-desc { font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; margin: 0; }
  .footer-contact-list { display: flex; flex-direction: column; gap: 12px; }
  .footer-contact-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: rgba(255, 255, 255, 0.5); }
  .footer-col-title { font-size: 12px; font-weight: 800; color: #fff; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 24px; }
  .footer-link-list { display: flex; flex-direction: column; gap: 16px; }
  .footer-link { font-size: 14px; color: rgba(255, 255, 255, 0.5); text-decoration: none; transition: all 0.2s; display: inline-block; }
  .footer-link:hover { color: #f59e0b; transform: translateX(4px); }
  
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 30px 40px;
    display: flex; align-items: center; justify-content: space-between;
    max-width: 1200px; margin: 0 auto; flex-wrap: wrap; gap: 20px;
  }
  .footer-copy { font-size: 12px; color: rgba(255, 255, 255, 0.4); }
  .footer-bottom-links { display: flex; align-items: center; gap: 24px; }
  .footer-bottom-link { font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.4); text-decoration: none; transition: color 0.2s; }
  .footer-bottom-link:hover { color: #fff; }

  .scroll-top-btn {
    position: absolute; top: -24px; right: 40px;
    width: 48px; height: 48px; background: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    color: #002147; transition: all 0.3s; z-index: 10;
  }
  .scroll-top-btn:hover { transform: translateY(-5px); background: #f59e0b; color: #fff; }

  @media(max-width: 900px) {
    .footer-main { grid-template-columns: 1fr 1fr; gap: 40px; }
    .footer-bottom { flex-direction: column; text-align: center; }
  }
  @media(max-width: 600px) {
    .footer-wrapper { border-radius: 2rem 2rem 0 0; padding-top: 60px; }
    .footer-main { grid-template-columns: 1fr; gap: 40px; }
    .scroll-top-btn { right: 20px; }
  }
`

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <>
      <style>{css}</style>
      <footer className="footer-wrapper">
        <button 
          className="scroll-top-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          aria-label="Volver arriba"
        >
          <ArrowUp size={20} />
        </button>

        <div className="footer-main">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-icon-box">
                <GraduationCap size={24} color="#002147" />
              </div>
              <div>
                <h3 className="footer-brand-title">Warisata</h3>
                <div className="footer-brand-sub">ESFM • Bolivia</div>
              </div>
            </Link>
            <p className="footer-desc">
              Herederos de la histórica gesta pedagógica. Formando los maestros del Estado Plurinacional de Bolivia desde 1931.
            </p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={16} color="#f59e0b"/> Omasuyos, La Paz — Bolivia
              </div>
              <div className="footer-contact-item">
                <Phone size={16} color="#f59e0b"/> +591 (2) 2234XXX
              </div>
              <div className="footer-contact-item">
                <Mail size={16} color="#f59e0b"/> info@warisata.edu.bo
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="footer-col-title">Académico</h4>
            <div className="footer-link-list">
              {[['Especialidades', '/especialidades'], ['Calendario', '/calendario'], ['Plan de Estudios', '/especialidades'], ['Investigación', '/institucion']].map(([l, h]) =>
                <Link key={l} href={h} className="footer-link">{l}</Link>
              )}
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Institucional</h4>
            <div className="footer-link-list">
              {[['Nuestra Historia', '/institucion'], ['Noticias', '/noticias'], ['Plantel Docente', '/personal'], ['Galería', '/galeria']].map(([l, h]) =>
                <Link key={l} href={h} className="footer-link">{l}</Link>
              )}
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Servicios</h4>
            <div className="footer-link-list">
              {[['Admisiones', '/tramites'], ['Trámites', '/tramites'], ['Directorio', '/contacto'], ['Ministerio', '#']].map(([l, h]) =>
                <Link key={l} href={h} className="footer-link">{l}</Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span className="footer-copy">© {year} ESFM Warisata. Todos los derechos reservados.</span>
          <div className="footer-bottom-links">
            <Link href="/admin" className="footer-bottom-link">Panel Administrativo</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span className="footer-bottom-link" style={{ cursor: 'default' }}>Estado Plurinacional de Bolivia</span>
          </div>
        </div>
      </footer>
    </>
  )
}
