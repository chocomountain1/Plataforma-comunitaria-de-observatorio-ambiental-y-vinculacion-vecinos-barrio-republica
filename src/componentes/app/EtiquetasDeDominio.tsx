import { Etiqueta } from '@/componentes/base';
import { estados, etapas, type IdEstado, type IdEtapa } from '@/dominio/estados';

/**
 * Pildoras de estado y de etapa. Envuelven a Etiqueta para que ninguna pantalla
 * tenga que acordarse de los colores de cada estado.
 */

export function EtiquetaDeEstado({
  estado,
  alto,
  tamanoDeTexto,
}: {
  estado: IdEstado;
  alto?: number;
  tamanoDeTexto?: number;
}) {
  const datos = estados[estado];
  return (
    <Etiqueta
      texto={datos.etiqueta}
      fondo={datos.fondo}
      color={datos.texto}
      punto={datos.punto}
      icono={datos.icono}
      alto={alto}
      tamanoDeTexto={tamanoDeTexto}
    />
  );
}

export function EtiquetaDeEtapa({
  etapa,
  alto,
  tamanoDeTexto,
}: {
  etapa: IdEtapa;
  alto?: number;
  tamanoDeTexto?: number;
}) {
  const datos = etapas[etapa];
  return (
    <Etiqueta
      texto={datos.etiqueta}
      fondo={datos.fondo}
      color={datos.texto}
      alto={alto}
      tamanoDeTexto={tamanoDeTexto}
    />
  );
}
