import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { hayBackend, haySesion } from '@/datos/cliente';
import { personas } from '@/datos/personas';
import {
  alCambiarLaSesion,
  cerrarSesion as cerrarSesionEnLinea,
  confirmarCodigo as confirmarCodigoEnLinea,
  crearPerfil as crearPerfilEnLinea,
  pedirCodigo as pedirCodigoEnLinea,
  perfilActual,
} from '@/datos/sesion';
import type { Persona } from '@/dominio/tipos';

/**
 * Quien esta usando la aplicacion.
 *
 * Son cuatro situaciones y no dos, porque entrar y tener perfil son cosas
 * distintas. La cuenta nace cuando el codigo del correo se canjea; el
 * seudonimo con que el barrio reconoce a esa persona se elige despues.
 */
export type EstadoDeSesion =
  /** Todavia se esta averiguando si hay sesion guardada. */
  | 'cargando'
  /** Hay backend y nadie ha entrado. */
  | 'sinCuenta'
  /** Entro con el codigo pero aun no elige seudonimo. */
  | 'sinPerfil'
  /** Entro y tiene perfil. */
  | 'dentro'
  /** No hay credenciales configuradas: el prototipo corre con datos de ejemplo. */
  | 'sinBackend';

type ContextoSesion = {
  estado: EstadoDeSesion;
  /** Quien publica, comenta y confirma. Nunca es nula si se puede usar la app. */
  persona: Persona | null;
  pedirCodigo: (correo: string) => Promise<void>;
  /** Devuelve en que queda la sesion: de eso depende si hay que crear perfil. */
  confirmarCodigo: (correo: string, codigo: string) => Promise<EstadoDeSesion>;
  crearPerfil: (seudonimo: string, vinculo: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
};

const Contexto = createContext<ContextoSesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoDeSesion>(hayBackend ? 'cargando' : 'sinBackend');
  const [persona, setPersona] = useState<Persona | null>(
    // Sin backend el prototipo sigue siendo navegable, que es como se muestra
    // en reuniones y como se prueba con vecinos.
    hayBackend ? null : personas.rosa,
  );

  const revisar = useCallback(async (): Promise<EstadoDeSesion> => {
    if (!hayBackend) return 'sinBackend';
    const perfil = await perfilActual();
    if (perfil !== null) {
      setPersona(perfil);
      setEstado('dentro');
      return 'dentro';
    }
    setPersona(null);
    // perfilActual devuelve nulo tanto si no hay sesion como si la hay y aun
    // no se elige seudonimo, asi que hay que distinguirlas aqui.
    const siguiente: EstadoDeSesion = (await haySesion()) ? 'sinPerfil' : 'sinCuenta';
    setEstado(siguiente);
    return siguiente;
  }, []);

  useEffect(() => {
    if (!hayBackend) return;
    void revisar();
    return alCambiarLaSesion(() => void revisar());
  }, [revisar]);

  const pedirCodigo = useCallback(async (correo: string) => {
    await pedirCodigoEnLinea(correo);
  }, []);

  // Devuelve el estado en vez de dejar que la pantalla lo lea del contexto,
  // porque ahi todavia figura el de antes de entrar.
  const confirmarCodigo = useCallback(
    async (correo: string, codigo: string) => {
      await confirmarCodigoEnLinea(correo, codigo);
      return revisar();
    },
    [revisar],
  );

  const crearPerfil = useCallback(async (seudonimo: string, vinculo: string) => {
    const nueva = await crearPerfilEnLinea(seudonimo, vinculo);
    setPersona(nueva);
    setEstado('dentro');
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionEnLinea();
    setPersona(null);
    setEstado('sinCuenta');
  }, []);

  const valor = useMemo<ContextoSesion>(
    () => ({ estado, persona, pedirCodigo, confirmarCodigo, crearPerfil, cerrarSesion }),
    [estado, persona, pedirCodigo, confirmarCodigo, crearPerfil, cerrarSesion],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarSesion(): ContextoSesion {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarSesion necesita estar dentro de ProveedorSesion');
  }
  return contexto;
}
