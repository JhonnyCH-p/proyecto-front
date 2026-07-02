import { useEffect, useState } from 'react'
import { useFiltros } from '@/application/hooks/useFiltros'
import { useDebounce } from '@/application/hooks/useDebounce'
import { Input } from '@/presentation/components/ui/Entrada'
import { Button } from '@/presentation/components/ui/Botones'

export const Filtros = () => {
  const { filtros, setFiltros, limpiarFiltros } = useFiltros()
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda || '')
  const debouncedBusqueda = useDebounce(busquedaLocal, 500)

  // Aplicar búsqueda cuando cambie el debounce
  useEffect(() => {
    setFiltros({ busqueda: debouncedBusqueda || undefined })
  }, [debouncedBusqueda])
  

  const tiposInmueble = ['casa', 'departamento', 'terreno', 'oficina']
  const ciudades = ['Guayaquil', 'Samborondón', 'Daule', 'Durán']

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda por texto */}
        <div>
          <Input
            label="Buscar"
            placeholder="Escribe lo que buscas..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
          />
        </div>

        {/* Tipo de transacción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transacción
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filtros.tipoTransaccion || ''}
            onChange={(e) => setFiltros({ tipoTransaccion: e.target.value as 'venta' | 'alquiler' || undefined })}
          >
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* Tipo de inmueble */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de inmueble
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filtros.tipoInmueble || ''}
            onChange={(e) => setFiltros({ tipoInmueble: e.target.value || undefined })}
          >
            <option value="">Todos</option>
            {tiposInmueble.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filtros.ciudad || ''}
            onChange={(e) => setFiltros({ ciudad: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segunda fila: Precio y habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {/* Precio mínimo */}
        <div>
          <Input
            label="Precio mínimo"
            type="number"
            placeholder="$0"
            value={filtros.precioMin || ''}
            onChange={(e) => setFiltros({ precioMin: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {/* Precio máximo */}
        <div>
          <Input
            label="Precio máximo"
            type="number"
            placeholder="$999,999"
            value={filtros.precioMax || ''}
            onChange={(e) => setFiltros({ precioMax: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {/* Habitaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Habitaciones (mínimo)
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filtros.habitaciones || 0}
            onChange={(e) => setFiltros({ habitaciones: Number(e.target.value) || undefined })}
          >
            <option value={0}>Cualquiera</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
          </select>
        </div>

        {/* Botón limpiar */}
        <div className="flex items-end">
          <Button variant="outline" size="pq" onClick={limpiarFiltros} className="w-full">
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  )
}