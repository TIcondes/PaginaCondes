import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { visibleProjects } from '../../data'
import type { ContactFormData } from '../../types'

interface Props {
  defaultProject?: string
}

const initial: ContactFormData = {
  fullName: '',
  project: '',
  email: '',
  phone: '',
  contactMethod: 'phone',
}

// Web3Forms: envía el POST directo desde el navegador a la casilla configurada
// en el dashboard de Web3Forms (sin backend propio). La access key es pública
// a propósito — Web3Forms la diseñó para usarse en código de cliente.
const WEB3FORMS_ACCESS_KEY = 'b70b0dcc-a865-4ca3-ade1-bad3dee92870'

export default function ContactForm({ defaultProject }: Props) {
  const [form, setForm] = useState<ContactFormData>({ ...initial, project: defaultProject ?? '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nuevo contacto desde la web — ${form.project || 'Condes Corporación'}`,
          from_name: form.fullName,
          name: form.fullName,
          email: form.email,
          telefono: form.phone,
          proyecto_de_interes: form.project,
          metodo_de_contacto_preferido: form.contactMethod === 'phone' ? 'Teléfono' : 'Correo',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 size={48} className="text-brand-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl text-gray-900 mb-2">¡Mensaje recibido!</h3>
        <p className="font-body text-gray-500 text-sm">Un asesor se comunicará contigo en menos de 24 horas.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ ...initial, project: defaultProject ?? '' }) }}
          className="mt-6 text-brand-600 text-sm font-body font-medium hover:text-brand-700 transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 font-body font-medium mb-1.5 tracking-wide">Nombre y Apellido</label>
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Ej. Juan Flores"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:scale-[1.01] transition-all" />
      </div>

      <div>
        <label className="block text-xs text-gray-500 font-body font-medium mb-1.5 tracking-wide">Proyecto de interés</label>
        <select name="project" value={form.project} onChange={handleChange} required
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-brand-500 focus:scale-[1.01] transition-all bg-white">
          <option value="">Elija su proyecto</option>
          {visibleProjects.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 font-body font-medium mb-1.5 tracking-wide">Correo electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="correo@email.com"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:scale-[1.01] transition-all" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-body font-medium mb-1.5 tracking-wide">Teléfono</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+51 999 000 000"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-body text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:scale-[1.01] transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 font-body font-medium mb-2 tracking-wide">¿Cómo te gustaría ser contactado?</label>
        <div className="flex gap-3">
          {(['phone', 'email'] as const).map((method) => (
            <label key={method} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer text-sm font-body transition-all duration-200 ${
              form.contactMethod === method ? 'border-brand-600 bg-brand-50 text-brand-700 scale-[1.02]' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:scale-[1.02]'
            }`}>
              <input type="radio" name="contactMethod" value={method} checked={form.contactMethod === method} onChange={handleChange} className="sr-only" />
              {method === 'phone' ? 'Teléfono' : 'Correo'}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 font-body bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <AlertCircle size={16} className="shrink-0" />
          No se pudo enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full rounded-full bg-brand-600 text-white py-4 text-sm font-body font-medium tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-brand-700 hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100 active:scale-[0.99]">
        {loading ? <span className="animate-pulse">Enviando...</span> : <><span>Enviar</span><ArrowRight size={15} /></>}
      </button>

      <p className="text-xs text-gray-400 font-body text-center">
        Al enviar, aceptas nuestra{' '}
        <Link to="/politica-de-privacidad" className="underline hover:text-brand-600 transition-colors">
          política de privacidad
        </Link>.
      </p>
    </form>
  )
}
