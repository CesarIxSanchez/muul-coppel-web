import { NextResponse } from "next/server";

interface POIContext {
  nombre: string;
  categoria: string;
  descripcion?: string | null;
  horario_apertura?: string | null;
  horario_cierre?: string | null;
  precio_rango?: string | null;
  emoji?: string | null;
  verificado?: boolean;
  direccion?: string | null;
  especialidades?: string[];
}

interface MensajeHistorial {
  tipo: "pregunta" | "respuesta";
  contenido: string;
}

// Fallback models in order of preference (Mejora 1)
const MODELOS = [
  "google/gemma-3-4b-it",
  "meta-llama/llama-3.2-3b-instruct",
  "mistralai/mistral-7b-instruct",
  "google/gemini-2.0-flash-exp:free",
];

async function llamarOpenRouter(
  modelo: string,
  messages: { role: string; content: string }[]
): Promise<Response> {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "Muul App",
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: 300,
      messages,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { pregunta, poi, idioma = "es", historial = [] } = (await request.json()) as {
      pregunta: string;
      poi: POIContext;
      idioma?: string;
      historial?: MensajeHistorial[];
    };

    // Validations
    if (!pregunta || !poi || !poi.nombre) {
      return NextResponse.json(
        { error: "Se requiere una pregunta y el contexto del lugar." },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API key de OpenRouter no configurada." },
        { status: 500 }
      );
    }

    // Map language code to full name
    const idiomaNombre: Record<string, string> = {
      "es-MX": "español",
      "en-US": "English",
      "zh-CN": "中文 (Chinese)",
      "pt-BR": "português",
      es: "español",
      en: "English",
      zh: "中文",
      pt: "português",
    };
    const idiomaRespuesta = idiomaNombre[idioma] || "español";

    // Build POI context
    const horario =
      poi.horario_apertura && poi.horario_cierre
        ? `${poi.horario_apertura} - ${poi.horario_cierre}`
        : "No especificado";

    const especialidadesTexto = poi.especialidades?.length
      ? `Especialidades/tags: ${poi.especialidades.join(", ")}`
      : "";

    // System prompt
    const systemPrompt = `Eres Muul AI, un guía turístico experto, amigable y conciso especializado en México y el Mundial FIFA 2026.

REGLAS ESTRICTAS:
- Responde ÚNICAMENTE sobre el lugar descrito abajo. No inventes datos que no estén en el contexto.
- Si no tienes suficiente información para responder algo, di honestamente que no tienes ese dato disponible y sugiere visitar el lugar para más detalles.
- Responde SIEMPRE en ${idiomaRespuesta}. Esto es obligatorio sin importar en qué idioma esté la pregunta.
- Máximo 3-4 oraciones por respuesta. Sé breve y útil.
- Usa un tono cálido y entusiasta, como un amigo local que conoce bien el lugar.
- Puedes usar 1-2 emojis relevantes por respuesta.

CONTEXTO DEL LUGAR ACTIVO:
- Nombre: ${poi.nombre}
- Categoría: ${poi.categoria}
- Descripción: ${poi.descripcion || "No disponible"}
- Horario: ${horario}
${poi.precio_rango ? `- Rango de precios: ${poi.precio_rango}` : ""}
${poi.direccion ? `- Dirección: ${poi.direccion}` : ""}
${especialidadesTexto ? `- ${especialidadesTexto}` : ""}
${poi.verificado ? "- Este lugar está VERIFICADO por Muul ✅" : ""}
${poi.emoji ? `- Emoji representativo: ${poi.emoji}` : ""}`;

    // Build messages array with conversation history (Mejora 3)
    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history for context
    historial.forEach((msg) => {
      messages.push({
        role: msg.tipo === "pregunta" ? "user" : "assistant",
        content: msg.contenido,
      });
    });

    // Add the new question
    messages.push({ role: "user", content: pregunta });

    // Try models with fallback (Mejora 1)
    let respuesta: string | null = null;
    let lastError: string = "";

    for (const modelo of MODELOS) {
      try {
        const res = await llamarOpenRouter(modelo, messages);

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            respuesta = content;
            break;
          }
        } else if (res.status === 429) {
          // Rate limited, try next model
          lastError = `Modelo ${modelo} saturado.`;
          continue;
        } else if (res.status === 401) {
          return NextResponse.json(
            { error: "API key de OpenRouter inválida." },
            { status: 401 }
          );
        } else {
          lastError = `Error ${res.status} con modelo ${modelo}.`;
          continue;
        }
      } catch {
        lastError = `Error de conexión con ${modelo}.`;
        continue;
      }
    }

    if (!respuesta) {
      return NextResponse.json(
        { error: lastError || "Todos los modelos fallaron. Intenta de nuevo en unos segundos." },
        { status: 502 }
      );
    }

    return NextResponse.json({ respuesta });
  } catch (error) {
    console.error("Error en /api/chatbot:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}