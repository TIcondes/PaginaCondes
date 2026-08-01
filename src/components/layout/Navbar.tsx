import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { navLinks, CONTACT } from '../../data'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  // Todas las páginas abren con una sección oscura (hero) a pantalla completa
  // detrás del navbar, así que el navbar transparente aplica al tope de
  // cualquier página, no solo en Home. Al hacer scroll, se vuelve blanco.
  const transparent = !scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`relative flex items-center justify-between transition-all duration-500 ${transparent ? 'h-28' : 'h-16'}`}>
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-sm font-bold italic tracking-wide transition-colors duration-200 relative group ${
                    transparent
                      ? 'text-white/90 hover:text-white'
                      : active
                      ? 'text-brand-600'
                      : 'text-gray-700 hover:text-brand-600'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-brand-500 transition-all duration-300 ${
                    active && !transparent ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            })}
          </nav>

          {/* Logo centrado de forma absoluta: queda perfectamente al medio
              sin importar cuánto midan los nav links o el botón a los lados. */}
          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={`${import.meta.env.BASE_URL}logos/${transparent ? 'logo-blanco.png' : 'logo.png'}`}
              alt="Condes Corporación"
              className={`w-auto transition-all duration-500 ${transparent ? 'h-20' : 'h-10'}`}
            />
          </Link>

          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:inline-flex items-center gap-2 text-sm font-body font-bold italic px-5 py-2.5 transition-all duration-300 ${
              transparent
                ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            <Phone size={15} />
            Hablar con asesor
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${transparent ? 'text-white' : 'text-gray-700'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-3 text-gray-700 font-body font-bold italic hover:text-brand-600 transition-colors border-b border-gray-50 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-3 bg-brand-600 text-white px-5 py-3 text-sm font-bold italic w-full justify-center"
          >
            <Phone size={15} />
            Hablar con un asesor
          </a>
        </div>
      </div>
    </header>
  )
}
