import type { NombreIcono } from '@/diseno/iconos';

/**
 * Las ocho categorias de reporte. Toman la taxonomia del catastro 2022 y de la
 * historia de usuario 1, y son las mismas que muestra la lamina del sistema
 * visual. El orden importa: es el que ve la persona en la pantalla "Que pasa".
 */
export const idsDeCategoria = [
  'basura',
  'arboles',
  'plagas',
  'ruido',
  'calles',
  'mobiliario',
  'patrimonio',
  'otro',
] as const;

export type IdCategoria = (typeof idsDeCategoria)[number];

export type Categoria = {
  id: IdCategoria;
  /** Nombre completo, el que se usa al elegir categoria. */
  etiqueta: string;
  /** Version corta para chips y fichas donde no cabe el nombre largo. */
  etiquetaCorta: string;
  /** Version en mayusculas que encabeza las tarjetas de reporte. */
  etiquetaTarjeta: string;
  color: string;
  icono: NombreIcono;
};

export const categorias: Record<IdCategoria, Categoria> = {
  basura: {
    id: 'basura',
    etiqueta: 'Basura o microbasural',
    etiquetaCorta: 'Basura',
    etiquetaTarjeta: 'BASURA',
    color: '#7A4A1F',
    icono: 'basura',
  },
  arboles: {
    id: 'arboles',
    etiqueta: 'Árboles y jardines',
    etiquetaCorta: 'Árboles y jardines',
    etiquetaTarjeta: 'ÁRBOLES',
    color: '#2E6B3F',
    icono: 'arbol',
  },
  plagas: {
    id: 'plagas',
    etiqueta: 'Plagas',
    etiquetaCorta: 'Plagas',
    etiquetaTarjeta: 'PLAGAS',
    color: '#6B4380',
    icono: 'plaga',
  },
  ruido: {
    id: 'ruido',
    etiqueta: 'Ruido o luz molesta',
    etiquetaCorta: 'Ruido o luz',
    etiquetaTarjeta: 'RUIDO O LUZ',
    color: '#2C5A8C',
    icono: 'ruidoLuz',
  },
  calles: {
    id: 'calles',
    etiqueta: 'Calles y veredas',
    etiquetaCorta: 'Calles y veredas',
    etiquetaTarjeta: 'CALLES Y VEREDAS',
    color: '#4A5560',
    icono: 'calle',
  },
  mobiliario: {
    id: 'mobiliario',
    etiqueta: 'Bancas, plazas y mobiliario',
    etiquetaCorta: 'Mobiliario y plazas',
    etiquetaTarjeta: 'MOBILIARIO',
    color: '#B0581A',
    icono: 'mobiliario',
  },
  patrimonio: {
    id: 'patrimonio',
    etiqueta: 'Patrimonio en riesgo',
    etiquetaCorta: 'Patrimonio',
    etiquetaTarjeta: 'PATRIMONIO',
    color: '#9C3A33',
    icono: 'patrimonio',
  },
  otro: {
    id: 'otro',
    etiqueta: 'Otro problema',
    etiquetaCorta: 'Otro',
    etiquetaTarjeta: 'OTRO',
    color: '#56625B',
    icono: 'otro',
  },
};

/** Lista en el orden de la pantalla, util para recorrer con map. */
export const listaDeCategorias: Categoria[] = idsDeCategoria.map((id) => categorias[id]);
