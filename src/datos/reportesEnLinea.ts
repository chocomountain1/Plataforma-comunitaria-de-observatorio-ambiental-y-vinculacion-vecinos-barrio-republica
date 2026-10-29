import type { IdCategoria } from '@/dominio/categorias';
import type { IdEstado } from '@/dominio/estados';
import type { EventoDeSeguimiento, Persona, PuntoEnMapa, Reporte } from '@/dominio/tipos';
import { diaYMes, hace, inicialDe } from '@/utiles/fechas';

import { exigirCliente } from './cliente';

/**
 * Registrar y consultar reportes contra Supabase.
 *
 * Vive en src/datos y no en src/estado por la regla de capas: el estado llama
 * a estas funciones y las pantallas llaman al estado. Ninguna pantalla importa
 * este archivo.
 *
 * Toda lectura pasa por la vista reportes_publicos, que es la unica puerta que
 * la base abre al cliente. Un reporte anonimo llega sin autor porque la vista
 * ya lo corto, no porque aqui se decida esconderlo.
 */

/** Lo que la vista reportes_publicos devuelve por cada reporte. */
type FilaDeReporte = {
  id: string;
  categoria: IdCategoria;
  subtipo: string | null;
  titulo: string;
  direccion: string;
  estado: IdEstado;
  descripcion: string | null;
  como_se_formo: string | null;
  desde_cuando: string | null;
  publicado_en: string;
  latitud: number;
  longitud: number;
  tiene_foto: boolean;
  anonimo: boolean;
  autor: string | null;
  autor_seudonimo: string | null;
  autor_vinculo: string | null;
  autor_es_organizacion: boolean | null;
  es_mio: boolean;
  confirmaciones: number;
  senalamientos: number;
};

type FilaDeSeguimiento = {
  reporte: string;
  estado: IdEstado;
  detalle: string;
  ocurrio_en: string | null;
};

export type DatosParaCrearReporte = {
  categoria: IdCategoria;
  titulo: string;
  direccion: string;
  posicion: PuntoEnMapa;
  anonimo: boolean;
  subtipo?: string;
  descripcion?: string;
  comoSeFormo?: string;
  desdeCuando?: string;
  tieneFoto: boolean;
};

export type FiltroDeReportes = {
  categoria?: IdCategoria;
  estado?: IdEstado;
  soloMios?: boolean;
};

/** Las columnas de la vista, en el orden en que la base las entrega. */
const COLUMNAS = '*';

/**
 * Arma la persona a partir de lo que la vista deja pasar. Devuelve nulo
 * cuando el reporte es anonimo, que es como el resto de la aplicacion
 * representa que no hay a quien mostrar.
 */
function personaDesde(fila: FilaDeReporte): Persona | null {
  if (fila.anonimo || fila.autor === null || fila.autor_seudonimo === null) {
    return null;
  }
  return {
    id: fila.autor,
    nombre: fila.autor_seudonimo,
    // La inicial se deriva del seudonimo, no se guarda en la base.
    inicial: inicialDe(fila.autor_seudonimo),
    vinculo: fila.autor_vinculo ?? '',
    esOrganizacion: fila.autor_es_organizacion ?? false,
  };
}

function seguimientoDesde(filas: FilaDeSeguimiento[]): EventoDeSeguimiento[] {
  return filas.map((fila) => ({
    estado: fila.estado,
    fecha: fila.ocurrio_en === null ? undefined : diaYMes(new Date(fila.ocurrio_en)),
    detalle: fila.detalle,
    // Que el paso ya haya ocurrido se deriva de si tiene fecha, no se guarda.
    ocurrio: fila.ocurrio_en !== null,
  }));
}

function reporteDesde(fila: FilaDeReporte, seguimiento: EventoDeSeguimiento[]): Reporte {
  const publicado = new Date(fila.publicado_en);
  return {
    id: fila.id,
    categoria: fila.categoria,
    subtipo: fila.subtipo ?? undefined,
    titulo: fila.titulo,
    direccion: fila.direccion,
    estado: fila.estado,
    descripcion: fila.descripcion ?? undefined,
    comoSeFormo: fila.como_se_formo ?? undefined,
    desdeCuando: fila.desde_cuando ?? undefined,
    publicado: hace(publicado),
    // El resumen tampoco se guarda: se arma al mostrar, por eso siempre dice
    // la verdad aunque el reporte lleve meses publicado.
    resumen: `Enviado ${hace(publicado)}`,
    confirmaciones: fila.confirmaciones,
    senalamientos: fila.senalamientos,
    anonimo: fila.anonimo,
    autor: personaDesde(fila),
    esMio: fila.es_mio,
    tieneFoto: fila.tiene_foto,
    posicion: { latitud: fila.latitud, longitud: fila.longitud },
    seguimiento,
    // Las propuestas y los comentarios se traen aparte, cuando la pantalla de
    // detalle los necesita. No se cargan al listar el mapa.
    propuestas: [],
    comentarios: [],
  };
}

