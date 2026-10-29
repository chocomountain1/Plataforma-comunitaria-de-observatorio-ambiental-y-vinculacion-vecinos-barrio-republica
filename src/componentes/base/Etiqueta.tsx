import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Icono } from './Icono';
import { Texto } from './Texto';
import type { NombreIcono } from '@/diseno/iconos';
import { espacio, radio } from '@/diseno/medidas';

type PropsEtiqueta = {
  texto: string;
  fondo: string;
  color: string;
  /** Punto de color antes del texto, como en los estados del reporte. */
  punto?: string;
  icono?: NombreIcono;
  alto?: number;
  tamanoDeTexto?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Pildora de estado. Nunca comunica con el color solo: siempre lleva la palabra
 * y, cuando corresponde, un punto o un icono, como pide la regla de
 * accesibilidad del sistema visual.
 */
export function Etiqueta({
  texto,
  fondo,
  color,
  punto,
  icono,
  alto = 28,
  tamanoDeTexto = 13,
  style,
}: PropsEtiqueta) {
  return (
    <View
      style={[
        {
          height: alto,
          paddingHorizontal: espacio.comodo,
          borderRadius: radio.redondo,
          backgroundColor: fondo,
          flexDirection: 'row',
          alignItems: 'center',
          gap: espacio.corto,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {punto === undefined ? null : (
        <View
          style={{ width: 7, height: 7, borderRadius: radio.redondo, backgroundColor: punto }}
        />
      )}
      {icono === undefined ? null : (
        <Icono nombre={icono} tamano={tamanoDeTexto + 2} color={color} grosor={2.6} />
      )}
      <Texto tamano={tamanoDeTexto} peso="fuerte" color={color}>
        {texto}
      </Texto>
    </View>
  );
}
