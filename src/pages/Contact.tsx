import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'
import { CONTACT } from '../data'
import ContactForm from '../components/ui/ContactForm'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Contact() {
  usePageMeta(
    'Contacto — Condes Corporación',
    'Contáctanos y recibe asesoría gratuita para encontrar tu hogar ideal en Arequipa.'
  )

  const headerRef = useScrollReveal()
  const bodyRef = useScrollReveal()

  return (
    <div>
      {/* Header — imagen a pantalla completa (render), texto abajo. Llega hasta
          el tope real de la página para quedar detrás del navbar transparente. */}
      <section className="relative min-h-[60vh] flex items-end pb-16 overflow-hidden" ref={headerRef}>
        <div className="absolute inset-0 reveal">
          <img
            src="https://condescorporacion.com/wp-content/uploads/2026/01/FOTO-JARDINES-S-PRINCIPAL-scaled.jpg"
            alt="Contáctanos — Condes Corporación"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-brand-900/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <p className="reveal text-brand-200 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Contáctanos</p>
          <h1 className="reveal reveal-delay-1 font-display text-4xl md:text-5xl text-white max-w-xl">
            Encuentra el proyecto <span className="italic text-brand-200">ideal para ti</span>
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-brand-600" ref={bodyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <p className="reveal font-body text-brand-50 leading-relaxed mb-10">
              Recibe asesoría gratuita en menos de 24 horas. Nuestros asesores te guiarán para encontrar la mejor opción según tus necesidades y presupuesto.
            </p>

            <div className="space-y-5 mb-10">
              {[
                { icon: Phone,  label: 'Teléfono', value: CONTACT.phone,   href: `tel:${CONTACT.phone}` },
                { icon: Mail,   label: 'Email',    value: CONTACT.email,   href: `mailto:${CONTACT.email}` },
              ].map(({ icon: Icon, label, value, href }, i) => (
                <a key={label} href={href} className={`flex items-center gap-4 group reveal reveal-delay-${(i % 3) + 1}`}>
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-100 font-body">{label}</p>
                    <p className="text-white font-body font-medium group-hover:text-brand-100 transition-colors">{value}</p>
                  </div>
                </a>
              ))}
              <div className="flex items-start gap-4 reveal reveal-delay-3 group">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 group-hover:-rotate-3">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-brand-100 font-body">Dirección</p>
                  <p className="text-white font-body font-medium">{CONTACT.address}</p>
                  <p className="text-brand-100 font-body text-sm">Sala de ventas: {CONTACT.sales}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-8 reveal reveal-delay-1">
              <p className="text-xs text-brand-100 font-body tracking-widest uppercase mb-4">Síguenos</p>
              <div className="flex gap-4">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-50 hover:text-white transition-colors font-body text-sm">
                  <Instagram size={18} /> Instagram
                </a>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-50 hover:text-white transition-colors font-body text-sm">
                  <Facebook size={18} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 reveal reveal-delay-2">
            <h3 className="font-display text-xl text-gray-900 mb-6">¿Quieres más información?</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
