import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { exigirCliente } from './cliente';

/**
 * Fotografias de los reportes.
 *
 * El diagnostico 2022 dejo previsto un campo para colgarle una foto a cada
 * punto y nunca lo lleno. Esto es lo que cierra esa brecha: la ubicacion ya
 * estaba levantada y lo que faltaba era mostrar en que estado esta.
 *
 * El deposito es privado, asi que las fotos no se leen por direccion publica
 * sino con un enlace firmado que caduca.
 */

const DEPOSITO = 'fotos-de-reportes';

/** El diseno admite hasta tres fotos por reporte. */
export const MAXIMO_DE_FOTOS = 3;

/**
 * Lado mayor al que se reduce cada foto antes de subirla.
 *
 * El plan gratuito da 1 GB de almacenamiento y la bitacora lo senala como el
 * primer limite que se va a alcanzar. A 1600 pixeles y calidad 0,6 una foto
 * de telefono queda en unos 300 a 600 KB, de modo que el GB alcanza para unos
 * 550 reportes con tres fotos cada uno. Sin reducir, alcanzaria para 70.
 */
const LADO_MAYOR = 1600;
const CALIDAD = 0.6;

/** Cuanto dura el enlace firmado con el que se muestra una foto. */
const SEGUNDOS_DE_VIGENCIA = 60 * 60;

export type FotoDeReporte = {
  id: string;
  orden: number;
  /** Enlace firmado, listo para pasarle a un componente Image. */
  url: string;
};

type FilaDeFoto = {
  id: string;
  ruta: string;
  orden: number;
};

/**
 * Reduce y recomprime antes de subir.
 *
 * Recomprimir tiene un efecto secundario buscado: la imagen resultante se
 * escribe de nuevo y pierde los metadatos EXIF del original, donde el telefono
 * suele dejar la coordenada exacta y el modelo del aparato. La posicion del
 * reporte la elige la persona en el mapa, no la foto.
 */
async function prepararParaSubir(uri: string): Promise<Blob> {
  const contexto = ImageManipulator.manipulate(uri).resize({ width: LADO_MAYOR });
  const imagen = await contexto.renderAsync();
  const reducida = await imagen.saveAsync({
    compress: CALIDAD,
    format: SaveFormat.JPEG,
  });

  const respuesta = await fetch(reducida.uri);
  return await respuesta.blob();
}

/**
 * Sube una foto y la asocia al reporte.
 *
 * La ruta lleva el identificador del reporte como carpeta, que es lo que
 * permite que las politicas del deposito decidan si quien sube es la autora
 * mirando solo el nombre del archivo.
 */
export async function subirFotoDeReporte(
  idReporte: string,
  uri: string,
  orden: number,
): Promise<void> {
  const supabase = exigirCliente();
  const ruta = `${idReporte}/${orden}.jpg`;
  const contenido = await prepararParaSubir(uri);

  const { error: errorAlSubir } = await supabase.storage
    .from(DEPOSITO)
    .upload(ruta, contenido, { contentType: 'image/jpeg', upsert: true });

  if (errorAlSubir !== null) throw new Error(errorAlSubir.message);

  const { error: errorAlAsociar } = await supabase
    .from('fotos_de_reporte')
    .upsert({ reporte: idReporte, ruta, orden }, { onConflict: 'reporte,orden' });

  // Si la fila no se pudo escribir, el archivo quedaria huerfano ocupando
  // espacio sin que ninguna pantalla lo muestre, asi que se retira.
  if (errorAlAsociar !== null) {
    await supabase.storage.from(DEPOSITO).remove([ruta]);
    throw new Error(errorAlAsociar.message);
  }
}

/** Sube las fotos de un reporte recien publicado, en orden. */
export async function subirFotosDeReporte(idReporte: string, uris: string[]): Promise<void> {
  const cuantas = Math.min(uris.length, MAXIMO_DE_FOTOS);
  for (let posicion = 0; posicion < cuantas; posicion += 1) {
    const uri = uris[posicion];
    if (uri === undefined) continue;
    await subirFotoDeReporte(idReporte, uri, posicion + 1);
  }
}

/** Las fotos de un reporte, con enlaces firmados listos para mostrar. */
export async function fotosDeReporte(idReporte: string): Promise<FotoDeReporte[]> {
  const supabase = exigirCliente();

  const { data, error } = await supabase
    .from('fotos_de_reporte')
    .select('id, ruta, orden')
    .eq('reporte', idReporte)
    .order('orden');

  if (error !== null) throw new Error(error.message);

  const filas = (data ?? []) as FilaDeFoto[];
  if (filas.length === 0) return [];

  const { data: firmadas, error: errorAlFirmar } = await supabase.storage
    .from(DEPOSITO)
    .createSignedUrls(
      filas.map((fila) => fila.ruta),
      SEGUNDOS_DE_VIGENCIA,
    );

  if (errorAlFirmar !== null) throw new Error(errorAlFirmar.message);

  return filas.flatMap((fila, posicion) => {
    const url = firmadas?.[posicion]?.signedUrl;
    if (url === undefined || url === null) return [];
    return [{ id: fila.id, orden: fila.orden, url }];
  });
}

/** Quita una foto del reporte y del deposito. */
export async function borrarFotoDeReporte(idReporte: string, orden: number): Promise<void> {
  const supabase = exigirCliente();
  const ruta = `${idReporte}/${orden}.jpg`;

  const { error } = await supabase
    .from('fotos_de_reporte')
    .delete()
    .eq('reporte', idReporte)
    .eq('orden', orden);

  if (error !== null) throw new Error(error.message);

  await supabase.storage.from(DEPOSITO).remove([ruta]);
}
