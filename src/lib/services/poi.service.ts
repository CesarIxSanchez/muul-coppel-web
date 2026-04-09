

import type { POI } from "@/types/database";
import { getLocalizedDummyPois } from "@/lib/dummy-data";

type POIServiceOptions = {
  lat: number;
  lng: number;
  radioKm?: number;
  locale?: string;
};

export const POIService = {
  
  async getNearby({ lat, lng, radioKm = 5, locale = "es" }: POIServiceOptions): Promise<POI[]> {
    try {

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const [{ data: negociosData }, { data: poisData }] = await Promise.all([
        supabase.rpc("negocios_en_radio", { lat, lng, radio_km: radioKm }),
        supabase.rpc("pois_en_radio", { lat, lng, radio_km: radioKm }),
      ]);

      const hasRealData = (negociosData?.length ?? 0) + (poisData?.length ?? 0) > 0;

      if (hasRealData) {
        const negocios = (negociosData ?? []).map((n: any) => ({
          ...n,
          categoria: n.categoria ?? "tienda",
          emoji: "🏪",
        }));
        return [...negocios, ...(poisData ?? [])] as POI[];
      }
    } catch (err) {
      console.warn("[POIService] Supabase unavailable, using local seed data:", err);
    }


    const allPois = getLocalizedDummyPois(locale);
    return allPois as POI[];
  },

  
  async getById(id: string, locale = "es"): Promise<POI | null> {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data } = await supabase
        .rpc("get_negocio_by_id_or_slug", { p_id_or_slug: id })
        .single();

      if (data) return data as POI;
    } catch {

    }

    const allPois = getLocalizedDummyPois(locale);
    return (allPois.find(p => p.id === id) ?? null) as POI | null;
  },

  
  async sorprendeme({ lat, lng, locale = "es" }: { lat: number; lng: number; locale?: string }): Promise<POI[]> {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data } = await supabase.rpc("sorprendeme", { lat, lng, cantidad: 5 });
      if (data && data.length > 0) return data as POI[];
    } catch {

    }

    const allPois = getLocalizedDummyPois(locale);
    return allPois.sort(() => Math.random() - 0.5).slice(0, 5) as POI[];
  },
};
