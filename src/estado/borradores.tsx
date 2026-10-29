import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { CENTRO_DEL_BARRIO } from '@/dominio/barrio';
import type { IdCategoria } from '@/dominio/categorias';
import type { PuntoEnMapa } from '@/dominio/tipos';

import { usarPreferencias } from './preferencias';

/**
 * Lo que la persona lleva escrito en los flujos de varios pasos.
 *
 * Vive fuera de las pantallas porque el asistente de reporte tiene cinco y
 * todas tienen que ver lo mismo, incluida la de revision final, que muestra un
 * resumen de los cuatro pasos anteriores.
 */

export type BorradorDeReporte = {
  categoria: IdCategoria | null;
  /** Cuantas fotos adjunto. El maximo del diseno es tres. */
  fotos: number;
  direccion: string;
  comoSeFormo: string | null;
  desdeCuando: string | null;
  descripcion: string;
  anonimo: boolean;
  /** Donde quedo el punto al terminar el paso de ubicacion. */
  posicion: PuntoEnMapa;
  /** Reporte parecido que se encontro cerca, si lo hubo. */
  posibleDuplicado: string | null;
};

const reporteVacio: BorradorDeReporte = {
  categoria: null,
  fotos: 0,
  direccion: 'Sazié con Av. República',
  comoSeFormo: null,
  desdeCuando: null,
  descripcion: '',
  anonimo: false,
  // Arranca al centro del barrio, que es donde el mapa abre el paso de
  // ubicacion. Si la persona no mueve el mapa, ese es el punto que vale.
  posicion: CENTRO_DEL_BARRIO,
  posibleDuplicado: null,
};

export type BorradorDePropuesta = {
  reporteDeOrigen: string | null;
  titulo: string;
  idea: string;
  eje: string;
  apoyosNecesarios: string[];
  voluntarios: number;
  disciplinas: string[];
};

const propuestaVacia: BorradorDePropuesta = {
  reporteDeOrigen: null,
  titulo: '',
  idea: '',
  eje: 'Residuos',
  apoyosNecesarios: [],
  voluntarios: 15,
  disciplinas: [],
};

type ContextoBorradores = {
  reporte: BorradorDeReporte;
  cambiarReporte: (cambios: Partial<BorradorDeReporte>) => void;
  reiniciarReporte: (origen?: Partial<BorradorDeReporte>) => void;

  propuesta: BorradorDePropuesta;
  cambiarPropuesta: (cambios: Partial<BorradorDePropuesta>) => void;
  reiniciarPropuesta: (origen?: Partial<BorradorDePropuesta>) => void;
};

const Contexto = createContext<ContextoBorradores | null>(null);

export function ProveedorBorradores({ children }: { children: ReactNode }) {
  // El ajuste del perfil solo decide con que valor arranca el borrador. La
  // decision de publicar sin mostrar autor se toma en cada reporte, en el paso
  // de revision, que es donde la persona ve lo que esta por publicar.
  const { proponerAnonimo } = usarPreferencias();

  const [reporte, setReporte] = useState<BorradorDeReporte>({
    ...reporteVacio,
    anonimo: proponerAnonimo,
  });
  const [propuesta, setPropuesta] = useState<BorradorDePropuesta>(propuestaVacia);

  const cambiarReporte = useCallback((cambios: Partial<BorradorDeReporte>) => {
    setReporte((actual) => ({ ...actual, ...cambios }));
  }, []);

  const reiniciarReporte = useCallback(
    (origen?: Partial<BorradorDeReporte>) => {
      setReporte({ ...reporteVacio, anonimo: proponerAnonimo, ...origen });
    },
    [proponerAnonimo],
  );

  const cambiarPropuesta = useCallback((cambios: Partial<BorradorDePropuesta>) => {
    setPropuesta((actual) => ({ ...actual, ...cambios }));
  }, []);

  const reiniciarPropuesta = useCallback((origen?: Partial<BorradorDePropuesta>) => {
    setPropuesta({ ...propuestaVacia, ...origen });
  }, []);

  const valor = useMemo<ContextoBorradores>(
    () => ({
      reporte,
      cambiarReporte,
      reiniciarReporte,
      propuesta,
      cambiarPropuesta,
      reiniciarPropuesta,
    }),
    [reporte, cambiarReporte, reiniciarReporte, propuesta, cambiarPropuesta, reiniciarPropuesta],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarBorradores(): ContextoBorradores {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarBorradores necesita estar dentro de ProveedorBorradores');
  }
  return contexto;
}
