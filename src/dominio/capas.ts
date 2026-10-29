import type { NombreIcono } from '@/diseno/iconos';

/**
 * Las capas del catastro socioambiental 2022 que la plataforma muestra.
 *
 * Son ocho y no las treinta y una del diagnostico. Las otras veintitres o
 * bien no estan en los mapas web que la organizacion publico, o bien quedaron
 * con la geometria levantada y los atributos vacios, como los 172 semaforos y
 * las 249 veredas. Mostrar un punto del que no se sabe nada no ayuda a nadie.
 *
 * Los colores viven aqui y no en la paleta general por la misma razon que los
 * de las categorias de reporte: son vocabulario del dominio, no decoracion.
 */

export const idsDeCapaDelCatastro = [
  'microbasurales',
  'platabandas',
  'basureros',
  'reciclaje',
  'areas-verdes',
  'bancas',
  'paraderos',
  'ciclovias',
] as const;

export type IdCapaDelCatastro = (typeof idsDeCapaDelCatastro)[number];

export type CapaDelCatastro = {
  id: IdCapaDelCatastro;
  etiqueta: string;
  color: string;
  icono: NombreIcono;
};

export const capasDelCatastro: Record<IdCapaDelCatastro, CapaDelCatastro> = {
  microbasurales: {
    id: 'microbasurales',
    etiqueta: 'Microbasurales',
    color: '#7A4A1F',
    icono: 'basura',
  },
  platabandas: {
    id: 'platabandas',
    etiqueta: 'Platabandas',
    color: '#2E6B3F',
    icono: 'arbol',
  },
  basureros: {
    id: 'basureros',
    etiqueta: 'Basureros',
    color: '#4A5560',
    icono: 'basura',
  },
  reciclaje: {
    id: 'reciclaje',
    etiqueta: 'Puntos de reciclaje',
    color: '#1F7A6B',
    icono: 'hoja',
  },
  'areas-verdes': {
    id: 'areas-verdes',
    etiqueta: 'Áreas verdes',
    color: '#3F8F4F',
    icono: 'arbol',
  },
  bancas: {
    id: 'bancas',
    etiqueta: 'Bancas',
    color: '#8C6A3F',
    icono: 'mobiliario',
  },
  paraderos: {
    id: 'paraderos',
    etiqueta: 'Paraderos',
    color: '#2C5A8C',
    icono: 'calle',
  },
  ciclovias: {
    id: 'ciclovias',
    etiqueta: 'Ciclovías',
    color: '#6B4380',
    icono: 'calle',
  },
};

/**
 * Las platabandas se colorean por su estado de uso y no con un color unico.
 *
 * Es la unica capa que lo hace, y no es un capricho: el diagnostico la
 * simboliza asi en su propio mapa web, y el dato que importa del barrio es
 * que 262 de las 500 estan abandonadas o ya se pavimentaron. Con un color
 * plano esa cifra deja de verse en el mapa.
 */
export const coloresPorEstadoDePlatabanda: Record<string, string> = {
  'En uso': '#2E6B3F',
  Abandonado: '#B0581A',
  Eliminado: '#6B6257',
};

/** El color con que se dibuja un elemento, segun su capa y su taxonomia. */
export function colorDelElemento(
  capa: IdCapaDelCatastro,
  estadoDePlatabanda?: string,
): string {
  if (capa === 'platabandas' && estadoDePlatabanda !== undefined) {
    return coloresPorEstadoDePlatabanda[estadoDePlatabanda] ?? capasDelCatastro[capa].color;
  }
  return capasDelCatastro[capa].color;
}

/** Si el identificador corresponde a una capa del catastro que se dibuja. */
export function esCapaDelCatastro(id: string): id is IdCapaDelCatastro {
  return (idsDeCapaDelCatastro as readonly string[]).includes(id);
}
