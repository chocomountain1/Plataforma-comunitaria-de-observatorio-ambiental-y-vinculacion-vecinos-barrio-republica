import type { NombreIcono } from '@/diseno/iconos';
import type { IdCategoria } from './categorias';
import type { IdEstado, IdEtapa } from './estados';

/**
 * Modelo de datos del prototipo.
 *
 * Los nombres y las formas siguen lo que muestran los mockups y las historias
 * de usuario, de modo que al conectar Supabase cada tipo de aqui tenga una
 * tabla equivalente y no haya que redisenar la aplicacion.
 */

/** Como se identifica una persona frente al resto del barrio. */
export type Persona = {
  id: string;
  /** Seudonimo visible. Nunca el nombre real ni el RUT. */
  nombre: string;
  /** Letra del avatar circular. */
  inicial: string;
  /** Vinculo declarado, por ejemplo "Vive en el barrio". */
  vinculo: string;
  /** Las organizaciones llevan un distintivo de verificada. */
  esOrganizacion?: boolean;
};

/**
 * Posicion sobre el mapa, en grados decimales WGS84, que es el sistema en el
 * que vienen las capas del catastro 2022 y el que espera PostGIS.
 */
export type PuntoEnMapa = {
  latitud: number;
  longitud: number;
};

/** Los cuatro bordes de lo que el mapa tiene a la vista, en grados. */
export type RecuadroDelMapa = {
  sur: number;
  oeste: number;
  norte: number;
  este: number;
};

/**
 * Un elemento del catastro 2022 listo para dibujar.
 *
 * La posicion es un punto representativo aunque la figura original sea una
 * linea o un poligono, porque el mapa dibuja chinchetas. El area y el largo
 * vienen calculados sobre la geometria completa, que la base conserva.
 */
export type ElementoEnElMapa = {
  id: string;
  capa: string;
  /** Identificador que el elemento traia en el archivo del diagnostico. */
  fid: number;
  posicion: PuntoEnMapa;
  tipoDeGeometria: string;
  areaM2: number;
  largoM: number;
  direccion?: string;
  estadoDePlatabanda?: string;
  tipoDeMicrobasural?: string;
  quienLoCuida?: string;
};

/** Un paso del recorrido de un reporte, tal como se ve en "En que va". */
export type EventoDeSeguimiento = {
  estado: IdEstado;
  /** Fecha en texto corto, por ejemplo "3 nov". Vacia si aun no ocurre. */
  fecha?: string;
  /** Que paso, o que pasara cuando llegue el turno de este estado. */
  detalle: string;
  /** Un evento futuro se dibuja apagado. */
  ocurrio: boolean;
};

export type Reporte = {
  id: string;
  categoria: IdCategoria;
  /** Precision dentro de la categoria, por ejemplo "microbasural". */
  subtipo?: string;
  titulo: string;
  /** Esquina o referencia, por ejemplo "Sazié con Av. República". */
  direccion: string;
  estado: IdEstado;
  /** Texto libre que escribio quien reporto. */
  descripcion?: string;
  /** Respuestas del paso de detalles, ya resumidas para mostrar. */
  comoSeFormo?: string;
  desdeCuando?: string;
  /** Fecha de publicacion en texto, como la muestran los mockups. */
  publicado: string;
  /** Linea de apoyo bajo el titulo en las listas. */
  resumen: string;
  confirmaciones: number;
  /** Vecinos que lo marcaron como inexistente. Dispara la revision. */
  senalamientos?: number;
  /**
   * Publicado sin mostrar quien. Es una decision por publicacion y no una
   * configuracion del perfil: la misma persona puede publicar un reporte con
   * su nombre y el siguiente sin el.
   */
  anonimo: boolean;
  /**
   * Nulo cuando el reporte es anonimo. En la base el autor siempre existe;
   * lo que llega a la aplicacion ya viene enmascarado por la vista, para que
   * el dato no pueda filtrarse desde el cliente.
   */
  autor: Persona | null;
  esMio: boolean;
  tieneFoto: boolean;
  posicion: PuntoEnMapa;
  seguimiento: EventoDeSeguimiento[];
  /** Identificadores de las propuestas que buscan resolverlo. */
  propuestas: string[];
  comentarios: Comentario[];
};

/** Postura de quien comenta, usada para filtrar la conversacion. */
export type PosturaComentario = 'mejora' | 'duda' | 'aFavor' | 'enContra' | 'respuesta';

export type Comentario = {
  id: string;
  autor: Persona;
  /** Antiguedad en texto corto, por ejemplo "4 d". */
  cuando: string;
  postura: PosturaComentario;
  texto: string;
  utiles: number;
  /** Nota de la autora de la propuesta cuando incorpora el aporte. */
  incorporado?: string;
  respuestas: Comentario[];
};

