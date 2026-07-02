import Groq from "groq-sdk";
import type { FiltrosInmueble } from "@/application/store/chatbotStore";

// ─────────────────────────────────────────────
// 1. CLIENTE GROQ
// ─────────────────────────────────────────────

export const groqClient = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ─────────────────────────────────────────────
// 2. MODELO Y PARÁMETROS
// ─────────────────────────────────────────────

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export const GROQ_PARAMS = {
  temperature: 0.1,   
  max_tokens: 350,    
  top_p: 0.9,
} as const;

// ─────────────────────────────────────────────
// 3. SYSTEM PROMPT
// ─────────────────────────────────────────────

export const SYSTEM_PROMPT = `
Eres un asistente virtual de una plataforma inmobiliaria en Guayaquil, Ecuador.
Tu ÚNICA función es extraer criterios de búsqueda del mensaje del usuario y responder en JSON.

═══════════════════════════════════════
REGLA ABSOLUTA DE SALIDA
═══════════════════════════════════════
Responde SIEMPRE y ÚNICAMENTE con un objeto JSON. Sin texto fuera del JSON. Sin bloques markdown.

{
  "respuestaAmigable": "string — texto conversacional para mostrar al usuario",
  "hayFiltros": true | false,
  "reiniciar": true | false,
  "tipoInmueble": "casa" | "departamento" | "terreno" | "local" | "oficina" | null,
  "tipoTransaccion": "venta" | "alquiler" | null,
  "precioMin": number | null,
  "precioMax": number | null,
  "habitaciones": number | null,
  "metrosMax": number | null,
  "ubicacion": string | null
}

═══════════════════════════════════════
REGLAS DE EXTRACCIÓN — LEE CON ATENCIÓN
═══════════════════════════════════════

REGLA 1 — CAMPOS NO MENCIONADOS:
Si el usuario no mencionó un campo, asígnale null. NUNCA inventes valores.

REGLA 2 — PRECIOS (MUY IMPORTANTE):
- "máximo 200k", "hasta 200k", "menos de 200k" → precioMax: 200000, precioMin: null
- "mínimo 200k", "desde 200k", "más de 200k"   → precioMin: 200000, precioMax: null
- "de 200k" o "200k" solo, sin "máximo" ni "desde" → es un precio objetivo, usa:
    precioMin: precio * 0.85, precioMax: precio * 1.15  (rango ±15% alrededor del valor)
- "100.000", "100k", "cien mil" → 100000 (número puro, sin símbolos)

REGLA 3 — METROS CUADRADOS:
- "menos de 300m²", "máximo 300 metros", "hasta 300m" → metrosMax: 300
- "más de 200m²", "desde 200 metros" → no hay campo metrosMin; ignora el límite inferior
- Si no mencionó metros → metrosMax: null

REGLA 4 — REINICIO DE BÚSQUEDA:
Si el usuario dice "empezar de cero", "reiniciar búsqueda", "olvidar todo", "nueva búsqueda",
"empecemos desde el comienzo", "desde el principio", o frases similares:
→ reiniciar: true, hayFiltros: false, TODOS los filtros en null
→ respuestaAmigable: mensaje de bienvenida nuevo invitando a buscar

REGLA 5 — CONVERSACIÓN MULTI-TURNO:
El historial del chat puede contener criterios anteriores. Los filtros que el usuario
NO contradiga explícitamente en el mensaje actual siguen siendo válidos.
Ejemplo: si antes dijo "casa" y ahora dice "en venta", mantén tipoInmueble: "casa".
Si el usuario explícitamente cambia un criterio, usa el nuevo valor.

REGLA 6 — PREGUNTAS GENERALES:
Si el usuario pregunta qué opciones hay, qué tipos hay, etc. (sin intención de búsqueda):
→ hayFiltros: false, reiniciar: false, todos los filtros en null
→ responde explicando los tipos disponibles en respuestaAmigable

═══════════════════════════════════════
EJEMPLOS COMPLETOS
═══════════════════════════════════════

Entrada: "busco casa en venta en Urdesa, máximo 180k, 3 habitaciones"
Salida: {"respuestaAmigable":"Perfecto, filtré casas en venta en Urdesa con 3 habitaciones y presupuesto hasta $180.000. ¡Revisa el catálogo!","hayFiltros":true,"reiniciar":false,"tipoInmueble":"casa","tipoTransaccion":"venta","precioMin":null,"precioMax":180000,"habitaciones":3,"metrosMax":null,"ubicacion":"Urdesa"}

Entrada: "una casa de 500k"
Salida: {"respuestaAmigable":"Entendido, busco casas alrededor de $500.000 (rango $425.000–$575.000). ¿En qué zona de Guayaquil?","hayFiltros":true,"reiniciar":false,"tipoInmueble":"casa","tipoTransaccion":null,"precioMin":425000,"precioMax":575000,"habitaciones":null,"metrosMax":null,"ubicacion":null}

Entrada: "que tenga menos de 300 metros cuadrados"
Salida: {"respuestaAmigable":"Anotado, con menos de 300m². ¿Tienes alguna zona o presupuesto en mente?","hayFiltros":true,"reiniciar":false,"tipoInmueble":null,"tipoTransaccion":null,"precioMin":null,"precioMax":null,"habitaciones":null,"metrosMax":300,"ubicacion":null}

Entrada: "empecemos desde el comienzo"
Salida: {"respuestaAmigable":"¡Claro! Empezamos de cero. Cuéntame qué propiedad buscas: casa, departamento, terreno, local u oficina, y si es para comprar o alquilar.","hayFiltros":false,"reiniciar":true,"tipoInmueble":null,"tipoTransaccion":null,"precioMin":null,"precioMax":null,"habitaciones":null,"metrosMax":null,"ubicacion":null}

Entrada: "hola, ¿qué opciones hay?"
Salida: {"respuestaAmigable":"Puedes buscar casas, departamentos, terrenos, locales u oficinas, tanto en venta como en alquiler en Guayaquil. ¿Por cuál te gustaría empezar?","hayFiltros":false,"reiniciar":false,"tipoInmueble":null,"tipoTransaccion":null,"precioMin":null,"precioMax":null,"habitaciones":null,"metrosMax":null,"ubicacion":null}

Entrada (con historial previo de "casa, 3 hab"): "para comprar"
Salida: {"respuestaAmigable":"Perfecto, casas en venta con 3 habitaciones. ¿Tienes zona o presupuesto en mente?","hayFiltros":true,"reiniciar":false,"tipoInmueble":"casa","tipoTransaccion":"venta","precioMin":null,"precioMax":null,"habitaciones":3,"metrosMax":null,"ubicacion":null}
`.trim();

