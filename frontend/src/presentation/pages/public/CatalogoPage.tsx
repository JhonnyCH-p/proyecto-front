import { useEffect } from 'react'
import { usePropiedades } from '@/application/hooks/usePropiedades'
import { PropiedadCard } from '@/presentation/components/shared/PropiedadCard'
import { Filtros } from '@/presentation/components/shared/Filtros'
import { Paginacion } from '@/presentation/components/shared/Paginacion'

export const CatalogoPage = () => {
  const { propiedades, loading, error, currentPage, totalPages, fetchPropiedades, setPage } =
    usePropiedades()

  useEffect(() => {
    fetchPropiedades()
  }, [])

  if (loading && propiedades.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-500">Cargando propiedades...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Error al cargar las propiedades</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button
            onClick={() => fetchPropiedades()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Propiedades</h1>
      <p className="text-gray-600 mb-6">
        {propiedades.length} propiedades encontradas
      </p>

      <Filtros />

      {propiedades.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No se encontraron propiedades con los filtros seleccionados.</p>
          <p className="text-sm text-gray-400">Prueba ajustando los filtros de búsqueda.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((prop) => (
              <PropiedadCard key={prop.id} propiedad={prop} />
            ))}
          </div>

          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}