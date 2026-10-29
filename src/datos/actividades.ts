import { personas } from './personas';
import type { Actividad } from '@/dominio/tipos';

/**
 * Actividades del barrio. La primera es la que se usa en la demostracion de
 * inscripcion y nace de la propuesta de la huerta, igual que en los mockups.
 */
export const actividadesIniciales: Actividad[] = [
  {
    id: 'platabanda-toesca',
    titulo: 'Recuperemos la platabanda de Toesca',
    diaSemana: 'SÁB',
    dia: 14,
    mes: 'NOV',
    hora: '10:00',
    horario: '10:00 a 13:00',
    lugar: 'Toesca con Av. Ejército',
    organiza: personas.republicaCircular,
    descripcion:
      'Vamos a sacar escombros, preparar la tierra y plantar las primeras hierbas. No necesitas saber de jardinería.',
    queLlevar:
      'Guantes, agua y ropa que se pueda ensuciar. Las palas las pone República Circular.',
    inscritos: 18,
    voluntarios: 9,
    voluntariosNecesarios: 15,
    tareas: ['Llevar herramientas', 'Regar la primera semana', 'Difundir'],
    naceDePropuesta: 'huerta-toesca',
    posicion: { latitud: -33.454253, longitud: -70.657948 },
    miInscripcion: null,
  },
  {
    id: 'taller-compostaje',
    titulo: 'Taller de compostaje en casa',
    diaSemana: 'MIÉ',
    dia: 18,
    mes: 'NOV',
    hora: '18:30',
    horario: '18:30 a 20:00',
    lugar: 'Sede junta de vecinos · 12 cupos libres',
    organiza: personas.republicaCircular,
    descripcion:
      'Cómo armar una compostera chica en un departamento y qué hacer con lo que sale. Se lleva material para empezar.',
    queLlevar: 'Un balde con tapa, si tienes. Si no, igual hay para repartir.',
    inscritos: 8,
    voluntarios: 0,
    voluntariosNecesarios: 0,
    tareas: [],
    posicion: { latitud: -33.452057, longitud: -70.665221 },
    miInscripcion: null,
  },
  {
    id: 'recorrido-casonas',
    titulo: 'Recorrido por las casonas de Av. República',
    diaSemana: 'SÁB',
    dia: 21,
    mes: 'NOV',
    hora: '11:00',
    horario: '11:00 a 13:00',
    lugar: 'Comité de Patrimonio y Cultura',
    organiza: personas.hernan,
    descripcion:
      'Caminata por seis casonas del eje República contando quién vivió ahí y por qué siguen en pie.',
    queLlevar: 'Agua y sombrero. Son dos horas de caminata tranquila.',
    inscritos: 23,
    voluntarios: 2,
    voluntariosNecesarios: 4,
    tareas: ['Tomar fotos', 'Guiar un tramo'],
    naceDePropuesta: 'placas-casonas',
    posicion: { latitud: -33.451776, longitud: -70.661076 },
    miInscripcion: null,
  },
];

/** Filtros del carril superior de la pantalla de actividades. */
export const filtrosDeActividad = ['Todas', 'Buscan voluntarios', 'Me inscribí'] as const;

/** Tipos de actividad que puede crear un gestor territorial. */
export const tiposDeActividad = [
  'Jornada de trabajo',
  'Taller',
  'Recorrido',
  'Reunión',
  'Fiesta de barrio',
] as const;
