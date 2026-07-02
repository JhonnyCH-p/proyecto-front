import { useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { Send } from "lucide-react";
import { selectPuedeEscribir, useChatbotStore } from "../../store/chatbotStore";

interface Props {
  onEnviar: (texto: string) => void;
}

export function ChatInput({ onEnviar }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const puedeEscribir = useChatbotStore(selectPuedeEscribir);

  const handleEnviar = () => {
    const texto = textareaRef.current?.value.trim() ?? "";
    if (!texto || !puedeEscribir) return;
    onEnviar(texto);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter solo → enviar. Shift+Enter → nueva línea.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  // Auto-resize del textarea hasta 5 líneas
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-slate-200 bg-white">
      <textarea
        ref={textareaRef}
        rows={1}
        disabled={!puedeEscribir}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={puedeEscribir ? "Ej: casas en venta en Urdesa..." : "Procesando..."}
        className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50
                   px-3 py-2 text-sm text-slate-800 placeholder-slate-400
                   focus:outline-none focus:ring-2 focus:ring-blue-400
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all"
        style={{ minHeight: "38px" }}
      />
      <button
        onClick={handleEnviar}
        disabled={!puedeEscribir}
        aria-label="Enviar mensaje"
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-500 text-white
                   flex items-center justify-center
                   hover:bg-blue-600 active:scale-95
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
