import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { actividadesIniciales } from '@/datos/actividades';
import { avisosIniciales } from '@/datos/avisos';
import { capasIniciales } from '@/datos/catastro';
import { personas } from '@/datos/personas';
import { propuestasIniciales } from '@/datos/propuestas';
import { reportesIniciales } from '@/datos/reportes';
import type { IdCategoria } from '@/dominio/categorias';
import type { IdEstado } from '@/dominio/estados';
import { estados } from '@/dominio/estados';
import type {
  Actividad,
  Aviso,
  CapaDelMapa,
  Comentario,
  ModoDeParticipar,
  PosturaComentario,
  Propuesta,
  Reporte,
} from '@/dominio/tipos';

/**
 * Estado compartido de la aplicacion.
 *
 * En el prototipo todo vive en memoria. Cuando se conecte Supabase, cada
 * funcion de aqui pasa a ser una llamada a la base y las pantallas no cambian,
 * porque ya hablan con estas acciones y no con los datos directamente.
 */

export type DatosDeReporteNuevo = {
  categoria: IdCategoria;
  direccion: string;
  descripcion: string;
  comoSeFormo?: string;
  desdeCuando?: string;
  tieneFoto: boolean;
  anonimo: boolean;
};

export type DatosDePropuestaNueva = {
  titulo: string;
  idea: string;
  eje: string;
  reporteDeOrigen?: string;
  apoyosNecesarios: string[];
  voluntarios: number;
  disciplinas: string[];
};

export type DatosDeActividadNueva = {
  titulo: string;
  tipo: string;
  dia: number;
  mes: string;
  diaSemana: string;
  hora: string;
  lugar: string;
  voluntariosNecesarios: number;
  tareas: string[];
  naceDePropuesta?: string;
};

type ContextoBarrio = {
  reportes: Reporte[];
  propuestas: Propuesta[];
  actividades: Actividad[];
  avisos: Aviso[];
  capas: CapaDelMapa[];
  /** Identificador del ultimo reporte publicado, para la pantalla de cierre. */
  ultimoReportePublicado: string | null;

  confirmarReporte: (id: string) => void;
  descartarReporte: (id: string) => void;
  cambiarEstadoDeReporte: (id: string, estado: IdEstado) => void;
  ocultarReporte: (id: string) => void;
  publicarReporte: (datos: DatosDeReporteNuevo) => string;

  apoyarPropuesta: (id: string) => void;
  comentarPropuesta: (id: string, texto: string, postura: PosturaComentario) => void;
  marcarComentarioUtil: (idPropuesta: string, idComentario: string) => void;
  publicarPropuesta: (datos: DatosDePropuestaNueva) => string;

  inscribirseEnActividad: (id: string, modo: ModoDeParticipar, tarea?: string) => void;
  cancelarInscripcion: (id: string) => void;
  publicarActividad: (datos: DatosDeActividadNueva) => string;

  marcarAvisoLeido: (id: string) => void;
  marcarTodosLosAvisosLeidos: () => void;
  avisosSinLeer: number;

  alternarCapa: (id: string) => void;
  restablecerCapas: () => void;
};

const Contexto = createContext<ContextoBarrio | null>(null);