/** Un tipo de ayuda que pide una propuesta para poder concretarse. */
export type ApoyoNecesario = {
  id: string;
  titulo: string;
  detalle: string;
  /** Cuando la ayuda se cuenta en personas, por ejemplo 9 de 15 voluntarios. */
  conseguido?: number;
  necesario?: number;
};

/** Institucion o local que se ofrecio a apoyar una propuesta. */
export type ApoyoInstitucional = {
  id: string;
  nombre: string;
  detalle: string;
  icono: 'birrete' | 'comercio';
};

export type Propuesta = {
  id: string;
  titulo: string;
  /** Eje tematico, por ejemplo "Residuos". */
  eje: string;
  etapa: IdEtapa;
  autor: Persona;
  publicada: string;
  idea: string;
  /** Mejora que surgio en la conversacion y la autora acepto. */
  mejoraIncorporada?: string;
  apoyos: number;
  /** Reportes que esta propuesta busca resolver. */
  reportesQueResuelve: number;
  /** Frase que resume a que reportes responde. */
  respondeA?: string;
  necesita: ApoyoNecesario[];
  quierenApoyar: ApoyoInstitucional[];
  comentarios: Comentario[];
  posicion: PuntoEnMapa;
  /** Disciplinas con las que calza, para el filtro de instituciones. */
  disciplinas: string[];
  apoyadaPorMi: boolean;
};

/** Forma de participar en una actividad. */
export type ModoDeParticipar = 'asistir' | 'voluntario';

export type Actividad = {
  id: string;
  titulo: string;
  /** Dia de la semana abreviado, como lo muestra el calendario del mockup. */
  diaSemana: string;
  dia: number;
  mes: string;
  hora: string;
  /** Rango completo, por ejemplo "10:00 a 13:00". */
  horario: string;
  lugar: string;
  organiza: Persona;
  descripcion: string;
  queLlevar: string;
  inscritos: number;
  voluntarios: number;
  voluntariosNecesarios: number;
  /** Tareas concretas que puede tomar quien se ofrece de voluntario. */
  tareas: string[];
  /** Propuesta que dio origen a la actividad. */
  naceDePropuesta?: string;
  posicion: PuntoEnMapa;
  /** Como se inscribio la persona, si es que lo hizo. */
  miInscripcion: ModoDeParticipar | null;
  /** Tarea tomada al inscribirse como voluntario. */
  miTarea?: string;
};

/** Agrupacion temporal de los avisos, tal como los ordena la pantalla. */
export type MomentoAviso = 'hoy' | 'semana';

export type Aviso = {
  id: string;
  momento: MomentoAviso;
  /** Parte en negrita del texto. */
  destacado: string;
  /** Resto de la frase. */
  texto: string;
  cuando: string;
  icono: 'visto' | 'birrete' | 'calendario' | 'globoDialogo' | 'medalla';
  color: string;
  fondo: string;
  leido: boolean;
  /** Etiqueta opcional al pie, por ejemplo "Recordatorio". */
  pie?: string;
  /** Enlace al contenido que origino el aviso. */
  destino?: string;
};

export type Logro = {
  id: string;
  nombre: string;
  icono: NombreIcono;
  /** Color de la insignia cuando ya se consiguio. */
  color: string;
  conseguido: boolean;
  /** Avance de los logros que todavia no estan completos. */
  avance?: string;
};

/** Capa que se puede encender o apagar en el mapa. */
export type CapaDelMapa = {
  id: string;
  nombre: string;
  detalle: string;
  grupo: 'ahora' | 'catastro';
  activa: boolean;
};

/** Ficha de un elemento del catastro socioambiental de 2022. */
export type ElementoDeCatastro = {
  id: string;
  tipo: string;
  fuente: string;
  direccion: string;
  estadoAnotado: string;
  quienLoCuida: string;
  ultimaRevision: string;
  /** Opciones con las que un vecino actualiza el estado de hoy. */
  opcionesDeEstado: string[];
  /** Dato del diagnostico que da contexto a la ficha. */
  dato: string;
  posicion: PuntoEnMapa;
};

/** Propuesta o problema publicado como desafio para una institucion. */
export type Desafio = {
  id: string;
  prioridad: 'alta' | 'media' | 'baja';
  eje: string;
  titulo: string;
  resumen: string;
  busca: string;
  disciplinas: string[];
  tiposDeApoyo: string[];
  /** Propuesta de origen, cuando el desafio nace de una. */
  propuesta?: string;
};