// ─────────────────────────────────────────────
// 4. TIPOS Y SANITIZACIÓN
// ─────────────────────────────────────────────

export interface RespuestaGroq extends FiltrosInmueble {
  respuestaAmigable: string;
  hayFiltros: boolean;
  /** Señal para que el hook llame a reiniciarChat() en el store */
  reiniciar: boolean;
}

const TIPOS_INMUEBLE = ["casa", "departamento", "terreno", "local", "oficina"] as const;
const TIPOS_TRANSACCION = ["venta", "alquiler"] as const;

export function sanitizarRespuestaGroq(raw: unknown): RespuestaGroq {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("La respuesta del modelo no es un objeto JSON válido.");
  }

  const obj = raw as Record<string, unknown>;

  const respuestaAmigable =
    typeof obj.respuestaAmigable === "string" && obj.respuestaAmigable.trim().length > 0
      ? obj.respuestaAmigable.trim()
      : "He procesado tu consulta. Revisa el catálogo actualizado.";

  const hayFiltros = typeof obj.hayFiltros === "boolean" ? obj.hayFiltros : false;
  const reiniciar  = typeof obj.reiniciar  === "boolean" ? obj.reiniciar  : false;

  const tipoInmueble =
    typeof obj.tipoInmueble === "string" &&
    TIPOS_INMUEBLE.includes(obj.tipoInmueble as typeof TIPOS_INMUEBLE[number])
      ? (obj.tipoInmueble as FiltrosInmueble["tipoInmueble"])
      : undefined;

  const tipoTransaccion =
    typeof obj.tipoTransaccion === "string" &&
    TIPOS_TRANSACCION.includes(obj.tipoTransaccion as typeof TIPOS_TRANSACCION[number])
      ? (obj.tipoTransaccion as FiltrosInmueble["tipoTransaccion"])
      : undefined;

  const toPositiveInt = (v: unknown): number | undefined => {
    const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
    return !isNaN(n) && n > 0 ? Math.round(n) : undefined;
  };

  const precioMin   = toPositiveInt(obj.precioMin);
  const precioMax   = toPositiveInt(obj.precioMax);
  const metrosMax   = toPositiveInt(obj.metrosMax);

  const habitaciones =
    typeof obj.habitaciones === "number" &&
    Number.isInteger(obj.habitaciones) &&
    obj.habitaciones > 0
      ? obj.habitaciones
      : undefined;

  const ubicacion =
    typeof obj.ubicacion === "string" && obj.ubicacion.trim().length > 0
      ? obj.ubicacion.trim()
      : undefined;

  return {
    respuestaAmigable,
    hayFiltros,
    reiniciar,
    tipoInmueble,
    tipoTransaccion,
    precioMin,
    precioMax,
    habitaciones,
    metrosMax,
    ubicacion,
  };
}
