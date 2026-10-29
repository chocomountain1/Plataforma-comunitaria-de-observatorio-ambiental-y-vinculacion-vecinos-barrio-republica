import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { Presionable } from './Presionable';
import { colores } from '@/diseno/colores';
import { espacio, radio } from '@/diseno/medidas';

type PropsTarjeta = {
  children: ReactNode;
  /** Las tarjetas oscuras se reservan para lo que avanzo en un reporte propio. */
  tono?: 'papel' | 'bosque' | 'menta' | 'crema';
  separacion?: number;
  relleno?: number;
  /** Si se entrega, la tarjeta completa se vuelve tocable. */
  onPress?: () => void;
  accesibilidad?: string;
  /** Recorta el contenido que se sale, por ejemplo la foto de cabecera. */
  recortar?: boolean;
  style?: StyleProp<ViewStyle>;
};

const tonos: Record<NonNullable<PropsTarjeta['tono']>, ViewStyle> = {
  papel: { backgroundColor: colores.papel, borderWidth: 1, borderColor: colores.borde },
  bosque: { backgroundColor: colores.bosque },
  menta: { backgroundColor: colores.menta },
  crema: { backgroundColor: colores.crema, borderWidth: 1, borderColor: colores.borde },
};

/**
 * Contenedor de contenido del feed, de las listas y de los detalles. Unifica
 * radio, borde y relleno para que ninguna pantalla los vuelva a escribir.
 */
export function Tarjeta({
  children,
  tono = 'papel',
  separacion = espacio.medio,
  relleno = espacio.amplio,
  onPress,
  accesibilidad,
  recortar = false,
  style,
}: PropsTarjeta) {
  const estilo: StyleProp<ViewStyle> = [
    {
      borderRadius: radio.tarjeta,
      padding: relleno,
      gap: separacion,
      ...(recortar ? { overflow: 'hidden', padding: 0 } : null),
    },
    tonos[tono],
    style,
  ];

  if (onPress === undefined) {
    return <View style={estilo}>{children}</View>;
  }

  return (
    <Presionable
      onPress={onPress}
      escalaAlTocar={0.985}
      accessibilityRole="button"
      accessibilityLabel={accesibilidad}
      style={estilo}
    >
      {children}
    </Presionable>
  );
}
