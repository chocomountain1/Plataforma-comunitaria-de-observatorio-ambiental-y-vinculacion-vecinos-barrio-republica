import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Preferencias de lectura de la persona que usa la aplicacion.
 *
 * El sistema visual exige que el tamano de letra se pueda ajustar desde la
 * bienvenida y desde Ajustes, asi que vive en un contexto propio y lo aplica el
 * componente Texto. Queda guardado en el telefono para no tener que
 * reconfigurarlo en cada sesion.
 */

export const factoresDeTexto = [1, 1.15, 1.3] as const;

export type FactorTexto = (typeof factoresDeTexto)[number];

export type Preferencias = {
  /** Multiplica el tamano de cada texto de la aplicacion. */
  factorTexto: FactorTexto;
  /** Sube el contraste de bordes y de los textos de apoyo. */
  altoContraste: boolean;
  /** Apaga las animaciones de entrada y de transicion. */
  menosAnimaciones: boolean;
  /** Avisa cuando cambia el estado de un reporte propio. */
  avisarCambioDeEstado: boolean;
  /** Avisa de actividades nuevas en el barrio. */
  avisarActividades: boolean;
  /**
   * Deja marcado "anonimo" al empezar un reporte.
   *
   * Es una sugerencia y no una regla: el anonimato se decide publicacion por
   * publicacion, y el paso de revision siempre permite cambiarlo. Por eso
   * tampoco viaja a la base, se queda en el telefono.
   */
  proponerAnonimo: boolean;
};

const preferenciasIniciales: Preferencias = {
  factorTexto: 1,
  altoContraste: false,
  menosAnimaciones: false,
  avisarCambioDeEstado: true,
  avisarActividades: true,
  proponerAnonimo: false,
};

const CLAVE_GUARDADO = 'barrio-republica.preferencias';

/** Guarda sin bloquear. Si el almacenamiento falla la sesion sigue igual. */
function persistir(preferencias: Preferencias): void {
  AsyncStorage.setItem(CLAVE_GUARDADO, JSON.stringify(preferencias)).catch(() => {});
}

type ContextoPreferencias = Preferencias & {
  /** Avanza al siguiente tamano de letra y vuelve al menor al pasarse. */
  rotarTamanoDeTexto: () => void;
  cambiar: <C extends keyof Preferencias>(clave: C, valor: Preferencias[C]) => void;
};

const Contexto = createContext<ContextoPreferencias | null>(null);

export function ProveedorPreferencias({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(preferenciasIniciales);

  useEffect(() => {
    let vigente = true;
    AsyncStorage.getItem(CLAVE_GUARDADO)
      .then((guardado) => {
        if (!vigente || guardado === null) return;
        setPreferencias({ ...preferenciasIniciales, ...JSON.parse(guardado) });
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  const cambiar = useCallback<ContextoPreferencias['cambiar']>((clave, valor) => {
    setPreferencias((actual) => {
      const siguiente = { ...actual, [clave]: valor };
      persistir(siguiente);
      return siguiente;
    });
  }, []);

  const rotarTamanoDeTexto = useCallback(() => {
    setPreferencias((actual) => {
      const posicion = factoresDeTexto.indexOf(actual.factorTexto);
      const siguiente: Preferencias = {
        ...actual,
        factorTexto: factoresDeTexto[(posicion + 1) % factoresDeTexto.length] ?? 1,
      };
      persistir(siguiente);
      return siguiente;
    });
  }, []);

  const valor = useMemo<ContextoPreferencias>(
    () => ({ ...preferencias, rotarTamanoDeTexto, cambiar }),
    [preferencias, rotarTamanoDeTexto, cambiar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarPreferencias(): ContextoPreferencias {
  const contexto = useContext(Contexto);
  if (contexto === null) {
    throw new Error('usarPreferencias necesita estar dentro de ProveedorPreferencias');
  }
  return contexto;
}
