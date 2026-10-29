import { Text, type TextProps, type TextStyle } from 'react-native';

import { colores } from '@/diseno/colores';
import { escalaTexto, familias } from '@/diseno/tipografia';
import { usarPreferencias } from '@/estado/preferencias';

type PropsTexto = TextProps & {
  /** Tamano en puntos. Por defecto el texto base del sistema, 17. */
  tamano?: number;
  /** Las dos familias del sistema: titulos condensados o texto hiperlegible. */
  familia?: 'titulo' | 'tituloSemi' | 'texto';
  peso?: 'normal' | 'fuerte';
  color?: string;
  /** Multiplicador del alto de linea. Los mockups usan entre 1 y 1.45. */
  interlineado?: number;
  alineacion?: TextStyle['textAlign'];
  mayusculas?: boolean;
  /** Separacion entre letras, usada en las etiquetas en mayusculas. */
  espaciado?: number;
};

/**
 * Todo el texto de la aplicacion pasa por aqui. Es lo que permite que el ajuste
 * de tamano de letra funcione de verdad en cada pantalla sin tener que tocarlas
 * una por una.
 */
export function Texto({
  tamano = escalaTexto.base,
  familia = 'texto',
  peso = 'normal',
  color = colores.tinta,
  interlineado,
  alineacion,
  mayusculas,
  espaciado,
  style,
  ...resto
}: PropsTexto) {
  const { factorTexto } = usarPreferencias();
  const tamanoFinal = tamano * factorTexto;

  const nombreDeFuente =
    familia === 'texto'
      ? peso === 'fuerte'
        ? familias.textoFuerte
        : familias.texto
      : familia === 'tituloSemi'
        ? familias.tituloSemi
        : familias.titulo;

  return (
    <Text
      {...resto}
      // La fuente ya viene en el peso correcto, pero sin allowFontScaling en
      // false el sistema operativo volveria a escalar encima del ajuste propio.
      allowFontScaling={false}
      style={[
        {
          fontFamily: nombreDeFuente,
          fontSize: tamanoFinal,
          color,
          ...(interlineado === undefined ? null : { lineHeight: tamanoFinal * interlineado }),
          ...(alineacion === undefined ? null : { textAlign: alineacion }),
          ...(mayusculas === true ? { textTransform: 'uppercase' as const } : null),
          ...(espaciado === undefined ? null : { letterSpacing: espaciado }),
        },
        style,
      ]}
    />
  );
}
