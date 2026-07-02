import { create } from 'zustand'
import { Asesor } from '@/domain/entities/Asesor'

interface AsesorState {
  asesores: Asesor[]
  asesorSeleccionado: Asesor | null
  setAsesores: (asesores: Asesor[]) => void
  setAsesorSeleccionado: (asesor: Asesor | null) => void
}

export const useAsesorStore = create<AsesorState>((set) => ({
  asesores: [],
  asesorSeleccionado: null,
  setAsesores: (asesores) => set({ asesores }),
  setAsesorSeleccionado: (asesor) => set({ asesorSeleccionado: asesor }),
}))