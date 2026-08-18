import { CONTACT } from '../data'
import { usePageMeta } from '../hooks/usePageMeta'

const LAST_UPDATED = '18 de agosto de 2026'

export default function Privacy() {
  usePageMeta(
    'Política de Privacidad — Condes Corporación',
    'Cómo Condes Corporación recopila, usa y protege tus datos personales al contactarnos a través de este sitio.'
  )

  return (
    <div>
      {/* Header — llega hasta el tope real de la página para quedar detrás del navbar transparente */}
      <section className="bg-gray-900 pt-36 pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <p className="text-brand-400 text-xs font-body font-semibold tracking-[0.25em] uppercase mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Política de Privacidad</h1>
          <p className="font-body text-gray-400 text-sm">Última actualización: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 font-body text-gray-600 leading-relaxed space-y-10">
          <p>
            En Condes Corporación respetamos tu privacidad y nos comprometemos a proteger los datos personales que nos
            confías. Esta política explica qué información recopilamos cuando usas este sitio web, para qué la usamos
            y cuáles son tus derechos, en línea con la Ley N° 29733, Ley de Protección de Datos Personales del Perú, y
            su reglamento.
          </p>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">1. Responsable del tratamiento</h2>
            <p>
              Condes Corporación, con domicilio en {CONTACT.address}, Arequipa, Perú, es responsable del tratamiento
              de los datos personales que recopila a través de este sitio web.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">2. Qué datos recopilamos</h2>
            <p className="mb-3">Cuando completas el formulario de contacto de este sitio, recopilamos:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Nombre y apellido</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Proyecto inmobiliario de tu interés y método de contacto preferido</li>
            </ul>
            <p className="mt-3">
              No recopilamos datos personales a través de cookies de seguimiento ni herramientas de analítica en este
              sitio. Si en el futuro incorporamos ese tipo de tecnología, actualizaremos esta política para
              informarlo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">3. Para qué usamos tus datos</h2>
            <p className="mb-3">Usamos la información que nos das únicamente para:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Contactarte y brindarte asesoría sobre el proyecto que te interesa</li>
              <li>Responder tus consultas por correo, teléfono o WhatsApp</li>
              <li>Llevar un registro interno de nuestros contactos comerciales</li>
            </ul>
            <p className="mt-3">
              No usamos tus datos para fines distintos a los indicados, ni los vendemos ni cedemos a terceros con
              fines comerciales o publicitarios.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">4. Con quién compartimos tu información</h2>
            <p>
              El formulario de contacto de este sitio utiliza Web3Forms, un servicio externo que procesa el envío del
              formulario y lo entrega a nuestra casilla de correo. Web3Forms actúa como encargado del tratamiento
              únicamente para ese fin — no usa tus datos con otro propósito. Fuera de este proveedor, no compartimos
              tu información con terceros, salvo que la ley nos obligue a hacerlo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">5. Cuánto tiempo conservamos tus datos</h2>
            <p>
              Conservamos tus datos de contacto mientras exista una relación comercial activa o potencial contigo, y
              los eliminamos cuando ya no son necesarios para los fines descritos, salvo que debamos conservarlos por
              una obligación legal.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">6. Tus derechos (ARCO)</h2>
            <p>
              Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales (derechos
              ARCO), así como a revocar el consentimiento que nos hayas dado. Para ejercer cualquiera de estos
              derechos, escríbenos a{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-brand-600 hover:text-brand-700 underline">
                {CONTACT.email}
              </a>{' '}
              indicando tu solicitud.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">7. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Si hacemos cambios importantes, actualizaremos la fecha
              al inicio de esta página.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-gray-900 mb-3">8. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política o sobre cómo tratamos tus datos, contáctanos:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Correo: <a href={`mailto:${CONTACT.email}`} className="text-brand-600 hover:text-brand-700 underline">{CONTACT.email}</a></li>
              <li>Teléfono: <a href={`tel:${CONTACT.phone}`} className="text-brand-600 hover:text-brand-700 underline">{CONTACT.phone}</a></li>
              <li>Dirección: {CONTACT.address}, Arequipa, Perú</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
