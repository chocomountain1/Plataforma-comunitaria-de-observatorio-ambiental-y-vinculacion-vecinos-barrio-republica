import { View } from 'react-native';

import { Fila, Icono, Texto } from '@/componentes/base';
import { categorias, type IdCategoria } from '@/dominio/categorias';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';

type PropsMarcaDeCategoria = {
  categoria: IdCategoria;
  /** Lado del cuadrado de color. */
  tamano?: number;
  /** Radio de esquina. Los cuadros grandes del formulario usan 13. */
  redondeo?: number;
};

/**
 * Cuadrado de color con el icono de la categoria. Es la pieza que identifica a
 * que corresponde un reporte en el feed, el mapa y las listas.
 */
export function MarcaDeCategoria({
  categoria,
  tamano = 24,
  redondeo = radio.chico,
}: PropsMarcaDeCategoria) {
  const datos = categorias[categoria];
  return (
    <View
      style={{
        width: tamano,
        height: tamano,
        borderRadius: redondeo,
        backgroundColor: datos.color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icono nombre={datos.icono} tamano={tamano * 0.62} color="#FFFFFF" />
    </View>
  );
}

/**
 * Marca de categoria con su nombre en mayusculas al lado, como encabeza cada
 * tarjeta de reporte.
 */
export function RotuloDeCategoria({
  categoria,
  detalle,
  tamanoDeTexto = 13.5,
}: {
  categoria: IdCategoria;
  /** Texto adicional separado por punto medio, por ejemplo "MICROBASURAL". */
  detalle?: string;
  tamanoDeTexto?: number;
}) {
  const datos = categorias[categoria];
  return (
    <Fila separacion={espacio.normal}>
      <MarcaDeCategoria categoria={categoria} />
      <Texto tamano={tamanoDeTexto} peso="fuerte" color={datos.color}>
        {detalle === undefined
          ? datos.etiquetaTarjeta
          : `${datos.etiquetaTarjeta} · ${detalle.toUpperCase()}`}
      </Texto>
    </Fila>
  );
}

/**
 * Pildora con la categoria ya elegida. Acompana a los pasos siguientes del
 * asistente para que siempre se vea sobre que se esta reportando.
 */
export function ChipDeCategoria({ categoria }: { categoria: IdCategoria }) {
  const datos = categorias[categoria];
  return (
    <Fila
      separacion={espacio.normal}
      style={{
        alignSelf: 'flex-start',
        height: 34,
        paddingLeft: espacio.corto,
        paddingRight: espacio.medio,
        borderRadius: radio.redondo,
        backgroundColor: colores.papel,
        borderWidth: 1,
        borderColor: colores.borde,
      }}
    >
      <MarcaDeCategoria categoria={categoria} />
      <Texto tamano={14} peso="fuerte">
        {datos.etiqueta}
      </Texto>
    </Fila>
  );
}
