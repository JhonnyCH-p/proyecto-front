import { create } from 'zustand'

interface UIState {
  sidebarAbierto: boolean
  alternarSidebar: () => void
  cerrarSidebar: () => void
  abrirSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarAbierto: false,
  alternarSidebar: () => set((state) => ({ sidebarAbierto: !state.sidebarAbierto })),
  cerrarSidebar: () => set({ sidebarAbierto: false }),
  abrirSidebar: () => set({ sidebarAbierto: true }),
}))