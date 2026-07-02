import { Propiedad } from '@/domain/entities/Propiedad'

interface InfoPropiedadProps {
  propiedad: Propiedad
}

export const InfoPropiedad = ({ propiedad }: InfoPropiedadProps) => {
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{propiedad.titulo}</h1>
      <p className="text-primary text-2xl font-bold mt-2">{formatearPrecio(propiedad.precio)}</p>
      <p className="text-gray-600 mt-2">
        {propiedad.ubicacion.direccion}, {propiedad.ubicacion.ciudad}
      </p>

      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
          {propiedad.habitaciones} hab.
        </span>
        <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
          {propiedad.banos} baños
        </span>
        <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
          {propiedad.areaTotal} m²
        </span>
        <span className="bg-gray-100 px-3 py-1.5 rounded-lg capitalize">
          {propiedad.tipoTransaccion}
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Descripción</h3>
        <p className="text-gray-700 leading-relaxed">{propiedad.descripcion}</p>
      </div>
    </div>
  )
}