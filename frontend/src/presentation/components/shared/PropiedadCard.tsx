import { Link } from 'react-router-dom'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Button } from '@/presentation/components/ui/Botones'

interface PropiedadCardProps {
  propiedad: Propiedad
  showActions?: boolean
}

export const PropiedadCard = ({ propiedad, showActions = false }: PropiedadCardProps) => {
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const tipoTransaccionLabel = propiedad.tipoTransaccion === 'venta' ? 'Venta' : 'Alquiler'

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={propiedad.imagenes[0] || 'https://picsum.photos/seed/default/400/300'}
          alt={propiedad.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge: Destacada */}
        {propiedad.destacada && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded">
            Destacada
          </span>
        )}
        {/* Badge: Tipo de transacción */}
        <span className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded">
          {tipoTransaccionLabel}
        </span>
        {showActions && (
          <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
            Tu propiedad
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{propiedad.titulo}</h3>
        <p className="text-primary font-bold text-xl mt-1">{formatearPrecio(propiedad.precio)}</p>
        <p className="text-gray-500 text-sm">{propiedad.ubicacion.ciudad}</p>

        <div className="flex gap-3 text-sm text-gray-600 mt-2">
          <span>{propiedad.habitaciones} hab.</span>
          <span>{propiedad.banos} baños</span>
          <span>{propiedad.areaTotal} m²</span>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Link to={`/propiedad/${propiedad.id}`} className="flex-1">
            <Button variant="primary" size="pq" className="w-full">
              Ver Detalle
            </Button>
          </Link>
          {showActions && (
            <>
              <Button variant="outline" size="pq">
                Editar
              </Button>
              <Button variant="danger" size="pq">
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}