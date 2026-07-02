import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Button } from '@/presentation/components/ui/Botones'
import { GaleriaImagenes } from '@/presentation/components/propiedad/GaleriaImagenes'
import { InfoPropiedad } from '@/presentation/components/propiedad/InfoPropiedad'
import { ContactoForm } from '@/presentation/components/propiedad/ContactoForm'
import { PropiedadesSimilares } from '@/presentation/components/propiedad/PropiedadesSimilares'

export const DetallePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { propiedades, fetchPropiedadPorId, loading } = usePropiedadStore()
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarPropiedad = async () => {
      if (!id) {
        setError('ID de propiedad no válido')
        return
      }

      // Buscar en el store primero
      const existente = propiedades.find((p) => p.id === id)
      if (existente) {
        setPropiedad(existente)
        return
      }

      // Si no existe, cargar desde API/mocks
      const result = await fetchPropiedadPorId(id)
      if (result) {
        setPropiedad(result)
      } else {
        setError('Propiedad no encontrada')
      }
    }

    cargarPropiedad()
  }, [id, propiedades])

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-500">Cargando propiedad...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !propiedad) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700">{error || 'Propiedad no encontrada'}</h2>
        <Button className="mt-4" onClick={() => navigate('/propiedades')}>
          Volver al catálogo
        </Button>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Galería (ocupa 2 columnas en desktop) */}
        <div className="lg:col-span-2">
          <GaleriaImagenes imagenes={propiedad.imagenes} titulo={propiedad.titulo} />
        </div>

        {/* Info y contacto (1 columna) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <InfoPropiedad propiedad={propiedad} />
          </div>
          <ContactoForm propiedadId={propiedad.id} propiedadTitulo={propiedad.titulo} />
        </div>
      </div>

      {/* Propiedades similares */}
      <PropiedadesSimilares propiedades={propiedades} propiedadActualId={propiedad.id} />
    </div>
  )
}