import type { IdCapaDelCatastro } from '@/dominio/capas';
import { esCapaDelCatastro } from '@/dominio/capas';
import type { ElementoEnElMapa, RecuadroDelMapa } from '@/dominio/tipos';

import { exigirCliente } from './cliente';

/**
 * Las capas del catastro socioambiental 2022, leidas desde la base.
 *
 * La consulta pide solo lo que entra en el recuadro visible y solo de las
 * capas encendidas. El filtro corre en la base contra el indice espacial: con
 * 903 elementos traerlos todos todavia funcionaria, pero el catastro completo
 * son 2.032 y el barrio sigue reportando.
 */

type FilaDeElemento = {
  id: string;
  capa: string;
  fid: number;
  latitud: number;
  longitud: number;
  tipo_de_geometria: string;
  area_m2: number;
  largo_m: number;
  direccion: string | null;
  estado_platabanda: string | null;
  tipo_microbasural: string | null;
  quien_lo_cuida: string | null;
  anotado_en: string | null;
};

function elementoDesde(fila: FilaDeElemento): ElementoEnElMapa | null {
  // Una capa que exista en la base pero que la aplicacion no sepa dibujar se
  // omite en vez de romper la pantalla. Pasaria si alguien carga una de las
  // veintitres capas que quedaron fuera.
  if (!esCapaDelCatastro(fila.capa)) return null;

  return {
    id: fila.id,
    capa: fila.capa,
    fid: fila.fid,
    posicion: { latitud: fila.latitud, longitud: fila.longitud },
    tipoDeGeometria: fila.tipo_de_geometria,
    areaM2: fila.area_m2,
    largoM: fila.largo_m,
    direccion: fila.direccion ?? undefined,
    estadoDePlatabanda: fila.estado_platabanda ?? undefined,
    tipoDeMicrobasural: fila.tipo_microbasural ?? undefined,
    quienLoCuida: fila.quien_lo_cuida ?? undefined,
  };
}

/** Los elementos visibles en un recuadro, de las capas que se le pidan. */
export async function elementosEnRecuadro(
  recuadro: RecuadroDelMapa,
  capas: IdCapaDelCatastro[],
): Promise<ElementoEnElMapa[]> {
  if (capas.length === 0) return [];

  const { data, error } = await exigirCliente().rpc('elementos_en_recuadro', {
    p_sur: recuadro.sur,
    p_oeste: recuadro.oeste,
    p_norte: recuadro.norte,
    p_este: recuadro.este,
    p_capas: capas,
  });

  if (error !== null) throw new Error(error.message);

  return ((data ?? []) as FilaDeElemento[]).flatMap((fila) => {
    const elemento = elementoDesde(fila);
    return elemento === null ? [] : [elemento];
  });
}

/**
 * Cuantos elementos cargados tiene cada capa, para el detalle de la lista.
 *
 * Cuenta lo que hay y no lo que el diagnostico declara. Son cifras distintas:
 * en microbasurales el diagnostico anota 40 y hay 39, porque uno queda a dos
 * kilometros del barrio y la carga lo rechaza. Un numero en pantalla que no
 * corresponde a lo que se puede tocar en el mapa es peor que no mostrarlo.
 */
export async function conteoPorCapa(): Promise<Record<string, number>> {
  const { data, error } = await exigirCliente()
    .from('conteo_de_capas')
    .select('capa, elementos');

  if (error !== null) throw new Error(error.message);

  const conteo: Record<string, number> = {};
  for (const fila of (data ?? []) as { capa: string; elementos: number }[]) {
    conteo[fila.capa] = fila.elementos;
  }
  return conteo;
}
