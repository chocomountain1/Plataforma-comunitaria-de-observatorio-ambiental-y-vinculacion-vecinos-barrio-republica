import type { ReactNode } from 'react';

import { BotonCircular, Columna, Fila, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';

type PropsEncabezado = {
  /** Sin titulo el encabezado queda solo con el boton de volver. */
  titulo?: string;
  onVolver?: () => void;
  /** Linea breve bajo el titulo. */
  subtitulo?: string;
  /** Contenido al extremo derecho, por ejemplo un boton de accion. */
  accion?: ReactNode;
  tamanoDeTitulo?: number;
  /** Sobre fondo bosque los botones y el texto se invierten. */
  tono?: 'claro' | 'oscuro';
  textoDeVolver?: string;
};

/**
 * Cabecera de las pantallas de detalle: volver, titulo y, si hace falta, una
 * accion a la derecha.
 */
export function Encabezado({
  titulo,
  onVolver,
  subtitulo,
  accion,
  tamanoDeTitulo = 28,
  tono = 'claro',
  textoDeVolver = 'Volver',
}: PropsEncabezado) {
  const colorDeTexto = tono === 'claro' ? colores.tinta : colores.papel;

  return (
    <Fila
      separacion={espacio.medio}
      alinear="center"
      style={{ paddingHorizontal: espacio.seccion, paddingBottom: espacio.normal }}
    >
      {onVolver === undefined ? null : (
        <BotonCircular
          icono="flechaIzquierda"
          accesibilidad={textoDeVolver}
          onPress={onVolver}
          tono={tono}
        />
      )}
      <Columna crecer={1} separacion={2}>
        {titulo === undefined ? null : (
          <Texto tamano={tamanoDeTitulo} familia="titulo" color={colorDeTexto} interlineado={1.1}>
            {titulo}
          </Texto>
        )}
        {subtitulo === undefined ? null : (
          <Texto
            tamano={14}
            color={tono === 'claro' ? colores.grisTexto : colores.textoTenueSobreBosque}
          >
            {subtitulo}
          </Texto>
        )}
      </Columna>
      {accion}
    </Fila>
  );
}
