import type { PuntoEnMapa } from './tipos';

/**
 * Donde queda el barrio, en coordenadas reales.
 *
 * El recuadro sale de la capa "Delimitacion de area de estudio" del catastro
 * socioambiental 2022, que viene en EPSG:4326. No es una aproximacion dibujada
 * a ojo: es el mismo poligono con el que la contraparte levanto el diagnostico,
 * y por eso define que entra y que no entra al barrio en toda la aplicacion.
 */
export const RECUADRO_DEL_BARRIO = {
  oeste: -70.671086,
  este: -70.655836,
  sur: -33.458024,
  norte: -33.446147,
} as const;

export const CENTRO_DEL_BARRIO: PuntoEnMapa = {
  latitud: (RECUADRO_DEL_BARRIO.sur + RECUADRO_DEL_BARRIO.norte) / 2,
  longitud: (RECUADRO_DEL_BARRIO.oeste + RECUADRO_DEL_BARRIO.este) / 2,
};

/**
 * El barrio mide alrededor de 1,4 km de lado. En zoom 15 cabe entero en una
 * pantalla de telefono y en 16 se distingue la vereda, que es el detalle que
 * hace falta para dejar un reporte donde corresponde.
 */
export const ZOOM_MINIMO = 14;
export const ZOOM_MAXIMO = 18;
export const ZOOM_DEL_BARRIO = 15;
export const ZOOM_PARA_UBICAR = 17;

/** Hasta donde se puede arrastrar el mapa antes de salirse del barrio. */
export const MARGEN_FUERA_DEL_BARRIO = 0.004;
