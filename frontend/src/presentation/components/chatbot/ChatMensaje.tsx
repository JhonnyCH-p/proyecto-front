import { Bot, User } from "lucide-react";
import type { ChatMensaje as TChatMensaje } from "../../store/chatbotStore";

interface Props {
  mensaje: TChatMensaje;
}

export function ChatMensaje({ mensaje }: Props) {
  const esUsuario = mensaje.rol === "usuario";

  return (
    <div className={`flex gap-2 ${esUsuario ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          esUsuario ? "bg-blue-500" : "bg-slate-200"
        }`}
      >
        {esUsuario
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-slate-600" />
        }
      </div>

      {/* Burbuja */}
      <div
        className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          esUsuario
            ? "bg-blue-500 text-white rounded-tr-sm"
            : "bg-slate-100 text-slate-800 rounded-tl-sm"
        }`}
      >
        {mensaje.esCargando ? (
          /* Animación "escribiendo..." */
          <span className="flex gap-1 items-center h-4">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          mensaje.contenido
        )}
      </div>
    </div>
  );
}
