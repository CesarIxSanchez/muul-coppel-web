/**
 * Calcula la distancia en km entre dos puntos geográficos
 * usando la fórmula de Haversine.
 */
export function haversine(
  a: [number, number], // [lat, lng]
  b: [number, number]  // [lat, lng]
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Optimiza el orden de los POIs usando Nearest Neighbor (TSP heurístico).
 * Comienza desde `origen` y visita el punto más cercano en cada paso.
 */
export function optimizarOrdenTSP<T extends { latitud: number; longitud: number }>(
  puntos: T[],
  origen?: [number, number]
): T[] {
  if (puntos.length <= 2) return puntos;

  const pendientes = [...puntos];
  const ordenados: T[] = [];
  let actual: [number, number] = origen ?? [pendientes[0].latitud, pendientes[0].longitud];

  // Si no hay origen externo, sacamos el primer punto como inicio
  if (!origen) {
    ordenados.push(pendientes.shift()!);
    actual = [ordenados[0].latitud, ordenados[0].longitud];
  }

  while (pendientes.length > 0) {
    let minDist = Infinity;
    let minIdx = 0;

    pendientes.forEach((poi, idx) => {
      const dist = haversine(actual, [poi.latitud, poi.longitud]);
      if (dist < minDist) {
        minDist = dist;
        minIdx = idx;
      }
    });

    const siguiente = pendientes.splice(minIdx, 1)[0];
    ordenados.push(siguiente);
    actual = [siguiente.latitud, siguiente.longitud];
  }

  return ordenados;
}