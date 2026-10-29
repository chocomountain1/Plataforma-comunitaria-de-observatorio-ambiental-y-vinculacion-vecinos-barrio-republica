import { useCallback, useEffect, useMemo, useState } from 'react';

import { elementosEnRecuadro } from '@/datos/catastroEnLinea';
import { hayBackend } from '@/datos/cliente';
import type { IdCapaDelCatastro } from '@/dominio/capas';
import { ZOOM_DEL_BARRIO } from '@/dominio/barrio';
import type { ElementoEnElMapa, RecuadroDelMapa } from '@/dominio/tipos';

/**
 * Los elementos del catastro que caben en lo que el mapa tiene a la vista.
 *
 * No es un contexto sino un enganche, porque lo que se pide depende del
 * encuadre de una pantalla y no del estado compartido de la aplicacion.
 */

type AreaMirada = {
  recuadro: RecuadroDelMapa;
  zoom: number;
};

export type ElementosDelCatastro = {
  elementos: ElementoEnElMapa[];
  /** Zoom vigente, que la pantalla necesita para agrupar las chinchetas. */
  zoom: number;
  /** Se le pasa al mapa para que avise cuando cambia el encuadre. */
  alCambiarElArea: (recuadro: RecuadroDelMapa, zoom: number) => void;
  error: string | null;
};

export function usarElementosDelCatastro(
  capasEncendidas: IdCapaDelCatastro[],
): ElementosDelCatastro {
  const [area, setArea] = useState<AreaMirada | null>(null);
  const [elementos, setElementos] = useState<ElementoEnElMapa[]>([]);
  const [error, setError] = useState<string | null>(null);

  const alCambiarElArea = useCallback((recuadro: RecuadroDelMapa, zoom: number) => {
    setArea({ recuadro, zoom });
  }, []);

  // Un arreglo nuevo en cada render volveria a disparar el efecto sin parar,
  // asi que lo que entra en las dependencias es el contenido y no el arreglo.
  const clave = useMemo(() => [...capasEncendidas].sort().join(','), [capasEncendidas]);

  useEffect(() => {
    if (!hayBackend || area === null || clave === '') {
      setElementos([]);
      return;
    }

    let vigente = true;
    elementosEnRecuadro(area.recuadro, clave.split(',') as IdCapaDelCatastro[])
      .then((lista) => {
        if (vigente) setElementos(lista);
      })
      .catch((falla: unknown) => {
        if (!vigente) return;
        setError(
          falla instanceof Error ? falla.message : 'No se pudieron cargar las capas',
        );
      });

    // Si el mapa se mueve antes de que llegue la respuesta, esa respuesta ya
    // no corresponde a lo que se esta viendo y se descarta.
    return () => {
      vigente = false;
    };
  }, [area, clave]);

  return {
    elementos,
    zoom: area?.zoom ?? ZOOM_DEL_BARRIO,
    alCambiarElArea,
    error,
  };
}
