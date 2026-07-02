import { useState } from 'react'
import { Button } from '@/presentation/components/ui/Botones'

interface ContactoFormProps {
  propiedadId: string
  propiedadTitulo: string
}

export const ContactoForm = ({ propiedadId, propiedadTitulo }: ContactoFormProps) => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validación básica
    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      setLoading(false)
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Ingresa un correo válido')
      setLoading(false)
      return
    }

    if (mensaje.length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres')
      setLoading(false)
      return
    }

    try {
      // Simular envío (en producción, llamar a la API)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setEnviado(true)
      setNombre('')
      setEmail('')
      setTelefono('')
      setMensaje('')
    } catch (err) {
      setError('Error al enviar el mensaje. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-semibold text-lg">¡Mensaje enviado con éxito!</p>
        <p className="text-green-600 text-sm mt-2">
          El asesor se pondrá en contacto contigo pronto.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setEnviado(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Contactar Asesor</h3>
      <p className="text-sm text-gray-600 mb-4">
        ¿Te interesa esta propiedad? Completa el formulario y el asesor se pondrá en contacto contigo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="tel"
          placeholder="Tu teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          placeholder="Mensaje"
          rows={3}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue={`Consulto sobre: ${propiedadTitulo}`}
          required
          minLength={10}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button variant="primary" className="w-full" loading={loading}>
          Enviar mensaje
        </Button>
      </form>
    </div>
  )
}