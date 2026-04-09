import { CURATED_PLACE_IMAGES } from "@/lib/dummy-data";



export const CATEGORY_QUERIES: Record<string, string> = {
  comida: "mexican gourmet food CDMX cuisine",
  tienda: "mexico city boutique shop luxury",
  cultural: "mexico city bellas artes museum architecture",
  deportes: "modern mexico city stadium",
  hospedaje: "mexico city hotel luxury room",
  eventos: "mexico city concert venue stage lights",
  servicios: "mexico city business services coworking",
  servicio: "mexico city professional service",
  default: "mexico city luxury travel destination"
};


export const CURATED_PHOTOS: Record<string, string> = {
  ...CURATED_PLACE_IMAGES,
};


export function getPremiumPhoto(
  nombre: string,
  categoria?: string,
  customUrl?: string | null
): string {

  if (customUrl) {
    return customUrl;
  }


  if (CURATED_PHOTOS[nombre]) {
    return CURATED_PHOTOS[nombre];
  }



  const query = `${nombre} ${CATEGORY_QUERIES[categoria || "default"]} city architecture`;
  const sanitizedQuery = encodeURIComponent(query.toLowerCase());
  


  return `https://source.unsplash.com/featured/800x600?${sanitizedQuery}`;
}


export const PLACEHOLDER_BANNER = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop";
