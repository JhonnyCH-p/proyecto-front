import { Asesor } from '@/domain/entities/Asesor'
import { apiClient } from './client'

export const asesorApi = {
  obtenerTodos: async (): Promise<Asesor[]> => {
    return apiClient.get<Asesor[]>('/asesores')
  },

  obtenerPorId: async (id: string): Promise<Asesor> => {
    return apiClient.get<Asesor>(`/asesores/${id}`)
  },

  obtenerPropiedades: async (id: string): Promise<Asesor[]> => {
    return apiClient.get<Asesor[]>(`/asesores/${id}/propiedades`)
  },
}