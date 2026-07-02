import { Propiedad } from '@/domain/entities/Propiedad'
import { apiClient } from './client'
import { Filtros } from '@/application/store/propiedadStore'

export const propiedadApi = {
  obtenerTodas: async (filtros?: Filtros, page?: number, limit?: number): Promise<Propiedad[]> => {
    const params = new URLSearchParams()

    if (filtros?.tipoTransaccion) {
      params.append('tipoTransaccion', filtros.tipoTransaccion)
    }
    if (filtros?.tipoInmueble) {
      params.append('tipoInmueble', filtros.tipoInmueble)
    }
    if (filtros?.precioMin !== undefined) {
      params.append('precioMin', String(filtros.precioMin))
    }
    if (filtros?.precioMax !== undefined) {
      params.append('precioMax', String(filtros.precioMax))
    }
    if (filtros?.habitaciones) {
      params.append('habitaciones', String(filtros.habitaciones))
    }
    if (filtros?.ciudad) {
      params.append('ciudad', filtros.ciudad)
    }
    if (filtros?.busqueda) {
      params.append('busqueda', filtros.busqueda)
    }
    if (page) {
      params.append('page', String(page))
    }
    if (limit) {
      params.append('limit', String(limit))
    }

    const query = params.toString()
    const endpoint = `/propiedades${query ? `?${query}` : ''}`

    return apiClient.get<Propiedad[]>(endpoint)
  },

  obtenerPorId: async (id: string): Promise<Propiedad> => {
    return apiClient.get<Propiedad>(`/propiedades/${id}`)
  },

  obtenerDestacadas: async (): Promise<Propiedad[]> => {
    return apiClient.get<Propiedad[]>('/propiedades/destacadas')
  },

  obtenerSimilares: async (id: string, limit: number = 3): Promise<Propiedad[]> => {
    return apiClient.get<Propiedad[]>(`/propiedades/${id}/similares?limit=${limit}`)
  },
}