/** Trae el seguimiento de varios reportes de una vez, agrupado por reporte. */
async function seguimientoDe(ids: string[]): Promise<Map<string, EventoDeSeguimiento[]>> {
  const agrupado = new Map<string, EventoDeSeguimiento[]>();
  if (ids.length === 0) return agrupado;

  const { data, error } = await exigirCliente()
    .from('eventos_de_seguimiento')
    .select('reporte, estado, detalle, ocurrio_en')
    .in('reporte', ids);

  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeSeguimiento[];
  for (const id of ids) {
    agrupado.set(
      id,
      seguimientoDesde(filas.filter((fila) => fila.reporte === id)),
    );
  }
  return agrupado;
}

/**
 * Publica un reporte y devuelve su identificador.
 *
 * El autor no se manda: lo pone la base a partir de la sesion, que es la unica
 * forma de que nadie publique a nombre de otro.
 */
export async function crearReporte(datos: DatosParaCrearReporte): Promise<string> {
  const { data, error } = await exigirCliente().rpc('crear_reporte', {
    p_categoria: datos.categoria,
    p_titulo: datos.titulo,
    p_direccion: datos.direccion,
    p_latitud: datos.posicion.latitud,
    p_longitud: datos.posicion.longitud,
    p_anonimo: datos.anonimo,
    p_subtipo: datos.subtipo ?? null,
    p_descripcion: datos.descripcion ?? null,
    p_como_se_formo: datos.comoSeFormo ?? null,
    p_desde_cuando: datos.desdeCuando ?? null,
    p_tiene_foto: datos.tieneFoto,
  });

  if (error !== null) throw new Error(error.message);
  return data as string;
}

/** Un reporte con su seguimiento, para la pantalla de detalle. */
export async function obtenerReporte(id: string): Promise<Reporte | undefined> {
  const { data, error } = await exigirCliente()
    .from('reportes_publicos')
    .select(COLUMNAS)
    .eq('id', id)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);
  if (data === null) return undefined;

  const fila = data as FilaDeReporte;
  const seguimiento = await seguimientoDe([fila.id]);
  return reporteDesde(fila, seguimiento.get(fila.id) ?? []);
}

/** Listado para el mapa y para el panel de gestion. */
export async function listarReportes(filtro: FiltroDeReportes = {}): Promise<Reporte[]> {
  let consulta = exigirCliente()
    .from('reportes_publicos')
    .select(COLUMNAS)
    .order('publicado_en', { ascending: false });

  if (filtro.categoria !== undefined) consulta = consulta.eq('categoria', filtro.categoria);
  if (filtro.estado !== undefined) consulta = consulta.eq('estado', filtro.estado);
  if (filtro.soloMios === true) consulta = consulta.eq('es_mio', true);

  const { data, error } = await consulta;
  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeReporte[];
  const seguimiento = await seguimientoDe(filas.map((fila) => fila.id));
  return filas.map((fila) => reporteDesde(fila, seguimiento.get(fila.id) ?? []));
}

/**
 * Reportes dentro de un radio, ordenados del mas cercano al mas lejano.
 *
 * El filtro corre en la base contra el indice espacial. Es lo que permite que
 * el paso de ubicacion avise de un posible duplicado sin descargar el barrio
 * entero.
 */
export async function listarReportesCerca(
  punto: PuntoEnMapa,
  radioEnMetros = 300,
): Promise<Reporte[]> {
  const { data, error } = await exigirCliente().rpc('reportes_cerca', {
    p_latitud: punto.latitud,
    p_longitud: punto.longitud,
    p_radio_metros: radioEnMetros,
  });

  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeReporte[];
  const seguimiento = await seguimientoDe(filas.map((fila) => fila.id));
  return filas.map((fila) => reporteDesde(fila, seguimiento.get(fila.id) ?? []));
}

/**
 * Confirma que el reporte existe y devuelve cuantas confirmaciones lleva.
 *
 * Confirmar dos veces o confirmar el reporte propio lo rechaza la base, no
 * esta funcion. Aqui solo se traduce el rechazo a un mensaje que la pantalla
 * pueda mostrar.
 */
export async function confirmarReporte(id: string): Promise<number> {
  const { data, error } = await exigirCliente().rpc('confirmar_reporte', {
    p_reporte: id,
  });

  if (error !== null) {
    if (error.code === '23505') throw new Error('Ya confirmaste este reporte');
    if (error.code === '23514') throw new Error('No puedes confirmar tu propio reporte');
    throw new Error(error.message);
  }
  return data as number;
}

/** Marca el reporte como posiblemente inexistente, lo que dispara revision. */
export async function senalarReporte(id: string, motivo?: string): Promise<void> {
  const { error } = await exigirCliente().rpc('senalar_reporte', {
    p_reporte: id,
    p_motivo: motivo ?? null,
  });

  if (error !== null) throw new Error(error.message);
}
