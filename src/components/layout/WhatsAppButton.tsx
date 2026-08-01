import { MessageCircle } from 'lucide-react'
import { CONTACT } from '../../data'

export default function WhatsAppButton() {
  return (
    <a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="font-body text-sm font-medium max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Habla con nosotros
      </span>
    </a>
  )
}
