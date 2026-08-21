import { Link } from 'react-router-dom'
import { navLinks, CONTACT } from '../../data'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 text-center">
          <h4 className="font-body text-xs text-gray-500 tracking-[0.25em] uppercase mb-5">Ubicación</h4>
          <div className="max-w-xl mx-auto overflow-hidden border border-gray-800 rounded-xl">
            <iframe
              title="Ubicación Condes Corporación"
              src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.address + ', Arequipa, Perú')}&output=embed`}
              width="100%"
              height="220"
              // El embed simple de Maps no tiene parámetro de tema oscuro nativo:
              // se simula invirtiendo colores y corrigiendo el tono con hue-rotate.
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* En desktop el orden visual es Logo / Contacto / Menú (como en
            condescorporacion.com). En móvil se reacomoda con `order-*` para
            que Menú (corto) quede junto al logo en una fila de 2 columnas, y
            Contacto (más largo) ocupe el ancho completo debajo — reordenar
            el markup en vez de solo usar CSS haría que este último se viera
            raro en uno de los dos tamaños.
            De md para arriba se pasa de grid (columnas de igual ancho, que
            con contenido angosto como Menú dejaba un espacio enorme y
            asimétrico) a flex + justify-between: cada bloque mide lo que
            necesita su contenido y el espacio libre se reparte parejo entre
            los tres, en vez de forzar tercios iguales. */}
        <div className="grid grid-cols-2 gap-8 mb-12 md:flex md:items-start md:justify-between md:gap-12">
          <div className="md:max-w-xs">
            <img
              src="https://condescorporacion.com/wp-content/uploads/2025/12/logo_V.png"
              alt="Condes Corporación"
              className="h-14 w-auto mb-4 brightness-0 invert"
            />
            <p className="font-body text-sm text-gray-400 leading-relaxed">
              Proyectos inmobiliarios de calidad con respaldo legal y técnico en Arequipa, Perú.
            </p>
          </div>

          <div className="text-center md:order-2 md:text-left">
            <h4 className="font-body text-xs text-gray-500 tracking-[0.25em] uppercase mb-5">Menú</h4>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block font-body text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-2 md:order-1 md:max-w-xs">
            <h4 className="font-body text-xs text-gray-500 tracking-[0.25em] uppercase mb-5">Contacto</h4>
            <div className="space-y-3">
              <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail size={14} className="mt-0.5 text-brand-500 shrink-0" />
                <span className="font-body">{CONTACT.email}</span>
              </a>
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone size={14} className="text-brand-500 shrink-0" />
                <span className="font-body">{CONTACT.phone}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={14} className="mt-0.5 text-brand-500 shrink-0" />
                <div className="font-body">
                  <p>{CONTACT.address}</p>
                  <p>Sala de ventas: {CONTACT.sales}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="font-body text-sm text-gray-600">© 2026 Condes Corporación. Todos los derechos reservados.</p>
            <Link to="/politica-de-privacidad" className="font-body text-sm text-gray-600 hover:text-white transition-colors">
              Política de privacidad
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
            <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors font-body text-xs font-semibold">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
