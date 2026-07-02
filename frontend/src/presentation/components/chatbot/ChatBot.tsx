import { useEffect, useRef } from "react";
import { MessageCircle, X, AlertCircle, RefreshCw, Bot, RotateCcw } from "lucide-react";

import { useChatbotStore } from "../../store/chatbotStore";
import { useGroq } from "../../hooks/useGroq";
import { ChatMensaje } from "./ChatMensaje";
import { ChatInput } from "./ChatInput";

interface Props {
  embebido?: boolean;
}

const MENSAJE_BIENVENIDA =
  "¡Hola! Soy tu asistente de bienes raíces en Guayaquil. " +
  "Cuéntame qué propiedad buscas y filtro el catálogo por ti. " +
  "Puedes decirme, por ejemplo: 'casa en venta en el norte, máximo 200k'.";

export function ChatBot({ embebido = false }: Props) {
  const {
    estaAbierto,
    toggleChat,
    estado,
    mensajeError,
    mensajes,
    limpiarError,
    agregarMensaje,
    reiniciarChat,
  } = useChatbotStore();

  const { enviarMensaje } = useGroq();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bienvenidaRef = useRef(false);

  // Inicialización limpia del primer saludo
  useEffect(() => {
    const debeInicializar = embebido || estaAbierto;
    if (debeInicializar && !bienvenidaRef.current && mensajes.length === 0) {
      bienvenidaRef.current = true;
      agregarMensaje("asistente", MENSAJE_BIENVENIDA);
    }
  }, [estaAbierto, embebido, mensajes.length, agregarMensaje]);

  // Auto-scroll fluido al recibir nuevos mensajes o estados de escritura
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes, estado]);

  /** Reset manual desde el botón del header — SOLUCIÓN AL BUG DE DUPLICIDAD */
  const handleReiniciar = () => {
    bienvenidaRef.current = true; // Bloquea el useEffect para que no se cruce
    reiniciarChat();
    agregarMensaje("asistente", MENSAJE_BIENVENIDA); // Se agrega inmediatamente en un solo ciclo de renderizado
  };

  if (embebido) {
    return (
      <div className="flex flex-col h-full">
        <PanelHeader estado={estado} onReiniciar={handleReiniciar} />
        <BannerError estado={estado} mensajeError={mensajeError} onReintentar={limpiarError} />
        <ListaMensajes scrollRef={scrollRef} mensajes={mensajes} estado={estado} />
        <ChatInput onEnviar={enviarMensaje} />
      </div>
    );
  }

  return (
    <>
      {estaAbierto && (
        <div
          className="fixed bottom-20 right-4 z-50
                     w-[350px] sm:w-[380px]
                     flex flex-col
                     bg-white rounded-2xl shadow-2xl border border-slate-200
                     overflow-hidden"
          style={{ maxHeight: "min(580px, calc(100vh - 100px))" }}
        >
          <PanelHeader estado={estado} onCerrar={toggleChat} onReiniciar={handleReiniciar} />
          <BannerError estado={estado} mensajeError={mensajeError} onReintentar={limpiarError} />
          <ListaMensajes scrollRef={scrollRef} mensajes={mensajes} estado={estado} />
          <ChatInput onEnviar={enviarMensaje} />
        </div>
      )}
      <button
        onClick={toggleChat}
        aria-label={estaAbierto ? "Cerrar asistente" : "Abrir asistente inmobiliario"}
        className="fixed bottom-4 right-4 z-50
                   w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg
                   flex items-center justify-center
                   hover:bg-blue-600 hover:scale-105 active:scale-95
                   transition-all duration-200"
      >
        {estaAbierto ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}

// ─────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────

function PanelHeader({
  estado,
  onCerrar,
  onReiniciar,
}: {
  estado: string;
  onCerrar?: () => void;
  onReiniciar: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-blue-500 flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm leading-none">Asistente Inmobiliario</p>
        <p className="text-blue-100 text-xs mt-0.5">
          {estado === "procesando" ? "Escribiendo..." : "En línea · IA con Groq"}
        </p>
      </div>

      <button
        onClick={onReiniciar}
        aria-label="Reiniciar conversación y filtros"
        title="Nueva búsqueda"
        className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center
                   transition-colors group"
      >
        <RotateCcw size={14} className="text-white/70 group-hover:text-white transition-colors" />
      </button>

      {onCerrar && (
        <button
          onClick={onCerrar}
          aria-label="Cerrar chat"
          className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-white" />
        </button>
      )}
    </div>
  );
}

function BannerError({
  estado,
  mensajeError,
  onReintentar,
}: {
  estado: string;
  mensajeError: string | null;
  onReintentar: () => void;
}) {
  if (estado !== "error" && estado !== "rateLimit") return null;
  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border-b border-red-100 text-xs text-red-700 flex-shrink-0">
      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
      <span className="flex-1">{mensajeError ?? "Error de conexión."}</span>
      {estado === "error" && (
        <button onClick={onReintentar} aria-label="Reintentar" className="flex-shrink-0 hover:text-red-900 transition-colors">
          <RefreshCw size={13} />
        </button>
      )}
    </div>
  );
}

// ANIMACIÓN COMPORTAMIENTO SPRINT 1: Inyección de burbuja interactiva de rebote
function ListaMensajes({
  scrollRef,
  mensajes,
  estado,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  mensajes: ReturnType<typeof useChatbotStore.getState>["mensajes"];
  estado: string;
}) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth"
      style={{ minHeight: "180px" }}
    >
      {mensajes.map((msg) => (
        // Filtrar burbujas fantasmas vacías de carga, ya manejamos la animación abajo por estado
        !msg.esCargando && <ChatMensaje key={msg.id} mensaje={msg} />
      ))}

      {/* Indicador visual animado con Tailwind CSS de tres puntos saltarines */}
      {estado === "procesando" && (
        <div className="flex justify-start items-center mb-2">
          <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-none px-4 py-2.5 flex gap-1.5 items-center shadow-sm">
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-duration:0.8s]"></span>
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
          </div>
        </div>
      )}
    </div>
  );
}
