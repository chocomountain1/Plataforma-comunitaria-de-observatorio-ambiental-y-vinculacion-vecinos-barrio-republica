import { personas } from './personas';
import type { Propuesta } from '@/dominio/tipos';

/**
 * Propuestas vecinales del prototipo. Las tres aparecen en la pantalla
 * "Propuestas del barrio" y la primera tiene el detalle y la conversacion
 * completos, que es el recorrido que se muestra en la demostracion.
 */
export const propuestasIniciales: Propuesta[] = [
  {
    id: 'punto-limpio',
    titulo: 'Punto limpio vecinal en Sazié con Av. República',
    eje: 'Residuos',
    etapa: 'priorizada',
    autor: personas.julia,
    publicada: 'publicada hace 6 días',
    idea: 'Contenedores separados para cartón, vidrio y basura, con un horario para sacar las bolsas y un letrero hecho por los vecinos.',
    mejoraIncorporada: 'se sumó un turno de cuidado los sábados, idea de Tomás.',
    apoyos: 64,
    reportesQueResuelve: 6,
    respondeA: '6 reportes de basura en esta esquina',
    necesita: [
      {
        id: 'voluntarios',
        titulo: 'Manos voluntarias',
        detalle: 'Para armarlo y cuidarlo',
        conseguido: 9,
        necesario: 15,
      },
      {
        id: 'tecnico',
        titulo: 'Conocimiento técnico',
        detalle: 'Estudiantes de FCFM se ofrecieron',
      },
      {
        id: 'permiso',
        titulo: 'Permiso municipal',
        detalle: 'En trámite por República Circular',
      },
    ],
    quierenApoyar: [
      {
        id: 'fcfm',
        nombre: 'FCFM, Universidad de Chile',
        detalle: 'Curso de ingeniería · otoño 2027',
        icono: 'birrete',
      },
      {
        id: 'almacen',
        nombre: 'Almacén de la esquina',
        detalle: 'Local asociado · presta su vereda',
        icono: 'comercio',
      },
    ],
    comentarios: [
      {
        id: 'p1-tomas',
        autor: personas.tomas,
        cuando: '4 d',
        postura: 'mejora',
        texto: '¿Y si alguien lo cuida los sábados en la noche, que es cuando más se llena?',
        utiles: 14,
        incorporado: 'La autora la sumó a la propuesta',
        respuestas: [
          {
            id: 'p1-tomas-julia',
            autor: personas.julia,
            cuando: '3 d',
            postura: 'respuesta',
            texto: '¡Buenísima! Ya la agregué. ¿Te animas a armar el turno?',
            utiles: 3,
            respuestas: [],
          },
        ],
      },
      {
        id: 'p1-hernan',
        autor: personas.hernan,
        cuando: '3 d',
        postura: 'duda',
        texto: '¿Y quién vacía los contenedores?',
        utiles: 5,
        respuestas: [
          {
            id: 'p1-hernan-camila',
            autor: personas.camila,
            cuando: '3 d',
            postura: 'respuesta',
            texto: 'El retiro municipal pasa todos los días después de las 20:00. Lo coordinaríamos con ellos.',
            utiles: 8,
            respuestas: [],
          },
        ],
      },
      {
        id: 'p1-marta',
        autor: personas.marta,
        cuando: '2 d',
        postura: 'enContra',
        texto: 'Justo ahí está la entrada de mi local. ¿Se podría correr media cuadra?',
        utiles: 6,
        respuestas: [],
      },
    ],
    posicion: { latitud: -33.449609, longitud: -70.661076 },
    disciplinas: ['Ingeniería', 'Diseño'],
    apoyadaPorMi: false,
  },
  {
    id: 'huerta-toesca',
    titulo: 'Huerta comunitaria en la platabanda de Toesca',
    eje: 'Áreas verdes',
    etapa: 'enMarcha',
    autor: personas.camila,
    publicada: 'publicada hace 3 semanas',
    idea: 'Recuperar la platabanda abandonada de Toesca con hierbas y plantas que aguanten el sol, y dejar un turno de riego entre los vecinos de la cuadra.',
    apoyos: 51,
    reportesQueResuelve: 2,
    respondeA: '2 reportes de platabandas abandonadas',
    necesita: [
      {
        id: 'voluntarios-huerta',
        titulo: 'Manos voluntarias',
        detalle: 'Jornada del sábado 14 de noviembre',
        conseguido: 9,
        necesario: 15,
      },
      {
        id: 'herramientas',
        titulo: 'Materiales o herramientas',
        detalle: 'Tierra, plantas y una manguera larga',
      },
    ],
    quierenApoyar: [
      {
        id: 'fablab',
        nombre: 'FabLab U. de Chile',
        detalle: 'Puede armar los cajones · verano 2027',
        icono: 'birrete',
      },
    ],
    comentarios: [],
    posicion: { latitud: -33.454618, longitud: -70.659668 },
    disciplinas: ['Agronomía', 'Diseño'],
    apoyadaPorMi: true,
  },
  {
    id: 'placas-casonas',
    titulo: 'Placas con la historia de las casonas de Av. República',
    eje: 'Patrimonio',
    etapa: 'conversacion',
    autor: personas.hernan,
    publicada: 'publicada hace 9 días',
    idea: 'Poner una placa chica en cada casona con su año, quién vivió ahí y una foto antigua, con un código para leer más en el teléfono.',
    apoyos: 38,
    reportesQueResuelve: 1,
    respondeA: '1 reporte de patrimonio en riesgo',
    necesita: [
      {
        id: 'diseno-placas',
        titulo: 'Conocimiento técnico',
        detalle: 'Diseño de las placas y del código',
      },
      {
        id: 'investigacion',
        titulo: 'Conocimiento técnico',
        detalle: 'Investigación histórica de cada casona',
      },
    ],
    quierenApoyar: [],
    comentarios: [],
    posicion: { latitud: -33.451776, longitud: -70.661076 },
    disciplinas: ['Diseño', 'Arquitectura', 'Ciencias sociales'],
    apoyadaPorMi: false,
  },
];

/** Los ejes tematicos que filtran la lista de propuestas. */
export const ejesDePropuesta = ['Todas', 'Residuos', 'Áreas verdes', 'Patrimonio'] as const;

/** Tipos de apoyo que puede pedir una propuesta nueva. */
export const tiposDeApoyo = [
  { id: 'voluntarios', titulo: 'Manos voluntarias', detalle: 'Para armarlo y cuidarlo', conCantidad: true },
  { id: 'materiales', titulo: 'Materiales o herramientas', detalle: 'Contenedores, pintura, palas', conCantidad: false },
  { id: 'tecnico', titulo: 'Conocimiento técnico', detalle: 'Estudiantes o profesionales', conCantidad: false },
  { id: 'permiso', titulo: 'Permiso o gestión municipal', detalle: 'República Circular puede ayudar', conCantidad: false },
] as const;

/** Disciplinas con las que una propuesta puede pedir ayuda. */
export const disciplinas = [
  'Ingeniería',
  'Diseño',
  'Arquitectura',
  'Agronomía',
  'Ciencias sociales',
  'Comunicación',
] as const;
