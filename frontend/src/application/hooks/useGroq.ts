import { useCallback, useRef } from "react";
import Groq from "groq-sdk";

import { useChatbotStore } from "@/application/store/chatbotStore";
import type { FiltrosInmueble } from "@/application/store/chatbotStore";
import {
  groqClient,
  GROQ_MODEL,
  GROQ_PARAMS,
  SYSTEM_PROMPT,
  sanitizarRespuestaGroq,
} from "@/infrastructure/services/groqConfig";

const TIMEOUT_MS = 20_000;

const MENSAJE_BIENVENIDA =
  "¡Hola! Soy tu asistente de bienes raíces en Guayaquil. " +
  "Cuéntame qué propiedad buscas y filtro el catálogo por ti en tiempo real. " +
  "Puedes decirme, por ejemplo: 'casa en venta en Samborondón, máximo 280k'.";

export function useGroq() {
  const abortRef = useRef<AbortController | null>(null);

  const {
    setEstado,
    setError,
    agregarMensaje,
    actualizarMensaje,
    eliminarMensaje,
    setEstaEscribiendo,
    setFiltrosExtraidos,
    limpiarFiltros,
    reiniciarChat,
    mensajes,
  } = useChatbotStore();

  const enviarMensaje = useCallback(
    async (textoUsuario: string) => {
      const estadoActual = useChatbotStore.getState().estado;
      if (estadoActual === "procesando") return;

      setEstado("procesando");
      setEstaEscribiendo(true);
      agregarMensaje("usuario", textoUsuario);
      const idBurbuja = agregarMensaje("asistente", "", { esCargando: true });

      const historial = useChatbotStore.getState().mensajes;
      const mensajesParaGroq = historial
        .filter((m) => !m.esCargando)
        .map((m) => ({
          role: m.rol === "asistente" ? ("assistant" as const) : ("user" as const),
          content: m.contenido,
        }));

      abortRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortRef.current?.abort(), TIMEOUT_MS);

      try {
        const completion = await groqClient.chat.completions.create(
          {
            model: GROQ_MODEL,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...mensajesParaGroq,
            ],
            response_format: { type: "json_object" },
            ...GROQ_PARAMS,
          },
          { signal: abortRef.current.signal }
        );

        clearTimeout(timeoutId);

        const contenidoCrudo = completion.choices[0]?.message?.content ?? "{}";
        const respuesta = sanitizarRespuestaGroq(JSON.parse(contenidoCrudo));

        // ── BUG FIX C: reiniciar detectado → reset completo ───────────────
        if (respuesta.reiniciar) {
          reiniciarChat();
          // Agregar el mensaje de bienvenida del modelo después del reset
          agregarMensaje("asistente", respuesta.respuestaAmigable || MENSAJE_BIENVENIDA);
          setEstado("listo");
          return;
        }

        // ── Actualizar burbuja temporal con respuesta real ────────────────
        actualizarMensaje(idBurbuja, {
          contenido: respuesta.respuestaAmigable,
          esCargando: false,
        });

        if (respuesta.hayFiltros) {
          // ── BUG FIX A: fusión acumulativa de filtros ──────────────────
          // Tomamos los filtros actuales del store y hacemos merge con los nuevos.
          // Solo sobreescribimos los campos que el modelo devolvió con valor real
          // (no undefined). Así "para comprar" no borra "3 habitaciones".
          const filtrosActuales = useChatbotStore.getState().filtrosExtraidos ?? {};

          const { respuestaAmigable: _r, hayFiltros: _h, reiniciar: _ri, ...camposNuevos } = respuesta;

          // Construir objeto de filtros fusionado
          const filtrosFusionados: FiltrosInmueble = { ...filtrosActuales };

          // Solo aplicar los campos que el modelo realmente extrajo (no undefined)
          if (camposNuevos.tipoInmueble   !== undefined) filtrosFusionados.tipoInmueble   = camposNuevos.tipoInmueble;
          if (camposNuevos.tipoTransaccion !== undefined) filtrosFusionados.tipoTransaccion = camposNuevos.tipoTransaccion;
          if (camposNuevos.precioMin       !== undefined) filtrosFusionados.precioMin       = camposNuevos.precioMin;
          if (camposNuevos.precioMax       !== undefined) filtrosFusionados.precioMax       = camposNuevos.precioMax;
          if (camposNuevos.habitaciones    !== undefined) filtrosFusionados.habitaciones    = camposNuevos.habitaciones;
          if (camposNuevos.metrosMax       !== undefined) filtrosFusionados.metrosMax       = camposNuevos.metrosMax;
          if (camposNuevos.ubicacion       !== undefined) filtrosFusionados.ubicacion       = camposNuevos.ubicacion;

          const tieneDatos = Object.values(filtrosFusionados).some(
            (v) => v !== undefined && v !== null
          );
          setFiltrosExtraidos(tieneDatos ? filtrosFusionados : null);

        } else {
          // ── BUG FIX B: mensaje conversacional → limpiar filtros ───────
          // Si el modelo dijo hayFiltros: false (pregunta general, saludo, etc.)
          // limpiamos los filtros para que el catálogo vuelva a mostrar todo.
          limpiarFiltros();
        }

        setEstado("listo");
      } catch (error) {
        clearTimeout(timeoutId);
        eliminarMensaje(idBurbuja);

        if (error instanceof DOMException && error.name === "AbortError") {
          setError("La consulta tardó demasiado. Verifica tu conexión e intenta de nuevo.");
          return;
        }
        if (error instanceof Groq.RateLimitError) {
          setEstado("rateLimit");
          const retryAfter = (error as unknown as { headers?: Record<string, string> }).headers?.["retry-after"];
          const segundos = retryAfter ? parseInt(retryAfter, 10) : 60;
          agregarMensaje(
            "asistente",
            `Alcanzamos el límite de consultas del plan gratuito. Intenta de nuevo en ${segundos} segundos.`
          );
          setTimeout(() => setEstado("listo"), segundos * 1000);
          return;
        }
        if (error instanceof Groq.AuthenticationError) {
          setError("API Key de Groq inválida. Revisa el archivo .env.local.");
          return;
        }
        if (error instanceof Groq.APIError) {
          setError(`Error del servidor de Groq (${error.status}). Intenta en unos segundos.`);
          return;
        }
        const msg = error instanceof Error ? error.message : "Error desconocido.";
        setError(`No se pudo procesar la respuesta: ${msg}`);
      } finally {
        setEstaEscribiendo(false);
        abortRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mensajes]
  );

  const cancelarPeticion = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { enviarMensaje, cancelarPeticion };
}
