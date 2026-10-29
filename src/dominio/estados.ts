import type { NombreIcono } from '@/diseno/iconos';

/**
 * Ciclo de vida de un reporte. El lenguaje es cotidiano a proposito: la regla
 * de accesibilidad del sistema visual pide decir "En gestion" y no "Ticket
 * asignado".
 */
export const idsDeEstado = ['recibido', 'verificado', 'gestion', 'resuelto'] as const;

export type IdEstado = (typeof idsDeEstado)[number];

export type EstadoReporte = {
  id: IdEstado;
  etiqueta: string;
  fondo: string;
  texto: string;
  /** Punto de color que precede al texto. El estado resuelto usa un visto. */
  punto?: string;
  icono?: NombreIcono;
  /** Posicion dentro de la barra de avance de cuatro pasos. */
  paso: number;
};

export const estados: Record<IdEstado, EstadoReporte> = {
  recibido: {
    id: 'recibido',
    etiqueta: 'Recibido',
    fondo: '#E6E8EC',
    texto: '#3F4855',
    punto: '#5A6472',
    paso: 1,
  },
  verificado: {
    id: 'verificado',
    etiqueta: 'Verificado',
    fondo: '#DCE7F3',
    texto: '#244C78',
    punto: '#2C5A8C',
    paso: 2,
  },
  gestion: {
    id: 'gestion',
    etiqueta: 'En gestión',
    fondo: '#F5E6C8',
    texto: '#6F4A0E',
    punto: '#A86E1C',
    paso: 3,
  },
  resuelto: {
    id: 'resuelto',
    etiqueta: 'Resuelto',
    fondo: '#DCEBD8',
    texto: '#174D34',
    icono: 'visto',
    paso: 4,
  },
};

export const totalDePasosDeEstado = idsDeEstado.length;

/**
 * Las cinco etapas por las que pasa una propuesta vecinal. A diferencia del
 * reporte, aqui avanzar depende de la comunidad y no de la organizacion.
 */
export const idsDeEtapa = [
  'idea',
  'conversacion',
  'priorizada',
  'enMarcha',
  'lograda',
] as const;

export type IdEtapa = (typeof idsDeEtapa)[number];

export type EtapaPropuesta = {
  id: IdEtapa;
  etiqueta: string;
  /** Frase que explica que significa estar en esta etapa. */
  explicacion: string;
  fondo: string;
  texto: string;
  numero: number;
};

export const etapas: Record<IdEtapa, EtapaPropuesta> = {
  idea: {
    id: 'idea',
    etiqueta: 'Idea',
    explicacion: 'recién publicada',
    fondo: '#E6E8EC',
    texto: '#3F4855',
    numero: 1,
  },
  conversacion: {
    id: 'conversacion',
    etiqueta: 'En conversación',
    explicacion: 'se mejora con vecinos',
    fondo: '#DCE7F3',
    texto: '#244C78',
    numero: 2,
  },
  priorizada: {
    id: 'priorizada',
    etiqueta: 'Priorizada',
    explicacion: 'apoyos y reportes la suben',
    fondo: '#F5E6C8',
    texto: '#6F4A0E',
    numero: 3,
  },
  enMarcha: {
    id: 'enMarcha',
    etiqueta: 'En marcha',
    explicacion: 'tiene equipo y fecha',
    fondo: '#1D5E40',
    texto: '#FFFFFF',
    numero: 4,
  },
  lograda: {
    id: 'lograda',
    etiqueta: 'Lograda',
    explicacion: 'con evidencia de cierre',
    fondo: '#0F3D2A',
    texto: '#6DBE5C',
    numero: 5,
  },
};

export const listaDeEtapas: EtapaPropuesta[] = idsDeEtapa.map((id) => etapas[id]);
