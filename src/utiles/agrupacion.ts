import type { PuntoEnMapa } from '@/dominio/tipos';

import { aPixeles } from './geografia';

/**
 * Agrupa lo que queda demasiado junto en la pantalla.
 *
 * Hace falta porque el catastro trae 500 platabandas en 129 hectareas:
 * dibujadas una por una tapan el mapa y dejan de decir nada. La pantalla de
 * capas del prototipo ya contemplaba esto, con un marcador de grupo que al
 * tocarlo acerca el mapa.
 *
 * La agrupacion se hace en pixeles y no en grados a proposito: lo que molesta
 * es que dos chinchetas se pisen en la pantalla, y cuanto se pisan depende
 * del zoom, no de la distancia real.
 */

export type Grupo<T> = {
  /** Estable mientras no cambie el zoom, sirve de clave de React. */
  clave: string;
  elementos: T[];
  /** Centro del grupo, donde se dibuja la chincheta. */
  posicion: PuntoEnMapa;
};

export function agruparEnPantalla<T>(
  elementos: T[],
  posicionDe: (elemento: T) => PuntoEnMapa,
  zoom: number,
  ladoDeCeldaEnPixeles: number,
): Grupo<T>[] {
  const celdas = new Map<string, T[]>();

  for (const elemento of elementos) {
    const pixeles = aPixeles(posicionDe(elemento), zoom);
    const columna = Math.floor(pixeles.x / ladoDeCeldaEnPixeles);
    const fila = Math.floor(pixeles.y / ladoDeCeldaEnPixeles);
    const clave = `${columna},${fila}`;
    const existentes = celdas.get(clave);
    if (existentes === undefined) {
      celdas.set(clave, [elemento]);
    } else {
      existentes.push(elemento);
    }
  }

  const grupos: Grupo<T>[] = [];
  for (const [clave, miembros] of celdas) {
    grupos.push({
      clave: `${zoom}-${clave}`,
      elementos: miembros,
      posicion: promedio(miembros.map(posicionDe)),
    });
  }
  return grupos;
}

/**
 * Centro de un grupo.
 *
 * El promedio simple alcanza porque una celda mide unas pocas decenas de
 * metros, una escala donde la curvatura de la Tierra no cambia el resultado.
 */
function promedio(puntos: PuntoEnMapa[]): PuntoEnMapa {
  const inicial = { latitud: 0, longitud: 0 };
  if (puntos.length === 0) return inicial;

  const suma = puntos.reduce(
    (acumulado, punto) => ({
      latitud: acumulado.latitud + punto.latitud,
      longitud: acumulado.longitud + punto.longitud,
    }),
    inicial,
  );
  return {
    latitud: suma.latitud / puntos.length,
    longitud: suma.longitud / puntos.length,
  };
}
