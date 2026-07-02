import { useMemo } from 'react'
import { usePropiedadStore } from '../store/propiedadStore'

export const useFiltros = () => {
  const { propiedadesFiltradas, filtros, setFiltros, limpiarFiltros, totalItems } =
    usePropiedadStore()

  const resultados = useMemo(() => propiedadesFiltradas, [propiedadesFiltradas])

  return {
    resultados,
    filtros,
    setFiltros,
    limpiarFiltros,
    total: totalItems,
  }
}