/** Genera un identificador legible y unico dentro de la sesion. */
function nuevoId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}`;
}

export function ProveedorBarrio({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>(reportesIniciales);
  const [propuestas, setPropuestas] = useState<Propuesta[]>(propuestasIniciales);
  const [actividades, setActividades] = useState<Actividad[]>(actividadesIniciales);
  const [avisos, setAvisos] = useState<Aviso[]>(avisosIniciales);
  const [capas, setCapas] = useState<CapaDelMapa[]>(capasIniciales);
  const [ultimoReportePublicado, setUltimoReportePublicado] = useState<string | null>(null);

  const cambiarUnReporte = useCallback(
    (id: string, transformar: (reporte: Reporte) => Reporte) => {
      setReportes((lista) => lista.map((r) => (r.id === id ? transformar(r) : r)));
    },
    [],
  );

  const confirmarReporte = useCallback(
    (id: string) => {
      cambiarUnReporte(id, (reporte) => {
        const confirmaciones = reporte.confirmaciones + 1;
        // Tres confirmaciones bastan para pasar de Recibido a Verificado. Es la
        // regla que explica la pantalla de envio: lo confirman otros vecinos o
        // lo revisa un moderador.
        const estado: IdEstado =
          reporte.estado === 'recibido' && confirmaciones >= 3 ? 'verificado' : reporte.estado;
        return { ...reporte, confirmaciones, estado };
      });
    },
    [cambiarUnReporte],
  );

  const descartarReporte = useCallback(
    (id: string) => {
      cambiarUnReporte(id, (reporte) => ({
        ...reporte,
        senalamientos: (reporte.senalamientos ?? 0) + 1,
      }));
    },
    [cambiarUnReporte],
  );

  const cambiarEstadoDeReporte = useCallback(
    (id: string, estado: IdEstado) => {
      cambiarUnReporte(id, (reporte) => ({
        ...reporte,
        estado,
        seguimiento: reporte.seguimiento.map((evento) => ({
          ...evento,
          ocurrio: estados[evento.estado].paso <= estados[estado].paso,
          fecha:
            evento.estado === estado && evento.fecha === undefined ? 'ahora' : evento.fecha,
        })),
      }));
    },
    [cambiarUnReporte],
  );

  const ocultarReporte = useCallback((id: string) => {
    setReportes((lista) => lista.filter((reporte) => reporte.id !== id));
  }, []);

  const publicarReporte = useCallback((datos: DatosDeReporteNuevo): string => {
    const id = nuevoId('reporte');
    const reporte: Reporte = {
      id,
      categoria: datos.categoria,
      titulo: datos.direccion,
      direccion: datos.direccion,
      estado: 'recibido',
      descripcion: datos.descripcion === '' ? undefined : datos.descripcion,
      comoSeFormo: datos.comoSeFormo,
      desdeCuando: datos.desdeCuando,
      publicado: 'recién',
      resumen: 'Enviado recién',
      confirmaciones: 0,
      autor: datos.anonimo ? null : personas.rosa,
      esMio: true,
      tieneFoto: datos.tieneFoto,
      // El punto queda donde la persona dejo el mapa en el paso de ubicacion.
      posicion: { x: 195, y: 430 },
      seguimiento: [
        { estado: 'recibido', fecha: 'recién', detalle: 'Quedó publicado en el mapa', ocurrio: true },
        {
          estado: 'verificado',
          detalle: 'Cuando otros vecinos confirmen que existe',
          ocurrio: false,
        },
        {
          estado: 'gestion',
          detalle: 'Cuando alguien tome acción, aquí verás quién y qué hizo',
          ocurrio: false,
        },
        { estado: 'resuelto', detalle: 'Con foto del antes y después', ocurrio: false },
      ],
      propuestas: [],
      comentarios: [],
    };
    setReportes((lista) => [reporte, ...lista]);
    setUltimoReportePublicado(id);
    return id;
  }, []);

  const cambiarUnaPropuesta = useCallback(
    (id: string, transformar: (propuesta: Propuesta) => Propuesta) => {
      setPropuestas((lista) => lista.map((p) => (p.id === id ? transformar(p) : p)));
    },
    [],
  );

  const apoyarPropuesta = useCallback(
    (id: string) => {
      cambiarUnaPropuesta(id, (propuesta) => ({
        ...propuesta,
        apoyadaPorMi: !propuesta.apoyadaPorMi,
        apoyos: propuesta.apoyos + (propuesta.apoyadaPorMi ? -1 : 1),
      }));
    },
    [cambiarUnaPropuesta],
  );

  const comentarPropuesta = useCallback(
    (id: string, texto: string, postura: PosturaComentario) => {
      const comentario: Comentario = {
        id: nuevoId('comentario'),
        autor: personas.rosa,
        cuando: 'recién',
        postura,
        texto,
        utiles: 0,
        respuestas: [],
      };
      cambiarUnaPropuesta(id, (propuesta) => ({
        ...propuesta,
        comentarios: [...propuesta.comentarios, comentario],
      }));
    },
    [cambiarUnaPropuesta],
  );

  const marcarComentarioUtil = useCallback(
    (idPropuesta: string, idComentario: string) => {
      cambiarUnaPropuesta(idPropuesta, (propuesta) => ({
        ...propuesta,
        comentarios: propuesta.comentarios.map((comentario) =>
          comentario.id === idComentario
            ? { ...comentario, utiles: comentario.utiles + 1 }
            : comentario,
        ),
      }));
    },
    [cambiarUnaPropuesta],
  );

  const publicarPropuesta = useCallback((datos: DatosDePropuestaNueva): string => {
    const id = nuevoId('propuesta');
    const propuesta: Propuesta = {
      id,
      titulo: datos.titulo,
      eje: datos.eje,
      etapa: 'idea',
      autor: personas.rosa,
      publicada: 'publicada recién',
      idea: datos.idea,
      apoyos: 1,
      reportesQueResuelve: datos.reporteDeOrigen === undefined ? 0 : 1,
      respondeA: datos.reporteDeOrigen === undefined ? undefined : '1 reporte del barrio',
      necesita: datos.apoyosNecesarios.map((titulo) => ({
        id: `${id}-${titulo}`,
        titulo,
        detalle: titulo === 'Manos voluntarias' ? 'Para armarlo y cuidarlo' : 'Por coordinar',
        ...(titulo === 'Manos voluntarias'
          ? { conseguido: 0, necesario: datos.voluntarios }
          : null),
      })),
      quierenApoyar: [],
      comentarios: [],
      posicion: { x: 195, y: 430 },
      disciplinas: datos.disciplinas,
      apoyadaPorMi: true,
    };
    setPropuestas((lista) => [propuesta, ...lista]);
    return id;
  }, []);

  const inscribirseEnActividad = useCallback(
    (id: string, modo: ModoDeParticipar, tarea?: string) => {
      setActividades((lista) =>
        lista.map((actividad) => {
          if (actividad.id !== id || actividad.miInscripcion !== null) return actividad;
          return {
            ...actividad,
            miInscripcion: modo,
            miTarea: tarea,
            inscritos: actividad.inscritos + 1,
            voluntarios: actividad.voluntarios + (modo === 'voluntario' ? 1 : 0),
          };
        }),
      );
    },
    [],
  );

  const cancelarInscripcion = useCallback((id: string) => {
    setActividades((lista) =>
      lista.map((actividad) => {
        if (actividad.id !== id || actividad.miInscripcion === null) return actividad;
        return {
          ...actividad,
          inscritos: actividad.inscritos - 1,
          voluntarios:
            actividad.voluntarios - (actividad.miInscripcion === 'voluntario' ? 1 : 0),
          miInscripcion: null,
          miTarea: undefined,
        };
      }),
    );
  }, []);

  const publicarActividad = useCallback((datos: DatosDeActividadNueva): string => {
    const id = nuevoId('actividad');
    const actividad: Actividad = {
      id,
      titulo: datos.titulo,
      diaSemana: datos.diaSemana,
      dia: datos.dia,
      mes: datos.mes,
      hora: datos.hora,
      horario: datos.hora,
      lugar: datos.lugar,
      organiza: personas.republicaCircular,
      descripcion: datos.tipo,
      queLlevar: 'Por confirmar con quienes se inscriban.',
      inscritos: 0,
      voluntarios: 0,
      voluntariosNecesarios: datos.voluntariosNecesarios,
      tareas: datos.tareas,
      naceDePropuesta: datos.naceDePropuesta,
      posicion: { x: 195, y: 430 },
      miInscripcion: null,
    };
    setActividades((lista) => [actividad, ...lista]);
    return id;
  }, []);

  const marcarAvisoLeido = useCallback((id: string) => {
    setAvisos((lista) =>
      lista.map((aviso) => (aviso.id === id ? { ...aviso, leido: true } : aviso)),
    );
  }, []);

  const marcarTodosLosAvisosLeidos = useCallback(() => {
    setAvisos((lista) => lista.map((aviso) => ({ ...aviso, leido: true })));
  }, []);

  const alternarCapa = useCallback((id: string) => {
    setCapas((lista) =>
      lista.map((capa) => (capa.id === id ? { ...capa, activa: !capa.activa } : capa)),
    );
  }, []);

  const restablecerCapas = useCallback(() => setCapas(capasIniciales), []);

  const avisosSinLeer = useMemo(
    () => avisos.filter((aviso) => !aviso.leido).length,
    [avisos],
  );

  const valor = useMemo<ContextoBarrio>(
    () => ({
      reportes,
      propuestas,
      actividades,
      avisos,
      capas,
      ultimoReportePublicado,
      confirmarReporte,
      descartarReporte,
      cambiarEstadoDeReporte,
      ocultarReporte,
      publicarReporte,
      apoyarPropuesta,
      comentarPropuesta,
      marcarComentarioUtil,
      publicarPropuesta,
      inscribirseEnActividad,
      cancelarInscripcion,
      publicarActividad,
      marcarAvisoLeido,
      marcarTodosLosAvisosLeidos,
      avisosSinLeer,
      alternarCapa,
      restablecerCapas,
    }),
    [
      reportes,
      propuestas,
      actividades,
      avisos,
      capas,
      ultimoReportePublicado,
      confirmarReporte,
      descartarReporte,
      cambiarEstadoDeReporte,
      ocultarReporte,
      publicarReporte,
      apoyarPropuesta,
      comentarPropuesta,
      marcarComentarioUtil,
      publicarPropuesta,
      inscribirseEnActividad,
      cancelarInscripcion,
      publicarActividad,
      marcarAvisoLeido,
      marcarTodosLosAvisosLeidos,
      avisosSinLeer,
      alternarCapa,
      restablecerCapas,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarBarrio(): ContextoBarrio {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarBarrio necesita estar dentro de ProveedorBarrio');
  }
  return contexto;
}

/** Atajo para las pantallas de detalle, que siempre reciben el identificador. */
export function usarReporte(id: string | undefined): Reporte | undefined {
  const { reportes } = usarBarrio();
  return reportes.find((reporte) => reporte.id === id);
}

export function usarPropuesta(id: string | undefined): Propuesta | undefined {
  const { propuestas } = usarBarrio();
  return propuestas.find((propuesta) => propuesta.id === id);
}

export function usarActividad(id: string | undefined): Actividad | undefined {
  const { actividades } = usarBarrio();
  return actividades.find((actividad) => actividad.id === id);
}
