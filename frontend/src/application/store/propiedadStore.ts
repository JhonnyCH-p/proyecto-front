import { create } from 'zustand'
import { Propiedad } from '@/domain/entities/Propiedad'
import { propiedadApi } from '@/infrastructure/api/propiedadApi'
import { propiedadesMock } from '@/infrastructure/mocks/propiedadesMock'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export interface Filtros {
  tipoTransaccion?: 'venta' | 'alquiler'
  tipoInmueble?: string
  precioMin?: number
  precioMax?: number
  habitaciones?: number
  ciudad?: string
  busqueda?: string
}

interface PropiedadState {
  // Estado
  propiedades: Propiedad[]
  propiedadesFiltradas: Propiedad[]
  filtros: Filtros
  loading: boolean
  error: string | null

  // Paginación
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number

  // Acciones
  setPropiedades: (props: Propiedad[]) => void
  setFiltros: (filtros: Partial<Filtros>) => void
  aplicarFiltros: () => void
  limpiarFiltros: () => void
  setPage: (page: number) => void

  // Acciones asíncronas
  fetchPropiedades: () => Promise<void>
  fetchPropiedadPorId: (id: string) => Promise<Propiedad | null>
}

export const usePropiedadStore = create<PropiedadState>((set, get) => ({
  // Estado inicial
  propiedades: [],
  propiedadesFiltradas: [],
  filtros: {},
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 6,
  totalItems: 0,
  totalPages: 0,

  // Acciones
  setPropiedades: (propiedades) => {
    set({ propiedades })
    get().aplicarFiltros()
  },

  setFiltros: (nuevosFiltros) => {
    set((state) => ({
      filtros: { ...state.filtros, ...nuevosFiltros },
      currentPage: 1, // Resetear página al cambiar filtros
    }))
    get().aplicarFiltros()
  },

  aplicarFiltros: () => {
    const { propiedades, filtros, currentPage, itemsPerPage } = get()

    // Aplicar filtros
    let filtradas = [...propiedades]

    if (filtros.tipoTransaccion) {
      filtradas = filtradas.filter(
        (p) => p.tipoTransaccion === filtros.tipoTransaccion
      )
    }

    if (filtros.tipoInmueble) {
      filtradas = filtradas.filter((p) => p.tipoInmueble === filtros.tipoInmueble)
    }

    if (filtros.precioMin !== undefined) {
      filtradas = filtradas.filter((p) => p.precio >= filtros.precioMin!)
    }

    if (filtros.precioMax !== undefined) {
      filtradas = filtradas.filter((p) => p.precio <= filtros.precioMax!)
    }

    if (filtros.habitaciones) {
      filtradas = filtradas.filter((p) => p.habitaciones >= filtros.habitaciones!)
    }

    if (filtros.ciudad) {
      filtradas = filtradas.filter(
        (p) => p.ubicacion.ciudad.toLowerCase() === filtros.ciudad?.toLowerCase()
      )
    }

    if (filtros.busqueda) {
      const term = filtros.busqueda.toLowerCase()
      filtradas = filtradas.filter(
        (p) =>
          p.titulo.toLowerCase().includes(term) ||
          p.descripcion.toLowerCase().includes(term)
      )
    }

    // Paginación
    const totalItems = filtradas.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginadas = filtradas.slice(start, end)

    set({
      propiedadesFiltradas: paginadas,
      totalItems,
      totalPages,
    })
  },

  limpiarFiltros: () => {
    set({ filtros: {}, currentPage: 1 })
    get().aplicarFiltros()
  },

  setPage: (page) => {
    const { totalPages } = get()
    if (page < 1 || page > totalPages) return
    set({ currentPage: page })
    get().aplicarFiltros()
  },

  // Acciones asíncronas
  fetchPropiedades: async () => {
    set({ loading: true, error: null })

    try {
      let data: Propiedad[]

      if (USE_MOCKS) {
        data = propiedadesMock
      } else {
        const { filtros, currentPage, itemsPerPage } = get()
        data = await propiedadApi.obtenerTodas(filtros, currentPage, itemsPerPage)
      }

      set({ propiedades: data })
      get().aplicarFiltros()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar propiedades' })
    } finally {
      set({ loading: false })
    }
  },

  fetchPropiedadPorId: async (id: string) => {
    set({ loading: true, error: null })

    try {
      let data: Propiedad

      if (USE_MOCKS) {
        const mock = propiedadesMock.find((p) => p.id === id)
        if (!mock) throw new Error('Propiedad no encontrada')
        data = mock
      } else {
        data = await propiedadApi.obtenerPorId(id)
      }

      return data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar la propiedad' })
      return null
    } finally {
      set({ loading: false })
    }
  },
}))