import type { PuntoEnMapa } from '@/dominio/tipos';

/**
 * Proyeccion Web Mercator, la que usan las teselas de OpenStreetMap.
 *
 * Esta aqui y no dentro del componente del mapa porque tambien la necesitan la
 * pantalla de ubicacion, para saber donde quedo el punto, y mas adelante las
 * consultas por cercania, para estimar el radio en metros antes de preguntarle
 * a la base.
 */

/** Las teselas de OpenStreetMap miden 256 pixeles de lado. */
export const LADO_DE_TESELA = 256;

/** Radio de la Tierra en metros, el valor que asume Web Mercator. */
const RADIO_TERRESTRE = 6378137;

export type PuntoEnPixeles = {
  x: number;
  y: number;
};

/** Cuantos pixeles de lado tiene el mundo entero en un nivel de zoom. */
function ladoDelMundo(zoom: number): number {
  return LADO_DE_TESELA * 2 ** zoom;
}

/** Pasa una coordenada geografica a pixeles absolutos del mundo. */
export function aPixeles(punto: PuntoEnMapa, zoom: number): PuntoEnPixeles {
  const lado = ladoDelMundo(zoom);
  const seno = Math.sin((punto.latitud * Math.PI) / 180);
  return {
    x: ((punto.longitud + 180) / 360) * lado,
    y: (0.5 - Math.log((1 + seno) / (1 - seno)) / (4 * Math.PI)) * lado,
  };
}

/** El camino de vuelta: de pixeles absolutos a coordenada geografica. */
export function aCoordenada(pixeles: PuntoEnPixeles, zoom: number): PuntoEnMapa {
  const lado = ladoDelMundo(zoom);
  const n = Math.PI - (2 * Math.PI * pixeles.y) / lado;
  return {
    latitud: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    longitud: (pixeles.x / lado) * 360 - 180,
  };
}

/**
 * Direccion de una tesela en el servidor de OpenStreetMap.
 *
 * La politica de uso del servidor publico permite trafico liviano como el de
 * un prototipo, y exige mostrar la atribucion, que el mapa dibuja en la
 * esquina. Si la aplicacion llega a produccion hay que cambiar esto por un
 * proveedor propio o contratado.
 */
export function direccionDeTesela(columna: number, fila: number, zoom: number): string {
  return `https://tile.openstreetmap.org/${zoom}/${columna}/${fila}.png`;
}

/**
 * Metros por pixel en un nivel de zoom, corregidos por la latitud.
 *
 * Mercator estira las distancias a medida que uno se aleja del ecuador, asi
 * que sin esta correccion un radio de cien metros en Santiago se dibujaria
 * veinte por ciento mas grande de lo que es.
 */
export function metrosPorPixel(latitud: number, zoom: number): number {
  return (
    (2 * Math.PI * RADIO_TERRESTRE * Math.cos((latitud * Math.PI) / 180)) / ladoDelMundo(zoom)
  );
}

/** Distancia en metros entre dos puntos, por la formula del semiverseno. */
export function distanciaEnMetros(uno: PuntoEnMapa, otro: PuntoEnMapa): number {
  const aRadianes = (grados: number): number => (grados * Math.PI) / 180;
  const diferenciaLatitud = aRadianes(otro.latitud - uno.latitud);
  const diferenciaLongitud = aRadianes(otro.longitud - uno.longitud);
  const a =
    Math.sin(diferenciaLatitud / 2) ** 2 +
    Math.cos(aRadianes(uno.latitud)) *
      Math.cos(aRadianes(otro.latitud)) *
      Math.sin(diferenciaLongitud / 2) ** 2;
  return 2 * RADIO_TERRESTRE * Math.asin(Math.sqrt(a));
}
