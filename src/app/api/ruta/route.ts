import { NextResponse } from "next/server";

interface PuntoInput {
  latitud: number;
  longitud: number;
  nombre?: string;
}

interface PasoRuta {
  instruccion: string;
  distancia: number;
  duracion: number;
}

interface RutaResponse {
  indice: number;
  geometry: GeoJSON.LineString;
  distancia_texto: string;
  duracion_texto: string;
  distancia_metros: number;
  duracion_segundos: number;
  pasos: PasoRuta[];
  perfil: string;
}

function formatearDistancia(metros: number): string {
  if (metros >= 1000) return `${(metros / 1000).toFixed(1)} km`;
  return `${Math.round(metros)} m`;
}

function formatearDuracion(segundos: number): string {
  const minutos = Math.round(segundos / 60);
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins} min` : `${horas}h`;
  }
  return `${minutos} min`;
}

// Valid Mapbox profiles
const PROFILES: Record<string, string> = {
  caminando: "mapbox/walking",
  accesible: "mapbox/cycling",   // Cycling avoids stairs/rough terrain
  vehiculo: "mapbox/driving",
};

export async function POST(request: Request) {
  try {
    const { puntos, idioma = "es", perfil = "caminando" } = (await request.json()) as {
      puntos: PuntoInput[];
      idioma?: string;
      perfil?: string;
    };

    if (!puntos || puntos.length < 2) {
      return NextResponse.json({ error: "Se necesitan al menos 2 puntos." }, { status: 400 });
    }
    if (puntos.length > 25) {
      return NextResponse.json({ error: "Máximo 25 puntos por ruta." }, { status: 400 });
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Token de Mapbox no configurado." }, { status: 500 });
    }

    const mapboxProfile = PROFILES[perfil] || PROFILES.caminando;
    const coordenadas = puntos.map((p) => `${p.longitud},${p.latitud}`).join(";");

    const idiomaMap: Record<string, string> = {
      "es-MX": "es", "en-US": "en", "zh-CN": "zh-Hans", "pt-BR": "pt-BR", es: "es", en: "en",
    };
    const lang = idiomaMap[idioma] || "es";

    const url = `https://api.mapbox.com/directions/v5/${mapboxProfile}/${coordenadas}?alternatives=true&geometries=geojson&steps=true&language=${lang}&access_token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Token de Mapbox inválido." }, { status: 401 });
      }
      return NextResponse.json({ error: "Error al calcular la ruta." }, { status: 502 });
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return NextResponse.json({ error: "No se encontró una ruta." }, { status: 404 });
    }

    const rutas: RutaResponse[] = data.routes.slice(0, 3).map((route: any, idx: number) => {
      const pasos: PasoRuta[] = [];
      route.legs.forEach((leg: any) => {
        leg.steps.forEach((step: any) => {
          if (step.maneuver?.instruction) {
            pasos.push({
              instruccion: step.maneuver.instruction,
              distancia: Math.round(step.distance),
              duracion: Math.round(step.duration),
            });
          }
        });
      });

      return {
        indice: idx,
        geometry: route.geometry,
        distancia_texto: formatearDistancia(route.distance),
        duracion_texto: formatearDuracion(route.duration),
        distancia_metros: Math.round(route.distance),
        duracion_segundos: Math.round(route.duration),
        pasos,
        perfil,
      };
    });

    return NextResponse.json({ rutas });
  } catch (error) {
    console.error("Error en /api/ruta:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}