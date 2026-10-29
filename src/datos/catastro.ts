import type { CapaDelMapa, ElementoDeCatastro } from '@/dominio/tipos';

/**
 * Capas del mapa y fichas del catastro socioambiental de 2022.
 *
 * Las cifras son las del diagnostico real de Republica Circular: 40
 * microbasurales, 500 platabandas, 218 basureros, 5 puntos de reciclaje, 8
 * areas verdes y 2 eriazos, 93 bancas, 35 paraderos y 3 tramos de ciclovia.
 */
export const capasIniciales: CapaDelMapa[] = [
  { id: 'reportes-abiertos', nombre: 'Reportes abiertos', detalle: '', grupo: 'ahora', activa: true },
  { id: 'resueltos', nombre: 'Resueltos', detalle: 'Últimos 30 días', grupo: 'ahora', activa: true },
  { id: 'propuestas', nombre: 'Propuestas', detalle: '', grupo: 'ahora', activa: true },
  { id: 'actividades', nombre: 'Actividades', detalle: '', grupo: 'ahora', activa: true },
  { id: 'microbasurales', nombre: 'Microbasurales', detalle: '40 puntos', grupo: 'catastro', activa: true },
  { id: 'platabandas', nombre: 'Platabandas', detalle: '500 franjas', grupo: 'catastro', activa: false },
  { id: 'basureros', nombre: 'Basureros', detalle: '218 en la calle', grupo: 'catastro', activa: false },
  { id: 'reciclaje', nombre: 'Puntos de reciclaje', detalle: '5 lugares', grupo: 'catastro', activa: true },
  { id: 'areas-verdes', nombre: 'Áreas verdes', detalle: '8 plazas y 2 eriazos', grupo: 'catastro', activa: true },
  { id: 'bancas', nombre: 'Bancas', detalle: '93 bancas', grupo: 'catastro', activa: false },
  { id: 'paraderos', nombre: 'Paraderos', detalle: '35 paraderos', grupo: 'catastro', activa: false },
  { id: 'ciclovias', nombre: 'Ciclovías', detalle: '3 tramos', grupo: 'catastro', activa: false },
];

export const fichasDeCatastro: ElementoDeCatastro[] = [
  {
    id: 'platabanda-grajales',
    tipo: 'Platabanda',
    fuente: 'Catastro 2022',
    direccion: 'Grajales, entre Av. República y Av. Ejército',
    estadoAnotado: 'Abandonada',
    quienLoCuida: 'Nadie',
    ultimaRevision: 'Feb 2023',
    opcionesDeEstado: ['Con jardín', 'Abandonada', 'Pavimentada', 'No sé'],
    dato: 'Solo 13 de 500 platabandas tienen quien las cuide',
    posicion: { x: 256, y: 400 },
  },
];
