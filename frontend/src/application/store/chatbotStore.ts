import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─────────────────────────────────────────────
// TIPOS EXPORTADOS
// ─────────────────────────────────────────────

export type EstadoChat = "listo" | "procesando" | "error" | "rateLimit";
export type RolMensaje = "usuario" | "asistente";

export interface ChatMensaje {
  id: string;
  rol: RolMensaje;
  contenido: string;
  timestamp: number;
  esCargando?: boolean;
}

export interface FiltrosInmueble {
  tipoInmueble?: "casa" | "departamento" | "terreno" | "local" | "oficina";
  tipoTransaccion?: "venta" | "alquiler";
  precioMin?: number;
  precioMax?: number;
  habitaciones?: number;
  ubicacion?: string;
  metrosMax?: number;
}

// ─────────────────────────────────────────────
// SHAPE DEL STORE
// ─────────────────────────────────────────────

interface ChatbotState {
  estaAbierto: boolean;
  estado: EstadoChat;
  mensajeError: string | null;
  mensajes: ChatMensaje[];
  estaEscribiendo: boolean;
  filtrosExtraidos: FiltrosInmueble | null;

  toggleChat: () => void;
  setChatAbierto: (v: boolean) => void;

  setEstado: (e: EstadoChat) => void;
  setError: (msg: string) => void;
  limpiarError: () => void;

  agregarMensaje: (
    rol: RolMensaje,
    contenido: string,
    opts?: { esCargando?: boolean }
  ) => string;
  actualizarMensaje: (id: string, cambios: Partial<ChatMensaje>) => void;
  eliminarMensaje: (id: string) => void;
  setEstaEscribiendo: (v: boolean) => void;

  setFiltrosExtraidos: (f: FiltrosInmueble | null) => void;
  limpiarFiltros: () => void;

  /**
   * NUEVO — Reset completo: limpia mensajes Y filtros en una sola acción atómica.
   * Usado cuando el usuario pide "empezar de cero" y el modelo detecta intención
   * de reinicio (campo reiniciar: true en el JSON).
   */
  reiniciarChat: () => void;
}

// ─────────────────────────────────────────────
// IMPLEMENTACIÓN
// ─────────────────────────────────────────────

function uid(): string {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const useChatbotStore = create<ChatbotState>()(
  devtools(
    (set) => ({
      estaAbierto: false,
      estado: "listo",
      mensajeError: null,
      mensajes: [],
      estaEscribiendo: false,
      filtrosExtraidos: null,

      toggleChat: () =>
        set((s) => ({ estaAbierto: !s.estaAbierto }), false, "toggleChat"),
      setChatAbierto: (v) =>
        set({ estaAbierto: v }, false, "setChatAbierto"),

      setEstado: (e) =>
        set({ estado: e }, false, `setEstado/${e}`),
      setError: (msg) =>
        set({ estado: "error", mensajeError: msg }, false, "setError"),
      limpiarError: () =>
        set({ estado: "listo", mensajeError: null }, false, "limpiarError"),

      agregarMensaje: (rol, contenido, opts = {}) => {
        const id = uid();
        set(
          (s) => ({
            mensajes: [
              ...s.mensajes,
              { id, rol, contenido, timestamp: Date.now(), esCargando: opts.esCargando ?? false },
            ],
          }),
          false,
          `agregarMensaje/${rol}`
        );
        return id;
      },

      actualizarMensaje: (id, cambios) =>
        set(
          (s) => ({
            mensajes: s.mensajes.map((m) =>
              m.id === id ? { ...m, ...cambios } : m
            ),
          }),
          false,
          "actualizarMensaje"
        ),

      eliminarMensaje: (id) =>
        set(
          (s) => ({ mensajes: s.mensajes.filter((m) => m.id !== id) }),
          false,
          "eliminarMensaje"
        ),

      setEstaEscribiendo: (v) =>
        set({ estaEscribiendo: v }, false, "setEstaEscribiendo"),

      setFiltrosExtraidos: (f) =>
        set({ filtrosExtraidos: f }, false, "setFiltros"),
      limpiarFiltros: () =>
        set({ filtrosExtraidos: null }, false, "limpiarFiltros"),

      reiniciarChat: () =>
        set(
          { mensajes: [], filtrosExtraidos: null, mensajeError: null, estado: "listo" },
          false,
          "reiniciarChat"
        ),
    }),
    { name: "ChatbotStore" }
  )
);

// ─────────────────────────────────────────────
// SELECTORES
// ─────────────────────────────────────────────

export const selectPuedeEscribir = (s: ChatbotState): boolean =>
  s.estado === "listo" && !s.estaEscribiendo;

export const selectFiltros = (s: ChatbotState): FiltrosInmueble | null =>
  s.filtrosExtraidos;
