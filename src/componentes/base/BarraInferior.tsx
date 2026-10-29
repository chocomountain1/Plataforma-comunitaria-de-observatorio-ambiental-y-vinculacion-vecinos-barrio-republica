import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { colores } from '@/diseno/colores';
import { espacio } from '@/diseno/medidas';

type PropsBarraInferior = {
  children: ReactNode;
  /** Fondo de la barra. Crema en la mayoria, papel sobre listas. */
  fondo?: string;
  separacion?: number;
  /** Deja la barra pegada al borde inferior empujando el contenido de arriba. */
  alFinal?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Barra fija del borde inferior con la accion principal de la pantalla. La
 * mayoria de los flujos la usan para que el boton de continuar quede siempre a
 * la vista, sin importar cuanto se desplace el contenido.
 */
export function BarraInferior({
  children,
  fondo = colores.crema,
  separacion = espacio.comodo,
  alFinal = true,
  style,
}: PropsBarraInferior) {
  const margenes = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: fondo,
          borderTopWidth: 1,
          borderTopColor: colores.borde,
          paddingHorizontal: espacio.seccion,
          paddingTop: espacio.amplio,
          paddingBottom: Math.max(margenes.bottom, espacio.amplio),
          gap: separacion,
          ...(alFinal ? { marginTop: 'auto' as const } : null),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
