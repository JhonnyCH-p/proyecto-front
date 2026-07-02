import { useEffect } from 'react'
import { usePropiedadStore } from '../store/propiedadStore'

export const usePropiedades = () => {
  const {
    propiedadesFiltradas,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchPropiedades,
    setPage,
  } = usePropiedadStore()

  useEffect(() => {
    fetchPropiedades()
  }, [])

  return {
    propiedades: propiedadesFiltradas,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchPropiedades,
    setPage,
  }
}