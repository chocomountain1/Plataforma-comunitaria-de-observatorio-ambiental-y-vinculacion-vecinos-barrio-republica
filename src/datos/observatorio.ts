import type { Desafio } from '@/dominio/tipos';

/**
 * Cifras del observatorio.
 *
 * Todas vienen del diagnostico socioambiental 2022 de Republica Circular, menos
 * el area verde por habitante, que es calculo del equipo cruzando el poligono
 * del barrio con el Censo 2017. El referente de comparacion es la comuna de
 * Santiago segun el SIEDU. Los reportes de vecinos son datos de ejemplo del
 * prototipo y la pantalla lo dice.
 */

export const platabandas = {
  titular: '262 de 500 platabandas están abandonadas o ya se pavimentaron',
  nota: 'Solo 13 tienen a alguien que las cuide.',
  tramos: [
    { etiqueta: 'En uso', valor: 238, color: '#2E6B3F' },
    { etiqueta: 'Abandonadas', valor: 236, color: '#A86E1C' },
    { etiqueta: 'Pavimentadas, sin vuelta atrás', valor: 26, color: '#9C3A33' },
  ],
};

export const areaVerde = {
  titular: 'Entre 7 y 10 veces menos que el promedio de Santiago',
  nota: 'Cálculo del equipo con el Censo 2017 y la capa de áreas verdes 2022. Comuna: SIEDU, INE.',
  barras: [
    { etiqueta: 'Barrio República', valor: '0,48 a 0,68 m²', proporcion: 0.068, destacada: true },
    { etiqueta: 'Comuna de Santiago', valor: '4,64 m²', proporcion: 0.464 },
    { etiqueta: 'Meta nacional (CNDU)', valor: '10 m²', proporcion: 1 },
  ],
};

export const loQueFaltaSaber = {
  titular: 'Sabemos dónde está cada banca, pero no en qué estado',
  filas: [
    { etiqueta: 'Bancas con estado', conseguido: 0, total: 93 },
    { etiqueta: 'Semáforos con estado', conseguido: 0, total: 172 },
    { etiqueta: 'Basureros con estado', conseguido: 4, total: 218 },
  ],
};

export const reportesDelMes = {
  titulo: 'REPORTES DE VECINOS · NOVIEMBRE',
  nota: 'Datos de ejemplo para el prototipo',
  filas: [
    { etiqueta: 'Basura', valor: 18, color: '#7A4A1F' },
    { etiqueta: 'Calles y veredas', valor: 9, color: '#4A5560' },
    { etiqueta: 'Árboles', valor: 6, color: '#2E6B3F' },
    { etiqueta: 'Ruido o luz', valor: 4, color: '#2C5A8C' },
    { etiqueta: 'Plagas', valor: 3, color: '#6B4380' },
  ],
};

export const trabajosDevueltos = [
  { id: 'diagnostico', titulo: 'Diagnóstico socioambiental 2022', autor: 'República Circular' },
  { id: 'levantamiento', titulo: 'Levantamiento con vecinos 2026', autor: 'Estudiantes FCFM · IE4000' },
];

/**
 * Desafios publicados para las instituciones del barrio. Nacen de lo que la
 * comunidad ya propuso y priorizo, que es la mitad del modulo de vinculacion.
 */
export const desafios: Desafio[] = [
  {
    id: 'punto-limpio',
    prioridad: 'alta',
    eje: 'Residuos',
    titulo: 'Punto limpio vecinal en Sazié con Av. República',
    resumen: '64 apoyos · 6 reportes · eje universitario',
    busca: 'diseño de contenedores y logística de retiro',
    disciplinas: ['Ingeniería', 'Diseño'],
    tiposDeApoyo: ['Conocimiento técnico', 'Materiales'],
    propuesta: 'punto-limpio',
  },
  {
    id: 'sombra-toesca',
    prioridad: 'alta',
    eje: 'Áreas verdes',
    titulo: 'Sombra en calle Toesca: 21 °C más caliente sin árboles',
    resumen: '47 apoyos · medición del diagnóstico 2022',
    busca: 'medición de temperatura y propuesta de arbolado',
    disciplinas: ['Ingeniería', 'Agronomía', 'Arquitectura'],
    tiposDeApoyo: ['Conocimiento técnico'],
  },
  {
    id: 'bancas',
    prioridad: 'media',
    eje: 'Espacio público',
    titulo: 'Mapear el estado de las 93 bancas del barrio',
    resumen: '29 apoyos · ninguna tiene estado registrado',
    busca: 'levantamiento en terreno y ficha de observación',
    disciplinas: ['Ciencias sociales', 'Arquitectura'],
    tiposDeApoyo: ['Voluntariado'],
  },
];

/** Formas en que una institucion declara que puede apoyar. */
export const formasDeApoyoInstitucional = [
  'Curso o taller',
  'Tesis o memoria',
  'Voluntariado',
  'Materiales',
] as const;

export const plazosDeApoyo = ['Este semestre', 'Otoño 2027', 'Por definir'] as const;
