import { Link } from 'react-router-dom'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Button } from '@/presentation/components/ui/Botones'

interface PropiedadesSimilaresProps {
  propiedades: Propiedad[]
  propiedadActualId: string
}

export const PropiedadesSimilares = ({ propiedades, propiedadActualId }: PropiedadesSimilaresProps) => {
  const similares = propiedades.filter((p) => p.id !== propiedadActualId).slice(0, 3)

  if (similares.length === 0) {
    return null
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div className="mt-10 pt-6 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Propiedades similares</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similares.map((prop) => (
          <div key={prop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-40 overflow-hidden bg-gray-200">
              <img
                src={prop.imagenes[0] || 'https://picsum.photos/seed/default/400/300'}
                alt={prop.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h4 className="font-bold text-gray-800 truncate">{prop.titulo}</h4>
              <p className="text-primary font-semibold">{formatearPrecio(prop.precio)}</p>
              <p className="text-gray-500 text-sm">{prop.ubicacion.ciudad}</p>
              <Link to={`/propiedad/${prop.id}`} className="mt-2 inline-block w-full">
                <Button variant="outline" size="pq" className="w-full">
                  Ver detalle
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}