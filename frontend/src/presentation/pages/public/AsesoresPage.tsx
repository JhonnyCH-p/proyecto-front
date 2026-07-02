import { useEffect } from 'react'
import { useAsesorStore } from '@/application/store/asesorStore'
import { AsesorCard } from '@/presentation/components/shared/AsesorCard'
import { asesoresMock } from '@/infrastructure/mocks/asesoresMock'

export const AsesoresPage = () => {
  const { asesores, setAsesores } = useAsesorStore()

  useEffect(() => {
    if (asesores.length === 0) {
      setAsesores(asesoresMock)
    }
  }, [asesores.length, setAsesores])

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nuestros Asesores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {asesores.map((asesor) => (
          <AsesorCard key={asesor.id} asesor={asesor} />
        ))}
      </div>
    </div>
  )
}