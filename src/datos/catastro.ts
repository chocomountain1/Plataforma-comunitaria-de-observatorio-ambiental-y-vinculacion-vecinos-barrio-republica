import type { CapaDelMapa, ElementoDeCatastro } from '@/dominio/tipos';

/**
 * Capas del mapa y fichas del catastro socioambiental de 2022.
 *
 * Las cifras escritas aqui son las que declara el diagnostico de Republica
 * Circular: 40 microbasurales, 500 platabandas, 218 basureros, 5 puntos de
 * reciclaje, 8 areas verdes y 2 eriazos, 93 bancas, 35 paraderos y 3 tramos de
 * ciclovia. Sirven para que el prototipo sin backend muestre algo razonable.
 *
 * Con sesion abierta se reemplazan por lo que hay cargado, que no es lo mismo:
 * en microbasurales el diagnostico anota 40 y hay 39, porque uno queda a dos
 * kilometros del barrio y la carga lo rechaza. De ahi la unidad de cada capa,
 * que es lo que permite rehacer la frase con el numero de verdad.
 */
export const capasIniciales: CapaDelMapa[] = [
  { id: 'reportes-abiertos', nombre: 'Reportes abiertos', detalle: '', grupo: 'ahora', activa: true },
  { id: 'resueltos', nombre: 'Resueltos', detalle: 'Últimos 30 días', grupo: 'ahora', activa: true },
  { id: 'propuestas', nombre: 'Propuestas', detalle: '', grupo: 'ahora', activa: true },
  { id: 'actividades', nombre: 'Actividades', detalle: '', grupo: 'ahora', activa: true },
  { id: 'microbasurales', nombre: 'Microbasurales', detalle: '40 puntos', unidad: 'puntos', grupo: 'catastro', activa: true },
  { id: 'platabandas', nombre: 'Platabandas', detalle: '500 franjas', unidad: 'franjas', grupo: 'catastro', activa: false },
  { id: 'basureros', nombre: 'Basureros', detalle: '218 en la calle', unidad: 'en la calle', grupo: 'catastro', activa: false },
  { id: 'reciclaje', nombre: 'Puntos de reciclaje', detalle: '5 lugares', unidad: 'lugares', grupo: 'catastro', activa: true },
  { id: 'areas-verdes', nombre: 'Áreas verdes', detalle: '8 plazas y 2 eriazos', unidad: 'plazas y eriazos', grupo: 'catastro', activa: true },
  { id: 'bancas', nombre: 'Bancas', detalle: '93 bancas', unidad: 'bancas', grupo: 'catastro', activa: false },
  { id: 'paraderos', nombre: 'Paraderos', detalle: '35 paraderos', unidad: 'paraderos', grupo: 'catastro', activa: false },
  { id: 'ciclovias', nombre: 'Ciclovías', detalle: '3 tramos', unidad: 'tramos', grupo: 'catastro', activa: false },
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
    posicion: { latitud: -33.451776, longitud: -70.661076 },
  },
];
