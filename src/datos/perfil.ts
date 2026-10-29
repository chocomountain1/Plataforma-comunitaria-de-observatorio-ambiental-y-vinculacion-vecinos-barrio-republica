import type { Logro } from '@/dominio/tipos';

/**
 * Perfil y logros. La regla que decidio el equipo es explicita: los logros
 * muestran lo que alguien aporta y nunca dan mas peso a sus reportes ni a sus
 * apoyos, para no reintroducir jerarquias entre vecinos.
 */
export const resumenDelPerfil = {
  desde: 'En el barrio desde octubre 2026',
  vinculos: ['Vive en el barrio', 'Trabaja en el barrio'],
  reportes: 4,
  confirmaciones: 11,
  propuestasApoyadas: 6,
};

export const logros: Logro[] = [
  { id: 'primer-reporte', nombre: 'Primer reporte', icono: 'pin', color: '#A86E1C', conseguido: true },
  { id: 'ojo-atento', nombre: 'Ojo atento', icono: 'ojo', color: '#2C5A8C', conseguido: true },
  {
    id: 'problema-resuelto',
    nombre: 'Problema resuelto',
    icono: 'visto',
    color: '#1D5E40',
    conseguido: true,
  },
  {
    id: 'guardiana-platabandas',
    nombre: 'Guardiana de platabandas',
    icono: 'arbol',
    color: '#2E6B3F',
    conseguido: false,
    avance: '3 de 10',
  },
  {
    id: 'manos-obra',
    nombre: 'Manos a la obra',
    icono: 'personas',
    color: '#7A4A1F',
    conseguido: false,
    avance: '0 de 3',
  },
  {
    id: 'idea-que-suma',
    nombre: 'Idea que suma',
    icono: 'idea',
    color: '#6B4380',
    conseguido: false,
    avance: '0 de 20 apoyos',
  },
];

/** Cuantos logros existen en total en el sistema. */
export const totalDeLogros = 9;

/** Opciones de vinculo con el barrio del registro inicial. */
export const vinculosConElBarrio = [
  { id: 'vivo', titulo: 'Vivo aquí', detalle: 'Residente del barrio' },
  { id: 'estudio', titulo: 'Estudio aquí', detalle: 'Universidad, instituto o colegio' },
  { id: 'trabajo', titulo: 'Trabajo aquí', detalle: 'Oficina, comercio o casa particular' },
  { id: 'local', titulo: 'Tengo un local o emprendimiento', detalle: 'Almacén, feria, taller, venta desde casa' },
  { id: 'institucion', titulo: 'Represento una institución', detalle: 'Universidad, organización o junta de vecinos' },
  { id: 'paso', titulo: 'Paso seguido por aquí', detalle: 'Lo cruzo camino a otro lugar' },
] as const;

/** Intereses que deciden que capas vienen encendidas al entrar al mapa. */
export const interesesDelMapa = [
  { id: 'reportes', sigla: 'REP', titulo: 'Problemas que reportan los vecinos', detalle: 'Abiertos y resueltos hace poco' },
  { id: 'propuestas', sigla: 'ACT', titulo: 'Propuestas y actividades', detalle: 'Lo que se está organizando' },
  { id: 'residuos', sigla: 'RES', titulo: 'Basura y reciclaje', detalle: 'Microbasurales, basureros y puntos limpios' },
  { id: 'verdes', sigla: 'VER', titulo: 'Áreas verdes y platabandas', detalle: 'Plazas, jardines y huertas' },
  { id: 'patrimonio', sigla: 'PAT', titulo: 'Patrimonio', detalle: 'Casonas, teatros y lugares con historia' },
  { id: 'movilidad', sigla: 'MOV', titulo: 'Movilidad', detalle: 'Paraderos, ciclovías y cruces' },
  { id: 'mobiliario', sigla: 'MOB', titulo: 'Bancas y mobiliario', detalle: 'Bancas, semáforos y luminarias' },
] as const;
