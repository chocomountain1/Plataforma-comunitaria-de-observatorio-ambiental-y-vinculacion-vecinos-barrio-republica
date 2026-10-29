import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { Icono, Texto } from '@/componentes/base';
import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';

type PropsFotoSimulada = {
  alto: number;
  /** Rotulo opcional sobre la trama, por ejemplo "Antes · 3 nov". */
  rotulo?: string;
  accesibilidad?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Marcador de posicion de una fotografia.
 *
 * En el prototipo no hay imagenes reales, asi que se dibuja la misma trama
 * diagonal de los mockups. Al conectar el almacenamiento, este componente se
 * reemplaza por la imagen y el resto de las pantallas no cambia.
 */
export function FotoSimulada({ alto, rotulo, accesibilidad, style }: PropsFotoSimulada) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accesibilidad ?? 'Fotografía del reporte'}
      style={[
        { height: alto, backgroundColor: colores.fotoTramaClara, justifyContent: 'center', alignItems: 'center' },
        style,
      ]}
    >
      <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <Defs>
          <Pattern id="trama" width={24} height={24} patternUnits="userSpaceOnUse">
            <Rect width={24} height={24} fill={colores.fotoTramaClara} />
            <Line
              x1={-6}
              y1={30}
              x2={30}
              y2={-6}
              stroke={colores.fotoTramaOscura}
              strokeWidth={12}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#trama)" />
      </Svg>
      <Icono nombre="imagen" tamano={30} color={colores.fotoIcono} />
      {rotulo === undefined ? null : (
        <Texto
          tamano={13}
          peso="fuerte"
          color={colores.fotoIcono}
          style={{ marginTop: espacio.corto }}
        >
          {rotulo}
        </Texto>
      )}
    </View>
  );
}
